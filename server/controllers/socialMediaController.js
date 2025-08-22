const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');


const q = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => (err ? reject(err) : resolve(results)));
  });

function requireGuideId(req, res) {
  const user = req.user || {};
  const idRaw = user.id;
  if (idRaw === undefined || idRaw === null) {
    console.error('[AUTH] req.user.id missing in JWT payload:', user);
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  const guideId = Number(idRaw);
  if (!Number.isFinite(guideId)) {
    console.error('[AUTH] req.user.id not a finite number:', idRaw);
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return guideId;
}

async function safeUnlink(absPath) {
  if (!absPath) return;
  try {
    await fs.unlink(absPath);
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      console.warn('[FS] unlink failed:', absPath, err.message);
    }
  }
}

function publicImageUrl(req, imagePath) {
  if (!imagePath) return null;
  return `${req.protocol}://${req.get('host')}/socialgroups/${path.basename(imagePath)}`;
}

const createSocialGroup = async (req, res) => {
  const guideId = requireGuideId(req, res);
  if (guideId === null) return;

  try {
    const { title, socialMedias } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Group title is required' });
    }

    let image_path = null;
    if (req.file) {
      image_path = path.posix.join('socialgroups', req.file.filename);
    }

    // Parse platforms array
    let platforms = [];
    if (typeof socialMedias !== 'undefined' && socialMedias !== null) {
      try {
        const raw = typeof socialMedias === 'string' ? JSON.parse(socialMedias) : socialMedias;
        platforms = Array.isArray(raw)
          ? raw
              .filter(p => p && p.name && p.link && String(p.link).trim() !== '')
              .map(p => ({ name: String(p.name).trim(), link: String(p.link).trim() }))
          : [];
      } catch (e) {
        if (req.file) {
          await safeUnlink(path.join(__dirname, '..', 'uploads', image_path || ''));
        }
        return res.status(400).json({ error: 'Invalid social media data format' });
      }
    }

    // Insert group with status 'pending'
    const ins = await q(
      `INSERT INTO social_groups (guide_id, title, image_path, status, created_at)
       VALUES (?, ?, ?, 'pending', NOW())`,
      [guideId, title.trim(), image_path]
    );
    const groupId = ins.insertId;
    if (!groupId) {
      return res.status(500).json({ error: 'Failed to create social group' });
    }

    // Insert platforms
    for (const p of platforms) {
      try {
        await q(
          `INSERT INTO social_group_platforms
             (social_group_id, platform_name, platform_link, created_at, updated_at)
           VALUES (?, ?, ?, NOW(), NOW())`,
          [groupId, p.name, p.link]
        );
      } catch (err) {
        console.error('[CREATE_PLATFORMS_ERROR]', err.message);
        return res.status(500).json({ error: 'Failed to create platform entries' });
      }
    }

    // Fetch group + platforms to return
    const [grp] = await q(
      'SELECT id, guide_id, title, image_path, status, reason, created_at, updated_at FROM social_groups WHERE id = ? AND guide_id = ?',
      [groupId, guideId]
    );

    const platRows = await q(
      'SELECT platform_name, platform_link FROM social_group_platforms WHERE social_group_id = ? ORDER BY id ASC',
      [groupId]
    );

    const group = {
      ...grp,
      socialMedias: platRows.map(r => ({ name: r.platform_name, link: r.platform_link })),
      image: publicImageUrl(req, grp?.image_path)
    };

    return res.status(201).json({ message: 'Social group created successfully', group });
  } catch (error) {
    console.error('[CREATE_GROUP_ERROR]', error.message);
    if (req.file) {
      const maybeRel = req.file.filename ? path.posix.join('socialgroups', req.file.filename) : null;
      await safeUnlink(path.join(__dirname, '..', 'Uploads', maybeRel || ''));
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getSocialGroups = async (req, res) => {
  const guideId = requireGuideId(req, res);
  if (guideId === null) return;

  try {
    const groups = await q(
      'SELECT id, guide_id, title, image_path, status, reason, created_at, updated_at FROM social_groups WHERE guide_id = ? ORDER BY created_at DESC',
      [guideId]
    );

    if (!groups.length) return res.json([]);

    const ids = groups.map(g => g.id);
    const inClause = ids.map(() => '?').join(',');
    const plats = await q(
      `SELECT social_group_id, platform_name, platform_link
         FROM social_group_platforms
        WHERE social_group_id IN (${inClause})
        ORDER BY id ASC`,
      ids
    );

    // Group platforms by social_group_id
    const byGroup = new Map();
    for (const p of plats) {
      const arr = byGroup.get(p.social_group_id) || [];
      arr.push({ name: p.platform_name, link: p.platform_link });
      byGroup.set(p.social_group_id, arr);
    }

    const formatted = groups.map(g => ({
      ...g,
      socialMedias: byGroup.get(g.id) || [],
      image: g.image_path ? publicImageUrl(req, g.image_path) : null
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('[FETCH_GROUPS_ERROR]', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSocialGroup = async (req, res) => {
  const guideId = requireGuideId(req, res);
  if (guideId === null) return;

  try {
    const { id } = req.params;
    const { title, socialMedias } = req.body;

    // Ownership check
    const [existing] = await q(
      'SELECT id, guide_id, title, image_path, status, reason FROM social_groups WHERE id = ? AND guide_id = ?',
      [id, guideId]
    );
    if (!existing) {
      if (req.file) {
        await safeUnlink(path.join(__dirname, '..', 'uploads', 'socialgroups', req.file.filename));
      }
      return res.status(404).json({ error: 'Social group not found' });
    }

    // Image handling
    let image_path = existing.image_path;
    if (req.file) {
      if (existing.image_path) {
        await safeUnlink(path.join(__dirname, '..', 'uploads', existing.image_path));
      }
      image_path = path.posix.join('socialgroups', req.file.filename);
    }

    // Parse platforms
    let parsed = null;
    if (typeof socialMedias !== 'undefined') {
      try {
        const raw = typeof socialMedias === 'string' ? JSON.parse(socialMedias) : socialMedias;
        parsed = Array.isArray(raw)
          ? raw
              .filter(p => p && p.name && p.link && String(p.link).trim() !== '')
              .map(p => ({ name: String(p.name).trim(), link: String(p.link).trim() }))
          : [];
      } catch (e) {
        if (req.file) {
          await safeUnlink(path.join(__dirname, '..', 'Uploads', image_path));
        }
        return res.status(400).json({ error: 'Invalid social media data format' });
      }
    }

    // Update the parent group
    await q(
      `UPDATE social_groups
          SET title = ?, image_path = ?, updated_at = NOW()
        WHERE id = ? AND guide_id = ?`,
      [title?.trim() || existing.title, image_path, id, guideId]
    );

    if (parsed) {
      await q('DELETE FROM social_group_platforms WHERE social_group_id = ?', [id]);
      for (const p of parsed) {
        try {
          await q(
            `INSERT INTO social_group_platforms
               (social_group_id, platform_name, platform_link, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [id, p.name, p.link]
          );
        } catch (err) {
          console.error('[UPDATE_PLATFORMS_ERROR]', err.message);
          return res.status(500).json({ error: 'Failed to update platform entries' });
        }
      }
    }

    const [updated] = await q(
      'SELECT id, guide_id, title, image_path, status, reason, created_at, updated_at FROM social_groups WHERE id = ? AND guide_id = ?',
      [id, guideId]
    );
    const platRows = await q(
      'SELECT platform_name, platform_link FROM social_group_platforms WHERE social_group_id = ? ORDER BY id ASC',
      [id]
    );

    return res.json({
      message: 'Social group updated successfully',
      group: {
        ...updated,
        socialMedias: platRows.map(r => ({ name: r.platform_name, link: r.platform_link })),
        image: publicImageUrl(req, updated?.image_path)
      }
    });
  } catch (error) {
    console.error('[UPDATE_GROUP_ERROR]', error.message);
    if (req.file) {
      await safeUnlink(path.join(__dirname, '..', 'Uploads', 'socialgroups', req.file.filename));
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSocialGroup = async (req, res) => {
  const guideId = requireGuideId(req, res);
  if (guideId === null) return;

  try {
    const { id } = req.params;

    const [existing] = await q(
      'SELECT id, guide_id, title, image_path, status, reason FROM social_groups WHERE id = ? AND guide_id = ?',
      [id, guideId]
    );
    if (!existing) {
      return res.status(404).json({ error: 'Social group not found' });
    }

    await q('DELETE FROM social_group_platforms WHERE social_group_id = ?', [id]);

    if (existing.image_path) {
      await safeUnlink(path.join(__dirname, '..', 'Uploads', existing.image_path));
    }

    await q('DELETE FROM social_groups WHERE id = ? AND guide_id = ?', [id, guideId]);

    return res.json({ message: 'Social group deleted successfully' });
  } catch (error) {
    console.error('[DELETE_GROUP_ERROR]', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createSocialGroup,
  getSocialGroups,
  updateSocialGroup,
  deleteSocialGroup
};
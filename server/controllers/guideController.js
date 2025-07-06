const db = require('../config/db');

const getGuide = (req, res) => {
    const guideId = req.params.id;
    
    db.query(
        'SELECT id, name, email, national_id, contact, birthday, country, language, experience, profile_image, bio, rating, reviews, facebook_url, instagram_url, tiktok_url, created_at FROM Guides WHERE id = ?',
        [guideId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Guide not found' });
            }
            res.status(200).json(results[0]);
        }
    );
};

const updateGuide = (req, res) => {
  const guideId = req.params.id;
  const { name, bio, facebook_url, instagram_url, tiktok_url, country, language, experience, categories } = req.body;
  const profileImage = req.file ? `/profiles/${req.file.filename}` : null;

  const updates = {};
  if (name) updates.name = name;
  if (bio) updates.bio = bio;
  if (facebook_url) updates.facebook_url = facebook_url;
  if (instagram_url) updates.instagram_url = instagram_url;
  if (tiktok_url) updates.tiktok_url = tiktok_url;
  if (country) updates.country = country;
  if (language) updates.language = language;
  if (experience) updates.experience = experience;
  if (profileImage) updates.profile_image = profileImage;
  if (categories) updates.categories = JSON.stringify(categories);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const query = 'UPDATE Guides SET ? WHERE id = ?';
  db.query(query, [updates, guideId], (err, result) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
};

const addPost = (req, res) => {
  const guideId = req.params.id;
  const { title, caption, location } = req.body;
  const image = req.file ? `/posts/${req.file.filename}` : null;

  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'Image is required' });
  }

  if (!title || !caption || !location || !image) {
    return res.status(400).json({ error: 'All fields (title, caption, location, image) are required' });
  }

  const query = `
    INSERT INTO Posts (guide_id, title, image, caption, location)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [guideId, title, image, caption, location], (err, result) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.status(201).json({ message: 'Post added successfully', postId: result.insertId, image });
  });
};
const getPosts = (req, res) => {
    const guideId = req.params.id;

    db.query(
        'SELECT id, title, image, caption, location, created_at FROM Posts WHERE guide_id = ? ORDER BY created_at DESC',
        [guideId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            res.status(200).json(results);
        }
    );
};

const addGalleryImage = (req, res) => {
  const guideId = req.params.id;
  const image = req.file ? `/posts/${req.file.filename}` : null;

  if (!image) {
    return res.status(400).json({ error: 'Image is required' });
  }

  const query = 'INSERT INTO Gallery (guide_id, image) VALUES (?, ?)';
  db.query(query, [guideId, image], (err, result) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.status(201).json({ message: 'Gallery image added successfully', imageId: result.insertId, image });
  });
};
const getGalleryImages = (req, res) => {
    const guideId = req.params.id;

    db.query(
        'SELECT id, image, created_at FROM Gallery WHERE guide_id = ? ORDER BY created_at DESC',
        [guideId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            res.status(200).json(results);
        }
    );
};

const deletePost = (req, res) => {
    const postId = req.params.postId;

    db.query('DELETE FROM Posts WHERE id = ?', [postId], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    });
};

const deleteGalleryImage = (req, res) => {
    const imageId = req.params.imageId;

    db.query('DELETE FROM Gallery WHERE id = ?', [imageId], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }
        res.status(200).json({ message: 'Gallery image deleted successfully' });
    });
};

module.exports = { getGuide, updateGuide, addPost, getPosts, addGalleryImage, getGalleryImages, deletePost, deleteGalleryImage };
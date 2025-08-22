const db = require('../config/db');

exports.getGuides = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT id, name, email, national_id, contact, birthday, country AS location, 
              language, experience, profile_image, bio, rating, reviews, 
              facebook_url, instagram_url, tiktok_url, status, geolocation_enabled 
       FROM guides 
       ORDER BY created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching guides:', err);
    return res.status(500).json({ error: 'Failed to fetch guides' });
  }
};

exports.getGuideById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT id, name, email, national_id, contact, birthday, country AS location, 
              language, experience, profile_image, bio, rating, reviews, 
              facebook_url, instagram_url, tiktok_url, status, geolocation_enabled 
       FROM guides 
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching guide:', err);
    return res.status(500).json({ error: 'Failed to fetch guide' });
  }
};

exports.updateGuideStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  try {
    const [result] = await db.promise().execute(
      `UPDATE guides SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    return res.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error('Error updating guide status:', err);
    return res.status(500).json({ error: 'Failed to update status' });
  }
};
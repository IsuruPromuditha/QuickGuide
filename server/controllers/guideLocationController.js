const db = require('../config/db');

const getSettings = (req, res) => {
  const guide_id = req.user.id;

  try {
    const query = 'SELECT geolocation_enabled, latitude, longitude FROM Guides WHERE id = ?';
    db.query(query, [guide_id], (err, results) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch settings.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Guide not found.' });
      }
      res.status(200).json(results[0]);
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

const updateLocation = (req, res) => {
  const guide_id = req.user.id;
  const { latitude, longitude, geolocation_enabled } = req.body;

  try {
    // Validate inputs
    if (geolocation_enabled && (latitude === null || longitude === null)) {
      return res.status(400).json({ error: 'Latitude and longitude are required when geolocation is enabled.' });
    }
    if (latitude !== null && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
      return res.status(400).json({ error: 'Invalid latitude value.' });
    }
    if (longitude !== null && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
      return res.status(400).json({ error: 'Invalid longitude value.' });
    }

    const query = `
      UPDATE Guides
      SET geolocation_enabled = ?, latitude = ?, longitude = ?
      WHERE id = ?
    `;
    const values = [
      geolocation_enabled || false,
      latitude !== null ? latitude : null,
      longitude !== null ? longitude : null,
      guide_id,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Failed to update location.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Guide not found.' });
      }
      res.status(200).json({ message: 'Location updated successfully.' });
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = { getSettings, updateLocation };
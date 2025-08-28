const db = require('../config/db');

const updateLocation = async (req, res) => {
  const { booking_id, latitude, longitude } = req.body;
  const user_id = req.user.id;
  const role = req.user.role; // Assume role is 'guide' or 'tourist' from token

  if (!booking_id || !latitude || !longitude) {
    return res.status(400).json({ error: 'Booking ID, latitude, and longitude are required' });
  }

  try {
    const query = `
      INSERT INTO Locations (booking_id, user_id, role, latitude, longitude, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE latitude = ?, longitude = ?, updated_at = NOW()
    `;
    db.query(query, [booking_id, user_id, role, latitude, longitude, latitude, longitude], (err, result) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      res.status(200).json({ message: 'Location updated successfully' });
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

const getLocation = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const query = `
      SELECT role, latitude, longitude, updated_at
      FROM Locations
      WHERE booking_id = ?
    `;
    db.query(query, [bookingId], (err, results) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = { updateLocation, getLocation };
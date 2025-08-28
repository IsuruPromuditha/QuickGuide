const db = require('../config/db');

const getLeaderboard = async (req, res) => {
  try {
    const query = `
      SELECT 
        g.id, 
        g.name, 
        g.profile_image, 
        g.categories, 
        g.rating, 
        COUNT(b.id) as completed_rides
      FROM guides g
      LEFT JOIN bookings b ON g.id = b.guide_id AND b.status = 'completed'
      WHERE g.status = 'active'
      GROUP BY g.id, g.name, g.profile_image, g.categories, g.rating
      ORDER BY completed_rides DESC, g.rating DESC
      LIMIT 50
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching leaderboard:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const guides = results.map((row) => ({
        id: row.id,
        name: row.name,
        profile_image: row.profile_image ? `${row.profile_image}` : null,
        categories: row.categories ? JSON.parse(row.categories) : [],
        rating: row.rating ? parseFloat(row.rating).toFixed(1) : null,
        completed_rides: parseInt(row.completed_rides) || 0,
      }));

      res.json(guides);
    });
  } catch (error) {
    console.error('Error in getLeaderboard:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getLeaderboard };
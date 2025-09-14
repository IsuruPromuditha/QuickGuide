const express = require('express');
const router = express.Router();
const { getTouristLeaderboard } = require('../controllers/touristLeaderBoardController');
const { authenticateToken, authorizeTourist } = require('../middleware/authMiddleware');

router.get('/tourist-leaderboard', authenticateToken, authorizeTourist, getTouristLeaderboard);

module.exports = router;
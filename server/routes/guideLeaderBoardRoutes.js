const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/guideLeaderBoardController');
const { authenticateToken, authorizeGuide } = require('../middleware/authMiddleware');

router.get('/guide-leaderboard', authenticateToken, authorizeGuide, getLeaderboard);

module.exports = router;
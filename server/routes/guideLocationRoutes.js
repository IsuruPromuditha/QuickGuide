const express = require('express');
const router = express.Router();
const guideLocationController = require('../controllers/guideLocationController');
const { authenticateToken, authorizeGuide } = require('../middleware/authMiddleware');

// Routes for guide location settings
router.get('/settings', authenticateToken, authorizeGuide, guideLocationController.getSettings);
router.put('/location', authenticateToken, authorizeGuide, guideLocationController.updateLocation);

module.exports = router;
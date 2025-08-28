const express = require('express');
const router = express.Router();
const { updateLocation, getLocation } = require('../controllers/locationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/update', authenticateToken, updateLocation);
router.get('/:bookingId', authenticateToken, getLocation);

module.exports = router;
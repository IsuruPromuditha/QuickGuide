const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { authenticateToken, authorizeTourist, authorizeGuide } = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, authorizeTourist, createBooking);
router.get('/guide', authenticateToken, authorizeGuide, getBookings);
router.patch('/update/:id', authenticateToken, authorizeGuide, updateBookingStatus);

module.exports = router;
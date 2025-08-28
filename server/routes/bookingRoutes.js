const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, getTouristBookings, getBookingLocations } = require('../controllers/bookingController');
const { authenticateToken, authorizeTourist, authorizeGuide } = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, authorizeTourist, createBooking);
router.get('/guide', authenticateToken, authorizeGuide, getBookings);
router.get('/tourist', authenticateToken, authorizeTourist, getTouristBookings);
router.patch('/update/:id', authenticateToken, authorizeGuide, updateBookingStatus);
router.get('/locations/:bookingId', authenticateToken, getBookingLocations);

module.exports = router;
// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getAllBookings);
router.get('/user/:cnic', bookingController.getBookingsByUser);
router.get('/event/:eventId', bookingController.getBookingsByEvent);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id/status', bookingController.updateBookingStatus);
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
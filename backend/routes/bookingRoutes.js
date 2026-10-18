
const express = require('express');

const router = express.Router();

const {
    createBooking,
    getBookings,
    getBookingById,
    deleteBooking
} = require('../controllers/bookingController');

// Create a booking
router.post('/', createBooking);

// Get all bookings
router.get('/', getBookings);

// Get one booking by ID
router.get('/:id', getBookingById);

// Cancel a booking
router.delete('/:id', deleteBooking);

module.exports = router;

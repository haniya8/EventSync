// backend/controllers/bookingController.js
const bookingModel = require('../models/BookingModel');

// Get all bookings
async function getAllBookings(req, res) {
    try {
        const bookings = await bookingModel.listAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error in getAllBookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}

// Get bookings by user
async function getBookingsByUser(req, res) {
    try {
        const { cnic } = req.params;
        const bookings = await bookingModel.getBookingsByUser(cnic);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error in getBookingsByUser:', error);
        res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
}

// Get booking by ID
async function getBookingById(req, res) {
    try {
        const { id } = req.params;
        const booking = await bookingModel.getBookingById(id);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.status(200).json(booking);
    } catch (error) {
        console.error('Error in getBookingById:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
}

// Create booking
async function createBooking(req, res) {
    try {
        const { cnic, event_id, num_tickets, payment_method } = req.body;
        
        if (!cnic || !event_id || !num_tickets || !payment_method) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const booking = await bookingModel.createBooking(cnic, event_id, num_tickets, payment_method);
        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        console.error('Error in createBooking:', error);
        
        // Check if it's a seat availability error
        if (error.message && error.message.includes('Not enough seats')) {
            return res.status(400).json({ error: 'Not enough seats available for this event' });
        }
        
        res.status(500).json({ error: 'Failed to create booking' });
    }
}

// Update booking status
async function updateBookingStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        
        const booking = await bookingModel.updateBookingStatus(id, status);
        res.status(200).json({ message: 'Booking status updated successfully', booking });
    } catch (error) {
        console.error('Error in updateBookingStatus:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
}

// Cancel booking
async function cancelBooking(req, res) {
    try {
        const { id } = req.params;
        await bookingModel.cancelBooking(id);
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error in cancelBooking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
}

// Get bookings by event
async function getBookingsByEvent(req, res) {
    try {
        const { eventId } = req.params;
        const bookings = await bookingModel.getBookingsByEvent(eventId);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error in getBookingsByEvent:', error);
        res.status(500).json({ error: 'Failed to fetch event bookings' });
    }
}

module.exports = {
    getAllBookings,
    getBookingsByUser,
    getBookingById,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getBookingsByEvent
};
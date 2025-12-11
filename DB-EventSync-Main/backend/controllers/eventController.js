// backend/controllers/eventController.js
const eventModel = require('../models/EventModel');

// Get all events
async function getAllEvents(req, res) {
    try {
        const events = await eventModel.listAllEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error in getAllEvents:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}

// Get upcoming events
async function getUpcomingEvents(req, res) {
    try {
        const events = await eventModel.getUpcomingEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error in getUpcomingEvents:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming events' });
    }
}

// Get event by ID
async function getEventById(req, res) {
    try {
        const { id } = req.params;
        const event = await eventModel.getEventById(id);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.status(200).json(event);
    } catch (error) {
        console.error('Error in getEventById:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
}

// Create event
async function createEvent(req, res) {
    
    try {
        console.log("CREATE EVENT BODY:", req.body);

        const { 
            organiser_id, 
            venue_id, 
            title, 
            category, 
            event_date, 
            start_time, 
            end_time, 
            ticket_price, 
            allocated_seats 
        } = req.body;
        
        if (!organiser_id || !venue_id || !title || !event_date || !ticket_price || !allocated_seats) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        
        const event = await eventModel.createEvent(
            organiser_id, 
            venue_id, 
            title, 
            category, 
            event_date, 
            start_time, 
            end_time, 
            ticket_price, 
            allocated_seats
        );
        
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        console.error('Error in createEvent:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
}

// Update event
async function updateEvent(req, res) {
    try {
        const { id } = req.params;
        const { 
            organiser_id, 
            venue_id, 
            title, 
            category, 
            event_date, 
            start_time, 
            end_time, 
            ticket_price, 
            allocated_seats,
            status 
        } = req.body;
        
        if (!organiser_id || !venue_id || !title || !event_date || !ticket_price || !allocated_seats) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        
        const event = await eventModel.updateEvent(
            id, 
            organiser_id, 
            venue_id, 
            title, 
            category, 
            event_date, 
            start_time, 
            end_time, 
            ticket_price, 
            allocated_seats,
            status || 'UPCOMING'
        );
        
        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error('Error in updateEvent:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
}

// Delete event
async function deleteEvent(req, res) {
    try {
        const { id } = req.params;
        await eventModel.deleteEvent(id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error in deleteEvent:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
}

// Get available seats
async function getAvailableSeats(req, res) {
    try {
        const { id } = req.params;
        const seats = await eventModel.getAvailableSeats(id);
        res.status(200).json(seats);
    } catch (error) {
        console.error('Error in getAvailableSeats:', error);
        res.status(500).json({ error: 'Failed to fetch available seats' });
    }
}

module.exports = {
    getAllEvents,
    getUpcomingEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getAvailableSeats
};
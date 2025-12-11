// backend/controllers/venueController.js
const venueModel = require('../models/VenueModel');

// Get all venues
async function getAllVenues(req, res) {
    try {
        const venues = await venueModel.getAllVenues();
        res.status(200).json(venues);
    } catch (error) {
        console.error('Error in getAllVenues:', error);
        res.status(500).json({ error: 'Failed to fetch venues' });
    }
}

// Get venue by ID
async function getVenueById(req, res) {
    try {
        const { id } = req.params;
        const venue = await venueModel.getVenueById(id);
        
        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }
        
        res.status(200).json(venue);
    } catch (error) {
        console.error('Error in getVenueById:', error);
        res.status(500).json({ error: 'Failed to fetch venue' });
    }
}

// Create venue
async function createVenue(req, res) {
    try {
        const { venue_name, address, city, capacity } = req.body;
        
        if (!venue_name || !address || !capacity) {
            return res.status(400).json({ error: 'Venue name, address, and capacity are required' });
        }
        
        const venue = await venueModel.createVenue(venue_name, address, city, capacity);
        res.status(201).json({ message: 'Venue created successfully', venue });
    } catch (error) {
        console.error('Error in createVenue:', error);
        res.status(500).json({ error: 'Failed to create venue' });
    }
}

// Update venue
async function updateVenue(req, res) {
    try {
        const { id } = req.params;
        const { venue_name, address, city, capacity } = req.body;
        
        if (!venue_name || !address || !capacity) {
            return res.status(400).json({ error: 'Venue name, address, and capacity are required' });
        }
        
        const result = await venueModel.updateVenue(id, venue_name, address, city, capacity);
        
        if (result === 0) {
            return res.status(404).json({ error: 'Venue not found' });
        }
        
        res.status(200).json({ message: 'Venue updated successfully' });
    } catch (error) {
        console.error('Error in updateVenue:', error);
        res.status(500).json({ error: 'Failed to update venue' });
    }
}

// Delete venue
async function deleteVenue(req, res) {
    try {
        const { id } = req.params;
        const result = await venueModel.deleteVenue(id);
        
        if (result === 0) {
            return res.status(404).json({ error: 'Venue not found' });
        }
        
        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (error) {
        console.error('Error in deleteVenue:', error);
        res.status(500).json({ error: 'Failed to delete venue' });
    }
}

module.exports = {
    getAllVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
};
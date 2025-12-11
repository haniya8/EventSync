// backend/controllers/organiserController.js
const organiserModel = require('../models/OrganiserModel');

// Get all organisers
async function getAllOrganisers(req, res) {
    try {
        const organisers = await organiserModel.listAllOrganisers();
        res.status(200).json(organisers);
    } catch (error) {
        console.error('Error in getAllOrganisers:', error);
        res.status(500).json({ error: 'Failed to fetch organisers' });
    }
}

// Get organiser by ID
async function getOrganiserById(req, res) {
    try {
        const { id } = req.params;
        const organiserId = Number(id);

        if (isNaN(organiserId)) {
            return res.status(400).json({ error: 'Invalid organiser ID' });
        }

        const organiser = await organiserModel.getOrganiserById(organiserId);

        if (!organiser) {
            return res.status(404).json({ error: 'Organiser not found' });
        }

        res.status(200).json(organiser);
    } catch (error) {
        console.error('Error in getOrganiserById:', error);
        res.status(500).json({ error: 'Failed to fetch organiser' });
    }
}

// Create organiser
async function createOrganiser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const organiser = await organiserModel.createOrganiser(name, email, password);
        res.status(201).json({ message: 'Organiser created successfully', organiser });
    } catch (error) {
        console.error('Error in createOrganiser:', error);
        res.status(500).json({ error: 'Failed to create organiser' });
    }
}

// Update organiser
async function updateOrganiser(req, res) {
    try {
        const { id } = req.params;
        const organiserId = Number(id);
        const { name, email, password } = req.body;

        if (isNaN(organiserId)) {
            return res.status(400).json({ error: 'Invalid organiser ID' });
        }

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const organiser = await organiserModel.updateOrganiser(organiserId, name, email, password);
        res.status(200).json({ message: 'Organiser updated successfully', organiser });
    } catch (error) {
        console.error('Error in updateOrganiser:', error);
        res.status(500).json({ error: 'Failed to update organiser' });
    }
}

// Delete organiser
async function deleteOrganiser(req, res) {
    try {
        const { id } = req.params;
        const organiserId = Number(id);

        if (isNaN(organiserId)) {
            return res.status(400).json({ error: 'Invalid organiser ID' });
        }

        await organiserModel.deleteOrganiser(organiserId);
        res.status(200).json({ message: 'Organiser deleted successfully' });
    } catch (error) {
        console.error('Error in deleteOrganiser:', error);
        res.status(500).json({ error: 'Failed to delete organiser' });
    }
}

// Get events by organiser
async function getEventsByOrganiser(req, res) {
    try {
        const { id } = req.params;
        const organiserId = Number(id);

        if (isNaN(organiserId)) {
            return res.status(400).json({ error: 'Invalid organiser ID' });
        }

        const events = await organiserModel.getEventsByOrganiser(organiserId);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error in getEventsByOrganiser:', error);
        res.status(500).json({ error: 'Failed to fetch organiser events' });
    }
}

// Login organiser
async function loginOrganiser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const organiser = await organiserModel.loginOrganiser(email, password);

        if (!organiser) {
            return res.status(401).json({ success: false, error: 'Invalid organiser credentials' });
        }

        // Return consistent response
        return res.status(200).json({
            success: true,
            organiser: {
                organiser_id: organiser.ORGANISER_ID,
                name: organiser.NAME,
                email: organiser.EMAIL_ADDRESS
            }
        });

    } catch (error) {
        console.error('Error logging in organiser:', error);
        return res.status(500).json({ success: false, error: 'Failed to login organiser' });
    }
}

// Get events by organiser WITH STATS, individual stats
async function getEventsByOrganiser(req, res) {
    const oracledb = require('oracledb');
    const database = require('../config/db');
    let connection;
    try {
        const { id } = req.params;
        const organiserId = Number(id);

        if (isNaN(organiserId)) {
            return res.status(400).json({ error: 'Invalid organiser ID' });
        }

        connection = await database.getConnection();
        
        const result = await connection.execute(
            `SELECT 
                e.EVENT_ID,
                e.ORGANISER_ID,
                e.VENUE_ID,
                e.TITLE,
                e.CATEGORY,
                e.EVENT_DATE,
                e.START_TIME,
                e.END_TIME,
                e.TICKET_PRICE,
                e.ALLOCATED_SEATS,
                e.STATUS,
                v.VENUE_NAME,
                v.CITY,
                COUNT(CASE WHEN b.STATUS != 'CANCELLED' THEN 1 END) as TOTAL_BOOKINGS,
                NVL(SUM(CASE WHEN b.STATUS != 'CANCELLED' THEN b.NUM_TICKETS ELSE 0 END), 0) as TICKETS_SOLD,
                NVL(SUM(CASE WHEN b.STATUS != 'CANCELLED' THEN b.TOTAL_AMOUNT ELSE 0 END), 0) as REVENUE,
                e.ALLOCATED_SEATS - NVL(SUM(CASE WHEN b.STATUS != 'CANCELLED' THEN b.NUM_TICKETS ELSE 0 END), 0) as TICKETS_LEFT
             FROM event e
             JOIN venue v ON e.venue_id = v.venue_id
             LEFT JOIN booking b ON e.event_id = b.event_id
             WHERE e.organiser_id = :organiserId
             GROUP BY e.EVENT_ID, e.ORGANISER_ID, e.VENUE_ID, e.TITLE, e.CATEGORY, 
                      e.EVENT_DATE, e.START_TIME, e.END_TIME, e.TICKET_PRICE, 
                      e.ALLOCATED_SEATS, e.STATUS, v.VENUE_NAME, v.CITY
             ORDER BY e.EVENT_DATE DESC`,
            [organiserId]
        );
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getEventsByOrganiser:', error);
        res.status(500).json({ error: 'Failed to fetch organiser events' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// Get bookings for organiser
async function getBookingsByOrganiser(req, res) {
    const oracledb = require('oracledb');
    const database = require('../config/db');
    let connection;
    try {
        const { id } = req.params;
        const organiserId = Number(id);

        if (isNaN(organiserId)) {
            return res.status(400).json({ error: 'Invalid organiser ID' });
        }

        connection = await database.getConnection();
        
        const result = await connection.execute(
            `SELECT 
                b.BOOKING_ID,
                b.CNIC,
                b.EVENT_ID,
                b.BOOKING_DATE,
                b.NUM_TICKETS,
                b.TOTAL_AMOUNT,
                b.STATUS,
                u.NAME as USER_NAME,
                u.EMAIL as USER_EMAIL,
                u.PHONE as USER_PHONE,
                e.TITLE as EVENT_TITLE,
                e.EVENT_DATE
             FROM booking b
             JOIN users u ON b.cnic = u.cnic
             JOIN event e ON b.event_id = e.event_id
             WHERE e.organiser_id = :organiserId
             ORDER BY b.BOOKING_DATE DESC`,
            [organiserId]
        );
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getBookingsByOrganiser:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// Get stats for organiser, total stats
async function getOrganiserStats(req, res) {
    const oracledb = require('oracledb');
    const database = require('../config/db');
    let connection;
    try {
        const { id } = req.params;
        const organiserId = Number(id);

        if (isNaN(organiserId)) {
            return res.status(400).json({ error: 'Invalid organiser ID' });
        }

        connection = await database.getConnection();
        
        const result = await connection.execute(
            `SELECT 
                COUNT(DISTINCT CASE WHEN b.STATUS != 'CANCELLED' THEN b.BOOKING_ID END) as TOTAL_BOOKINGS,
                NVL(SUM(CASE WHEN b.STATUS != 'CANCELLED' THEN b.NUM_TICKETS ELSE 0 END), 0) as TOTAL_TICKETS_SOLD,
                NVL(SUM(CASE WHEN b.STATUS != 'CANCELLED' THEN b.TOTAL_AMOUNT ELSE 0 END), 0) as TOTAL_REVENUE
             FROM event e
             LEFT JOIN booking b ON e.event_id = b.event_id
             WHERE e.organiser_id = :organiserId`,
            [organiserId]
        );
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in getOrganiserStats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}


module.exports = {
    getAllOrganisers,
    getOrganiserById,
    createOrganiser,
    updateOrganiser,
    deleteOrganiser,
    getEventsByOrganiser,
    loginOrganiser,
    getBookingsByOrganiser, 
    getOrganiserStats  
};
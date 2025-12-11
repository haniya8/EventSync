// backend/models/venueModel.js
const oracledb = require('oracledb');
const database = require('../config/db');

// Get all venues
async function getAllVenues() {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT venue_id, venue_name, city, address, capacity 
             FROM venue 
             ORDER BY venue_name`
        );
        return result.rows;
    } catch (err) {
        console.error('Error getting venues:', err);
        throw err;
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

// Get venue by ID
async function getVenueById(venueId) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT venue_id, venue_name, city, address, capacity 
             FROM venue 
             WHERE venue_id = :venueId`,
            [venueId]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error getting venue:', err);
        throw err;
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

// Create venue
async function createVenue(venueName, address, city, capacity) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `INSERT INTO venue (venue_name, address, city, capacity) 
             VALUES (:venueName, :address, :city, :capacity)
             RETURNING venue_id INTO :id`,
            {
                venueName,
                address,
                city,
                capacity,
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );
        return { venue_id: result.outBinds.id[0] };
    } catch (err) {
        console.error('Error creating venue:', err);
        throw err;
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

// Update venue
async function updateVenue(venueId, venueName, address, city, capacity) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `UPDATE venue 
             SET venue_name = :venueName,
                 address = :address,
                 city = :city,
                 capacity = :capacity
             WHERE venue_id = :venueId`,
            {
                venueId,
                venueName,
                address,
                city,
                capacity
            },
            { autoCommit: true }
        );
        return result.rowsAffected;
    } catch (err) {
        console.error('Error updating venue:', err);
        throw err;
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

// Delete venue
async function deleteVenue(venueId) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `DELETE FROM venue WHERE venue_id = :venueId`,
            [venueId],
            { autoCommit: true }
        );
        return result.rowsAffected;
    } catch (err) {
        console.error('Error deleting venue:', err);
        throw err;
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
    getAllVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
};
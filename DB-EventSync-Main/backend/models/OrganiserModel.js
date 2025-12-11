// backend/models/organiserModel.js
const oracledb = require('oracledb');
const database = require('../config/db');

// List all organisers
async function listAllOrganisers() {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT organiser_id, name, email_address FROM organiser ORDER BY name`
        );
        return result.rows;
    } catch (err) {
        console.error('Error listing organisers:', err);
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

// Get organiser by ID
async function getOrganiserById(organiserId) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT organiser_id, name, email_address 
             FROM organiser 
             WHERE organiser_id = :organiserId`,
            [organiserId]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (err) {
        console.error('Error getting organiser by ID:', err);
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

async function createOrganiser(name, email, password) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `INSERT INTO organiser (name, email_address, password)
             VALUES (:name, :email, :password)
             RETURNING organiser_id INTO :id`,
            {
                name,
                email,
                password,
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );
        return { organiser_id: result.outBinds.id[0], name, email_address: email };
    } catch (err) {
        console.error('Error creating organiser:', err);
        throw err;
    } finally {
        if (connection) try { await connection.close(); } catch(e) {}
    }
}

// Login organiser
async function loginOrganiser(email, password) {
    let connection;
    try {
        connection = await database.getConnection();

        // Fetch organiser by email
        const result = await connection.execute(
            `SELECT organiser_id, name, email_address, password
             FROM organiser
             WHERE LOWER(email_address) = LOWER(:email)`,
            { email },
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // returns object, not array
        );

        const organiser = result.rows[0];
        if (!organiser) return null;

        // Compare plain text password
        if (organiser.PASSWORD !== password) return null;

        return organiser;

    } catch (err) {
        console.error('Error logging in organiser:', err);
        throw err;
    } finally {
        if (connection) try { await connection.close(); } catch (e) {}
    }
}


// Update organiser
async function updateOrganiser(organiserId, name, email) {
    let connection;
    try {
        connection = await database.getConnection();
        await connection.execute(
            `UPDATE organiser SET name = :name, email_address = :email WHERE organiser_id = :organiserId`,
            [name, email, organiserId],
            { autoCommit: true }
        );
        return { organiser_id: organiserId, name, email_address: email };
    } catch (err) {
        console.error('Error updating organiser:', err);
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

// Delete organiser
async function deleteOrganiser(organiserId) {
    let connection;
    try {
        connection = await database.getConnection();
        await connection.execute(
            `DELETE FROM organiser WHERE organiser_id = :organiserId`,
            [organiserId],
            { autoCommit: true }
        );
        return { success: true };
    } catch (err) {
        console.error('Error deleting organiser:', err);
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

// Get events by organiser
async function getEventsByOrganiser(organiserId) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT e.event_id, e.title, e.category, e.event_date, 
                    e.start_time, e.end_time, e.ticket_price, e.allocated_seats, e.status,
                    v.venue_name, v.city
             FROM event e
             JOIN venue v ON e.venue_id = v.venue_id
             WHERE e.organiser_id = :organiserId
             ORDER BY e.event_date DESC`,
            [organiserId]
        );
        return result.rows;
    } catch (err) {
        console.error('Error getting organiser events:', err);
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
    listAllOrganisers,
    getOrganiserById,
    createOrganiser,
    updateOrganiser,
    deleteOrganiser,
    getEventsByOrganiser,
    loginOrganiser
};
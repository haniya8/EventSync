// backend/models/bookingModel.js
const oracledb = require('oracledb');
const database = require('../config/db');

// List all bookings
async function listAllBookings() {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT b.booking_id, b.cnic, b.booking_date, b.num_tickets, 
                    b.total_amount, b.status,
                    u.name as user_name, e.title as event_title, 
                    e.event_date, p.payment_status
             FROM booking b
             JOIN users u ON b.cnic = u.cnic
             JOIN event e ON b.event_id = e.event_id
             LEFT JOIN payment p ON b.booking_id = p.booking_id
             ORDER BY b.booking_date DESC`,
            {},
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error listing bookings:', err);
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

// Get bookings by user
async function getBookingsByUser(cnic) {
    let connection;
    try {
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
                e.TITLE as EVENT_TITLE,
                e.EVENT_DATE,
                p.PAYMENT_STATUS
             FROM booking b
             JOIN users u ON b.cnic = u.cnic
             JOIN event e ON b.event_id = e.event_id
             LEFT JOIN payment p ON b.booking_id = p.booking_id
             WHERE b.cnic = :cnic 
             ORDER BY b.booking_date DESC`,
            { cnic },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error getting user bookings:', err);
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

// Get booking by ID
async function getBookingById(bookingId) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT b.booking_id, b.cnic, b.event_id, b.booking_date, 
                    b.num_tickets, b.total_amount, b.status,
                    u.name as user_name, u.email, u.phone,
                    e.title as event_title, e.event_date, e.start_time,
                    v.venue_name, v.city,
                    p.payment_id, p.payment_status, p.payment_method, p.transaction_id
             FROM booking b
             JOIN users u ON b.cnic = u.cnic
             JOIN event e ON b.event_id = e.event_id
             JOIN venue v ON e.venue_id = v.venue_id
             LEFT JOIN payment p ON b.booking_id = p.booking_id
             WHERE b.booking_id = :bookingId`,
            { bookingId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error getting booking:', err);
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

// Create booking with sold out check
async function createBooking(cnic, eventId, numTickets, paymentMethod) {
    let connection;
    try {
        connection = await database.getConnection();
        
        //CHECK AVAILABLE SEATS FIRST
        const availableSeatsResult = await connection.execute(
            `SELECT 
                e.ALLOCATED_SEATS,
                NVL(SUM(CASE WHEN b.STATUS = 'CONFIRMED' THEN b.NUM_TICKETS ELSE 0 END), 0) as TICKETS_SOLD,
                e.ALLOCATED_SEATS - NVL(SUM(CASE WHEN b.STATUS = 'CONFIRMED' THEN b.NUM_TICKETS ELSE 0 END), 0) as AVAILABLE_SEATS
             FROM event e
             LEFT JOIN booking b ON e.event_id = b.event_id
             WHERE e.event_id = :eventId
             GROUP BY e.ALLOCATED_SEATS`,
            { eventId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        if (availableSeatsResult.rows.length === 0) {
            throw new Error('Event not found');
        }
        
        const availableSeats = availableSeatsResult.rows[0].AVAILABLE_SEATS;
        
        // CHECK IF SOLD OUT
        if (availableSeats === 0) {
            throw new Error('All tickets have been sold out for this event');
        }
        
        //  CHECK IF ENOUGH TICKETS AVAILABLE
        if (availableSeats < numTickets) {
            throw new Error(`Not enough seats available. Only ${availableSeats} tickets remaining`);
        }
        
        // Proceed with booking using stored procedure
        await connection.execute(
            `BEGIN
                create_booking(:cnic, :eventId, :numTickets, :paymentMethod);
             END;`,
            {
                cnic,
                eventId,
                numTickets,
                paymentMethod
            },
            { autoCommit: true }
        );
        
        // Get the last inserted booking
        const result = await connection.execute(
            `SELECT booking_id FROM booking WHERE cnic = :cnic AND event_id = :eventId 
             ORDER BY booking_date DESC FETCH FIRST 1 ROW ONLY`,
            { cnic, eventId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        return { booking_id: result.rows[0].BOOKING_ID };
    } catch (err) {
        console.error('Error creating booking:', err);
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

// Update booking status
async function updateBookingStatus(bookingId, status) {
    let connection;
    try {
        connection = await database.getConnection();
        await connection.execute(
            `UPDATE booking SET status = :status WHERE booking_id = :bookingId`,
            { status, bookingId },
            { autoCommit: true }
        );
        return { booking_id: bookingId, status };
    } catch (err) {
        console.error('Error updating booking:', err);
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

// Cancel booking
async function cancelBooking(bookingId) {
    let connection;
    try {
        connection = await database.getConnection();
        
        // Check if booking exists and is not already cancelled
        const checkResult = await connection.execute(
            `SELECT status FROM booking WHERE booking_id = :bookingId`,
            { bookingId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        if (checkResult.rows.length === 0) {
            throw new Error('Booking not found');
        }
        
        if (checkResult.rows[0].STATUS === 'CANCELLED') {
            throw new Error('Booking is already cancelled');
        }
        
        // Cancel the booking
        await connection.execute(
            `UPDATE booking SET status = 'CANCELLED' WHERE booking_id = :bookingId`,
            { bookingId },
            { autoCommit: true }
        );
        
        return { success: true };
    } catch (err) {
        console.error('Error cancelling booking:', err);
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

// Get bookings by event
async function getBookingsByEvent(eventId) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT b.booking_id, b.cnic, b.booking_date, b.num_tickets, 
                    b.total_amount, b.status,
                    u.name as user_name, u.email, u.phone,
                    p.payment_status
             FROM booking b
             JOIN users u ON b.cnic = u.cnic
             LEFT JOIN payment p ON b.booking_id = p.booking_id
             WHERE b.event_id = :eventId
             ORDER BY b.booking_date DESC`,
            { eventId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (err) {
        console.error('Error getting event bookings:', err);
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
    listAllBookings,
    getBookingsByUser,
    getBookingById,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getBookingsByEvent
};
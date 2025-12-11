// backend/models/eventModel.js
const oracledb = require('oracledb');
const database = require('../config/db');


// List all events
async function listAllEvents() {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT e.event_id, e.title, e.category, e.event_date, 
                    e.start_time, e.end_time, e.ticket_price, e.allocated_seats, e.status,
                    o.name as organiser_name, v.venue_name, v.city
             FROM event e
             JOIN organiser o ON e.organiser_id = o.organiser_id
             JOIN venue v ON e.venue_id = v.venue_id
             ORDER BY e.event_date DESC`
        );
        return result.rows;
    } catch (err) {
        console.error('Error listing events:', err);
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

// Get upcoming events
async function getUpcomingEvents() {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT * FROM upcoming_events_view ORDER BY event_date`
        );
        return result.rows;
    } catch (err) {
        console.error('Error getting upcoming events:', err);
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

// Get event by ID
async function getEventById(eventId) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT e.event_id, e.organiser_id, e.venue_id, e.title, e.category, 
                    e.event_date, e.start_time, e.end_time, e.ticket_price, 
                    e.allocated_seats, e.status,
                    o.name as organiser_name, v.venue_name, v.city, v.address
             FROM event e
             JOIN organiser o ON e.organiser_id = o.organiser_id
             JOIN venue v ON e.venue_id = v.venue_id
             WHERE e.event_id = :eventId`,
            [eventId]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error getting event:', err);
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


// Create event
async function createEvent(
    organiserId, venueId, title, category, eventDate, 
    startTime, endTime, ticketPrice, allocatedSeats) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `INSERT INTO event (organiser_id, venue_id, title, category, event_date, 
                               start_time, end_time, ticket_price, allocated_seats) 
             VALUES (:organiserId, :venueId, :title, :category, TO_DATE(:eventDate, 'YYYY-MM-DD'), 
                     :startTime, :endTime, :ticketPrice, :allocatedSeats)
             RETURNING event_id INTO :id`,
            {
                organiserId,
                venueId,
                title,
                category,
                eventDate,
                startTime,
                endTime,
                ticketPrice,
                allocatedSeats,
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );
        return { event_id: result.outBinds.id[0] };
    } catch (err) {
        console.error('Error creating event:', err);
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

// Update event
async function updateEvent(
  event_id,
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
) {
  let connection;

  try {
    connection = await database.getConnection();

    // FIX: ensure Oracle receives YYYY-MM-DD only
    const cleanDate =
      typeof event_date === "string"
        ? event_date.split("T")[0]
        : event_date;

    const result = await connection.execute(
      `
        UPDATE event
        SET organiser_id    = :organiser_id,
            venue_id        = :venue_id,
            title           = :title,
            category        = :category,
            event_date      = TO_DATE(:event_date, 'YYYY-MM-DD'),
            start_time      = :start_time,
            end_time        = :end_time,
            ticket_price    = :ticket_price,
            allocated_seats = :allocated_seats,
            status          = :status
        WHERE event_id = :event_id
      `,
      {
        event_id,
        organiser_id,
        venue_id,
        title,
        category,
        event_date: cleanDate,
        start_time,
        end_time,
        ticket_price,
        allocated_seats,
        status
      },
      { autoCommit: true }
    );

    return result.rowsAffected;
  } catch (err) {
    console.error("Error updating event model:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}



// Delete event
async function deleteEvent(eventId) {
    let connection;
    try {
        connection = await database.getConnection();
        
        // First, delete all payments associated with bookings for this event
        await connection.execute(
            `DELETE FROM payment 
             WHERE booking_id IN (SELECT booking_id FROM booking WHERE event_id = :eventId)`,
            [eventId]
        );
        
        // Then delete all bookings for this event
        await connection.execute(
            `DELETE FROM booking WHERE event_id = :eventId`,
            [eventId]
        );
        
        // Finally, delete the event
        await connection.execute(
            `DELETE FROM event WHERE event_id = :eventId`,
            [eventId],
            { autoCommit: true }
        );
        
        return { success: true };
    } catch (err) {
        console.error('Error deleting event:', err);
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

// Get available seats for event
async function getAvailableSeats(eventId) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT allocated_seats - NVL(SUM(num_tickets), 0) as available_seats
             FROM event e
             LEFT JOIN booking b ON e.event_id = b.event_id
             WHERE e.event_id = :eventId
             GROUP BY allocated_seats`,
            [eventId]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error getting available seats:', err);
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
    listAllEvents,
    getUpcomingEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getAvailableSeats
};
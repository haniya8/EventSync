const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const organiserRoutes = require('./routes/organiserRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const venueRoutes = require('./routes/venueRoutes');

// Import DB
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Event Ticket Booking API is running!' });
});

app.use('/api/users', userRoutes);
app.use('/api/organisers', organiserRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/venues', venueRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server after DB pool is initialized
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await db.initialize();   // <-- initialize the pool here
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Visit http://localhost:${PORT} to verify the server is running`);
        });
    } catch (err) {
        console.error('Failed to initialize DB pool:', err);
    }
}

startServer();

module.exports = app;

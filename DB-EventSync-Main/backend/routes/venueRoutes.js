// backend/routes/venueRoutes.js
const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

// Get all venues
router.get('/', venueController.getAllVenues);

// Get venue by ID
router.get('/:id', venueController.getVenueById);

router.post('/', venueController.createVenue);
router.put('/:id', venueController.updateVenue);
router.delete('/:id', venueController.deleteVenue);

module.exports = router;
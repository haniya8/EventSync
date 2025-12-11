// backend/routes/organiserRoutes.js
const express = require('express');
const router = express.Router();
const organiserController = require('../controllers/organiserController');

router.post('/login', organiserController.loginOrganiser);
router.get('/', organiserController.getAllOrganisers);
router.get('/:id', organiserController.getOrganiserById);
router.get('/:id/events', organiserController.getEventsByOrganiser);
router.get('/:id/bookings', organiserController.getBookingsByOrganiser);  // ✅ ADD THIS LINE
router.get('/:id/stats', organiserController.getOrganiserStats);  // ✅ ADD THIS LINE
router.post('/', organiserController.createOrganiser);
router.put('/:id', organiserController.updateOrganiser);
router.delete('/:id', organiserController.deleteOrganiser);

module.exports = router;
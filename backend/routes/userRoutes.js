const express = require('express')
const router = express.Router();
const userControllers = require('../controllers/userControllers');

// Route for signing up user
router.post('/signup', userControllers.signup);

// Route to retrieve list of events the user created
router.get('/:gNumber/:email/eventsCreated', userControllers.getUserCreatedEvents);

// Route to retrieve list of events the user registered to join
router.get('/:gNumber/:email/eventsJoined', userControllers.getUserJoinedEvents);

module.exports = router;
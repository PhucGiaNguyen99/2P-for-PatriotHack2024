const express = require('express')
const router = express.Router();
const eventController = require('../controllers/eventController');

// Route for creating a new event
router.post('/create', eventController.createEvent);

// Route to get all events
router.get('/', eventController.getAllEvents);

// Route to search event by ID
router.get('/id/:id', eventController.getEventById);

// Route to search event by title
router.get('/title/:title', eventController.getEventByTitle);

// Route to search event by date
router.get('/date/:date', eventController.getEventByDate);

// Route to search event by location
router.get('/location/:location', eventController.getEventByLocation);

// Route to update an event by ID
router.put('/id/:id', eventController.updateEventById);

// Route to update an event by title
router.put('/title/:title', eventController.updateEventByTitle);

// Route to delete an event by ID
router.delete('/id/:id', eventController.deleteEventById);

// Route to delete an event by title
router.delete('/title/:title', eventController.deleteEventByTitle);

// Route to get upcoming events
router.get('/upcoming', eventController.getUpcomingEvents);

// Route to get past events
router.get('/past', eventController.getPastEvents);

// Router to allow user to join an event
router.post('/join/:id', eventController.joinEvent);

module.exports = router;
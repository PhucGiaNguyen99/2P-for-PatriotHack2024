const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        // Get the event data from the request body
        const { title, description, date, location, slots } = req.body;

        // Create a new Event instance with the provided data
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            createdBy: req.user ? req.user.id : null,  // Assuming authenticated user, otherwise null
            slots
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();

        // Add this event to the user's createdEvents list
        user.createdEvents.push(savedEvent._id);
        await user.save();

        // Send a success response with the saved event
        res.status(201).json(savedEvent);
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ message: 'Server error', error });
    }
}

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        // Retrieve all events from the database
        const events = await Event.find();

        // Send the events as a response
        res.status(200).json(events);
    } catch (error) {
        // Handle errors and send a 500 response
        res.status(500).json({ message: 'Server error', error });
    }
}

// Get event by ID
exports.getEventById = async (req, res) => {
    console.log('Received ID:', req.params.id);  // Log the ID parameter
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
}

// Get event by title
exports.getEventByTitle = async (req, res) => {
    try {
        const regex = new RegExp(`\\b${req.params.title}\\b`, 'i');  // Use word boundary \b to match the whole words
        const events = await Event.find({ title: { $regex: regex } });
        if (!events.length) {
            return res.status(404).json({ message: 'No events found with the specified title' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// Get event by date
exports.getEventByDate = async (req, res) => {
    try {
        const events = await Event.find({ date: new Date(req.params.date) });
        if (!events.length) {
            return res.status(404).json({ message: 'No events found on the specified date' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// Get event by location
exports.getEventByLocation = async (req, res) => {
    try {
        const regex = new RegExp(`\\b${req.params.location}\\b`, 'i');  // Use word boundary \b
        const events = await Event.find({ location: { $regex: regex } });
        if (!events.length) {
            return res.status(404).json({ message: 'No events found at the specified location' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, // The event ID from the URL
            { $set: req.body }, // Update the fields in the event with the data in the request body
            { new: true, runValidators: true } // Options to return the updated event and run validations
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(updatedEvent); // Send back the updated event
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.updateEventById = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.updateEventByTitle = async (req, res) => {
    try {
        const updatedEvent = await Event.findOneAndUpdate(
            { title: req.params.title },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.deleteEventById = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.deleteEventByTitle = async (req, res) => {
    try {
        const deletedEvent = await Event.findOneAndDelete({ title: req.params.title });

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.getUpcomingEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $gte: new Date() } });
        if (!events.length) {
            return res.status(404).json({ message: 'No upcoming events' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.getPastEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $lt: new Date() } });
        if (!events.length) {
            return res.status(404).json({ message: 'No past events found' });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.joinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.slots <= 0) {
            return res.status(400).json({ message: 'No slots available for this event' });
        }

        event.slots -= 1;
        await event.save();

        res.status(200).json({ message: 'Successfully joined the event', event });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
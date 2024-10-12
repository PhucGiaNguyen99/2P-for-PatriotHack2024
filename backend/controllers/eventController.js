const Event = require('../models/Event');
const User = require('../models/User');  // Adjust the path to the actual location of your User model


// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, slots, firstName, lastName, email, gNumber } = req.body;

        // Check if the user already exists based on their gNumber or email
        let creator = await User.findOne({ gNumber });

        // If the user doesn't exist, create a new user
        if (!creator) {
            creator = new User({
                firstName,
                lastName,
                email: email.toLowerCase(),  // Ensure the email is in lowercase
                gNumber
            });

            // Save the new user to the database
            await creator.save();
        }

        // Create a new event with the user's ID as the creator
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            creator: creator._id,  // Assign the newly created or found user as the creator
            usersJoined: [],        // Initialize the usersJoined list as empty
            slots
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();

        // Add this event to the user's createdEvents list
        creator.createdEvents.push(savedEvent._id);
        await creator.save();  // Save the updated user with the event they created

        // Return the newly created event
        res.status(201).json(savedEvent);

    } catch (error) {
        console.error('Error creating event:', error);  // Log the error to inspect what went wrong
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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
        const { firstName, lastName, email, gNumber } = req.body;
        const event = await Event.findById(req.params.id);

        // Check if the event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the event has available slots
        if (event.slots <= 0) {
            return res.status(400).json({ message: 'No slots available for this event' });
        }

        // Find the user by both gNumber and email (unique combination)
        let user = await User.findOne({ gNumber, email: email.toLowerCase() });

        // If the user doesn't exist, create a new user
        if (!user) {
            user = new User({
                firstName,
                lastName,
                email: email.toLowerCase(),
                gNumber
            });

            // Save the new user to the database
            await user.save();
        }

        // Check if the user has already joined the event
        const hasUserJoined = event.usersJoined.some(joinedUser => joinedUser.equals(user._id));

        if (hasUserJoined) {
            return res.status(400).json({ message: 'User has already joined this event' });
        }

        // Add the user to the list of users who joined the event
        event.usersJoined.push(user._id);

        // Decrement available slots
        event.slots -= 1;

        // Save the updated event
        await event.save();

        // Add the event to the user's eventsJoined list
        user.eventsJoined.push(event._id);
        await user.save();  // Save the updated user

        // Respond with success
        res.status(200).json({ message: 'Successfully joined the event', event });
    } catch (error) {
        console.error('Error joining event:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.leaveEvent = async (req, res) => {
    try {
        const { email, gNumber } = req.body;
        const event = await Event.findById(req.params.id);

        // Check if the event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Find the user by gNumber and email
        const user = await User.findOne({ gNumber, email: email.toLowerCase() });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already joined the event
        const hasUserJoined = event.usersJoined.some(joinedUser => joinedUser.equals(user._id));

        if (!hasUserJoined) {
            return res.status(400).json({ message: 'User has not joined this event' });
        }

        // Remove the user from the event's usersJoined array
        event.usersJoined = event.usersJoined.filter(joinedUser => !joinedUser.equals(user._id));

        // Increment available slots
        event.slots += 1;

        // Save the updated event
        await event.save();

        // Remove the event from the user's eventsJoined list
        user.eventsJoined = user.eventsJoined.filter(joinedEvent => !joinedEvent.equals(event._id));

        // Save the updated user
        await user.save();

        // Respond with success
        res.status(200).json({ message: 'Successfully left the event', event });
    } catch (error) {
        console.error('Error leaving event:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


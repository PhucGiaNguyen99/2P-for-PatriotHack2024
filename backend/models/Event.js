const mongoose = require('mongoose');

// Define the Event schema
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usersJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    slots: {
        type: Number,
        required: true,
        min: 1 // Ensure at least 1 slot is available for an event
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

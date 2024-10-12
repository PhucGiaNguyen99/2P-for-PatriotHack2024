const mongoose = require('mongoose');
const bcrypt = require('becryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    gNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{8}$/.test(v); // Regular expression to ensure exactly 8 digits
            },
            message: props => `${props.value} is not a valid gNumber! It must be 8 digits long.`
        }
    },
    createdEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    eventsJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;


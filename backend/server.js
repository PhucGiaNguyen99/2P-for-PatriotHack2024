const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')

// Load the evironment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use the event routes
app.use('/api/events', require('./routes/eventRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
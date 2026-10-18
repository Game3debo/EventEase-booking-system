require('dotenv').config();

const express = require('express');
const cors = require('cors');

const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const errorHandler = require('./middleware/errorMiddleware');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Event Booking API is running successfully'
    });
});


// API routes
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);


// Error middleware
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
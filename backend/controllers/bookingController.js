const pool = require('../config/db');

// CREATE BOOKING
const createBooking = async (req, res, next) => {
    try {
        const {
            event_id,
            customer_name,
            customer_email,
            tickets
        } = req.body;

        // Check if event exists
        const eventResult = await pool.query(
            'SELECT * FROM events WHERE id = $1',
            [event_id]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        const event = eventResult.rows[0];

        // Check existing bookings
        const bookingResult = await pool.query(
            `SELECT COALESCE(SUM(tickets), 0) AS total_booked
             FROM bookings
             WHERE event_id = $1`,
            [event_id]
        );

        const totalBooked = Number(bookingResult.rows[0].total_booked);
        const requestedTickets = Number(tickets);

        if (totalBooked + requestedTickets > event.capacity) {
            return res.status(400).json({
                message: 'Not enough available tickets'
            });
        }

        // Create booking
        const result = await pool.query(
            `INSERT INTO bookings
            (event_id, customer_name, customer_email, tickets)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                event_id,
                customer_name,
                customer_email,
                tickets
            ]
        );

        res.status(201).json({
            message: 'Booking created successfully',
            booking: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL BOOKINGS
const getBookings = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT 
                bookings.id,
                bookings.customer_name,
                bookings.customer_email,
                bookings.tickets,
                bookings.booking_date,
                events.title AS event_title,
                events.location,
                events.event_date
             FROM bookings
             JOIN events
             ON bookings.event_id = events.id
             ORDER BY bookings.booking_date DESC`
        );

        res.status(200).json({
            message: 'Bookings retrieved successfully',
            bookings: result.rows
        });

    } catch (error) {
        next(error);
    }
};


// GET ONE BOOKING
const getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
                bookings.*,
                events.title AS event_title,
                events.location,
                events.event_date
             FROM bookings
             JOIN events
             ON bookings.event_id = events.id
             WHERE bookings.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            booking: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


// DELETE BOOKING
const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM bookings WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            message: 'Booking cancelled successfully',
            booking: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    deleteBooking
};
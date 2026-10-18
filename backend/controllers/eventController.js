const pool = require('../config/db');

// CREATE EVENT
const createEvent = async (req, res, next) => {
    try {
        const {
            title,
            description,
            location,
            event_date,
            capacity
        } = req.body;

        const result = await pool.query(
            `INSERT INTO events
            (title, description, location, event_date, capacity)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [title, description, location, event_date, capacity]
        );

        res.status(201).json({
            message: 'Event created successfully',
            event: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL EVENTS
const getEvents = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM events ORDER BY event_date ASC'
        );

        res.status(200).json({
            message: 'Events retrieved successfully',
            events: result.rows
        });

    } catch (error) {
        next(error);
    }
};


// GET ONE EVENT
const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM events WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        res.status(200).json({
            event: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE EVENT
const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            location,
            event_date,
            capacity
        } = req.body;

        const result = await pool.query(
            `UPDATE events
            SET title = $1,
                description = $2,
                location = $3,
                event_date = $4,
                capacity = $5
            WHERE id = $6
            RETURNING *`,
            [
                title,
                description,
                location,
                event_date,
                capacity,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        res.status(200).json({
            message: 'Event updated successfully',
            event: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


// DELETE EVENT
const deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM events WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        res.status(200).json({
            message: 'Event deleted successfully',
            event: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
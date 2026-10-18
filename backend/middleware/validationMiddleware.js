const validateEvent = (req, res, next) => {
    const {
        title,
        location,
        event_date,
        capacity
    } = req.body;

    if (!title || !location || !event_date || !capacity) {
        return res.status(400).json({
            message: 'Title, location, event date and capacity are required'
        });
    }

    if (Number(capacity) <= 0) {
        return res.status(400).json({
            message: 'Capacity must be greater than 0'
        });
    }

    next();
};


const validateBooking = (req, res, next) => {
    const {
        event_id,
        customer_name,
        customer_email,
        tickets
    } = req.body;

    if (
        !event_id ||
        !customer_name ||
        !customer_email ||
        !tickets
    ) {
        return res.status(400).json({
            message: 'Event ID, customer name, email and tickets are required'
        });
    }

    if (Number(tickets) <= 0) {
        return res.status(400).json({
            message: 'Tickets must be greater than 0'
        });
    }

    next();
};


module.exports = {
    validateEvent,
    validateBooking
};
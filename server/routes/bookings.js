const express = require('express');
const { check, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private (User)
router.post(
    '/',
    [
        protect,
        check('room', 'Room ID is required').not().isEmpty(),
        check('checkIn', 'Check-in date is required').not().isEmpty(),
        check('checkOut', 'Check-out date is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { room, checkIn, checkOut } = req.body;

            // Find room to get price
            const roomDetails = await Room.findById(room);
            if (!roomDetails) {
                return res.status(404).json({ success: false, error: 'Room not found' });
            }

            // Calculate total price based on dates
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const totalPrice = diffDays * roomDetails.pricePerNight || roomDetails.pricePerNight;

            // Create booking
            const booking = await Booking.create({
                user: req.user.id,
                room,
                checkIn,
                checkOut,
                totalPrice
            });

            res.status(201).json({ success: true, data: booking });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/bookings/me
// @desc    Get logged in user's bookings
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('room', 'name imageUrl type');
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name email').populate('room', 'name');
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.patch('/:id/cancel', protect, async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Make sure user owns booking or is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to cancel this booking' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ success: true, data: booking });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

const express = require('express');
const { check, validationResult } = require('express-validator');
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/rooms
// @desc    Get all rooms (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.type) query.type = req.query.type;
        if (req.query.minPrice) query.pricePerNight = { $gte: req.query.minPrice };
        if (req.query.maxPrice) {
            query.pricePerNight = query.pricePerNight || {};
            query.pricePerNight.$lte = req.query.maxPrice;
        }

        const rooms = await Room.find(query);
        res.json({ success: true, count: rooms.length, data: rooms });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/rooms/:id
// @desc    Get single room
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ success: false, error: 'Room not found' });
        }
        res.json({ success: true, data: room });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ success: false, error: 'Room not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/rooms
// @desc    Create a room
// @access  Private/Admin
router.post(
    '/',
    [
        protect,
        authorize('admin'),
        check('name', 'Name is required').not().isEmpty(),
        check('type', 'Type is required').not().isEmpty(),
        check('capacity', 'Capacity is required').isNumeric(),
        check('pricePerNight', 'Price is required').isNumeric(),
        check('description', 'Description is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const room = await Room.create(req.body);
            res.status(201).json({ success: true, data: room });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/rooms/:id
// @desc    Update room
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        let room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, error: 'Room not found' });
        }

        room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: room });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/rooms/:id
// @desc    Delete room
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, error: 'Room not found' });
        }

        await room.deleteOne();

        res.json({ success: true, data: {} });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

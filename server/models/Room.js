const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a room name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    type: {
        type: String,
        required: [true, 'Please add a room type'],
        enum: ['single', 'double', 'suite']
    },
    capacity: {
        type: Number,
        required: [true, 'Please add room capacity']
    },
    pricePerNight: {
        type: Number,
        required: [true, 'Please add price per night']
    },
    amenities: {
        type: [String],
        default: []
    },
    imageUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', roomSchema);

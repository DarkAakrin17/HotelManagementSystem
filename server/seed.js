const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const User = require('./models/User');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const rooms = [
    {
        name: 'Ocean View Suite',
        type: 'suite',
        capacity: 4,
        pricePerNight: 350,
        amenities: ['Ocean View', 'Balcony', 'King Bed', 'Minibar', 'Free WiFi'],
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        description: 'Luxurious suite with stunning ocean views and premium sound system.',
        isAvailable: true
    },
    {
        name: 'Executive Double',
        type: 'double',
        capacity: 2,
        pricePerNight: 200,
        amenities: ['City View', 'Queen Bed', 'Workspace', 'Free WiFi'],
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
        description: 'Perfect for business travelers needing space and comfort.',
        isAvailable: true
    },
    {
        name: 'Cozy Single',
        type: 'single',
        capacity: 1,
        pricePerNight: 100,
        amenities: ['Garden View', 'Single Bed', 'Free WiFi'],
        imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        description: 'A cozy retreat for the solo traveler looking for a peaceful stay.',
        isAvailable: true
    }
];

const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
};

const importData = async () => {
    try {
        await Room.deleteMany();
        await User.deleteMany();

        await Room.insertMany(rooms);

        // Create admin user manually to trigger pre-save hook
        await User.create(adminUser);

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(`Error: ${err}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Room.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (err) {
        console.error(`Error: ${err}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}

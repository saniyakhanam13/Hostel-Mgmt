const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server');

const seedAdmin = async () => {
    try {
        const Admin = require('./models/admins');
        const bcrypt = require('bcrypt');
        const count = await Admin.countDocuments();
        if (count === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await Admin.create({
                name: 'System Admin',
                email: 'admin@hostel.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin account created successfully: admin@hostel.com / admin123');
        } else {
            console.log('Admin account already exists in database');
        }
    } catch (err) {
        console.error('Failed to seed admin user:', err.message);
    }
};

const seedEvents = async () => {
    try {
        const Event = require('./models/event');
        const count = await Event.countDocuments();
        if (count === 0) {
            const mockEvents = [
                {
                    name: 'Annual Sports Meet 2026',
                    date: new Date('2026-10-15T09:00:00'),
                    venue: 'College Main Ground',
                    description: 'The annual college athletics and sports championship, featuring track events, football, basketball, and more.',
                    status: 'Upcoming',
                    participationCount: 0,
                    liveUpdates: 'Registrations are open! Register now to secure your spot.',
                    winners: '',
                    achievements: '',
                    galleryPhotos: [],
                    participants: []
                },
                {
                    name: 'Inter-College Coding Hackathon',
                    date: new Date(), 
                    venue: 'CS Seminar Hall',
                    description: 'A 24-hour hackathon where students build innovative software solutions addressing real-world campus problems.',
                    status: 'Ongoing',
                    participationCount: 0,
                    liveUpdates: 'Hacking has officially started! Teams are working hard on their prototypes. Mentor reviews starting at 2 PM.',
                    winners: '',
                    achievements: '',
                    galleryPhotos: [],
                    participants: []
                },
                {
                    name: 'Republic Day Cultural Fest',
                    date: new Date('2026-01-26T10:00:00'),
                    venue: 'Open Air Theater',
                    description: 'A grand celebration of Republic Day featuring patriotic songs, traditional dances, and drama performances.',
                    status: 'Completed',
                    participationCount: 25,
                    liveUpdates: 'The event concluded successfully with the national anthem.',
                    winners: '1st Place: Drama Club, 2nd Place: Music Ensemble',
                    achievements: 'High engagement with over 300+ student attendees.',
                    galleryPhotos: [],
                    participants: []
                }
            ];
            await Event.insertMany(mockEvents);
            console.log('Mock events seeded successfully!');
        }
    } catch (err) {
        console.error('Failed to seed events:', err.message);
    }
};

const connectToMongo = async () => {
    // Try process.env.MONGO_URI first
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
        try {
            await mongoose.connect(mongoUri);
            console.log('Connected to MongoDB successfully via MONGO_URI');
            await seedAdmin();
            await seedEvents();
            return;
        } catch (err) {
            console.error('Failed to connect to MONGO_URI from env:', err.message);
            console.log('Attempting local connection fallback...');
        }
    }

    // Try local MongoDB default URL
    const localUri = 'mongodb://127.0.0.1:27017/hostel';
    try {
        await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to local MongoDB successfully at', localUri);
        await seedAdmin();
        await seedEvents();
        return;
    } catch (err) {
        console.log('Local MongoDB is not running or failed to connect:', err.message);
        console.log('Falling back to in-memory database server...');
    }

    // Fallback to in-memory server
    try {
        const mongoServer = await MongoMemoryServer.create({
            binary: {
                version: '4.4.24'
            }
        });
        const mongouri = mongoServer.getUri();
        await mongoose.connect(mongouri);
        console.log('Connected to MongoDB successfully (in-memory) at', mongouri);
        console.log('WARNING: Because the server is using an in-memory database, any accounts created will be deleted when the backend is stopped.');
        console.log('To persist your accounts, please install MongoDB locally or configure MONGO_URI in your .env file.');
        await seedAdmin();
        await seedEvents();
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}
module.exports = connectToMongo;
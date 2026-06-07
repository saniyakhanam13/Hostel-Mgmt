const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectToMongo = async () => {
    // Try process.env.MONGO_URI first
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
        try {
            await mongoose.connect(mongoUri);
            console.log('Connected to MongoDB successfully via MONGO_URI');
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
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}
module.exports = connectToMongo;
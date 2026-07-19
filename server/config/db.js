const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    let mongoUri = process.env.MONGO_URI;

    // Check if we should use in-memory server
    // Conditions: No URI provided, or URI is local/default
    const useMemoryServer = !mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');

    if (useMemoryServer) {
        console.log('Starting MongoDB Memory Server (No local MongoDB detected)...');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log(`MongoDB Memory Server started at ${mongoUri}`);
        process.env.MONGO_URI = mongoUri;
    }

    // Try connecting; if Atlas fails, fall back to in-memory server
    try {
        const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Atlas connection failed (${error.message}). Falling back to MongoDB Memory Server...`);
        const mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        console.log(`MongoDB Memory Server started at ${fallbackUri}`);
        process.env.MONGO_URI = fallbackUri;
        const conn = await mongoose.connect(fallbackUri);
        console.log(`MongoDB Connected (in-memory): ${conn.connection.host}`);
    }
};

module.exports = connectDB;

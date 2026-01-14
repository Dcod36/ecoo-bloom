const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        // Check if we should use in-memory server
        // Conditions: No URI provided, or URI is local/default and user has no mongo installed
        const useMemoryServer = !mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');

        if (useMemoryServer) {
            console.log('Starting MongoDB Memory Server (No local MongoDB detected)...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log(`MongoDB Memory Server started at ${mongoUri}`);

            // Update env variable for other parts of app if needed
            process.env.MONGO_URI = mongoUri;
        }

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let isConnected: boolean = false;
let mongoServer: MongoMemoryServer;

export async function connectToDatabase() {
    if (isConnected) {
        console.log('Already connected to MongoDB');
        return;
    }

    try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri);
        isConnected = true;
        console.log('Connected to in-memory MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

export async function disconnectDatabase() {
    if (!isConnected) {
        console.log('No active MongoDB connection');
        return;
    }

    try {
        await mongoose.disconnect();
        await mongoServer.stop();
        isConnected = false;
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error disconnecting MongoDB:', error);
    }
}

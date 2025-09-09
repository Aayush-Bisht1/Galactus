import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
    throw new Error('incorrect conn uri');
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('connected');
    } catch (error) {
        console.log(error);
    }
}
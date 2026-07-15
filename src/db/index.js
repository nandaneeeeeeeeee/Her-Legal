import mongoose from 'mongoose';


const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/herlegal';
        const connectionInstance = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
        });
        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);



    } catch (error) {
        console.error('MONGODB CONNECTION ERROR:', error);
        process.exit(1);
    }
};

export default connectDB;
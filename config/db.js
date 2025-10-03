// backend/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const uri = process.env.MONGODB_URI || 'mongodb+srv://bhagyashreea912_db_user:4ovPoZkWqPtqCizd@cluster0.h3pt8vf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    }
};

export default connectDB;



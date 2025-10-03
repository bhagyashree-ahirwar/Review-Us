import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // confirmPassword: { type: String, required: true },
    sendOtp: { type: String, expOtp:Date},
    verifyOtp: { type: String, expOtp:Date},
    }, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;

import express from 'express';
import cors from 'cors';
import signupAuth from './auth/authContoller.js';
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";
import upload from './upload/upload.js'
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());


// Database connection
connectDB();

// CORS setup
app.use(cors({
  origin: ['http://localhost:3000'],  // ✅ fixed typo
  methods: ['GET', 'PUT', 'POST', 'PATCH'],
  credentials: true , // ✅ important for cookies
}));

// Routes
app.use('/api', signupAuth);
app.use('/api', upload);
app.use('/api',authMiddleware,upload)


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

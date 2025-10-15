import express from 'express';
import cors from 'cors';
import signupAuth from './auth/authContoller.js';
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";
import upload from './upload/upload.js'
import feedbackRoutes from './feedbackRoutes/feedback.js';
import feedbackAnalytics from './feedbackAnalytics/feedbackAnaly.js'; 
import branch  from './auth/branchContoller.js'
import GoogleUrl from './googlereviewUrl/googleReviewUrl.js'

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
app.use('/api', GoogleUrl)
// app.use('/api',authMiddleware,upload)
app.use('/api', feedbackRoutes );
app.use('/api/', feedbackAnalytics);
app.use("/api", branch);



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});



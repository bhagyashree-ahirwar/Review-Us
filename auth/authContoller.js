import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Signup from "../models/UserScema.js";
import { sendMail } from "../mailes/transporter.js";

const router = express.Router();

// --- Utility: Generate OTP ---
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- Signup ---
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existUser = await Signup.findOne({ email });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Signup({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- Login ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "100y" }); // token valid for 100 years
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // local par false bhi kar sakti ho
      sameSite: "none",
      maxAge: 100 * 365 * 24 * 60 * 60 * 1000, // 100 years
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});







// // --- Login ---
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await Signup.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     // ✅ Token create karo
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "100y" }
//     );

//     // ✅ Cookie me token bhejo (local ke liye secure: false)
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, // localhost ke liye false rakhna zaroori hai!
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     // ✅ Response me token bhejna important hai (Postman ke liye)
//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//       },
//       token, // <--- yahi missing tha!
//     });
//   } catch (error) {
//     console.log("Error during login:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });












// --- Check Authentication ---
router.get("/checkAuth", async (req, res) => {
  try {
    const token = req.cookies.token; // cookie se token uthao
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    // Optional: fetch user details
    const user = await Signup.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    res.status(200).json({ message: "Authenticated", user });
  } catch (err) {
    console.error("Auth check error:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
});

// --- Forgot Password (Send OTP) ---
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Signup.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOtp();
 console.log("Generated OTP:", otp);
  console.log("Sending OTP to:", email);
    // Generate short-lived OTP token
    const otpToken = jwt.sign({ id: user._id, otp }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // Send OTP on email
    await sendMail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    // Save token in cookie
    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Reset Password using OTP ---
router.post("/reset-password", async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const otpToken = req.cookies.otpToken;
    if (!otpToken) return res.status(400).json({ message: "OTP expired or not found" });

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await Signup.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear OTP token
    res.clearCookie("otpToken");

    res.json({ message: "Password reset successful. Now you can login with your new password." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

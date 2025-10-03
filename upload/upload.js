import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { QrImage } from "../models/QrImage.js";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- AWS S3 Setup ---
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// --- Upload QR (Protected) ---
router.post("/upload-qr", authMiddleware, upload.single("qr"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype, // MIME type correct set karna
    };

    // Upload to S3
    await s3.send(new PutObjectCommand(params));

    // S3 URL
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Save in DB with user info
    const qrDoc = new QrImage({
      imageUrl,
      user: req.user._id, // "uploadedBy" se same field ho jo findOne me search kar rahi ho
      createdAt: new Date(),
    });

    await qrDoc.save();

    res.status(200).json({ success: true, message: "QR uploaded successfully", url: imageUrl });
  } catch (error) {
    console.error("Upload QR Error:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
});

// --- Get QR of logged-in user ---
router.get("/qr", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const qr = await QrImage.findOne({ user: userId }).sort({ createdAt: -1 }); 
    // latest QR fetch karne ke liye sort use kiya
    if (!qr) {
      return res.status(404).json({ message: "No QR found for this user" });
    }
    res.status(200).json({ message: "Successfully fetched", qr });
  } catch (error) {
    console.error("Fetch QR Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- Get QR by ID ---
router.get("/qr/:id", authMiddleware, async (req, res) => {
  try {
    const qrId = req.params.id; 
    const qr = await QrImage.findById(qrId);

    if (!qr) {
      return res.status(404).json({ message: "QR not found" });
    }

    res.status(200).json({ message: "Successfully fetched", qr });
  } catch (error) {
    console.error("Fetch QR by ID Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

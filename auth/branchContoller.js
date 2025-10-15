
import express from "express";
import QRCode from "qrcode";
import Branch from "../models/branchSchema.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create branch (protected)
router.post("/new", async (req, res) => {
  try {
    const branch = new Branch(req.body);

    // Generate QR code for frontend review link
    branch.qrCode = await QRCode.toDataURL(
      `${process.env.FRONTEND_BASE_URL}/review/${branch._id}`
    );

    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all branches (protected)
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single branch (protected)
router.get("/detail/:branchId", authMiddleware, async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.branchId);
    if (!branch) return res.status(404).json({ error: "Branch not found" });
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update branch (protected)
router.put("/update/:branchId", authMiddleware, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.branchId, req.body, { new: true });
    if (!branch) return res.status(404).json({ error: "Branch not found" });
    res.json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete branch (protected)
router.delete("/delete/:branchId", authMiddleware, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.branchId);
    if (!branch) return res.status(404).json({ error: "Branch not found" });
    res.json({ message: "Branch deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Add feedback (public)
router.post("/feedback/:branchId", async (req, res) => {
  try {
    const { rating } = req.body;
    const branch = await Branch.findById(req.params.branchId);
    if (!branch) return res.status(404).json({ error: "Branch not found" });

    branch.totalReviews += 1;
    branch.averageRating = (branch.averageRating * (branch.totalReviews - 1) + rating) / branch.totalReviews;
    await branch.save();

    res.json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;


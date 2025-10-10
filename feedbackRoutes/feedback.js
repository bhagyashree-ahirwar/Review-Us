
// // // import express from "express";
// // // import User from "../models/UserScema.js"; // Correct import
// // // import Feedback from "../models/feedbackschema.js";
// // // import QrCode from "../models/qrCodeSchema.js";
// // // import { authMiddleware } from "../middleware/authMiddleware.js";


// // // const router = express.Router();

// // // // feedbackRoutes.js
// // // router.post("/feedback/:code", async (req, res) => {
// // //   try {
// // //     const { code } = req.params; // URL se code nikal rahe
// // //     const { name, email, rating, comments } = req.body;

// // //     if (!name || !email || !rating || !comments) {
// // //       return res.status(400).json({ success: false, message: "All fields are required" });
// // //     }

// // //     // Rating check
// // //     if (rating < 1 || rating > 5) {
// // //       return res.status(400).json({ success: false, message: "Rating must be 1-5" });
// // //     }

// // //     // Find QR code in DB
// // //     const qr = await QrCode.findOne({ code });
// // //     if (!qr) return res.status(404).json({ success: false, message: "Invalid QR code" });

// // //     // Create feedback
// // //     const feedback = new Feedback({ name, email, rating, comments });
// // //     await feedback.save();

// // //     // Link feedback to QR code
// // //     qr.feedbackId = feedback._id;
// // //     await qr.save();

// // //     res.status(201).json({ success: true, message: "Feedback submitted successfully!", feedback, qr });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ success: false, message: "Server error", error: err.message });
// // //   }
// // // });


// // // // =========================
// // // // GET - All Feedbacks
// // // // =========================
// // // router.get("/feedback", async (req, res) => {
// // //   try {
// // //     const feedbacks = await Feedback.find().sort({ createdAt: -1 });
// // //     res.status(200).json({ success: true, feedbacks });
// // //   } catch (error) {
// // //     res.status(500).json({ success: false, message: "Error fetching feedbacks", error: error.message });
// // //   }
// // // });

// // // // =========================
// // // // GET - Single Feedback by ID
// // // // =========================
// // // router.get("/feedback/:id", async (req, res) => {
// // //   try {
// // //     const feedback = await Feedback.findById(req.params.id);
// // //     if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });
// // //     res.status(200).json({ success: true, feedback });
// // //   } catch (error) {
// // //     res.status(500).json({ success: false, message: "Error fetching feedback", error: error.message });
// // //   }
// // // });

// // // // =========================
// // // // POST - Store QR Code
// // // // =========================
// // // router.post("/store-qr",  authMiddleware, async (req, res) => {
// // //   try {
// // //     const { code, userId } = req.body;

// // //     // Validate userId as ObjectId
// // //     if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
// // //       return res.status(400).json({ success: false, message: "Invalid userId" });
// // //     }

// // //     // Check if user exists
// // //     const user = await User.findById(userId);
// // //     if (!user) return res.status(404).json({ success: false, message: "User not found" });

// // //     // Check duplicate code
// // //     const existing = await QrCode.findOne({ code });
// // //     if (existing) return res.status(400).json({ success: false, message: "Code already exists" });

// // //     // Store QR
// // //     const newQr = new QrCode({ code, userId });
// // //     await newQr.save();

// // //     res.status(201).json({ success: true, message: "QR stored successfully", data: newQr });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ success: false, message: "Server error", error: err.message });
// // //   }
// // // });

// // // // =========================
// // // // POST - Verify QR Code
// // // // =========================
// // // router.post("/verify-qr", async (req, res) => {
// // //   try {
// // //     const { code } = req.body;
// // //     if (!code) return res.status(400).json({ success: false, message: "Code is required" });

// // //     const qr = await QrCode.findOne({ code });
// // //     if (!qr) return res.status(404).json({ success: false, message: "Invalid QR code" });

// // //     res.status(200).json({ success: true, message: "QR code verified", data: qr });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ success: false, message: "Server error", error: err.message });
// // //   }
// // // });

// // // export default router;



// // import express from "express";
// // import User from "../models/UserScema.js";
// // import Feedback from "../models/feedbackschema.js";
// // import QrCode from "../models/qrCodeSchema.js";
// // import { authMiddleware } from "../middleware/authMiddleware.js";

// // const router = express.Router();

// // // =========================
// // // POST - Submit Feedback via QR
// // // =========================
// // router.post("/feedback/:code", async (req, res) => {
// //   try {
// //     const { code } = req.params;
// //     const { name, email, rating, comments } = req.body;

// //     if (!name || !email || !rating || !comments) {
// //       return res.status(400).json({ success: false, message: "All fields are required" });
// //     }

// //     if (rating < 1 || rating > 5) {
// //       return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
// //     }

// //     const qr = await QrCode.findOne({ code });
// //     if (!qr) return res.status(404).json({ success: false, message: "Invalid QR code" });

// //     const feedback = new Feedback({
// //       name,
// //       email,
// //       rating,
// //       comments,
// //       qrId: qr._id,
// //     });

// //     await feedback.save();

// //     res.status(201).json({
// //       success: true,
// //       message: "Feedback submitted successfully!",
// //       feedback,
// //     });
// //   } catch (err) {
// //     console.error("Feedback error:", err);
// //     res.status(500).json({ success: false, message: "Server error", error: err.message });
// //   }
// // });

// // // =========================
// // // GET - All Feedbacks
// // // =========================
// // router.get("/feedback", async (req, res) => {
// //   try {
// //     const feedbacks = await Feedback.find().populate("qrId", "code").sort({ createdAt: -1 });
// //     res.status(200).json({ success: true, feedbacks });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: "Error fetching feedbacks", error: error.message });
// //   }
// // });

// // // =========================
// // // GET - Single Feedback by ID
// // // =========================
// // router.get("/feedback/:id", async (req, res) => {
// //   try {
// //     const feedback = await Feedback.findById(req.params.id).populate("qrId", "code");
// //     if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });
// //     res.status(200).json({ success: true, feedback });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: "Error fetching feedback", error: error.message });
// //   }
// // });




// // // =========================
// // // POST - Store QR Code
// // // =========================
// // router.post("/store-qr", authMiddleware, async (req, res) => {
// //   try {
// //     const { code, userId } = req.body;

// //     if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
// //       return res.status(400).json({ success: false, message: "Invalid userId" });
// //     }

// //     const user = await User.findById(userId);
// //     if (!user) return res.status(404).json({ success: false, message: "User not found" });

// //     const existing = await QrCode.findOne({ code });
// //     if (existing) return res.status(400).json({ success: false, message: "Code already exists" });

// //     const newQr = new QrCode({ code, userId });
// //     await newQr.save();

// //     res.status(201).json({ success: true, message: "QR stored successfully", data: newQr });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ success: false, message: "Server error", error: err.message });
// //   }
// // });

// // // =========================
// // // POST - Verify QR Code
// // // =========================
// // router.post("/verify-qr", async (req, res) => {
// //   try {
// //     const { code } = req.body;
// //     if (!code) return res.status(400).json({ success: false, message: "Code is required" });

// //     const qr = await QrCode.findOne({ code });
// //     if (!qr) return res.status(404).json({ success: false, message: "Invalid QR code" });

// //     res.status(200).json({ success: true, message: "QR code verified", data: qr });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ success: false, message: "Server error", error: err.message });
// //   }
// // });

// // export default router;



// // feedbackRoutes/feedback.js

// import express from "express";
// import User from "../models/UserScema.js";
// import Feedback from "../models/feedbackschema.js";
// import QrCode from "../models/qrCodeSchema.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // =========================
// // POST - Submit Feedback via QR
// // =========================
// router.post("/feedback/:code", async (req, res) => {
//   try {
//     const { code } = req.params;
//     const { name, email, rating, comments } = req.body;

//     if (!name || !email || !rating || !comments) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
//     }

//     const qr = await QrCode.findOne({ code });
//     if (!qr) return res.status(404).json({ success: false, message: "Invalid QR code" });

//     const feedback = new Feedback({
//       name,
//       email,
//       rating,
//       comments,
//       qrId: qr._id,
//     });

//     await feedback.save();

//     res.status(201).json({
//       success: true,
//       message: "Feedback submitted successfully!",
//       feedback,
//     });
//   } catch (err) {
//     console.error("Feedback error:", err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// });

// // =========================
// // GET - All Feedbacks
// // =========================
// router.get("/feedback", async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find()
//       .populate("qrId", "code")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, feedbacks });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching feedbacks", error: error.message });
//   }
// });

// // =========================
// // GET - Single Feedback by ID
// // =========================
// router.get("/feedback/:id", async (req, res) => {
//   try {
//     const feedback = await Feedback.findById(req.params.id).populate("qrId", "code");
//     if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });
//     res.status(200).json({ success: true, feedback });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching feedback", error: error.message });
//   }
// });


// // feedbackRoutes.js
// router.put("/feedback/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedFeedback = await Feedback.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true } // ye naya updated document return karega
//     );
//     if (!updatedFeedback) {
//       return res.status(404).json({ success: false, message: "Feedback not found" });
//     }
//     res.json({ success: true, message: "Feedback updated successfully!", feedback: updatedFeedback });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });








// // =========================
// // DELETE - Delete Feedback by ID
// // =========================
// router.delete("/feedback/:id", async (req, res) => {
//   try {
//     const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

//     if (!deletedFeedback) return res.status(404).json({ success: false, message: "Feedback not found" });

//     res.status(200).json({ success: true, message: "Feedback deleted successfully!" });
//   } catch (err) {
//     console.error("Delete Feedback Error:", err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// });

// // =========================
// // POST - Store QR Code
// // =========================
// router.post("/store-qr", authMiddleware, async (req, res) => {
//   try {
//     const { code, userId } = req.body;

//     if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
//       return res.status(400).json({ success: false, message: "Invalid userId" });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const existing = await QrCode.findOne({ code });
//     if (existing) return res.status(400).json({ success: false, message: "Code already exists" });

//     const newQr = new QrCode({ code, userId });
//     await newQr.save();

//     res.status(201).json({ success: true, message: "QR stored successfully", data: newQr });
//   } catch (err) {
//     console.error("Store QR Error:", err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// });

// // =========================
// // POST - Verify QR Code
// // =========================
// router.post("/verify-qr", async (req, res) => {
//   try {
//     const { code } = req.body;
//     if (!code) return res.status(400).json({ success: false, message: "Code is required" });

//     const qr = await QrCode.findOne({ code });
//     if (!qr) return res.status(404).json({ success: false, message: "Invalid QR code" });

//     res.status(200).json({ success: true, message: "QR code verified", data: qr });
//   } catch (err) {
//     console.error("Verify QR Error:", err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// });

// export default router;




import express from "express";
import mongoose from "mongoose";
import User from "../models/UserScema.js";
import Feedback from "../models/feedbackschema.js";
import QrCode from "../models/qrCodeSchema.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// POST - Submit Feedback via QR
// =========================
router.post("/feedback/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const { name, email, rating, comments } = req.body;

    if (!name || !email || !rating || !comments) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const qr = await QrCode.findOne({ code });
    if (!qr) return res.status(404).json({ success: false, message: "Invalid QR code" });

    const feedback = new Feedback({
      name,
      email,
      rating,
      comments,
      qrId: qr._id,
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      feedback,
    });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// =========================
// GET - All Feedbacks
// =========================
router.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("qrId", "code")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedbacks", error: error.message });
  }
});

// =========================
// GET - Single Feedback by ID
// =========================
router.get("/feedback/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate("qrId", "code");
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });
    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedback", error: error.message });
  }
});

// =========================
// PUT - Update Feedback by ID
// =========================
router.put("/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // ye naya updated document return karega
    );
    if (!updatedFeedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, message: "Feedback updated successfully!", feedback: updatedFeedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================
// DELETE - Delete Feedback by ID
// =========================
router.delete("/feedback/:id", async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!deletedFeedback) return res.status(404).json({ success: false, message: "Feedback not found" });

    res.status(200).json({ success: true, message: "Feedback deleted successfully!" });
  } catch (err) {
    console.error("Delete Feedback Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// =========================
// POST - Store QR Code
// =========================
router.post("/store-qr", authMiddleware, async (req, res) => {
  try {
    const { code, userId } = req.body;

    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const existing = await QrCode.findOne({ code });
    if (existing) return res.status(400).json({ success: false, message: "Code already exists" });

    const newQr = new QrCode({ code, userId });
    await newQr.save();

    res.status(201).json({ success: true, message: "QR stored successfully", data: newQr });
  } catch (err) {
    console.error("Store QR Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// =========================
// POST - Verify QR Code
// =========================
router.post("/verify-qr", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Code is required" });

    const qr = await QrCode.findOne({ code });
    if (!qr) return res.status(404).json({ success: false, message: "Invalid QR code" });

    res.status(200).json({ success: true, message: "QR code verified", data: qr });
  } catch (err) {
    console.error("Verify QR Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});



export default router;


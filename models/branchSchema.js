

import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
   

    // QR code (auto-generated on branch creation)
    qrCode: { type: String }, // Base64 QR
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Feedback stats
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    
    // Social links for reviews
    googleReviewUrl: { type: String, trim: true },
    facebookPageUrl: { type: String, trim: true },

    // Staff assignment
    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Business info
    businessHours: { type: String },
    branchType: {
      type: String,
      enum: ["restaurant", "hotel", "shop", "office", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
branchSchema.index({ createdBy: 1 });
branchSchema.index({ city: 1 });
branchSchema.index({ isActive: 1 });

// Virtual field for frontend review URL
branchSchema.virtual("reviewUrl").get(function () {
  return `${process.env.FRONTEND_BASE_URL}/review/${this._id}`;
});

// Enable virtuals in JSON
branchSchema.set("toJSON", { virtuals: true });
branchSchema.set("toObject", { virtuals: true });

export default mongoose.model("Branch", branchSchema);

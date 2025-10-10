
import mongoose from "mongoose";

const feedbacksSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    rating: { type: Number, required: true },
    comments: { type: String, required: true },
    code: { type: String, unique: true }, // Unique feedback code like "unique123"
  },
  { timestamps: true }
);

export default mongoose.model("Feedbacks", feedbacksSchema);

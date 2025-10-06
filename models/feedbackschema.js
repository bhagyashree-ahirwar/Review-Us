import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true },
    comments: { type: String, required: true },

  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);

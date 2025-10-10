// import mongoose from "mongoose";

// const feedbackSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     rating: { type: Number, required: true },
//     comments: { type: String, required: true },

//   },
//   { timestamps: true }
// );

// export default mongoose.model("Feedback", feedbackSchema);

import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    rating: { type: Number, required: true },
    comments: { type: String, required: true },
    code: { type: String, unique: true }, // Unique feedback code like "unique123"
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);

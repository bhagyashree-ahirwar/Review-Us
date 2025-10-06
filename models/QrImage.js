import mongoose from "mongoose";

const qrImageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // linked user
    imageUrl: { type: String, required: true },  // QR image URL
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model("QrImage", qrImageSchema);

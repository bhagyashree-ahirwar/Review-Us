
import mongoose, { Schema } from "mongoose"; 


const qrCodeImage = new mongoose .Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl :{ type: String , require:true},
    createdAt :{type:Date, default:Date.now},   
});

export const QrImage = mongoose.model('QrImage', qrCodeImage)
import mongoose from "mongoose";

const FaceSchema = new mongoose.Schema({
    name: { type: String },
    imageUrl: { type: String },
    recognized: { type: Boolean },
    comprefaceResponse: { type: Object }
}, { timestamps: true });

export default mongoose.model("Face", FaceSchema);
 
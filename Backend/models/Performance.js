import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  department: { type: String, required: true },
  year: { type: Number, required: true },
  avgRating: { type: Number, required: true }, // 1-5 scale
}, { timestamps: true });

export default mongoose.model("Performance", performanceSchema);

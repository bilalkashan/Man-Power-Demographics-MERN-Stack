import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  department: { type: String, required: true },
  year: { type: Number, required: true },
  avgRating: { type: Number, required: true }, 
}, { timestamps: true });

export default mongoose.model("Performance", performanceSchema);

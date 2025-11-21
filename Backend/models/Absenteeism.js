import mongoose from "mongoose";

const absenteeismSchema = new mongoose.Schema({
  month: { type: String, required: true },   // Jan, Feb, ...
  year: { type: Number, required: true },
  absenteeismPercent: { type: Number, required: true }, // %
}, { timestamps: true });

export default mongoose.model("Absenteeism", absenteeismSchema);

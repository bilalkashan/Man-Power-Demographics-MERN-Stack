import mongoose from "mongoose";

const headcountSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  hires: { type: Number, default: 0 },
  leavers: { type: Number, default: 0 },
  netHeadcount: { type: Number, default: 0 },  // hires - leavers (or actual snapshot)
}, { timestamps: true });

export default mongoose.model("Headcount", headcountSchema);

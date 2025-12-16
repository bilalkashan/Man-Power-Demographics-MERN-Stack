import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String },
    category: {
      type: String,
      enum: ["Company News", "Events", "Policy Update"],
      default: "Company News",
    },
    content: { type: String },
    image: { type: String }, 
    author: { type: String },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);

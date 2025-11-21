import Engagement from "../models/Engagement.js";

export const empEngagementData = async (req, res) => {
  try {
    const data = await Engagement.find().sort({ Month: 1 });
    res.json(data);
  } catch (err) {
    console.error("Fetch engagement error:", err);
    res.status(500).json({ message: "Error fetching engagement data" });
  }
};

// In engagementController.js
export const getMonthlyEngagement = async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const data = await Engagement.find({ year }).sort({ month: 1 });
  res.json(data);
};


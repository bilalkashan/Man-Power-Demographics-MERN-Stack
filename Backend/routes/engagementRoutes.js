// engagementRoutes.js
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Engagement from "../models/Engagement.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { empEngagementData, getMonthlyEngagement } from "../controllers/EngagementContoller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    await Engagement.deleteMany({});
    await Engagement.insertMany(data);

    fs.unlinkSync(req.file.path); // cleanup temp file

    res.json({ success: true, message: "✅ Engagement data uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Error uploading engagement data" });
  }
});

router.get("/empEngagementData", verifyToken, empEngagementData);
router.get("/monthly", verifyToken, getMonthlyEngagement);

export default router;

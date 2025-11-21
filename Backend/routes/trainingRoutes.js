// routes/training.js
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import { verifyToken } from "../middleware/verifyToken.js";
import TrainingRecord from "../models/TrainigRecord.js";
import { getRecords, getSummary } from "../controllers/TrainingController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Flexible mapping of columns
    const docs = rows.map((r) => ({
      department: (r.department ?? r.Department ?? "General").toString().trim(),
      trainingType: (r.trainingType ?? r.TrainingType ?? "Other").toString().trim(),
      month: (r.month ?? r.Month ?? "").toString().trim(),
      year: Number(r.year ?? r.Year ?? new Date().getFullYear()),
      trainingsConducted: Number(r.trainingsConducted ?? r.TrainingsConducted ?? r.Sessions ?? 0),
      trainingHours: Number(r.trainingHours ?? r.TrainingHours ?? r.Hours ?? 0),
      participationPercent: Number(r.participationPercent ?? r.Participation ?? r.ParticipationPercent ?? 0),
      participants: Number(r.participants ?? r.Participants ?? 0),
    }));

    // Replace all (keep simple like HR Ops)
    await TrainingRecord.deleteMany({});
    await TrainingRecord.insertMany(docs, { ordered: false });

    fs.unlinkSync(req.file.path);
    res.json({ message: "Training data updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

// Data APIs
router.get("/records", verifyToken, getRecords);
router.get("/summary", verifyToken, getSummary);

export default router;

// metricsRoutes.js 
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Absenteeism from "../models/Absenteeism.js";
import Performance from "../models/Performance.js";
import Headcount from "../models/Headcount.js";
import { absenteeism, performance, headcount } from "../controllers/KeyMetricsController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload Excel
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const workbook = xlsx.readFile(req.file.path);

    if (workbook.SheetNames.includes("Absenteeism")) {
      await Absenteeism.deleteMany({});
      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets["Absenteeism"]);
      await Absenteeism.insertMany(sheet);
    }

    if (workbook.SheetNames.includes("Performance")) {
      await Performance.deleteMany({});
      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets["Performance"]);
      await Performance.insertMany(sheet);
    }

    if (workbook.SheetNames.includes("Headcount")) {
      await Headcount.deleteMany({});
      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets["Headcount"]);
      await Headcount.insertMany(sheet);
    }

    fs.unlinkSync(req.file.path);
    res.json({ message: "Key metrics uploaded successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// APIs
router.get("/absenteeism", verifyToken, absenteeism);
router.get("/performance", verifyToken, performance);
router.get("/headcount", verifyToken, headcount);

export default router;

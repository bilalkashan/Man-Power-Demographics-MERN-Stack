// hiringRoutes.js

import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Hiring from "../models/Hiring.js";
import Leaver from "../models/Leaver.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { hiring, leavers, hiringSummary, getHiringKpis } from "../controllers/HiringController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload Excel file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);

    let hiringCount = 0, leaverCount = 0;

    if (workbook.SheetNames.includes("Hiring")) {
      const hiringSheet = workbook.Sheets["Hiring"];
      const hiringData = xlsx.utils.sheet_to_json(hiringSheet);

      // 🔥 Delete old Hiring data
      await Hiring.deleteMany({});

      const result = await Hiring.insertMany(hiringData, { ordered: false });
      hiringCount = result.length;
    }

    if (workbook.SheetNames.includes("Leavers")) {
      const leaverSheet = workbook.Sheets["Leavers"];
      const leaverData = xlsx.utils.sheet_to_json(leaverSheet);

      // 🔥 Delete old Leaver data
      await Leaver.deleteMany({});

      const result = await Leaver.insertMany(leaverData, { ordered: false });
      leaverCount = result.length;
    }

    fs.unlinkSync(req.file.path); // Delete uploaded file

    res.json({
      message: "Data updated successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

// API Routes
router.get("/hiring", verifyToken, hiring);
router.get("/leavers", verifyToken, leavers);
router.get("/hiringSummary", verifyToken, hiringSummary);
router.get("/kpis", verifyToken, getHiringKpis);


export default router;

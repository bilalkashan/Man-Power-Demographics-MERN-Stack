// leaverRoutes.js
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Leaver from "../models/Leaver.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getLeavers } from "../controllers/LeaverController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Delete old Leaver data before inserting new
    await Leaver.deleteMany({});

    const result = await Leaver.insertMany(jsonData, { ordered: false });

    fs.unlinkSync(req.file.path); 

    res.json({ message: "Data updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

router.get("/leavers", verifyToken, getLeavers);

export default router;

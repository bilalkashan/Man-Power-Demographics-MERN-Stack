// routes/demographics.js
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Demographics from "../models/Demographics.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { demographicsData, demographicsFilter, demographicsSummary } from "../controllers/DemographicsController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: ""
    });

    const cityCoords = {
      "Karachi": { lat: 24.8607, lon: 67.0011, province: "Sindh" },
      "Lahore": { lat: 31.5204, lon: 74.3587, province: "Punjab" },
      "Islamabad": { lat: 33.6844, lon: 73.0479, province: "ICT" },
      "Rawalpindi": { lat: 33.5651, lon: 73.0169, province: "Punjab" },
      "Multan": { lat: 30.1575, lon: 71.5249, province: "Punjab" },
      "Faisalabad": { lat: 31.418, lon: 73.0791, province: "Punjab" },
      "Peshawar": { lat: 34.0151, lon: 71.5249, province: "KPK" }
    };

    // Normalize & map rows
    const formattedData = sheetData.map(row => {
      const doc = {
        Department: row.Department || row.department || "",
        Designation: row.Designation || row.designation || "Staff",
        Year: Number(row.Year || row.year) || new Date().getFullYear(),
        Gender: row.Gender || row.gender || "",
        Age: Number(row.Age || row.age) || null,
        Tenure: Number(row.Tenure || row.tenure) || null,
        Education: row.Education || row.education || "",
        Province: row.Province || row.province || "",
        City: row.City || row.city || "",
      };

      // Auto location mapping
      const city = doc.City.trim();
      if (city && cityCoords[city]) {
        doc.lat = cityCoords[city].lat;
        doc.lon = cityCoords[city].lon;
        if (!doc.Province) doc.Province = cityCoords[city].province;
      }

      return doc;
    });

    // Remove empty rows (missing required Department/Year)
    const validData = formattedData.filter(r => r.Department && r.Year);

    // Clear old data
    await Demographics.deleteMany({});
    await Demographics.insertMany(validData);

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: `✅ Uploaded ${validData.length} records successfully`,
      inserted: validData.length
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Failed to upload demographics data" });
  }
});

router.get("/demographics-data", verifyToken, demographicsData);

router.get("/demographics-filters", verifyToken, demographicsFilter);

router.get("/demographics-summary", verifyToken, demographicsSummary);

export default router;
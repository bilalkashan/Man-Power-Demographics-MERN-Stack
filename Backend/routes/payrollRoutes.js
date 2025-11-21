// payrollRoutes.js
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Payroll from "../models/Payroll.js";
import { allPayrollData } from "../controllers/PayrollController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded!",
      });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: 0, 
    });

    const normalizeRow = (row) => {
      const obj = {};
      Object.keys(row).forEach((k) => {
        obj[k.trim().toLowerCase()] = row[k];
      });
      return obj;
    };

    const validRows = sheet
      .map(normalizeRow)
      .filter(
        (r) => r.month && r.department && r.totalpayroll
      );

    const insertData = validRows.map((row) => ({
      month: row.month,
      department: row.department,
      totalPayroll: Number(row.totalpayroll) || 0,
      basic: Number(row.basic) || 0,
      allowances: Number(row.allowances) || 0,
      overtime: Number(row.overtime) || 0,
      bonus: Number(row.bonus) || 0,
      incentives: Number(row.incentives) || 0,
      headcount: Number(row.headcount) || 1,
      revenue: Number(row.revenue) || 0,
      leavers: Number(row.leavers) || 0,
      tax: Number(row.tax) || 0,
      employerContribution: Number(row.employercontribution) || 0,
      totalCostOfEmployment: Number(row.totalcostofemployment) || 0,
    }));

    if (insertData.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid rows found. Please check headers matches the template.",
      });
    }

    await Payroll.deleteMany({});
    const result = await Payroll.insertMany(insertData);

    try {
        fs.unlinkSync(req.file.path);
    } catch (e) {
        console.error("Error deleting temp file", e);
    }

    res.json({
      success: true,
      message: `Inserted ${result.length} records successfully!`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: "Error processing file",
      error: err.message,
    });
  }
});

router.get("/allPayrollData", verifyToken, allPayrollData);

export default router;
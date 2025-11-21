// hrOpsRoutes.js
import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Issue from "../models/Issue.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getIssues, getSummary } from "../controllers/IssueController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Excel Upload → insert into MongoDB
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const docs = rows.map((r) => ({
      issueType: (r.issueType || r.IssueType || "Other").toString().trim(),
      avgResolutionTime: Number(r.avgResolutionTime ?? r.AvgResolutionTime ?? 0),
      slaCompliance: Number(r.slaCompliance ?? r.SLACompliance ?? 0),
      status: (r.status || r.Status || "Closed").toString().trim(),
      month: (r.month || r.Month || "").toString().trim(),
      year: Number(r.year ?? r.Year ?? new Date().getFullYear()),
      issuesRaised: Number(r.issuesRaised ?? r.IssuesRaised ?? 0),
      issuesResolved: Number(r.issuesResolved ?? r.IssuesResolved ?? 0),
      department: (r.department || r.Department || "HR Operations").toString().trim(),
      designation: (r.designation || r.Designation || "").toString().trim(),
    }));

    await Issue.deleteMany({});
    await Issue.insertMany(docs, { ordered: false });

    fs.unlinkSync(req.file.path);

    res.json({ message: "Data updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

router.get("/issues", verifyToken, getIssues);
router.get("/summary", verifyToken, getSummary);

export default router;

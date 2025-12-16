import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getJobs = async (req, res) => {
  try {
    const { keyword, category, type, location, status } = req.query;
    let query = {};

    // Search Logic
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }
    if (category && category !== "All Job Category") query.category = category;
    if (type && type !== "All Job Type") query.type = type;
    if (location && location !== "All Job Location") query.location = location;
    if (status) query.status = status;

    const jobs = await Job.find(query).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json({ success: true, job: savedJob });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json({ success: true, jobs, count: jobs.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Active", "Closed"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    // Find the job first
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Find all applications for this job
    const applications = await Application.find({ jobId: job._id });

    // Delete resume files associated with each application
    for (const app of applications) {
      if (app.resume) {
        try {
          // Normalize resume path and protect against external URLs
          if (!app.resume.startsWith("http")) {
            const rel = app.resume.replace(/^\/+/, "");
            const filePath = path.join(__dirname, "..", rel);
            // Attempt unlink, ignore if file doesn't exist
            await fs.promises.unlink(filePath).catch((e) => {
              if (e.code !== "ENOENT")
                console.warn("Failed to delete file:", filePath, e.message);
            });
          }
        } catch (e) {
          console.warn(
            "Error deleting resume for application",
            app._id,
            e.message
          );
        }
      }
    }

    // Remove applications from DB
    await Application.deleteMany({ jobId: job._id });

    // Finally remove the job
    await Job.findByIdAndDelete(job._id);

    res.json({
      success: true,
      message: "Job and related applications deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

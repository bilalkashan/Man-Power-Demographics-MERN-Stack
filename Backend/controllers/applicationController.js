import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title company")
      .sort({ appliedAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "jobId"
    );
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found", success: false });
    }
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// Create new application
export const createApplication = async (req, res) => {
  try {
    const {
      jobId,
      candidateName,
      candidateEmail,
      candidatePhone,
      coverLetter,
    } = req.body;

    if (!jobId || !candidateName || !candidateEmail) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // Get resume file path from multer
    const resumePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!resumePath) {
      return res
        .status(400)
        .json({ message: "Resume file is required", success: false });
    }

    const newApplication = new Application({
      jobId,
      candidateName,
      candidateEmail,
      candidatePhone,
      resume: resumePath,
      coverLetter,
    });

    const savedApplication = await newApplication.save();
    res.status(201).json({ success: true, application: savedApplication });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Applied",
      "Reviewed",
      "Shortlisted",
      "Rejected",
      "Hired",
    ];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status", success: false });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("jobId");

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found", success: false });
    }

    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found", success: false });
    }

    res.json({ success: true, message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// Get applications by job
export const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("jobId")
      .sort({ appliedAt: -1 });
    res.json({ success: true, applications, count: applications.length });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// Get total application count
export const getApplicationCount = async (req, res) => {
  try {
    const count = await Application.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

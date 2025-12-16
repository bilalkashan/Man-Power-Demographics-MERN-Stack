import Job from "../models/Job.js";

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
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

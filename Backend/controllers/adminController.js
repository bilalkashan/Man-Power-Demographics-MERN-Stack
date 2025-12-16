import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getDashboardStats = async (req, res) => {
  try {
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();

    // Get recent applications for activity feed
    const recentApplications = await Application.find()
      .populate("jobId", "title")
      .sort({ appliedAt: -1 })
      .limit(4);

    const recentActivity = recentApplications.map((app) => ({
      id: app._id,
      type: "Application",
      name: app.candidateName,
      detail: `Applied for ${app.jobId?.title || "Unknown Position"}`,
      time: getTimeAgo(app.appliedAt),
      status: app.status,
    }));

    res.json({
      success: true,
      jobs: jobCount,
      applications: applicationCount,
      contacts: 0,
      recentActivity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// Helper function to format time
const getTimeAgo = (date) => {
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

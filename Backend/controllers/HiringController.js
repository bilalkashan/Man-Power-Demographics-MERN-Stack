// HiringController.js
import Hiring from "../models/Hiring.js";
import Leaver from "../models/Leaver.js";

// Get Hiring Data (filter by department)
export const hiring = async (req, res) => {
  try {
    const { department, month, year } = req.query;

    const query = {};
    if (department && department !== "All") query.department = department;
    if (month) query.month = month;
    if (year) query.createdAt = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    };

    const data = await Hiring.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Leavers Data (filter by department, month, year)
export const leavers = async (req, res) => {
  try {
    const { department, month, year } = req.query;

    const query = {};
    if (department && department !== "All") query.department = department;
    if (month) query.month = month;
    if (year) query.createdAt = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    };

    const data = await Leaver.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const hiringSummary = async (req, res) => {
  try {
    const data = await Hiring.find();

    // 🔥 Funnel aggregation
    const funnel = [
      { name: "Applications", value: data.reduce((a, d) => a + (d.stageCounts?.applications || 0), 0) },
      { name: "Shortlisted", value: data.reduce((a, d) => a + (d.stageCounts?.shortlisted || 0), 0) },
      { name: "Interviewed", value: data.reduce((a, d) => a + (d.stageCounts?.interviewed || 0), 0) },
      { name: "Offers", value: data.reduce((a, d) => a + (d.stageCounts?.offers || 0), 0) },
      { name: "Hired", value: data.reduce((a, d) => a + (d.stageCounts?.hired || 0), 0) },
    ];

    // 🔥 Time to Hire by dept
    const timeToHire = data.map(d => ({
      department: d.department,
      timeToHire: d.timeToHire || 0,
    }));

    res.json({ funnel, timeToHire }); // 🔥 summary for AdminDashboard
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// In hiringController.js
export const getHiringKpis = async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const hires = await Hiring.countDocuments({ year });
  const leavers = await Leavers.countDocuments({ year });
  const headcount = await Payroll.aggregate([
    { $match: { year } },
    { $group: { _id: null, total: { $sum: "$headcount" } } },
  ]);

  const attrition = headcount.length
    ? ((leavers / headcount[0].total) * 100).toFixed(1)
    : 0;

  res.json({
    hires,
    leavers,
    attrition,
    headcount: headcount[0]?.total || 0,
  });
};

export const getDesignationsByDepartment = async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) return res.status(400).json({ message: "Department required" });

    const designations = await Demographics.distinct("Designation", { Department: department });
    res.json(designations || []);
  } catch (err) {
    console.error("getDesignationsByDepartment error:", err);
    res.status(500).json({ message: "Error fetching designations" });
  }
};

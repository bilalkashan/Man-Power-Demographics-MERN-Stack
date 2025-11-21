// IssueController.js
import Issue from "../models/Issue.js";

export const getIssues = async (req, res) => {
  try {
    // getIssues
    const { type, year, month, status, department, designation } = req.query;
    const query = {};
    if (type) query.issueType = type;
    if (year) query.year = Number(year);
    if (month && month !== "All") query.month = month;
    if (status) query.status = status;
    if (department && department !== "All") query.department = department;
    if (designation && designation !== "All") query.designation = designation; // ✅ NEW

    const data = await Issue.find(query).lean();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    // getSummary
    const { year, department, designation } = req.query;
    const match = {};
    if (year) match.year = Number(year);
    if (department && department !== "All") match.department = department;
    if (designation && designation !== "All") match.designation = designation; // ✅ NEW

    // Aggregate by issueType for bars & donuts
    const byType = await Issue.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$issueType",
          avgResolutionTime: { $avg: "$avgResolutionTime" },
          slaCompliance: { $avg: "$slaCompliance" },
          issuesRaised: { $sum: "$issuesRaised" },
          issuesResolved: { $sum: "$issuesResolved" },
        },
      },
      {
        $project: {
          _id: 0,
          issueType: "$_id",
          avgResolutionTime: 1,
          slaCompliance: 1,
          issuesRaised: 1,
          issuesResolved: 1,
        },
      },
      { $sort: { issueType: 1 } },
    ]);

    // Line chart over months
    const byMonth = await Issue.aggregate([
      { $match: match },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          issuesRaised: { $sum: "$issuesRaised" },
          issuesResolved: { $sum: "$issuesResolved" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          issuesRaised: 1,
          issuesResolved: 1,
        },
      },
    ]);

    // KPIs
    const kpis = await Issue.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: "$avgResolutionTime" },
          slaCompliance: { $avg: "$slaCompliance" },
          openCount: { $sum: { $cond: [{ $eq: ["$status", "Open"] }, 1, 0] } },
          closedCount: { $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] } },
        },
      },
      { $project: { _id: 0 } },
    ]);

    res.json({
      byType,
      byMonth,
      kpis:
        kpis[0] || {
          avgResolutionTime: 0,
          slaCompliance: 0,
          openCount: 0,
          closedCount: 0,
        },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

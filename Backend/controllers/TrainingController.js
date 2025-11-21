// TrainingController.js
import TrainingRecord from "../models/TrainigRecord.js";

export const getRecords = async (req, res) => {
  try {
    const { year, month, department, trainingType } = req.query;
    const query = {};
    if (year) query.year = Number(year);
    if (month) query.month = month;
    if (department && department !== "All") query.department = department;
    if (trainingType && trainingType !== "All") query.trainingType = trainingType;

    const data = await TrainingRecord.find(query).lean();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aggregated summary for charts + KPIs
export const getSummary = async (req, res) => {
  try {
    const { year, department } = req.query;
    const match = {};
    if (year) match.year = Number(year);
    if (department && department !== "All") match.department = department;

    // Trainings by department
    const byDepartment = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$department",
          trainingsConducted: { $sum: "$trainingsConducted" },
          trainingHours: { $sum: "$trainingHours" },
          avgParticipation: { $avg: "$participationPercent" },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          trainingsConducted: 1,
          trainingHours: 1,
          avgParticipation: 1,
        },
      },
      { $sort: { department: 1 } },
    ]);

    // Hours by training type
    const byType = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$trainingType",
          hours: { $sum: "$trainingHours" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          trainingType: "$_id",
          hours: 1,
          count: 1,
        },
      },
      { $sort: { trainingType: 1 } },
    ]);

    // monthly participation trend (avg % per month)
    const byMonth = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          avgParticipation: { $avg: "$participationPercent" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          avgParticipation: 1,
        },
      },
    ]);

    const kpisAgg = await TrainingRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$trainingHours" },
          totalParticipants: { $sum: "$participants" },
          avgParticipationPercent: { $avg: "$participationPercent" },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const topTypes = [...byType]
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 3)
      .map((t) => t.trainingType);

    const k = kpisAgg[0] || {
      totalHours: 0,
      totalParticipants: 0,
      avgParticipationPercent: 0,
    };

    const avgHoursPerEmployee =
      k.totalParticipants > 0 ? k.totalHours / k.totalParticipants : 0;

    res.json({
      byDepartment,
      byType,
      byMonth,
      kpis: {
        avgTrainingHoursPerEmployee: avgHoursPerEmployee,
        trainingParticipationPercent: k.avgParticipationPercent,
        mostCommonTrainingTypes: topTypes,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

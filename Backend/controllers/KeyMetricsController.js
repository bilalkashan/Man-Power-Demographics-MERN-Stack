import Absenteeism from "../models/Absenteeism.js";
import Performance from "../models/Performance.js";
import Headcount from "../models/Headcount.js";

export const absenteeism = async (req, res) => {
  try {
    const { year, department, months } = req.query;
    let query = {};
    if (year) query.year = year;
    if (department && department !== "All") query.department = department;
    if (months) {
      // last X months filter
      const monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const now = new Date();
      const lastMonths = Array.from({length: months}, (_,i)=>{
        const d = new Date(now.getFullYear(), now.getMonth() - (months-1-i), 1);
        return monthList[d.getMonth()];
      });
      query.month = { $in: lastMonths };
    }
    const data = await Absenteeism.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Performance Ratings
export const performance = async (req, res) => {
  try {
    const { year, department } = req.query;
    let query = {};
    if (year) query.year = year;
    if (department && department !== "All") query.department = department;
    const data = await Performance.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Headcount
export const headcount = async (req, res) => {
  try {
    const { year, department, months } = req.query;
    let query = {};
    if (year) query.year = year;
    if (department && department !== "All") query.department = department;
    if (months) {
      const monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const now = new Date();
      const lastMonths = Array.from({length: months}, (_,i)=>{
        const d = new Date(now.getFullYear(), now.getMonth() - (months-1-i), 1);
        return monthList[d.getMonth()];
      });
      query.month = { $in: lastMonths };
    }
    const data = await Headcount.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

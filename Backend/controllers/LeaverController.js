// LeaverController.js
import Leaver from "../models/Leaver.js";

export const getLeavers = async (req, res) => {
  try {
    const { department, year } = req.query;
    const query = {};
    if (department) query.department = department;
    if (year) query.year = year;

    const data = await Leaver.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

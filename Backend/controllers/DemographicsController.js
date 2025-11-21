// DemographicsController.js
import Demographics from "../models/Demographics.js";

export const demographicsData = async (req, res) => {
  try {
    const { department, year, designation, education, province } = req.query;
    let query = {};
    if (department && department !== "All") query.Department = department;
    if (designation && designation !== "All") query.Designation = designation;
    if (education && education !== "All") query.Education = education;
    if (province && province !== "All") query.Province = province;
    if (year && year !== "All") query.Year = Number(year);

    const data = await Demographics.find(query).lean();
    res.json(data || []);
  } catch (err) {
    console.error("demographicsData error:", err);
    res.status(500).json({ message: "Error fetching demographics data" });
  }
};

export const demographicsFilter = async (req, res) => {
  try {
    const departments = await Demographics.distinct("Department");
    const designations = await Demographics.distinct("Designation");
    const years = await Demographics.distinct("Year");
    const educations = await Demographics.distinct("Education");
    const provinces = await Demographics.distinct("Province");

    const yearsSorted = years
      .map((y) => (typeof y === "number" ? y : Number(y)))
      .filter((y) => !Number.isNaN(y))
      .sort((a, b) => a - b);

    res.json({
      departments: departments || [],
      designations: designations || [],
      years: yearsSorted || [],
      educations: educations || [],
      provinces: provinces || [],
    });
  } catch (err) {
    console.error("demographicsFilter error:", err);
    res.status(500).json({ message: "Error fetching filters" });
  }
};

export const demographicsSummary = async (req, res) => {
  try {
    const { year, department, designation, education, province } = req.query;
    let match = {};
    if (year && year !== "All") match.Year = Number(year);
    if (department && department !== "All") match.Department = department;
    if (designation && designation !== "All") match.Designation = designation;
    if (education && education !== "All") match.Education = education;
    if (province && province !== "All") match.Province = province;

    const totalEmployees = await Demographics.countDocuments(match);

    // City aggregation
    const cityAgg = await Demographics.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$City",
          count: { $sum: 1 },
          lat: { $first: "$lat" },
          lon: { $first: "$lon" },
          province: { $first: "$Province" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    cityAgg.forEach((c) => {
      c.percentage = totalEmployees
        ? ((c.count / totalEmployees) * 100).toFixed(2)
        : 0;
    });

    // Other aggregations
    const genderAgg = await Demographics.aggregate([
      { $match: match },
      { $group: { _id: "$Gender", count: { $sum: 1 } } },
    ]);

    const ageBuckets = [
      { name: "<25", min: 0, max: 24 },
      { name: "25-34", min: 25, max: 34 },
      { name: "35-44", min: 35, max: 44 },
      { name: "45-54", min: 45, max: 54 },
      { name: "55+", min: 55, max: 200 },
    ];
    const ageAgg = await Promise.all(
      ageBuckets.map((b) =>
        Demographics.countDocuments({
          ...match,
          Age: { $gte: b.min, $lte: b.max },
        }).then((c) => ({ bucket: b.name, count: c }))
      )
    );

    const tenureBuckets = [
      { name: "<1", min: 0, max: 0.99 },
      { name: "1-3", min: 1, max: 3 },
      { name: "3-5", min: 3.01, max: 5 },
      { name: "5+", min: 5.01, max: 100 },
    ];
    const tenureAgg = await Promise.all(
      tenureBuckets.map((b) =>
        Demographics.countDocuments({
          ...match,
          Tenure: { $gte: b.min, $lte: b.max },
        }).then((c) => ({ bucket: b.name, count: c }))
      )
    );

    const eduAgg = await Demographics.aggregate([
      { $match: match },
      { $group: { _id: "$Education", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const deptAgg = await Demographics.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$Department",
          male: {
            $sum: { $cond: [{ $eq: ["$Gender", "Male"] }, 1, 0] },
          },
          female: {
            $sum: { $cond: [{ $eq: ["$Gender", "Female"] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      genderAgg,
      ageAgg,
      tenureAgg,
      eduAgg,
      deptAgg,
      cityAgg,
    });
  } catch (err) {
    console.error("demographicsSummary error:", err);
    res.status(500).json({ message: "Error computing summary" });
  }
};


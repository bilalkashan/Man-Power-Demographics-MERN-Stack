import Payroll from "../models/Payroll.js";

export const allPayrollData = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = department && department !== "All" ? { department } : {};
    let data = await Payroll.find(filter).sort({ month: 1 }); 


    if (!data || data.length === 0) {
      return res.json([
        {
          month: "N/A",
          totalPayroll: 0,
          basic: 0,
          allowances: 0,
          overtime: 0,
          bonus: 0,
          headcount: 0,
          revenue: 0,
          leavers: 0,
          tax: 0,
          employerContribution: 0,
          totalCostOfEmployment: 0,
        },
      ]);
    }

    data = data.map((item) => ({
      month: item.month || "Unknown",
      totalPayroll: item.totalPayroll ?? 0,
      basic: item.basic ?? 0,
      allowances: item.allowances ?? 0,
      overtime: item.overtime ?? 0,
      bonus: item.bonus ?? 0,
      incentives: item.incentives ?? 0, // Added missing incentive field
      department: item.department || "General", // Added missing department field
      headcount: item.headcount ?? 0, // Added missing headcount field
      revenue: item.revenue ?? 0,
      leavers: item.leavers ?? 0,
      tax: item.tax ?? 0,
      employerContribution: item.employerContribution ?? 0,
      totalCostOfEmployment: item.totalCostOfEmployment ?? 0,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
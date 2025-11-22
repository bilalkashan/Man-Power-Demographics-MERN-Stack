import { useEffect, useState, useMemo } from "react";
import api from "../../api";
import Sidebar from "../../components/Sidebar";
import { FaBars, FaUpload, FaMoon, FaSun } from "react-icons/fa";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../toast";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/Footer";

// Colors for the Fixed vs Variable/Cost Pie Chart
const PIE_COLORS = ["#2563EB", "#06B6D4", "#EF4444", "#10B981"]; // Blue, Cyan, Red, Green

// --- HELPER: MONTH ORDER ---
const monthOrder = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  January: 1, February: 2, March: 3, April: 4, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

export default function PayrollDashboard({ userRole }) {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [department, setDepartment] = useState("All");

  const { darkMode, toggleDarkMode } = useTheme();
  const [uploading, setUploading] = useState(false);

  const cleanData = (arr) =>
    (arr || []).map((d, i) => ({
      id: i,
      month: d?.month?.toString().trim() || `M${i + 1}`,
      basic: Number(d?.basic) || 0,
      allowances: Number(d?.allowances) || 0,
      overtime: Number(d?.overtime) || 0,
      bonus: Number(d?.bonus) || 0,
      incentives: Number(d?.incentives) || 0,
      totalPayroll: Number(d?.totalPayroll) || 0,
      department: d?.department || "General",
      headcount: Number(d?.headcount) || 1,
      // === NEW FIELDS IMPLEMENTED ===
      revenue: Number(d?.revenue) || 0,
      leavers: Number(d?.leavers) || 0,
      tax: Number(d?.tax) || 0,
      employerContribution: Number(d?.employerContribution) || 0,
      totalCostOfEmployment: Number(d?.totalCostOfEmployment) || (Number(d?.totalPayroll) || 0), // Fallback
      // ==============================
    }));

  const fetchPayrollData = async () => {
    try {
      const res = await api.get(
        `/payroll/allPayrollData?department=${
          department === "All" ? "" : department
        }`
      );
      if (Array.isArray(res.data) && res.data.length > 0) {
        let cleaned = cleanData(res.data);
        
        // --- FIX: SORT MONTHS CHRONOLOGICALLY ---
        cleaned.sort((a, b) => {
          // Get month number from map, default to 99 if not found to push to end
          const m1 = monthOrder[a.month] || 99;
          const m2 = monthOrder[b.month] || 99;
          return m1 - m2;
        });
        // ----------------------------------------

        setData(cleaned);
      } else {
        setData([]); // Clear data if empty response
      }
    } catch (err) {
      console.error("Fetch payroll failed", err);
      handleError("Failed to fetch payroll data");
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [department]);

  const uniqueDepartments = useMemo(() => {
    return ["All", ...new Set(data.map((d) => d.department).filter(Boolean))];
  }, [data]);

  // Use TotalCostOfEmployment for a more comprehensive financial view
  const latest = data[data.length - 1] || {};
  const fixed = Number(latest.basic) || 0;
  const variable =
    (Number(latest.allowances) || 0) +
    (Number(latest.overtime) || 0) +
    (Number(latest.bonus) || 0) +
    (Number(latest.incentives) || 0);
  
  // === NEW KPI CALCULATIONS ===
  const totalCostOfEmployment = latest.totalCostOfEmployment || 0;
  const totalRevenue = latest.revenue || 0;
  const headcount = latest.headcount || 1;
  const leavers = latest.leavers || 0;

  const avgPayrollPerEmployee = (totalCostOfEmployment / headcount).toFixed(0);

  // New KPI 1: Cost of Payroll as % of Revenue
  const payrollCostOfRevenue = totalRevenue > 0 
    ? ((totalCostOfEmployment / totalRevenue) * 100).toFixed(1)
    : "0";

  // New KPI 2: Voluntary Turnover Rate (MoM/Latest)
  const turnoverRate = headcount > 0
    ? ((leavers / headcount) * 100).toFixed(1)
    : "0";

  // New KPI 3: Overtime Cost % of Basic Pay
  const overtimePercentOfBasic = fixed > 0
    ? ((latest.overtime / fixed) * 100).toFixed(1)
    : "0";
  // ============================

  // Payroll Growth now uses Total Cost of Employment
  const payrollGrowth = useMemo(() => {
    if (data.length < 2) return "0";
    const last = data[data.length - 1].totalCostOfEmployment;
    const secondLast = data[data.length - 2].totalCostOfEmployment;
    if (secondLast === 0) return (last > 0 ? "100" : "0");
    return (((last - secondLast) / secondLast) * 100).toFixed(1);
  }, [data]);

  const fixedPercent = ((fixed / (fixed + variable || 1)) * 100).toFixed(1);
  const variablePercent = ((variable / (fixed + variable || 1)) * 100).toFixed(1);

  // === NEW CHART DATA CALCULATIONS ===
  const chartData = (data || []).map((d) => ({
    month: d.month,
    basic: d.basic,
    allowances: d.allowances,
    overtime: d.overtime,
    bonus: d.bonus,
    incentives: d.incentives,
    totalPayroll: d.totalPayroll,
    totalCostOfEmployment: d.totalCostOfEmployment, // For Line Chart
  }));

  // Chart Data 1: Fixed vs Variable (with Tax/Employer Contribution)
  const fixedVsVariableData = [
    { name: "Fixed (Basic)", value: fixed || 0 },
    { name: "Variable", value: variable || 0 },
    { name: "Tax", value: latest.tax || 0 },
    { name: "Employer Cont.", value: latest.employerContribution || 0 },
  ].filter(d => d.value > 0);

  // Chart Data 2: Cumulative Payroll Spend (YTD)
  const ytdCumulativePayroll = useMemo(() => {
    let cumulative = 0;
    return (data || []).map(d => {
      cumulative += d.totalCostOfEmployment;
      return {
        month: d.month,
        cumulativeCost: cumulative
      };
    });
  }, [data]);

  // Chart Data 3: Department Summary (for Total & Avg)
  const departmentSummary = useMemo(() => {
    const summary = (data || []).reduce((acc, curr) => {
        if (!acc[curr.department]) {
            acc[curr.department] = { totalCost: 0, headcount: 0 };
        }
        acc[curr.department].totalCost += curr.totalCostOfEmployment;
        acc[curr.department].headcount += curr.headcount;
        return acc;
    }, {});

    return Object.keys(summary).map(dept => ({
        department: dept,
        totalCost: summary[dept].totalCost,
        avgCostPerEmployee: summary[dept].headcount > 0 
          ? (summary[dept].totalCost / summary[dept].headcount).toFixed(0) 
          : 0
    })).sort((a, b) => b.totalCost - a.totalCost); // Sort by total cost descending
  }, [data]);

  // Chart Data 4: Headcount Trend
  const headcountTrendData = (data || []).map(d => ({
    month: d.month,
    headcount: d.headcount
  }));
  // ===================================

  const handleUpload = async () => {
    if (!file) return handleError("⚠️ Please select a file!"); // Use toast
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/payroll/upload", formData);
      handleSuccess("File uploaded successfully!");
      fetchPayrollData(); // Refetch
      setFile(null); // Clear file
    } catch (err) {
      handleError("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <Sidebar
            role={userRole}
            active="Payroll"
            setActive={() => {}}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
          />
          
          <main className="flex-1 p-4 sm:p-6 overflow-auto text-gray-800 dark:text-gray-200">
            {/* Header and Toggle Button (omitted for brevity) */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <div className="flex items-center">
                <button
                  className="p-2 rounded-md text-gray-800 dark:text-gray-200 mr-3 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <FaBars className="text-xl" />
                </button>
                <motion.h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight dark:text-gray-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Payroll Dashboard
                </motion.h1>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md"
              >
                {darkMode ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-gray-800" />
                )}
              </button>
            </div>

            {/* Upload + Filter Section (omitted for brevity) */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white/80 backdrop-blur rounded-xl shadow-md dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {userRole === "user" && (
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border rounded-lg p-2 bg-white shadow-md dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg shadow-md w-full sm:w-auto ${
                      uploading
                        ? "bg-gray-400 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    <FaUpload /> {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto flex-grow sm:flex-grow-0"
                >
                  {uniqueDepartments.map((dep, i) => (
                    <option key={i} value={dep}>
                      {dep === "All" ? "All Departments" : dep}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* UPDATED KPI Section (4 columns for more metrics) */}
            <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  title: "Avg Cost / Employee",
                  value: avgPayrollPerEmployee,
                  suffix: " RS",
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  title: "Headcount (Latest)",
                  value: headcount,
                  suffix: " Emp",
                  color: "from-yellow-500 to-orange-600", // New KPI
                },
                {
                  title: "Payroll Growth % (MoM)",
                  value: payrollGrowth,
                  suffix: "%",
                  color: "from-green-400 to-emerald-600",
                },
                {
                  title: "% Cost vs Revenue",
                  value: payrollCostOfRevenue,
                  suffix: "%",
                  color: "from-red-500 to-pink-600", // New KPI
                },
                {
                  title: "% Fixed vs Variable",
                  value: `${fixedPercent}% / ${variablePercent}%`,
                  color: "from-purple-400 to-fuchsia-600",
                },
                {
                  title: "Overtime Cost % of Basic",
                  value: overtimePercentOfBasic,
                  suffix: "%",
                  color: "from-cyan-500 to-blue-500", // New KPI
                },
                {
                  title: "Turnover Rate (MoM)",
                  value: turnoverRate,
                  suffix: "%",
                  color: "from-red-400 to-red-600", // New KPI
                },
                {
                  title: "Total Cost of Employment (Latest)",
                  value: (totalCostOfEmployment / 1000).toFixed(1),
                  suffix: "K RS",
                  color: "from-gray-500 to-gray-700",
                },
              ].map((kpi, idx) => (
                <motion.div
                  key={idx}
                  className={`bg-gradient-to-r ${kpi.color} text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition transform`}
                >
                  <h3 className="text-sm font-medium mb-1 truncate">{kpi.title}</h3>
                  <p className="text-xl font-bold">
                    {kpi.value}
                    {kpi.suffix || ""}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Section (3 columns layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ErrorBoundary>

                {/* Payroll Breakdown Trend (Column 1: Full Width) */}
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition lg:col-span-2"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    📈 Total Payroll Trend (by Component)
                  </h2>
                  {chartData && chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="basic" stackId="a" fill="#4A86E8" name="Basic Pay" />
                        <Bar dataKey="allowances" stackId="a" fill="#60A5FA" name="Allowances" />
                        <Bar dataKey="overtime" stackId="a" fill="#0F766E" name="Overtime" />
                        <Bar dataKey="bonus" stackId="a" fill="#06B6D4" name="Bonus" />
                        <Bar dataKey="incentives" stackId="a" fill="#9333EA" name="Incentives" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12 dark:text-gray-300">
                      No payroll data available
                    </div>
                  )}
                </motion.div>

                {/* Fixed vs Variable (Latest Month) (Full Width) */}
                <motion.div 
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    🏢 Total Cost Breakdown
                  </h2>
                  {fixedVsVariableData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={fixedVsVariableData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={130}
                          paddingAngle={2}
                        >
                          {fixedVsVariableData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => `${value.toFixed(0)} RS`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12 dark:text-gray-300">
                      No data available
                    </div>
                  )}
                </motion.div>

                {/* NEW CHART 1: YTD Cumulative Payroll (Column 1) */}
                <motion.div
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
                    💸 YTD Cumulative Payroll Cost
                  </h2>
                  {ytdCumulativePayroll && ytdCumulativePayroll.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart
                        data={ytdCumulativePayroll}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px" }} />
                        <Line
                          type="monotone"
                          dataKey="cumulativeCost"
                          stroke="#F59E0B"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          name="Cumulative Cost"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12 dark:text-gray-300">
                      No cumulative data available
                    </div>
                  )}
                </motion.div>

                {/* NEW CHART 2: Average Payroll by Department (Column 2) */}
                <motion.div
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
                    🏢 Avg Payroll Cost by Department
                  </h2>
                  {departmentSummary && departmentSummary.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart 
                        data={departmentSummary.filter(d => d.department !== 'General')} // Filter 'General' for cleaner view
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="department" />
                        <Tooltip formatter={(value) => `${value} RS`} />
                        <Legend />
                        <Bar dataKey="avgCostPerEmployee" fill="#10B981" name="Avg Cost/Employee" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12 dark:text-gray-300">
                      No departmental data available
                    </div>
                  )}
                </motion.div>

                {/* NEW CHART 3: Headcount Trend (Column 3) */}
                <motion.div
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
                    👤 Headcount Trend
                  </h2>

                  {headcountTrendData && headcountTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart
                        data={headcountTrendData}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px" }} />
                        <Line
                          type="monotone"
                          dataKey="headcount"
                          stroke="#4F46E5"
                          strokeWidth={3}
                          dot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12 dark:text-gray-300">
                      No headcount data available
                    </div>
                  )}
                </motion.div>

              </ErrorBoundary>
            </div>
            <Footer />
          </main>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
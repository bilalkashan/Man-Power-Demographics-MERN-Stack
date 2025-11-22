import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaBars, FaMoon, FaSun } from "react-icons/fa";
import api from "../../api";
import Sidebar from "../../components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../toast";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/Footer";

// --- Professional color palette ---
const COLORS = ["#2563EB", "#0D9488", "#F59E0B", "#475569", "#DC2626"];

export default function LeaversDashboard({ userRole }) {
  const [leaverData, setLeaverData] = useState([]);
  const [department, setDepartment] = useState("All");
  const [year, setYear] = useState(new Date().getFullYear().toString()); // Set to current year
  const [file, setFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Unique Departments from DB ---
  const departments = ["All", ...new Set(leaverData.map((d) => d.department))];
  // --- Dynamic Years ---
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Dark mode
  const { darkMode, toggleDarkMode } = useTheme();
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get(
        `/leavers/leavers?department=${
          department === "All" ? "" : department
        }&year=${year}`
      );
      setLeaverData(res.data);
    } catch (err) {
      console.error(err);
      handleError("Failed to fetch leavers data"); // Use toast for error
    }
  };

  useEffect(() => {
    fetchData();
  }, [department, year]);

  const handleUpload = async () => {
    if (!file) return handleError("⚠️ Please select a file!"); // Use toast
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/leavers/upload", formData);
      handleSuccess(res.data.message);
      fetchData(); // Refetch
      setFile(null); // Clear file
    } catch (err) {
      console.error(err);
      handleError("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // --- KPI Calculations ---
  const ytdAttrition =
    leaverData.length > 0
      ? (
          leaverData.reduce((acc, d) => acc + (d.attritionRate || 0), 0) /
          leaverData.length
        ).toFixed(1)
      : 0;

  const avgTenure =
    leaverData.length > 0
      ? (
          leaverData.reduce((acc, d) => acc + (d.tenureAtExit || 0), 0) /
          leaverData.length
        ).toFixed(1)
      : 0;

  // Top reasons
  const reasonsCount = leaverData.reduce((acc, d) => {
    acc[d.reason] = (acc[d.reason] || 0) + d.leavers;
    return acc;
  }, {});
  const topReasons = Object.entries(reasonsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Top departments
  const deptCount = leaverData.reduce((acc, d) => {
    acc[d.department] = (acc[d.department] || 0) + d.leavers;
    return acc;
  }, {});
  const topDepartments = Object.entries(deptCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // --- Chart Data ---
  const lineData = leaverData.map((d) => ({
    month: d.month,
    leavers: d.leavers,
    attrition: d.attritionRate,
  }));

  const stackedData = leaverData.reduce((acc, d) => {
    let existing = acc.find((item) => item.month === d.month);
    if (!existing) {
      existing = { month: d.month };
      acc.push(existing);
    }
    existing[d.reason] = (existing[d.reason] || 0) + d.leavers;
    return acc;
  }, []);

  const pieData = [
    { name: "Voluntary", value: leaverData.filter((d) => d.voluntary).length },
    { name: "Involuntary", value: leaverData.filter((d) => !d.voluntary).length },
  ];

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <Sidebar
            role={userRole}
            active="Leavers"
            setActive={() => {}}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
          />
          <main className="flex-1 p-4 sm:p-6 overflow-auto text-gray-800 dark:text-gray-200">
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
                  Leavers & Attrition
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

            {/* Upload + Filters */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white/80 backdrop-blur rounded-xl shadow-md dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* --- RESPONSIVENESS FIX ---
                - Added flex-wrap and width classes
              */}
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
                {/* Department Filter */}
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 w-full sm:w-auto flex-grow sm:flex-grow-0"
                >
                  {departments.map((dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                {/* Year Filter */}
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 w-full sm:w-auto flex-grow sm:flex-grow-0"
                >
                  {years.map((yr, i) => (
                    <option key={i} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: "YTD Attrition %",
                  value: `${ytdAttrition} %`,
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  title: "Top 3 Reasons",
                  value:
                    topReasons.map(([r, c]) => `${r}: ${c}`).join(", ") || "N/A",
                  color: "from-teal-500 to-green-600",
                },
                {
                  title: "Leavers from Departments",
                  value:
                    topDepartments.map(([d, c]) => `${d}: ${c}`).join(", ") ||
                    "N/A",
                  color: "from-amber-500 to-yellow-600",
                },
                {
                  title: "Avg Tenure of Leavers",
                  value: `${avgTenure} months`,
                  color: "from-slate-500 to-gray-700",
                },
              ].map((kpi, idx) => (
                <motion.div
                  key={idx}
                  className={`bg-gradient-to-r ${kpi.color} text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition transform`}
                >
                  <h3 className="text-sm font-medium mb-1 truncate">{kpi.title}</h3>
                  <p className="text-xl font-bold">
                    {kpi.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ErrorBoundary>
                {/* Line Chart */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-gray-800 transition"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                    📈 Monthly Attrition Trend
                  </h2>
                  {lineData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={lineData}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }} // Adjusted margin
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="leavers"
                          stroke="#DC2626"
                          strokeWidth={3}
                          dot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="attrition"
                          stroke="#2563EB"
                          strokeWidth={3}
                          dot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12 dark:text-gray-300">
                      No data available
                    </div>
                  )}
                </motion.div>

                {/* Stacked Column */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-gray-800"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                    📊 Reasons for Leaving
                  </h2>
                  {stackedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={stackedData}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }} // Adjusted margin
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(reasonsCount).map((r, i) => (
                          <Bar
                            key={r}
                            dataKey={r}
                            stackId="a"
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12 dark:text-gray-300">
                      No data available
                    </div>
                  )}
                </motion.div>

                {/* Pie Chart */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition col-span-1 lg:col-span-2 dark:bg-gray-800"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300 ">
                    🍰 Voluntary vs Involuntary Exits
                  </h2>
                  {pieData.reduce((a, b) => a + b.value, 0) > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={110}
                          paddingAngle={2}
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12 dark:text-gray-300">
                      No data available
                    </div>
                  )}
                </motion.div>
              </ErrorBoundary>
            </div>

            <Footer />
          </main>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
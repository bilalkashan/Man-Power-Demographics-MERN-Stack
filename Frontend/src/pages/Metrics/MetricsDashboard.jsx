import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../toast";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { FaUpload, FaMoon, FaSun, FaBars } from "react-icons/fa"; // Added FaBars
import { useTheme } from "../../components/ThemeContext";
import ErrorBoundary from "../../components/ErrorBoundary";
import Footer from "../../components/Footer";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const currentYear = new Date().getFullYear();

// Heatmap color scale
const getColor = (rating) => {
  if (rating >= 4) return "#22c55e"; // green
  if (rating >= 3) return "#facc15"; // yellow
  return "#ef4444"; // red
};

export default function MetricsDashboard({ userRole }) {
  const [absenteeism, setAbsenteeism] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [headcount, setHeadcount] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [department, setDepartment] = useState("All");
  const [file, setFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Set to false

  // Dark mode
  const { darkMode, toggleDarkMode } = useTheme();
  const [uploading, setUploading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      const [absRes, perfRes, headRes] = await Promise.all([
        api.get(`/metrics/absenteeism?year=${year}`),
        api.get(`/metrics/performance?year=${year}`),
        api.get(`/metrics/headcount?year=${year}`),
      ]);
      setAbsenteeism(absRes.data);
      setPerformance(perfRes.data);
      setHeadcount(headRes.data);
    } catch (err) {
      handleError("❌ Failed to fetch key metrics");
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  // Upload Excel
  const handleUpload = async () => {
    if (!file) return handleError("⚠️ Please select a file!");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/metrics/upload", formData);
      handleSuccess(res.data.message);
      fetchData(); // Refetch
      setFile(null); // Clear file
    } catch (err) {
      handleError("❌ Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // Filters
  const uniqueDepartments = [
    "All",
    ...new Set(performance.map((p) => p.department)),
  ];
  const filteredPerformance =
    department === "All"
      ? performance
      : performance.filter((p) => p.department === department);
  const filteredAbsenteeism =
    department === "All"
      ? absenteeism
      : absenteeism.filter((a) => a.department === department);
  const filteredHeadcount =
    department === "All"
      ? headcount
      : headcount.filter((h) => h.department === department);

  // KPIs
  const currentHeadcount = filteredHeadcount.reduce(
    (acc, d) => acc + (d.netHeadcount || 0),
    0
  );
  const avgAbsenteeism =
    filteredAbsenteeism.length > 0
      ? (
          filteredAbsenteeism.reduce(
            (a, d) => a + (d.absenteeismPercent || 0),
            0
          ) / filteredAbsenteeism.length
        ).toFixed(1)
      : 0;
  const avgPerfRating =
    filteredPerformance.length > 0
      ? (
          filteredPerformance.reduce((a, d) => a + (d.avgRating || 0), 0) /
          filteredPerformance.length
        ).toFixed(1)
      : 0;

  // Chart Data
  const absenteeismData = months.map((m) => ({
    month: m,
    percent:
      filteredAbsenteeism.find((d) => d.month === m)?.absenteeismPercent || 0,
  }));

  const performanceHeatmapData = filteredPerformance.map((d) => ({
    department: d.department,
    rating: d.avgRating,
  }));

  const headData = months.map((m) => {
    const row = filteredHeadcount.find((d) => d.month === m);
    return {
      month: m,
      hires: row?.hires || 0,
      leavers: row?.leavers || 0,
      net: row?.netHeadcount || 0,
    };
  });

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <Sidebar
            role={userRole}
            active="Other Metrics"
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
                  Key Metrics
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
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto flex-grow sm:flex-grow-0"
                >
                  {Array.from({ length: 5 }).map((_, i) => {
                    const y = currentYear - i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto flex-grow sm:flex-grow-0"
                >
                  {uniqueDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "Current Headcount",
                  value: currentHeadcount,
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  title: "Absenteeism %",
                  value: avgAbsenteeism + "%",
                  color: "from-green-400 to-emerald-600",
                },
                {
                  title: "Avg Performance Rating",
                  value: avgPerfRating,
                  color: "from-purple-400 to-fuchsia-600",
                },
              ].map((k, i) => (
                <motion.div
                  key={i}
                  className={`bg-gradient-to-r ${k.color} text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition transform`}
                >
                  <h3 className="text-sm font-medium mb-1 truncate">{k.title}</h3>
                  <p className="text-xl font-bold">
                    {k.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <ErrorBoundary>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Absenteeism */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
                    📉 Absenteeism Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={absenteeismData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ background: "#fff", borderRadius: "8px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percent"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Performance Heatmap */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
                    🔥 Performance Ratings
                  </h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      layout="vertical"
                      data={performanceHeatmapData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }} // Adjusted margin
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      {/* --- RESPONSIVENESS FIX ---
                        - Changed YAxis width from 120 to 100
                      */}
                      <YAxis
                        dataKey="department"
                        type="category"
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{ background: "#fff", borderRadius: "8px" }}
                      />
                      <Bar dataKey="rating" radius={[0, 8, 8, 0]}>
                        {performanceHeatmapData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={getColor(entry.rating)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Headcount */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition col-span-1 lg:col-span-2 dark:bg-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
                    👥 Headcount Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={headData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ background: "#fff", borderRadius: "8px" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="hires"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="leavers"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="net"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </ErrorBoundary>
            <Footer />
          </main>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaMoon, FaSun, FaBars } from "react-icons/fa"; // Added FaBars
import api from "../../api";
import Sidebar from "../../components/Sidebar";
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell, // Import Cell for Bar Chart
} from "recharts";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../toast";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/Footer";

export default function HiringDashboard({ userRole }) {
  const [hiringData, setHiringData] = useState([]);
  const [department, setDepartment] = useState("All");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [file, setFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Set to false

  const { darkMode, toggleDarkMode } = useTheme();
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch data
  const fetchData = async () => {
    try {
      const res = await api.get(
        `/hiring/hiring?department=${
          department === "All" ? "" : department
        }&month=${month}&year=${year}`
      );
      setHiringData(res.data);
    } catch (err) {
      console.error(err);
      handleError("Failed to fetch data"); // Use toast notification
    }
  };

  useEffect(() => {
    fetchData();
  }, [department, month, year]);

  const handleUpload = async () => {
    if (!file) return handleError("⚠️ Please select a file!"); // Use toast
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/hiring/upload", formData);
      handleSuccess(res.data.message);
      fetchData(); // Refetch data
      setFile(null); // Clear file
    } catch (err) {
      console.error(err);
      handleError("❌ Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // ✅ Dynamically extract departments and months
  const uniqueDepartments = [
    "All",
    ...new Set(hiringData.map((d) => d.department).filter(Boolean)),
  ];
  const uniqueMonths = [
    "",
    ...new Set(hiringData.map((d) => d.month).filter(Boolean)),
  ];

  // KPI calculations
  const totalHires = hiringData.reduce((acc, d) => acc + (d.hires || 0), 0);
  const avgTimeToHire =
    hiringData.length > 0
      ? (
          hiringData.reduce((acc, d) => acc + (d.timeToHire || 0), 0) /
          hiringData.length
        ).toFixed(1)
      : 0;
  const avgOfferAcceptance =
    hiringData.length > 0
      ? (
          hiringData.reduce((acc, d) => acc + (d.offerAcceptanceRate || 0), 0) /
          hiringData.length
        ).toFixed(1)
      : 0;

  // Funnel Chart
  const funnelData = [
    {
      name: "Applications",
      value: hiringData.reduce(
        (acc, d) => acc + (d.stageCounts?.applications || 0),
        0
      ),
    },
    {
      name: "Shortlisted",
      value: hiringData.reduce(
        (acc, d) => acc + (d.stageCounts?.shortlisted || 0),
        0
      ),
    },
    {
      name: "Interviewed",
      value: hiringData.reduce(
        (acc, d) => acc + (d.stageCounts?.interviewed || 0),
        0
      ),
    },
    {
      name: "Offers",
      value: hiringData.reduce(
        (acc, d) => acc + (d.stageCounts?.offers || 0),
        0
      ),
    },
    {
      name: "Hired",
      value: hiringData.reduce(
        (acc, d) => acc + (d.stageCounts?.hired || 0),
        0
      ),
    },
  ];

  // Bar Chart
  const barData = hiringData
    .filter((d) => d.department)
    .map((d) => ({ department: d.department, timeToHire: d.timeToHire }));

  // Line Chart
  const lineDataMap = {};
  hiringData.forEach((d) => {
    if (!lineDataMap[d.month]) lineDataMap[d.month] = 0;
    lineDataMap[d.month] += d.hires || 0;
  });
  const monthsOrdered = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const lineData = monthsOrdered
    .map((m) => ({
      month: m,
      hires: lineDataMap[m] || 0,
    }))
    .filter(d => d.hires > 0); // Only show months with data

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <Sidebar
            role={userRole}
            active="Hirings"
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setActive={() => {}}
          />

          {/* --- ALIGNMENT FIX ---
            - Removed `md:ml-1` and adjusted padding
          */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto text-gray-800 dark:text-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <div className="flex items-center">
                {/* --- HAMBURGER FIX ---
                  - Moved hamburger button here
                */}
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
                  Hiring
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

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 w-full sm:w-auto flex-grow sm:flex-grow-0"
                >
                  {uniqueDepartments.map((dep, idx) => (
                    <option key={idx} value={dep}>
                      {dep === "All" ? "All Departments" : dep}
                    </option>
                  ))}
                </select>

                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto flex-grow sm:flex-grow-0"
                >
                  {/* --- BUG FIX ---
                    - Changed label for "All Months"
                  */}
                  {uniqueMonths.map((m, idx) => (
                    <option key={idx} value={m}>
                      {m === "" ? "All Months" : m}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto flex-grow sm:flex-grow-0"
                >
                  {years.map((y, idx) => (
                    <option key={idx} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* --- RESPONSIVENESS FIX ---
              - Added `sm:grid-cols-2`
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "Total Hires",
                  value: totalHires,
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  title: "Avg Time to Hire (Days)",
                  value: avgTimeToHire,
                  color: "from-green-400 to-emerald-600",
                },
                {
                  title: "Offer Acceptance %",
                  value: avgOfferAcceptance + "%",
                  color: "from-purple-400 to-fuchsia-600",
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
                {/* Funnel Chart */}
                <motion.div
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    🎯 Recruitment Funnel
                  </h2>

                  {funnelData.reduce((sum, d) => sum + d.value, 0) > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <FunnelChart>
                        {/* 🎨 Gradient Definitions */}
                        <defs>
                          <linearGradient id="colorApps" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#2563EB" />
                          </linearGradient>
                          <linearGradient id="colorShort" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#14B8A6" />
                            <stop offset="100%" stopColor="#0D9488" />
                          </linearGradient>
                          <linearGradient id="colorInt" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#A855F7" />
                            <stop offset="100%" stopColor="#7E22CE" />
                          </linearGradient>
                          <linearGradient id="colorOffer" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#F97316" />
                            <stop offset="100%" stopColor="#EA580C" />
                          </linearGradient>
                          <linearGradient id="colorHired" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#22C55E" />
                            <stop offset="100%" stopColor="#16A34A" />
                          </linearGradient>
                        </defs>

                        {/* Custom Tooltip */}
                        <Tooltip
                          content={({ payload }) => {
                            if (!payload || !payload[0]) return null;
                            const { name, value } = payload[0].payload;
                            const total = funnelData[0].value; // Base on Applications
                            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return (
                              <div className="bg-white shadow-lg rounded-lg p-3 text-sm text-gray-700 border">
                                <p className="font-semibold">{name}</p>
                                <p>
                                  👥 Candidates:{" "}
                                  <span className="font-medium">{value}</span>
                                </p>
                                <p>📊 Conversion: {percent}%</p>
                              </div>
                            );
                          }}
                        />

                        {/* Funnel with gradients */}
                        <Funnel
                          dataKey="value"
                          data={funnelData.map((d, i) => ({
                            ...d,
                            fill: [
                              "url(#colorApps)",
                              "url(#colorShort)",
                              "url(#colorInt)",
                              "url(#colorOffer)",
                              "url(#colorHired)",
                            ][i],
                          }))}
                          isAnimationActive
                        >
                          <LabelList
                            position="center"
                            fill="#fff"
                            stroke="none"
                            fontSize={13}
                            fontWeight="bold"
                            formatter={(value, entry) => {
                              if (!entry || !entry.name) return value;
                              return `${entry.name}: ${value}`;
                            }}
                          />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-lg text-gray-400 text-center py-12">
                      No data available
                    </div>
                  )}
                </motion.div>

                {/* Bar Chart */}
                <motion.div
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    ⏱ Time to Hire by Department (Days)
                  </h2>
                  {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={330}>
                      <BarChart
                        data={barData}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="timeToHire" fill="#4F46E5" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-5 dark:text-gray-300">
                      No data available
                    </div>
                  )}
                </motion.div>

                {/* Line Chart */}
                <motion.div
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition col-span-1 lg:col-span-2"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    📈 Hiring Trend Over Time
                  </h2>
                  {lineData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={lineData}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="hires"
                          stroke="#10B981"
                          strokeWidth={3}
                        />
                      </LineChart>
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
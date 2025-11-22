import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaUpload, FaMoon, FaSun } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import api from "../../api";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../toast";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/Footer";

// 🎨 Palette
const BLUE = "#2563EB";
const GREEN = "#10B981";
const AMBER = "#F59E0B";

export default function EngagementDashboard({ userRole }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [department, setDepartment] = useState("All");
  const [data, setData] = useState([]); // This will hold ALL data
  const [departments, setDepartments] = useState(["All"]); // Start with "All"

  // Dark mode
  const { darkMode, toggleDarkMode } = useTheme();
  const [uploading, setUploading] = useState(false);

  // ========== Upload ==========
  const handleUpload = async () => {
    if (!file) return handleError("Please select a file!");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/engagement/upload", formData);
      handleSuccess(res.data.message);
      await fetchData(); // Refetch data
      setFile(null); // Clear file
    } catch (err) {
      console.error(err);
      handleError("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // ========== Fetch Data ==========
  // Fetches ALL data just once on page load
  const fetchData = async () => {
    try {
      const res = await api.get("/engagement/empEngagementData");
      const dataset = Array.isArray(res.data) ? res.data : [];
      setData(dataset);

      // Populate departments filter from the full dataset
      const uniqueDepts = [...new Set(dataset.map((d) => d.Department))];
      setDepartments(["All", ...uniqueDepts]);
    } catch (err) {
      console.error(err);
      handleError("Failed to fetch engagement data");
    }
  };

  // Fetch data only once on component mount
  useEffect(() => {
    fetchData();
  }, []); // Runs once

  // ========== Derived Data (FIXED) ==========
  const categories = ["Leadership", "Recognition", "Growth", "WorkLifeBalance"];

  // **THE REAL FIX IS HERE:**
  // We filter the local `data` state using the filters.
  const filteredData = useMemo(() => {
    let ds = data;
    
    // **NOTE:** The "Year" filter is not applied because your 'Engagement'
    // data model does not have a "year" field.
    // We will only filter by Department, which is supported.

    // Filter by Department
    if (department !== "All") {
      ds = ds.filter((d) => d.Department === department);
    }

    return ds;
  }, [data, department]); // Re-runs when data or department (from filter) changes

  // All calculations below now correctly use the `filteredData`
  const months = [...new Set(filteredData.map((d) => d.Month))];
  const latestMonth = months[months.length - 1] || "N/A";

  // Radar → avg per category
  const radarData =
    filteredData.length > 0
      ? categories.map((cat) => ({
          category: cat,
          score:
            filteredData.reduce((sum, d) => sum + (d[cat] || 0), 0) /
            filteredData.length,
        }))
      : categories.map((cat) => ({ category: cat, score: 0 }));

  // Bar → latest month per dept
  const barData =
    filteredData.length > 0
      ? filteredData
          .filter((d) => d.Month === latestMonth)
          .map((d) => ({ department: d.Department, score: d.EngagementScore }))
      : [];

  // Line → avg per month
  const lineData =
    filteredData.length > 0
      ? months.map((month) => {
          const monthlyData = filteredData.filter((d) => d.Month === month);
          return {
            month,
            engagement:
              monthlyData.reduce((sum, d) => sum + d.EngagementScore, 0) /
              (monthlyData.length || 1),
          };
        })
      : [];

  // KPIs
  const overallEngagement =
    filteredData.length > 0
      ? filteredData.reduce((sum, d) => sum + d.EngagementScore, 0) /
        filteredData.length
      : 0;

  const highestDept =
    barData.length > 0
      ? barData.reduce((a, b) => (a.score > b.score ? a : b))
      : { department: "N/A", score: 0 };

  const lowestDept =
    barData.length > 0
      ? barData.reduce((a, b) => (a.score < b.score ? a : b))
      : { department: "N/A", score: 0 };

  const weakestCategory =
    radarData.length > 0
      ? radarData.reduce((a, b) => (a.score < b.score ? a : b))
      : { category: "N/A", score: 0 };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <Sidebar
          role={userRole}
          active="Employee Engagement"
          setActive={() => {}}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-auto text-gray-800 dark:text-gray-200">
          {/* Title */}
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
                Employee Engagement
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

          {/* Upload & Filters */}
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
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto flex-grow sm:flex-grow-0"
              >
                <option>{new Date().getFullYear()}</option>
                <option>{new Date().getFullYear() - 1}</option>
              </select>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 w-full sm:w-auto flex-grow sm:flex-grow-0"
              >
                {departments.map((d, i) => (
                  <option key={i}>{d}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* --- RESPONSIVENESS FIX ---
            - Added `sm:grid-cols-2` for tablets
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Overall Engagement",
                value: `${overallEngagement.toFixed(1)}%`,
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Highest Dept",
                value: `${highestDept.department}: ${highestDept.score.toFixed(
                  1
                )}%`,
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "Lowest Dept",
                value: `${lowestDept.department}: ${lowestDept.score.toFixed(
                  1
                )}%`,
                color: "from-red-500 to-pink-600",
              },
              {
                title: "Weakest Category",
                value: `${
                  weakestCategory.category
                }: ${weakestCategory.score.toFixed(1)}%`,
                color: "from-amber-500 to-yellow-600",
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
              {/* Radar Chart */}
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-gray-800"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  🧭 Survey Category Scores
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke={BLUE}
                      fill={BLUE}
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Bar Chart */}
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-gray-800"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  🏢 Engagement by Department ({latestMonth})
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={barData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill={GREEN} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Line Chart */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition lg:col-span-2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  📈 Engagement Trend
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={lineData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      name="Engagement Score"
                      stroke={AMBER}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </ErrorBoundary>
          </div>
          <Footer />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaUpload, FaMoon, FaSun } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import api from "../../api";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../toast";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/Footer";

// Vibrant palette
const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#22C55E",
  "#A855F7",
];
const BLUE = "#2563EB";

export default function TrainingDevelopmentDashboard({ userRole }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);

  // Filters
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [department, setDepartment] = useState("All");

  // Data
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    byDepartment: [],
    byType: [],
    byMonth: [],
    kpis: null,
  });
  const [departments, setDepartments] = useState(["All"]);

  // Dark mode
  const { darkMode, toggleDarkMode } = useTheme();
  const [uploading, setUploading] = useState(false);

  // Upload
  const handleUpload = async () => {
    if (!file) return handleError("Please select a file!");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/training/upload", formData);
      handleSuccess(res.data.message);
      await fetchData();
      setFile(null); // Clear file
    } catch (err) {
      console.error(err);
      handleError("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const fetchData = async () => {
    try {
      const query = `?year=${year}${
        department !== "All" ? `&department=${department}` : ""
      }`;
      const [recordsRes, summaryRes] = await Promise.all([
        api.get(`/training/records${query}`),
        api.get(`/training/summary${query}`),
      ]);

      const recs = Array.isArray(recordsRes.data) ? recordsRes.data : [];
      setRecords(recs);
      setSummary(
        summaryRes.data || { byDepartment: [], byType: [], byMonth: [], kpis: null }
      );

      const uniqueDepts = ["All", ...new Set(recs.map((r) => r.department))];
      setDepartments(uniqueDepts);
    } catch (err) {
      console.error(err);
      handleError("Failed to fetch Training data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, department]);

  // ------- KPIs -------
  const kpis = useMemo(() => {
    const k = summary?.kpis || {
      avgTrainingHoursPerEmployee: 0,
      trainingParticipationPercent: 0,
      mostCommonTrainingTypes: [],
    };
    return {
      avgHoursPerEmployee: (k.avgTrainingHoursPerEmployee || 0).toFixed(1),
      participationPercent: Math.round(k.trainingParticipationPercent || 0),
      mostCommonTypes: k.mostCommonTrainingTypes || [],
    };
  }, [summary]);

  // ------- Charts data -------
  const barData = useMemo(() => {
    return (summary?.byDepartment || []).map((d) => ({
      department: d.department,
      trainings: Number(d.trainingsConducted || 0),
      hours: Number(d.trainingHours || 0),
      avgParticipation: Number(d.avgParticipation || 0),
    }));
  }, [summary]);

  const donutTypeData = useMemo(() => {
    return (summary?.byType || []).map((t, idx) => ({
      trainingType: t.trainingType,
      hours: Number(t.hours || 0),
      fill: COLORS[idx % COLORS.length],
    }));
  }, [summary]);

  const monthOrder = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const lineData = useMemo(() => {
    const dict = {};
    (summary?.byMonth || []).forEach((m) => {
      dict[m.month] = {
        month: m.month,
        participation: Number(m.avgParticipation || 0),
      };
    });
    return monthOrder.filter((m) => dict[m]).map((m) => dict[m]);
  }, [summary]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <Sidebar
          role={userRole}
          active="Training & Development"
          setActive={() => {}}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
        />
        {/* --- ALIGNMENT FIX ---
          - Removed fixed hamburger button
          - Removed `md:ml-1` from <main>
          - Added responsive padding
        */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto text-gray-800 dark:text-gray-200">
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
                Training & Development
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
            - Added `sm:grid-cols-2`
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Avg Training Hours / Employee",
                value: kpis.avgHoursPerEmployee,
                badge: "hrs",
                color: "from-indigo-500 to-violet-600",
              },
              {
                title: "Training Participation",
                value: `${kpis.participationPercent}%`,
                badge: "",
                color: "from-emerald-500 to-teal-600",
              },
              {
                title: "Top Training Types",
                value: kpis.mostCommonTypes.join(", ") || "—",
                badge: "",
                color: "from-amber-500 to-orange-600",
              },
            ].map((k, idx) => (
              <motion.div
                key={idx}
                className={`bg-gradient-to-r ${k.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-medium">{k.title}</h3>
                  {k.badge && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {k.badge}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold mt-2 truncate">{k.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ErrorBoundary>
              {/* Bar: Trainings by department */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition lg:col-span-2"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  🏢 Trainings by Department
                </h2>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={barData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="trainings"
                        fill="#2563EB"
                        name="Trainings Conducted"
                      >
                        {barData.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-400 text-center py-12">
                    No data available
                  </div>
                )}
              </motion.div>

              {/* Donut: Training hours by type */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  🧭 Training Hours by Type
                </h2>
                {donutTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={donutTypeData}
                        dataKey="hours"
                        nameKey="trainingType"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                      >
                        {donutTypeData.map((e, i) => (
                          <Cell key={i} fill={e.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-400 text-center py-12">
                    No data available
                  </div>
                )}
              </motion.div>

              {/* Participation Radial Cards */}
              {barData.length > 0 && (
                <motion.div
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition lg:col-span-3"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                    🏅 Best Participation (Top 3 Departments)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[...barData]
                      .sort((a, b) => b.avgParticipation - a.avgParticipation)
                      .slice(0, 3)
                      .map((d, idx) => {
                        const gradientBg = [
                          "from-indigo-500 to-violet-600",
                          "from-emerald-500 to-teal-600",
                          "from-amber-500 to-orange-600",
                        ][idx % 3];
                        const pct = Math.round(d.avgParticipation || 0);

                        return (
                          <motion.div
                            key={idx}
                            className={`bg-gradient-to-br ${gradientBg} text-white rounded-xl p-5 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform`}
                            whileHover={{ rotate: 1 }}
                          >
                            <div className="text-sm font-semibold text-center mb-3">
                              {d.department}
                            </div>
                            <ResponsiveContainer width="100%" height={180}>
                              <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                startAngle={90}
                                endAngle={-270}
                                data={[{ value: pct }]}
                              >
                                <PolarAngleAxis
                                  type="number"
                                  domain={[0, 100]}
                                  tick={false}
                                />
                                <RadialBar
                                  dataKey="value"
                                  cornerRadius={12}
                                  fill="#fff"
                                  stroke="none"
                                />
                                <RadialBar
                                  data={[{ value: 100 }]}
                                  dataKey="value"
                                  cornerRadius={12}
                                  fill="rgba(255,255,255,0.3)"
                                  isAnimationActive={false}
                                />
                                <text
                                  x="50%"
                                  y="50%"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    fontSize="22"
                                    fontWeight="bold"
                                    fill="#fff"
                                  >
                                    {pct}%
                                  </tspan>
                                  <tspan
                                    x="50%"
                                    dy="1.5em"
                                    fontSize="12"
                                    fill="rgba(255,255,255,0.9)"
                                  >
                                    Avg Participation
                                  </tspan>
                                </text>
                              </RadialBarChart>
                            </ResponsiveContainer>
                          </motion.div>
                        );
                      })}
                  </div>
                </motion.div>
              )}

              {/* Line: Participation trend */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition lg:col-span-3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  📈 Participation % Trend
                </h2>
                {lineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={lineData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="participation"
                        name="Participation %"
                        stroke={BLUE}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-400 text-center py-12">
                    No data available
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
  );
}
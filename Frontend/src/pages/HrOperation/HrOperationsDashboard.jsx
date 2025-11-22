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
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useTheme } from "../../components/ThemeContext";
import Footer from "../../components/Footer";

// Palette
const COLORS = [
  "#2563EB",
  "#0D9488",
  "#F59E0B",
  "#475569",
  "#DC2626",
  "#9333EA",
  "#059669",
  "#D97706",
];
const BLUE = "#2563EB";
const SLATE = "#475569";
const RED = "#DC2626";

export default function HrOperationsDashboard({ userRole }) {
  // Filters
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [department, setDepartment] = useState("All");
  const [month, setMonth] = useState("All");
  const [designation, setDesignation] = useState("All");

  // Dynamic options
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to false
  const [file, setFile] = useState(null);
  const [rawIssues, setRawIssues] = useState([]);
  const [summary, setSummary] = useState({
    byType: [],
    byMonth: [],
    kpis: null,
  });

  // Dark mode
  const { darkMode, toggleDarkMode } = useTheme();
  const [uploading, setUploading] = useState(false);

  // Upload
  const handleUpload = async () => {
    if (!file) return handleError("Please select a file!");
    setUploading(true); // Set uploading true
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/hr-operations/upload", formData);
      handleSuccess(res.data.message);
      await fetchData();
      setFile(null); // Clear file input
    } catch (err) {
      console.error(err);
      handleError("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false); // Set uploading false
    }
  };

  const fetchData = async () => {
    try {
      const query =
        `?year=${year}` +
        (department !== "All" ? `&department=${department}` : "") +
        (month !== "All" ? `&month=${month}` : "") +
        (designation !== "All" ? `&designation=${designation}` : "");

      const [issuesRes, summaryRes] = await Promise.all([
        api.get(`/hr-operations/issues${query}`),
        api.get(`/hr-operations/summary${query}`),
      ]);

      setRawIssues(Array.isArray(issuesRes.data) ? issuesRes.data : []);
      setSummary(summaryRes.data || { byType: [], byMonth: [], kpis: null });

      // Departments
      const uniqueDepts = [
        ...new Set((issuesRes.data || []).map((d) => d.department)),
      ];
      setDepartments(["All", ...uniqueDepts]);

      // Designations (only if department is selected)
      if (department !== "All") {
        const uniqueDesignations = [
          ...new Set(
            (issuesRes.data || []).map((d) => d.designation).filter(Boolean)
          ),
        ];
        setDesignations(["All", ...uniqueDesignations]);
      } else {
        setDesignations([]);
      }
    } catch (err) {
      console.error(err);
      handleError("Failed to fetch HR Ops data");
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [year, department, month, designation]); // Added month and designation

  // ------- KPIs -------
  const kpis = useMemo(() => {
    const k = summary?.kpis || {
      avgResolutionTime: 0,
      slaCompliance: 0,
      openCount: 0,
      closedCount: 0,
    };
    const totalTickets = (k.openCount || 0) + (k.closedCount || 0);
    return {
      avgResolutionTime: (k.avgResolutionTime || 0).toFixed(1),
      slaCompliance: (k.slaCompliance || 0).toFixed(1),
      openCount: k.openCount || 0,
      closedCount: k.closedCount || 0,
      totalTickets,
    };
  }, [summary]);

  // ------- Charts data -------
  const barData = useMemo(() => {
    return (summary?.byType || []).map((t) => ({
      issueType: t.issueType,
      avgResolutionTime: Number(t.avgResolutionTime || 0),
    }));
  }, [summary]);

  const donutDataByType = useMemo(() => {
    return (summary?.byType || []).map((t, idx) => ({
      issueType: t.issueType,
      value: Math.max(0, Math.min(100, Number(t.slaCompliance || 0))),
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
        issuesRaised: Number(m.issuesRaised || 0),
        issuesResolved: Number(m.issuesResolved || 0),
      };
    });
    // Filter to show only months that have data
    return monthOrder.filter(m => dict[m]).map(m => dict[m]);
  }, [summary]);

  const statusPie = useMemo(() => {
    return [
      { name: "Open", value: kpis.openCount },
      { name: "Closed", value: kpis.closedCount },
    ];
  }, [kpis]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <Sidebar
          role={userRole}
          active="HR Operations"
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
                HR Operations
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
              {/* Year Filter */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
              >
                {[
                  new Date().getFullYear(),
                  new Date().getFullYear() - 1,
                ].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>

              {/* Month Filter */}
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
              >
                <option>All</option>
                {[
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              {/* Department Filter */}
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDesignation("All"); // reset designation
                }}
                className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
              >
                {departments.map((d, i) => (
                  <option key={i}>{d}</option>
                ))}
              </select>

              {/* Designation Filter */}
              {department !== "All" && designations.length > 1 && ( // Only show if there are designations to select
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
                >
                  {designations.map((des, i) => (
                    <option key={i}>{des}</option>
                  ))}
                </select>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Avg Resolution (days)",
                value: kpis.avgResolutionTime,
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Compliance %",
                value: `${kpis.slaCompliance}%`,
                color: "from-teal-500 to-emerald-600",
              },
              {
                title: "Total Tickets",
                value: kpis.totalTickets,
                color: "from-slate-500 to-gray-700",
              },
              {
                title: "Tickets (Open/Closed)",
                value: `${kpis.openCount} / ${kpis.closedCount}`,
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <ErrorBoundary>
              {/* Compliance by Issue Type */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition xl:col-span-3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                  🎯 Compliance by Issue Type
                </h2>

                {donutDataByType.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {donutDataByType.map((d, idx) => {
                      const gradientBg = [
                        "from-indigo-500 to-violet-600",
                        "from-emerald-500 to-teal-600",
                        "from-amber-500 to-orange-600",
                        "from-rose-500 to-pink-600",
                      ][idx % 4];
                      const pct = Math.round(d.value || 0);

                      return (
                        <motion.div
                          key={idx}
                          className={`bg-gradient-to-br ${gradientBg} text-white rounded-xl p-5 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform`}
                        >
                          <div className="text-sm font-semibold text-center mb-3 truncate">
                            {d.issueType}
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
                                  SLA Compliance
                                </tspan>
                              </text>
                            </RadialBarChart>
                          </ResponsiveContainer>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-12">
                    No data available
                  </div>
                )}
              </motion.div>

              {/* Bar: Avg resolution */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition xl:col-span-2"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  📊 Avg Resolution Time by Issue Type
                </h2>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={barData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="issueType" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="avgResolutionTime"
                        fill="#2563EB"
                        name="Avg Days"
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

              {/* 🧾 Open vs Closed */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">🧾 Open vs Closed</h2>
                {kpis.totalTickets > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusPie}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={2}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        <Cell fill="#2563EB" /> {/* Open */}
                        <Cell fill="#34d399" /> {/* Closed */}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-400 text-center py-12">
                    No data available
                  </div>
                )}
              </motion.div>

              {/* Line: Issues over months */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition xl:col-span-3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  📈 Issues Over Months
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
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="issuesRaised"
                        name="Raised"
                        stroke={RED}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="issuesResolved"
                        name="Resolved"
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
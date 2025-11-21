import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import CountUp from "react-countup";
import { motion } from "framer-motion";
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
  FunnelChart,
  PieChart,
  Funnel,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  FaMale,
  FaFemale,
  FaMoon,
  FaSun,
  FaBars, 
} from "react-icons/fa";
import api from "../api";
import { useTheme } from "../components/ThemeContext";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";

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

// Heatmap colors
const getColor = (rating) => {
  if (rating >= 4) return "#22c55e"; // green
  if (rating >= 3) return "#F59E0B"; 
  return "#ef4444"; // red
};

export default function AdminDashboard() {
  const [reasonsForLeavingData, setReasonsForLeavingData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [timeToHireData, setTimeToHireData] = useState([]);
  const [hiresData, setHiresData] = useState([]);
  const [leaversData, setLeaversData] = useState([]);
  const [active, setActive] = useState("Dashboard");
  // Set sidebar to be closed by default on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All");
  const [hrSummary, setHrSummary] = useState({
    byType: [],
    kpis: { slaCompliance: 0 },
  });
  const [trainingSummary, setTrainingSummary] = useState({
    byDepartment: [],
    byType: [],
  });
  const [payrollData, setPayrollData] = useState([]);
  const [demographics, setDemographics] = useState([]);

  // Dark mode
  const { darkMode, toggleDarkMode } = useTheme();

  // ✅ New KPI state
  const [kpis, setKpis] = useState({
    headcount: 0,
    hires: 0,
    leavers: 0,
    attrition: 0,
    payroll: 0,
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Last 6 months hires
        const hiresRes = await api.get("/hiring/hiring?months=6");
        setHiresData(hiresRes.data);

        // Last 6 months leavers
        const leaversRes = await api.get("/leavers/leavers?months=6");
        setLeaversData(leaversRes.data);
      } catch (err) {
        console.error("Failed to fetch hires/leavers data", err);
      }
    };

    fetchData();
  }, []);

  const allMonths = Array.from(
    new Set([...hiresData.map((h) => h.month), ...leaversData.map((l) => l.month)])
  );

  const combinedData = allMonths.map((m) => {
    const hireMatch = hiresData.find((h) => h.month === m);
    const leaveMatch = leaversData.find((l) => l.month === m);
    return {
      month: m,
      hires: hireMatch ? hireMatch.hires : 0,
      leavers: leaveMatch ? leaveMatch.leavers : 0,
    };
  });

  // Helper: get last 6 month labels with year
  const getLast6Months = () => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return `${months[d.getMonth()]} ${d.getFullYear()}`;
    });
  };

  const last6 = getLast6Months();

  // Normalize API data into "MMM YYYY" format
  const normalizeData = (data) =>
    data.map((d) => {
      let label = d.month;
      if (/^\d{4}-\d{2}$/.test(d.month)) {
        const [year, monthNum] = d.month.split("-");
        label = `${months[parseInt(monthNum) - 1]} ${year}`;
      } else if (/^[A-Za-z]{3}$/.test(d.month)) {
        label = `${d.month} ${new Date().getFullYear()}`;
      }
      return { ...d, month: label };
    });

  const hiresNormalized = normalizeData(hiresData);
  const leaversNormalized = normalizeData(leaversData);

  const last6MonthsData = last6.map((m) => {
    const hireMatch = hiresNormalized.find((h) => h.month === m);
    const leaveMatch = leaversNormalized.find((l) => l.month === m);
    return {
      month: m,
      hires: hireMatch ? hireMatch.hires : 0,
      leavers: leaveMatch ? leaveMatch.leavers : 0,
    };
  });

  useEffect(() => {
    const fetchRecruitmentData = async () => {
      try {
        const res = await api.get("/hiring/hiringSummary");
        setFunnelData(res.data.funnel);
        setTimeToHireData(res.data.timeToHire);
      } catch (err) {
        console.error("Error fetching recruitment data:", err);
      }
    };
    fetchRecruitmentData();
  }, []);

  // ✅ Other states
  const [absenteeism, setAbsenteeism] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  // Latest payroll record
  const latestPayroll = payrollData[payrollData.length - 1] || {};
  const headcount = latestPayroll.headcount || 0;
  const payroll = latestPayroll.totalPayroll || 0;

  // ✅ Compute Headcount from demographics
  const totalEmployees = demographics.length;
  const maleCount = demographics.filter((d) => d.Gender === "Male").length;
  const femaleCount = demographics.filter((d) => d.Gender === "Female").length;

  const ageGroups = ["<25", "25-34", "35-44", "45-54", "55+"];

  // 📉 Fetch absenteeism & performance
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [absRes, perfRes] = await Promise.all([
          api.get(`/metrics/absenteeism?year=${year}`),
          api.get(`/metrics/performance?year=${year}`),
        ]);
        setAbsenteeism(absRes.data || []);
        setPerformance(perfRes.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch metrics", err);
      }
    };
    fetchMetrics();
  }, [year]);

  const absenteeismData = months.map((m) => ({
    month: m,
    percent: absenteeism.find((d) => d.month === m)?.absenteeismPercent || 0,
  }));

  const performanceHeatmapData = performance.map((d) => ({
    department: d.department,
    rating: d.avgRating,
  }));

  // Fetch Payroll
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await api.get(`/payroll/allPayrollData`);
        setPayrollData(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch payroll data", err);
      }
    };
    fetchPayroll();
  }, []);

  const payrollTrend = payrollData.map((d) => ({
    month: d.month,
    payroll: d.totalPayroll,
  }));

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await api.get(`/training/summary?year=2025`);
        setTrainingSummary(res.data || { byDepartment: [], byType: [] });
      } catch (err) {
        console.error("❌ Failed to fetch training summary", err);
      }
    };
    fetchTraining();
  }, []);

  useEffect(() => {
    const fetchHrOps = async () => {
      try {
        const res = await api.get(`/hr-operations/summary?year=2025`);
        setHrSummary(res.data || { byType: [], kpis: { slaCompliance: 0 } });
      } catch (err) {
        console.error("❌ Failed to fetch HR Ops summary", err);
      }
    };
    fetchHrOps();
  }, []);

  const donutDataByType = useMemo(() => {
    return (hrSummary?.byType || []).map((t, idx) => ({
      issueType: t.issueType,
      value: Math.max(0, Math.min(100, Number(t.slaCompliance || 0))),
      fill: COLORS[idx % COLORS.length],
    }));
  }, [hrSummary]);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await api.get(`/leavers/leavers?year=2025`);
        const leavers = res.data;

        const grouped = {};
        leavers.forEach((d) => {
          if (!grouped[d.reason]) grouped[d.reason] = { reason: d.reason };
          grouped[d.reason][d.department] =
            (grouped[d.reason][d.department] || 0) + d.leavers;
        });

        setReasonsForLeavingData(Object.values(grouped));
      } catch (err) {
        console.error("❌ Failed to fetch reasons for leaving", err);
      }
    };
    fetchReasons();
  }, []);

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const res = await api.get(
          `/demographics/demographics-data?year=2025&department=${
            selectedDept === "All" ? "" : selectedDept
          }`
        );
        setDemographics(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch demographics", err);
      }
    };
    fetchDemo();
  }, [selectedDept]);

  const ageData = ageGroups.map((group) => {
    let count = 0;
    demographics.forEach((d) => {
      if (group === "<25" && d.Age < 25) count++;
      else if (group === "25-34" && d.Age >= 25 && d.Age <= 34) count++;
      else if (group === "35-44" && d.Age >= 35 && d.Age <= 44) count++;
      else if (group === "45-54" && d.Age >= 45 && d.Age <= 54) count++;
      else if (group === "55+" && d.Age >= 55) count++;
    });
    return { ageGroup: group, count };
  });

  const genderData = [
    { name: "Male", value: maleCount },
    { name: "Female", value: femaleCount },
  ];

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const demoRes = await api.get(`/demographics/demographics-data`);
        const demographics = demoRes.data || [];
        const headcount = demographics.length;

        const hiresRes = await api.get(`/hiring/hiring?year=2025`);
        const hiresCount = hiresRes.data.reduce(
          (sum, h) => sum + (h.hires || 0),
          0
        );

        const leaversRes = await api.get(`/leavers/leavers?year=2025`);
        const leaversCount = leaversRes.data.reduce(
          (sum, l) => sum + (l.leavers || 0),
          0
        );

        const attritionRate =
          headcount > 0 ? ((leaversCount / headcount) * 100).toFixed(1) : 0;

        const payrollRes = await api.get(`/payroll/allPayrollData`);
        const payrollList = payrollRes.data || [];
        const payrollData = payrollList[payrollList.length - 1] || {};

        setKpis({
          headcount,
          payroll: payrollData.totalPayroll || 0,
          hires: hiresCount,
          leavers: leaversCount,
          attrition: attritionRate,
        });
      } catch (err) {
        console.error("❌ Failed to fetch KPI data", err);
      }
    };
    fetchKpis();
  }, []);

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <Sidebar
            role="admin"
            active={active}
            setActive={setActive}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
          />
          {/* Main content area: Added md:ml-64 for desktop sidebar offset, adjusted padding */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto text-gray-800 dark:text-gray-200">

            {/* Header: Wrapped left items, added hamburger button */}
            <div className="flex justify-between mb-7 p-4 items-center backdrop-blur bg-white/80 rounded-xl shadow-md dark:bg-gray-800">
              {/* Left side of header */}
              <div className="flex items-center">
                {/* Hamburger Menu Button (Mobile Only) */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-800 dark:text-gray-200 mr-3 md:hidden"
                >
                  <FaBars className="text-xl" />
                </button>
                {/* Page Title */}
                <motion.h1
                  className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight dark:text-gray-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Main Dashboard
                  <p className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-300">
                    Analytics overview
                  </p>
                </motion.h1>
              </div>

              {/* Right side of header */}
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

            {/* KPI Cards: Adjusted grid for tablets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
              {/* KPI: Headcount */}
              <div className="bg-indigo-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-lg font-semibold">Headcount</h3>
                <p className="text-2xl font-bold">
                  <CountUp start={0} end={kpis.headcount} duration={2} />
                </p>
              </div>

              {/* KPI: Hires */}
              <div className="bg-green-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform">
                <h3 className="text-lg font-semibold">Hires</h3>
                <p className="text-2xl font-bold">
                  <CountUp start={0} end={kpis.hires} duration={2} />
                </p>
              </div>

              {/* KPI: Leavers */}
              <div className="bg-red-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform">
                <h3 className="text-lg font-semibold">Leavers</h3>
                <p className="text-2xl font-bold">
                  <CountUp start={0} end={kpis.leavers} duration={2} />
                </p>
              </div>

              {/* KPI: Attrition */}
              <div className="bg-yellow-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform">
                <h3 className="text-lg font-semibold">Attrition %</h3>
                <p className="text-2xl font-bold">
                  <CountUp
                    start={0}
                    end={kpis.attrition}
                    duration={2}
                    decimals={1}
                    suffix="%"
                  />
                </p>
              </div>

              {/* KPI: Payroll */}
              <div className="bg-purple-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform">
                <h3 className="text-lg font-semibold">Payroll</h3>
                <p className="text-2xl font-bold">
                  <CountUp
                    start={0}
                    end={kpis.payroll}
                    duration={2}
                    separator=","
                    prefix="RS. "
                  />
                </p>
              </div>
            </div>

            <ErrorBoundary>
              {/* 📊 Demographics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Ratio: Made icons/text responsive */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition lg:col-span-1 dark:bg-gray-800"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-lg font-semibold">⚧ Gender Ratio</h2>
                  <div className="relative w-full h-72 flex items-center justify-center">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={genderData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={3}
                          isAnimationActive={true}
                          animationBegin={100}
                          animationDuration={1200}
                        >
                          {genderData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#2563EB" : "#EC4899"}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Male/Female Counts */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex">
                        {/* Male */}
                        <div className="flex flex-col items-center px-2">
                          <FaMale className="text-blue-800 text-5xl sm:text-6xl" />
                          <span className="text-md sm:text-lg font-bold text-gray-800 dark:text-gray-300">
                            {maleCount}
                          </span>
                        </div>
                        {/* Female */}
                        <div className="flex flex-col items-center px-2">
                          <FaFemale className="text-pink-600 text-5xl sm:text-6xl" />
                          <span className="text-md sm:text-lg font-bold text-gray-800 dark:text-gray-300">
                            {femaleCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Employees */}
                  <div className="text-center text-gray-700 font-semibold text-md dark:text-gray-300">
                    Total Employees: {maleCount + femaleCount}
                  </div>
                </motion.div>

                {/* Age Group Distribution: Adjusted margin */}
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">
                    🎂 Age Group Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={ageData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hiring & Leavers Charts: Adjusted grid for tablets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
                {/* Recruitment Funnel */}
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl flex flex-col h-full dark:bg-gray-800">
                  <h2 className="text-xl font-semibold mb-4">
                    🎯 Recruitment Funnel
                  </h2>
                  <ResponsiveContainer width="100%" height={350}>
                    <FunnelChart>
                      <Tooltip />
                      <Funnel
                        dataKey="value"
                        data={funnelData}
                        isAnimationActive
                        label={{
                          position: "center",
                          fill: "#fff",
                          formatter: (value) => `${value}`,
                          fontSize: 12,
                        }}
                      >
                        {funnelData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>

                {/* Time to Hire by Department */}
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl flex flex-col h-full dark:bg-gray-800">
                  <h2 className="text-xl font-semibold mb-4">
                    ⏱ Time to Hire by Department (Days)
                  </h2>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={timeToHireData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="timeToHire" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Reasons for Leaving: Adjusted grid span and margin */}
                <div className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 flex flex-col h-full dark:bg-gray-800 md:col-span-2 lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">
                    📊 Reasons for Leaving
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={reasonsForLeavingData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="reason" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="HR" stackId="a" fill="#6366F1" />
                      <Bar dataKey="IT" stackId="a" fill="#10B981" />
                      <Bar dataKey="Finance" stackId="a" fill="#F59E0B" />
                      <Bar dataKey="Sales" stackId="a" fill="#EF4444" />
                      <Bar dataKey="Marketing" stackId="a" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* HR Operations Charts and Payroll trend */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Per-issue-type SLA (Radial cards) */}
                <div className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">
                    🎯 Compliance by Issue Type
                  </h3>
                  {donutDataByType.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                      {donutDataByType.map((d, idx) => {
                        const gradientBg = [
                          "from-indigo-500 to-violet-600",
                          "from-emerald-500 to-teal-600",
                          "from-amber-500 to-orange-600",
                          "from-rose-500 to-pink-600",
                        ][idx % 4];
                        const pct = Math.round(d.value || 0);

                        return (
                          <div
                            key={idx}
                            className={`bg-gradient-to-br ${gradientBg} text-white rounded-xl p-4 shadow-lg`}
                          >
                            <div className="text-sm font-semibold text-center mb-2 truncate">
                              {d.issueType}
                            </div>
                            <ResponsiveContainer width="100%" height={100}>
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
                                  fill="rgba(255,255,255,0.2)"
                                  isAnimationActive={false}
                                />
                                <text
                                  x="50%"
                                  y="50%"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    fontSize="18"
                                    fontWeight="bold"
                                    fill="#fff"
                                  >
                                    {pct}%
                                  </tspan>
                                </text>
                              </RadialBarChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-12">
                      No HR operations compliance data
                    </div>
                  )}
                </div>

                {/* Payroll trend */}
                <div className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">
                    📈 Payroll Trend
                  </h3>
                  {payrollTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={payrollTrend}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="payroll"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12">
                      No payroll data available
                    </div>
                  )}
                </div>
              </div>

              {/* Training Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Bar Chart → Trainings by Department: Adjusted margin */}
                <div className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">
                    📊 Trainings by Department
                  </h3>
                  {trainingSummary.byDepartment.length > 0 ? (
                    <ResponsiveContainer width="100%" height={270}>
                      <BarChart
                        data={trainingSummary.byDepartment}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="trainingsConducted"
                          name="Trainings Conducted"
                          fill="#3B82F6"
                        >
                          {trainingSummary.byDepartment.map((_, idx) => (
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
                      No training data available
                    </div>
                  )}
                </div>

                {/* Donut Chart → Training Type Distribution */}
                <div className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">
                    🍩 Training Type Distribution
                  </h3>
                  {trainingSummary.byType.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={trainingSummary.byType}
                          dataKey="hours"
                          nameKey="trainingType"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={110}
                          paddingAngle={2}
                          label
                        >
                          {trainingSummary.byType.map((_, idx) => (
                            <Cell
                              key={idx}
                              fill={COLORS[idx % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-gray-400 text-center py-12">
                      No training data available
                    </div>
                  )}
                </div>
              </div>

              {/* Other Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* 📉 Absenteeism Trend: Adjusted margin */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-gray-800"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-lg font-semibold mb-4">
                    📉 Absenteeism % Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={absenteeismData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ background: "#fff", borderRadius: "8px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percent"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* 🔥 Performance Ratings Heatmap: Adjusted YAxis width */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-gray-800"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-lg font-semibold mb-4">
                    🔥 Performance Ratings Heatmap
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={performanceHeatmapData}
                      margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis
                        dataKey="department"
                        type="category"
                        width={100} // Reduced width for mobile
                      />
                      <Tooltip
                        contentStyle={{ background: "#fff", borderRadius: "8px" }}
                      />
                      <Bar dataKey="rating" radius={[0, 8, 8, 0]}>
                        {performanceHeatmapData.map((entry, idx) => (
                          <Cell key={idx} fill={getColor(entry.rating)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </ErrorBoundary>
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
}
import React, { useState, useEffect, useMemo } from "react";
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
import { FaMale, FaFemale, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import api from "../api";
import { useTheme } from "../components/ThemeContext";
import ErrorBoundary from "../components/ErrorBoundary";
// import Footer from "../components/Footer"; // REMOVED
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { handleError } from "../toast";
import logo from "../assets/MMC-Logo.png";
import { useNavigate } from "react-router-dom";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// --- Corporate Color Palette ---
const COLORS = [
  "#2563EB", // Blue
  "#059669", // Green
  "#D97706", // Amber
  "#DC2626", // Red
  "#475569", // Slate
  "#7C3AED", // Purple
  "#0D9488", // Teal
  "#EC4899", // Pink
];

const BLUE = "#2563EB";
const SLATE = "#475569";
const RED = "#DC2626";
const GREEN = "#059669";
const AMBER = "#D97706";
const PINK = "#EC4899";
const TEAL = "#0D9488";
const PURPLE = "#7C3AED"; // ADDED BACK

// Gradients for KPIs
const CORP_BLUE = "from-blue-500 to-blue-700";
const CORP_GREEN = "from-green-500 to-green-700";
const CORP_AMBER = "from-amber-500 to-amber-700";
const CORP_RED = "from-red-500 to-red-700";
const CORP_SLATE = "from-slate-500 to-slate-700";
const CORP_PURPLE = "from-purple-500 to-purple-700";
const CORP_TEAL = "from-teal-500 to-teal-700";
const CORP_PINK = "from-pink-500 to-pink-700";

// --- Helper Component for KPIs (Smaller, no motion) ---
const KpiCard = ({ title, value, color }) => (
  <div
    className={`bg-gradient-to-r ${color} text-white p-2 rounded-lg shadow-md`}
  >
    <h3 className="text-xs font-medium mb-1 truncate">{title}</h3>
    <p className="text-lg font-bold truncate">{value}</p>
  </div>
);

// --- Helper Function for Payroll ---
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
  }));

export default function SuperAdminDashboard() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  // --- Get User Name and Handle Logout ---
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) setName(user.name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // --- Consolidated Filter States ---
  const [globalFilters, setGlobalFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: "All",
    department: "All",
    designation: "All",
    education: "All",
    province: "All",
  });

  // State for filter dropdown options (Kept for function integrity)
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    designations: [],
    years: [],
    educations: [],
    provinces: [],
  });

  // --- Data States --- (Abbreviated for brevity, functional code kept)
  const [demographicsRawData, setDemographicsRawData] = useState([]);
  const [demographicsSummary, setDemographicsSummary] = useState(null);
  const [hiringData, setHiringData] = useState([]);
  const [hrOpsSummary, setHrOpsSummary] = useState({
    byType: [],
    byMonth: [],
    kpis: null,
  });
  const [leaverData, setLeaverData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [absenteeism, setAbsenteeism] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [headcount, setHeadcount] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [trainingSummary, setTrainingSummary] = useState({
    byDepartment: [],
    byType: [],
    byMonth: [],
    kpis: null,
  });

  // --- Build Query String from Global Filters ---
  const buildQuery = (exclude = []) => {
    return Object.entries(globalFilters)
      .filter(
        ([key, value]) =>
          value && value !== "All" && !exclude.includes(key)
      )
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  };

  // --- Data Fetching (Functions kept for integrity) ---

  const fetchFilterOptions = async () => {
    try {
      const res = await api.get("/demographics/demographics-filters");
      const currentYear = new Date().getFullYear();
      const defaultYears = Array.from({ length: 5 }, (_, i) =>
        String(currentYear - i)
      );

      setFilterOptions({
        departments: ["All", ...(res.data.departments || [])],
        designations: ["All", ...(res.data.designations || [])],
        years: (res.data.years || defaultYears).map((y) => String(y)),
        educations: ["All", ...(res.data.educations || [])],
        provinces: ["All", ...(res.data.provinces || [])],
      });
    } catch (err) {
      handleError("Failed to load filter options");
    }
  };

  const fetchDemographicsData = async () => {
    try {
      const q = buildQuery();
      const [dataRes, sumRes] = await Promise.all([
        api.get(`/demographics/demographics-data?${q}`),
        api.get(`/demographics/demographics-summary?${q}`),
      ]);
      setDemographicsRawData(dataRes.data || []);
      setDemographicsSummary(sumRes.data || null);
    } catch (err) {
      handleError("Failed to fetch demographics data: " + err.message);
    }
  };

  const fetchHiringData = async () => {
    try {
      const { year, department } = globalFilters;
      const deptQuery = department === "All" ? "" : encodeURIComponent(department);
      const yearQuery = encodeURIComponent(year);
      const q = `department=${deptQuery}&year=${yearQuery}`;
      
      const res = await api.get(`/hiring/hiring?${q}`);
      setHiringData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch hiring data:", err);
      handleError("Failed to fetch hiring data");
    }
  };

  const fetchHrOperationData = async () => {
    try {
      const q = buildQuery(["education", "province"]);
      const summaryRes = await api.get(`/hr-operations/summary?${q}`);
      setHrOpsSummary(
        summaryRes.data || { byType: [], byMonth: [], kpis: null }
      );
    } catch (err) {
      console.error(err);
      handleError("Failed to fetch HR Ops data");
    }
  };

  const fetchLeaversData = async () => {
    try {
      const { year, department } = globalFilters;
      const deptQuery = department === "All" ? "" : encodeURIComponent(department);
      const yearQuery = encodeURIComponent(year);
      const q = `department=${deptQuery}&year=${yearQuery}`;
      
      const res = await api.get(`/leavers/leavers?${q}`);
      setLeaverData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch leavers data:", err);
      handleError("Failed to fetch leavers data");
    }
  };

  const fetchEngagementData = async () => {
    try {
      const q = buildQuery(['month', 'designation', 'education', 'province']);
      const res = await api.get(`/engagement/empEngagementData?${q}`);
      setEngagementData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch engagement data:", err);
      handleError("Failed to fetch engagement data");
    }
  };

  const fetchMetricsData = async () => {
    try {
      const { year } = globalFilters; 
      const [absRes, perfRes, headRes] = await Promise.all([
        api.get(`/metrics/absenteeism?year=${year}`),
        api.get(`/metrics/performance?year=${year}`),
        api.get(`/metrics/headcount?year=${year}`),
      ]);
      setAbsenteeism(absRes.data || []);
      setPerformance(perfRes.data || []);
      setHeadcount(headRes.data || []);
    } catch (err) {
      handleError("❌ Failed to fetch key metrics");
    }
  };

  const fetchPayrollData = async () => {
    try {
      const { department } = globalFilters;
      const res = await api.get(
        `/payroll/allPayrollData?department=${
          department === "All" ? "" : department
        }`
      );
      if (Array.isArray(res.data) && res.data.length > 0) {
        setPayrollData(cleanData(res.data));
      } else {
        setPayrollData([]); 
      }
    } catch (err) {
      console.error("Fetch payroll failed", err);
      handleError("Failed to fetch payroll data");
    }
  };

  const fetchTrainingData = async () => {
    try {
      const { year, department } = globalFilters;
      const query = `?year=${year}${
        department !== "All" ? `&department=${encodeURIComponent(department)}` : ""
      }`;
      const [recordsRes, summaryRes] = await Promise.all([
        api.get(`/training/records${query}`),
        api.get(`/training/summary${query}`),
      ]);

      // setTrainingRecords(Array.isArray(recordsRes.data) ? recordsRes.data : []); // Removed as trainingRecords is unused
      setTrainingSummary(
        summaryRes.data || { byDepartment: [], byType: [], byMonth: [], kpis: null }
      );
    } catch (err) {
      console.error(err);
      handleError("Failed to fetch Training data");
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // ✅ Master useEffect to fetch all data when filters change
  useEffect(() => {
    fetchDemographicsData();
    fetchHiringData();
    fetchHrOperationData();
    fetchLeaversData();
    fetchEngagementData();
    fetchMetricsData();
    fetchPayrollData();
    fetchTrainingData();
  }, [globalFilters]);

  // --- Chart Dark Mode Colors ---
  const tickColor = darkMode ? "#E5E7EB" : "#4B5563"; // light gray / dark gray
  const tooltipStyle = {
    backgroundColor: darkMode ? "#374151" : "#FFFFFF", // gray-700 / white
    borderRadius: "8px",
    border: "1px solid #eee",
    padding: "8px",
    fontSize: "12px",
  };

  // --- Memoized Calculations (KPIs and Charts) ---
  // --- Demographics KPIs & Charts ---
  const {
    totalEmployees,
    maleCount,
    femaleCount,
    genderDiversity,
    // avgAge, // Removed unused KPI
    // avgTenure, // Removed unused KPI
  } = useMemo(() => {
    const data = demographicsRawData || [];
    const total = data.length || 0;
    if (total === 0) {
      return { totalEmployees: 0, maleCount: 0, femaleCount: 0, genderDiversity: 0, avgAge: 0, avgTenure: 0 };
    }
    const males = data.filter((d) => d.Gender === "Male").length;
    const females = data.filter((d) => d.Gender === "Female").length;
    return {
      totalEmployees: total,
      maleCount: males,
      femaleCount: females,
      genderDiversity: ((females / total) * 100).toFixed(1),
      avgAge: (
        data.reduce((acc, d) => acc + (Number(d.Age) || 0), 0) / total
      ).toFixed(1),
      avgTenure: (
        data.reduce((acc, d) => acc + (Number(d.Tenure) || 0), 0) / total
      ).toFixed(1),
    };
  }, [demographicsRawData]);

  const ageData = demographicsSummary?.ageAgg || [];
  // const tenureData = demographicsSummary?.tenureAgg || []; // Removed unused chart data
  const eduData = (demographicsSummary?.eduAgg || []).map((e) => ({
    name: e._id || "Unknown",
    value: e.count || 0,
  }));
  const deptData = demographicsSummary?.deptAgg || [];
  const genderData =
    demographicsSummary?.genderAgg?.map((g) => ({
      name: g._id || "Unknown",
      value: g.count || 0,
    })) || [];
  // const cityPieData = // Removed unused chart data
  // 	demographicsSummary?.cityAgg?.map((c) => ({
  // 		name: c._id || "Unknown",
  // 		value: c.count,
  // 	})) || [];

  // --- Hiring KPIs & Charts ---
  const {
    // totalHires, // Removed unused KPI
    // avgTimeToHire, // Removed unused KPI
    // avgOfferAcceptance // Removed unused KPI
  } = useMemo(() => {
    const data = hiringData || [];
    const len = data.length;
    if (len === 0) {
      return { totalHires: 0, avgTimeToHire: 0, avgOfferAcceptance: 0 };
    }
    return {
      totalHires: data.reduce((acc, d) => acc + (d.hires || 0), 0),
      avgTimeToHire: (
        data.reduce((acc, d) => acc + (d.timeToHire || 0), 0) / len
      ).toFixed(1),
      avgOfferAcceptance: (
        data.reduce((acc, d) => acc + (d.offerAcceptanceRate || 0), 0) /
        len
      ).toFixed(1),
    };
  }, [hiringData]);

  const funnelData = useMemo(() => {
    return [
      "applications",
      "shortlisted",
      "interviewed",
      "offers",
      "hired",
    ].map((stage) => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      value: hiringData.reduce(
        (acc, d) => acc + (d.stageCounts?.[stage] || 0),
        0
      ),
    }));
  }, [hiringData]);

  // const barData = useMemo(() => { // Removed unused chart data
  // 	return hiringData
  // 		.filter((d) => d.department)
  // 		.map((d) => ({ department: d.department, timeToHire: d.timeToHire }));
  // }, [hiringData]);

  const lineData = useMemo(() => {
    const lineDataMap = {};
    hiringData.forEach((d) => {
      if (!lineDataMap[d.month]) lineDataMap[d.month] = 0;
      lineDataMap[d.month] += d.hires || 0;
    });
    const monthsOrdered = [
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
    return monthsOrdered
      .map((m) => ({
        month: m,
        hires: lineDataMap[m] || 0,
      }))
      .filter((d) => d.hires > 0);
  }, [hiringData]);

  // --- HR Operations KPIs & Charts ---
  const hrOpsKpis = useMemo(() => {
    const k = hrOpsSummary?.kpis || {
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
  }, [hrOpsSummary]);

  // const HrOperationbarData = useMemo(() => { // Removed unused chart data
  // 	return (hrOpsSummary?.byType || []).map((t) => ({
  // 		issueType: t.issueType,
  // 		avgResolutionTime: Number(t.avgResolutionTime || 0),
  // 	}));
  // }, [hrOpsSummary]);

  const donutDataByType = useMemo(() => {
    return (hrOpsSummary?.byType || []).map((t, idx) => ({
      issueType: t.issueType,
      value: Math.max(0, Math.min(100, Number(t.slaCompliance || 0))),
      fill: COLORS[idx % COLORS.length],
    }));
  }, [hrOpsSummary]);

  const HrOperationlineData = useMemo(() => {
    const dict = {};
    (hrOpsSummary?.byMonth || []).forEach((m) => {
      dict[m.month] = {
        month: m.month,
        issuesRaised: Number(m.issuesRaised || 0),
        issuesResolved: Number(m.issuesResolved || 0),
      };
    });
    const monthOrder = [
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
    return monthOrder.filter((m) => dict[m]).map((m) => dict[m]);
  }, [hrOpsSummary]);

  const statusPie = useMemo(() => {
    return [
      { name: "Open", value: hrOpsKpis.openCount },
      { name: "Closed", value: hrOpsKpis.closedCount },
    ];
  }, [hrOpsKpis]);

  // --- Leavers KPIs & Charts ---
  const { ytdAttrition, avgLeaverTenure, reasonsCount } = useMemo(() => {
    const data = leaverData || [];
    // const len = data.length; // Removed unused variable

    if (data.length === 0) {
      return { ytdAttrition: 0, avgLeaverTenure: 0, topReasons: [], topDepartments: [], reasonsCount: {} };
    }

    const monthlyAttrition = data.reduce((acc, d) => {
      if (d.month) {
        acc[d.month] = (acc[d.month] || 0) + (d.attritionRate || 0);
      }
      return acc;
    }, {});
    const uniqueMonths = Object.keys(monthlyAttrition).length;
    const totalAttrition = Object.values(monthlyAttrition).reduce((s, v) => s + v, 0);

    const attrition = (uniqueMonths > 0 ? totalAttrition / uniqueMonths : 0).toFixed(1);

    const totalLeavers = data.reduce((acc, d) => acc + (d.leavers || 0), 0);

    const tenure = (totalLeavers > 0 ?
      data.reduce((acc, d) => acc + ((d.tenureAtExit || 0) * (d.leavers || 0)), 0) / totalLeavers
      : 0).toFixed(1);

    const rCount = data.reduce((acc, d) => {
      if (d.reason) {
        acc[d.reason] = (acc[d.reason] || 0) + (d.leavers || 0);
      }
      return acc;
    }, {});
    // const tReasons = Object.entries(rCount) // Removed unused calculation
    // 	.sort((a, b) => b[1] - a[1])
    // 	.slice(0, 3);

    // const dCount = data.reduce((acc, d) => { // Removed unused calculation
    // 	if (d.department) {
    // 		acc[d.department] = (acc[d.department] || 0) + (d.leavers || 0);
    // 	}
    // 	return acc;
    // }, {});
    // const tDepts = Object.entries(dCount) // Removed unused calculation
    // 	.sort((a, b) => b[1] - a[1])
    // 	.slice(0, 3);

    return {
      ytdAttrition: attrition,
      avgLeaverTenure: tenure,
      // topReasons: tReasons,
      // topDepartments: tDepts,
      reasonsCount: rCount,
    };
  }, [leaverData]);

  // const leaverLineData = useMemo(() => { // Removed unused chart data
  // 	const data = leaverData || [];
  // 	const monthsOrdered = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 	const dataMap = data.reduce((acc, d) => {
  // 		if (!d.month) return acc;
  // 		const monthData = acc[d.month] || { month: d.month, leavers: 0, totalAttrition: 0, count: 0 };
  // 		monthData.leavers += (d.leavers || 0);
  // 		monthData.totalAttrition += (d.attritionRate || 0);
  // 		monthData.count += 1;
  // 		acc[d.month] = monthData;
  // 		return acc;
  // 	}, {});

  // 	return monthsOrdered
  // 		.map(m => dataMap[m])
  // 		.filter(Boolean)
  // 		.map(d => ({
  // 			month: d.month,
  // 			leavers: d.leavers,
  // 			attrition: (d.totalAttrition / (d.count || 1)).toFixed(1)
  // 		}));

  // }, [leaverData]);

  const leaverStackedData = useMemo(() => {
    const data = leaverData || [];
    const monthsOrdered = [
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

    const stackedMap = data.reduce((acc, d) => {
      if (!d.month) return acc;
      let existing = acc[d.month];
      if (!existing) {
        existing = { month: d.month };
        acc[d.month] = existing;
      }
      if (d.reason) {
        existing[d.reason] = (existing[d.reason] || 0) + (d.leavers || 0);
      }
      return acc;
    }, {});

    return monthsOrdered.map((m) => stackedMap[m]).filter(Boolean);
  }, [leaverData]);

  // const leaverPieData = useMemo(() => { // Removed unused chart data
  // 	const data = leaverData || [];
  // 	const voluntaryCount = data.filter(d => d.voluntary).reduce((acc, d) => acc + (d.leavers || 0), 0);
  // 	const involuntaryCount = data.filter(d => !d.voluntary).reduce((acc, d) => acc + (d.leavers || 0), 0);

  // 	return [
  // 		{ name: "Voluntary", value: voluntaryCount },
  // 		{ name: "Involuntary", value: involuntaryCount },
  // 	];
  // }, [leaverData]);

  // --- Engagement KPIs & Charts ---
  const engagementCategories = [
    "Leadership",
    "Recognition",
    "Growth",
    "WorkLifeBalance",
  ];

  const {
    overallEngagement,
    highestDept,
    lowestDept,
    weakestCategory,
    engagementRadarData,
    engagementBarData,
    // engagementLineData, // Removed unused chart data
    // latestEngagementMonth // Removed unused KPI
  } = useMemo(() => {
    const data = engagementData;
    const categories = engagementCategories;

    if (data.length === 0) {
      return {
        overallEngagement: 0,
        highestDept: { department: "N/A", score: 0 },
        lowestDept: { department: "N/A", score: 0 },
        weakestCategory: { category: "N/A", score: 0 },
        engagementRadarData: categories.map((cat) => ({
          category: cat,
          score: 0,
        })),
        engagementBarData: [],
        engagementLineData: [],
        latestEngagementMonth: "N/A",
      };
    }

    const months = [...new Set(data.map((d) => d.Month))];
    const latestMonth = months[months.length - 1] || "N/A";

    const overall =
      data.reduce((sum, d) => sum + d.EngagementScore, 0) / data.length;

    const radarData = categories.map((cat) => ({
      category: cat,
      score:
        data.reduce((sum, d) => sum + (d[cat] || 0), 0) / data.length,
    }));

    const barData = data
      .filter((d) => d.Month === latestMonth)
      .map((d) => ({ department: d.Department, score: d.EngagementScore }));

    const lineData = months.map((month) => {
      const monthlyData = data.filter((d) => d.Month === month);
      return {
        month,
        engagement:
          monthlyData.reduce((sum, d) => sum + d.EngagementScore, 0) /
          (monthlyData.length || 1),
      };
    });

    const highDept =
      barData.length > 0
        ? barData.reduce((a, b) => (a.score > b.score ? a : b))
        : { department: "N/A", score: 0 };

    const lowDept =
      barData.length > 0
        ? barData.reduce((a, b) => (a.score < b.score ? a : b))
        : { department: "N/A", score: 0 };

    const weakCat =
      radarData.length > 0
        ? radarData.reduce((a, b) => (a.score < b.score ? a : b))
        : { category: "N/A", score: 0 };

    return {
      overallEngagement: overall.toFixed(1),
      highestDept: {
        department: highDept.department,
        score: highDept.score.toFixed(1),
      },
      lowestDept: {
        department: lowDept.department,
        score: lowDept.score.toFixed(1),
      },
      weakestCategory: {
        category: weakCat.category,
        score: weakCat.score.toFixed(1),
      },
      engagementRadarData: radarData.map((d) => ({
        ...d,
        score: parseFloat(d.score.toFixed(1)),
      })),
      engagementBarData: barData.map((d) => ({
        ...d,
        score: parseFloat(d.score.toFixed(1)),
      })),
      engagementLineData: lineData.map((d) => ({
        ...d,
        engagement: parseFloat(d.engagement.toFixed(1)),
      })),
      latestEngagementMonth: latestMonth,
    };
  }, [engagementData]);

  // --- Key Metrics KPIs & Charts ---
  const {
    filteredPerformance,
    filteredAbsenteeism,
    filteredHeadcount,
  } = useMemo(() => {
    const { department } = globalFilters;

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

    return { filteredPerformance, filteredAbsenteeism, filteredHeadcount };
  }, [performance, absenteeism, headcount, globalFilters.department]);

  const {
    currentHeadcount,
    avgAbsenteeism,
    avgPerfRating,
    absenteeismChartData,
    // performanceChartData, // Removed unused chart data
    headcountChartData,
  } = useMemo(() => {
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
    const absenteeismChartData = months
      .map((m) => ({
        month: m,
        percent:
          filteredAbsenteeism.find((d) => d.month === m)?.absenteeismPercent ||
          0,
      }))
      .filter((d) => d.percent > 0);

    const performanceChartData = filteredPerformance.map((d) => ({
      department: d.department,
      rating: d.avgRating,
    }));

    const headcountChartData = months
      .map((m) => {
        const row = filteredHeadcount.find((d) => d.month === m);
        return {
          month: m,
          hires: row?.hires || 0,
          leavers: row?.leavers || 0,
          net: row?.netHeadcount || 0,
        };
      })
      .filter((d) => d.hires > 0 || d.leavers > 0 || d.net > 0);

    return {
      currentHeadcount,
      avgAbsenteeism,
      avgPerfRating,
      absenteeismChartData,
      performanceChartData,
      headcountChartData,
    };
  }, [filteredPerformance, filteredAbsenteeism, filteredHeadcount]);

  // --- Payroll KPIs & Charts ---
  const {
    payrollKPIs,
    payrollChartData,
    payrollPieData,
    // latestPayrollMonth // Removed unused KPI
  } = useMemo(() => {
    const data = payrollData;
    if (data.length === 0) {
      return {
        payrollKPIs: {
          avgPayrollPerEmployee: 0,
          payrollGrowth: 0,
          fixedPercent: 0,
          variablePercent: 0,
        },
        payrollChartData: [],
        payrollPieData: [
          { name: "Fixed", value: 0 },
          { name: "Variable", value: 0 },
        ],
        latestPayrollMonth: "N/A",
      };
    }

    const chartData = data.map((d) => ({
      month: d.month,
      basic: d.basic,
      allowances: d.allowances,
      overtime: d.overtime,
      bonus: d.bonus,
      incentives: d.incentives,
      totalPayroll: d.totalPayroll,
    }));

    const latest = data[data.length - 1] || {};
    const fixed = Number(latest.basic) || 0;
    const variable =
      (Number(latest.allowances) || 0) +
      (Number(latest.overtime) || 0) +
      (Number(latest.bonus) || 0) +
      (Number(latest.incentives) || 0);

    const totalPayroll = latest.totalPayroll || 0;
    const headcount = latest.headcount || 1;

    const avgPayrollPerEmployee = (totalPayroll / headcount).toFixed(0);

    const payrollGrowth =
      data.length < 2
        ? "0"
        : (() => {
            const last = data[data.length - 1].totalPayroll;
            const secondLast = data[data.length - 2].totalPayroll;
            if (secondLast === 0) return last > 0 ? "100" : "0";
            return (((last - secondLast) / secondLast) * 100).toFixed(1);
          })();

    const fixedPercent = ((fixed / (fixed + variable || 1)) * 100).toFixed(1);
    const variablePercent = (
      (variable / (fixed + variable || 1)) *
      100
    ).toFixed(1);

    const pieData = [
      { name: "Fixed", value: fixed || 0 },
      { name: "Variable", value: variable || 0 },
    ];

    return {
      payrollKPIs: {
        avgPayrollPerEmployee,
        payrollGrowth,
        fixedPercent,
        variablePercent,
      },
      payrollChartData: chartData,
      payrollPieData: pieData,
      latestPayrollMonth: latest.month || "N/A",
    };
  }, [payrollData]);

  // --- Training KPIs & Charts ---
  const {
    trainingKpis,
    trainingBarData,
    trainingDonutData,
    // trainingLineData // Removed unused chart data
  } = useMemo(() => {
    const summary = trainingSummary;
    const k = summary?.kpis || {
      avgTrainingHoursPerEmployee: 0,
      trainingParticipationPercent: 0,
      mostCommonTrainingTypes: [],
    };
    const kpis = {
      avgHoursPerEmployee: (k.avgTrainingHoursPerEmployee || 0).toFixed(1),
      participationPercent: Math.round(
        k.trainingParticipationPercent || 0
      ),
      mostCommonTypes: k.mostCommonTrainingTypes || [],
    };

    const barData = (summary?.byDepartment || []).map((d) => ({
      department: d.department,
      trainings: Number(d.trainingsConducted || 0),
      hours: Number(d.trainingHours || 0),
      avgParticipation: Number(d.avgParticipation || 0),
    }));

    const donutData = (summary?.byType || []).map((t, idx) => ({
      trainingType: t.trainingType,
      hours: Number(t.hours || 0),
      fill: COLORS[idx % COLORS.length],
    }));

    const monthOrder = [
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
    const dict = {};
    (summary?.byMonth || []).forEach((m) => {
      dict[m.month] = {
        month: m.month,
        participation: Number(m.avgParticipation || 0),
      };
    });
    const lineData = monthOrder.filter((m) => dict[m]).map((m) => dict[m]);

    return {
      trainingKpis: kpis,
      trainingBarData: barData,
      trainingDonutData: donutData,
      trainingLineData: lineData,
    };
  }, [trainingSummary]);

  // --- Consolidated KPI List (REDUCED TO ESSENTIALS) ---
  const allKpis = [
    // Demographics (1)
    {
      title: "Total Employees",
      value: totalEmployees,
      color: CORP_BLUE,
    },
    // Demographics (1)
    {
      title: "Gender Diversity (♀ %)",
      value: `${genderDiversity}%`,
      color: CORP_PINK,
    },
    // Metrics (1)
    {
      title: "Absenteeism %",
      value: avgAbsenteeism + "%",
      color: CORP_AMBER,
    },
    // Metrics (1)
    {
      title: "Avg Performance Rating",
      value: avgPerfRating,
      color: CORP_GREEN,
    },
    // Leavers (1)
    {
      title: "YTD Attrition %",
      value: `${ytdAttrition} %`,
      color: CORP_RED,
    },
    // Engagement (1)
    {
      title: "Overall Engagement",
      value: `${overallEngagement}%`,
      color: CORP_GREEN,
    },
    // Payroll (1)
    {
      title: "Avg Payroll / Employee",
      value: `${payrollKPIs.avgPayrollPerEmployee} RS`,
      color: CORP_SLATE,
    },
    // Payroll (1)
    {
      title: "Payroll Growth % (MoM)",
      value: `${payrollKPIs.payrollGrowth}%`,
      color: CORP_SLATE,
    },
    // Training (1)
    {
      title: "Training Participation",
      value: `${trainingKpis.participationPercent}%`,
      color: CORP_TEAL,
    },
  ];

  // Helper function to update global filters (Kept for function integrity)
  const handleFilterChange = (key, value) => {
    setGlobalFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "department" && value === "All" && { designation: "All" }),
    }));
  };

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        {/* Removed h-screen to allow content to dictate height, but overflow hidden for main content area. */}
        <div className="flex bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          {/* Change flex-1 overflow-auto to just overflow-hidden to force single page. */}
          <main className="flex-1 overflow-hidden text-gray-800 dark:text-gray-200">
            <div className="p-4 sm:p-6">
              {/* Header and Controls */}
              <div className="flex justify-between items-center rounded-xl dark:bg-gray-800 mb-4">
                <div className="flex items-center">
                  <img src={logo} alt="MMCL Logo" className="h-8 w-56" />
                </div>

                <div className="flex-grow text-center">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-300">
                    {name}'s Dashboard
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md"
                  >
                    {darkMode ? (
                      <FaSun className="text-yellow-400" />
                    ) : (
                      <FaMoon className="text-gray-800" />
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                    title="Logout"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              </div>

              {/* --- KPI Cards (Reduced to 9) --- */}
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2 mb-4">
                {allKpis.map((kpi, idx) => (
                  <KpiCard
                    key={kpi.title + idx}
                    title={kpi.title}
                    value={kpi.value}
                    color={kpi.color}
                  />
                ))}
              </div>

              <ErrorBoundary>
                {/* Main Dashboard Grid: Increased to 6 Columns on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  {/* --- 1. Gender Ratio (Pie) --- */}
                  <div className="dark:bg-gray-800 bg-white p-3 rounded-xl shadow-lg lg:col-span-1">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      ⚧ Gender Ratio
                    </h2>
                    <div className="relative w-full h-40 flex items-center justify-center">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={genderData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={2}
                            labelLine={false}
                            isAnimationActive={false}
                          >
                            {genderData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={index === 0 ? BLUE : PINK}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(v, name) => [`${v} employees`, name]}
                            contentStyle={tooltipStyle}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center">
                          <FaMale className="text-blue-800 text-xl" />
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-300">
                            {maleCount}
                          </span>
                          <FaFemale className="text-pink-600 text-xl" />
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-300">
                            {femaleCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- 2. Age Distribution (Bar) --- */}
                  <div className="bg-white p-3 rounded-xl shadow-md dark:bg-gray-800 lg:col-span-1">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      👥 Age Group Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart
                        data={ageData}
                        margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="bucket"
                          tick={{ fill: tickColor, fontSize: 10 }}
                        />
                        <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="count" fill={AMBER} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* --- 3. Education Levels (Bar) --- */}
                  <div className="bg-white p-3 rounded-xl shadow-md dark:bg-gray-800 lg:col-span-1">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      🎓 Education Levels
                    </h2>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart
                        data={eduData}
                        margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: tickColor, fontSize: 10 }}
                        />
                        <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="value" fill={SLATE} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* --- 4. Department Headcount (Stacked Bar) --- */}
                  <div className="bg-white p-3 rounded-xl shadow-md dark:bg-gray-800 lg:col-span-1">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      🏢 Department Headcount
                    </h2>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart
                        data={deptData}
                        margin={{ top: 5, right: 0, left: -30, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="_id"
                          tick={{ fill: tickColor, fontSize: 10 }}
                        />
                        <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend
                          wrapperStyle={{ color: tickColor, fontSize: 10 }}
                        />
                        <Bar dataKey="male" stackId="a" fill={BLUE} />
                        <Bar dataKey="female" stackId="a" fill={PINK} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* --- 5. Hiring Trend (Line) --- */}
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md lg:col-span-2">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      📈 Hiring Trend Over Time
                    </h2>
                    {lineData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={160}>
                        <LineChart
                          data={lineData}
                          margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: tickColor, fontSize: 10 }}
                          />
                          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line
                            type="monotone"
                            dataKey="hires"
                            stroke={GREEN}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-gray-400 text-center py-6 text-sm">
                        No data available
                      </div>
                    )}
                  </div>

                  {/* --- 6. Recruitment Funnel (Bar-equivalent - using BarChart for space) --- */}
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md lg:col-span-2">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      🎯 Recruitment Funnel
                    </h2>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart
                        layout="vertical"
                        data={funnelData}
                        margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number"
                          tick={{ fill: tickColor, fontSize: 10 }}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fill: tickColor, fontSize: 10 }}
                        />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="value" fill={TEAL} />
                        <Legend
                          wrapperStyle={{ color: tickColor, fontSize: 10 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* --- 7. Issues Over Months (Line) --- */}
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md lg:col-span-2">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      📈 HR Issues Over Months
                    </h2>
                    {HrOperationlineData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={160}>
                        <LineChart
                          data={HrOperationlineData}
                          margin={{ top: 5, right: 0, left: -30, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: tickColor, fontSize: 10 }}
                          />
                          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend
                            wrapperStyle={{ color: tickColor, fontSize: 10 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="issuesRaised"
                            name="Raised"
                            stroke={RED}
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="issuesResolved"
                            name="Resolved"
                            stroke={BLUE}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-gray-400 text-center py-6 text-sm">
                        No data available
                      </div>
                    )}
                  </div>

                  {/* --- 13. Payroll Trend (Stacked Bar) --- */}
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md lg:col-span-2">
                    <h2 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 text-sm truncate">
                      📈 Total Payroll Trend
                    </h2>
                    {payrollChartData && payrollChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart
                          data={payrollChartData}
                          margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: tickColor, fontSize: 10 }}
                          />
                          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend
                            wrapperStyle={{ color: tickColor, fontSize: 10 }}
                          />
                          <Bar dataKey="basic" stackId="a" fill={BLUE} />
                          <Bar dataKey="allowances" stackId="a" fill={TEAL} />
                          <Bar dataKey="overtime" stackId="a" fill={AMBER} />
                          <Bar dataKey="bonus" stackId="a" fill={GREEN} />
                          {/* <Bar dataKey="incentives" stackId="a" fill={PURPLE} /> */}
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-gray-400 text-center py-6 text-sm">
                        No payroll data available
                      </div>
                    )}
                  </div>

                  {/* --- 10. Reasons for Leaving (Stacked Bar) --- */}
                  <div className="bg-white p-3 rounded-xl shadow-md dark:bg-gray-800 lg:col-span-2">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      📊 Reasons for Leaving
                    </h2>
                    {leaverStackedData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart
                          data={leaverStackedData}
                          margin={{ top: 5, right: 0, left: -30, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: tickColor, fontSize: 10 }}
                          />
                          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend
                            wrapperStyle={{ color: tickColor, fontSize: 10 }}
                          />
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
                      <div className="text-gray-400 text-center py-6 text-sm">
                        No data available
                      </div>
                    )}
                  </div>

                  {/* --- 11. Absenteeism Trend (Line) --- */}
                  <div className="bg-white p-3 rounded-xl shadow-md dark:bg-gray-800 lg:col-span-1">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      📉 Absenteeism Trend
                    </h2>
                    {absenteeismChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={160}>
                        <LineChart
                          data={absenteeismChartData}
                          margin={{ top: 5, right: 0, left: -30, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: tickColor, fontSize: 10 }}
                          />
                          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line
                            type="monotone"
                            dataKey="percent"
                            name="Absenteeism %"
                            stroke={RED}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-gray-400 text-center py-6 text-sm">
                        No data available
                      </div>
                    )}
                  </div>

                  {/* --- 12. Headcount Trend (Multi-Line) --- */}
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md lg:col-span-3">
                    <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 truncate">
                      👥 Headcount Trend
                    </h2>
                    {headcountChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={160}>
                        <LineChart
                          data={headcountChartData}
                          margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: tickColor, fontSize: 10 }}
                          />
                          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend
                            wrapperStyle={{ color: tickColor, fontSize: 10 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="hires"
                            stroke={GREEN}
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="leavers"
                            stroke={RED}
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="net"
                            name="Net Headcount"
                            stroke={BLUE}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-gray-400 text-center py-6 text-sm">
                        No data available
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
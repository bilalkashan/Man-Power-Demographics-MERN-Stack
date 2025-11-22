import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaBars, FaMale, FaFemale, FaMoon, FaSun } from "react-icons/fa";
import api from "../../api";
import Sidebar from "../../components/Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Treemap,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useTheme } from "../../components/ThemeContext";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ErrorBoundary from "../../components/ErrorBoundary";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Footer from "../../components/Footer";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const COLORS = [
  "#2563EB",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#9333EA",
  "#DC2626",
  "#8B5CF6",
];

export default function DemographicsDashboard({ userRole }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({
    year: "All",
    department: "All",
    designation: "All",
    education: "All",
    province: "All",
  });

  const [options, setOptions] = useState({
    departments: [],
    designations: [],
    years: [],
    educations: [],
    provinces: [],
  });

  // Dark mode
  const { darkMode, toggleDarkMode } = useTheme();

  const totalEmployees = rawData?.length || 0;
  const maleCount = rawData.filter((d) => d.Gender === "Male").length;
  const femaleCount = rawData.filter((d) => d.Gender === "Female").length;
  const genderDiversity = totalEmployees
    ? ((femaleCount / totalEmployees) * 100).toFixed(1)
    : 0;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const avgAge = totalEmployees
    ? (
        rawData.reduce((acc, d) => acc + (Number(d.Age) || 0), 0) /
        totalEmployees
      ).toFixed(1)
    : 0;
  const avgTenure = totalEmployees
    ? (
        rawData.reduce((acc, d) => acc + (Number(d.Tenure) || 0), 0) /
        totalEmployees
      ).toFixed(1)
    : 0;

  const buildQuery = () =>
    Object.entries(filters)
      .filter(([k, v]) => v && v !== "All")
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");

  const fetchData = async () => {
    try {
      const q = buildQuery();
      const [dataRes, sumRes] = await Promise.all([
        api.get(`/demographics/demographics-data?${q}`),
        api.get(`/demographics/demographics-summary?${q}`)
      ]);
      setRawData(dataRes.data || []);
      setSummary(sumRes.data || null);
    } catch (err) {
      handleError("Failed to fetch demographics data: " + err.message);
    }
  };

  const fetchFilters = async () => {
    try {
      const res = await api.get("/demographics/demographics-filters");
      setOptions({
        departments: res.data.departments || [],
        designations: res.data.designations || [],
        years: (res.data.years || []).map((y) => String(y)),
        educations: res.data.educations || [],
        provinces: res.data.provinces || [],
      });
    } catch (err) {
      handleError("Failed to load filter options");
    }
  };
  
  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleUpload = async () => {
    if (!file) return handleError("⚠️ Please select a file!");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/demographics/upload", formData);
      handleSuccess(res.data.message || "Upload successful");
      await fetchFilters();
      await fetchData();
      setFile(null);
    } catch (err) {
      console.error(err);
      handleError("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const ageData = summary?.ageAgg || [];
  const tenureData = summary?.tenureAgg || [];
  const eduData = (summary?.eduAgg || []).map((e) => ({
    name: e._id || "Unknown",
    value: e.count || 0,
  }));
  const deptData = summary?.deptAgg || [];

  const genderData =
    summary?.genderAgg?.map((g) => ({
      name: g._id || "Unknown",
      value: g.count || 0,
    })) || [];

  const cityPieData =
    summary?.cityAgg?.map((c) => ({
      name: c._id || "Unknown",
      value: c.count,
    })) || [];

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          <Sidebar
            role={userRole}
            active="Demographics"
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
                  Demographics
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

            {/* Filter Bar */}
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
              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <select
                  value={filters.year}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, year: e.target.value }))
                  }
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
                >
                  <option value="All">All Years</option>
                  {options.years?.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.department}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, department: e.target.value }))
                  }
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
                >
                  <option value="All">All Departments</option>
                  {options.departments?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.designation}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, designation: e.target.value }))
                  }
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
                >
                  <option value="All">All Designations</option>
                  {options.designations?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.education}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, education: e.target.value }))
                  }
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
                >
                  <option value="All">All Education</option>
                  {options.educations?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.province}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, province: e.target.value }))
                  }
                  className="rounded-full border px-4 py-2 shadow-md bg-white hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 flex-grow sm:flex-grow-0"
                >
                  <option value="All">All Provinces</option>
                  {options.provinces?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: "Gender Diversity (♀ %)",
                  value: `${genderDiversity}%`,
                  color: "from-pink-500 to-red-600",
                },
                {
                  title: "Avg Employee Age",
                  value: `${avgAge} yrs`,
                  color: "from-indigo-500 to-blue-600",
                },
                {
                  title: "Avg Tenure",
                  value: `${avgTenure} yrs`,
                  color: "from-green-500 to-emerald-600",
                },
                {
                  title: "Total Employees",
                  value: `${totalEmployees}`,
                  color: "from-amber-500 to-yellow-600",
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Gender Ratio */}
                <motion.div
                  className="dark:bg-gray-800 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                    ⚧ Gender Ratio
                  </h2>
                  <div className="relative w-full h-72 flex items-center justify-center dark:bg-gray-800">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={genderData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={4}
                          labelLine={false}
                          isAnimationActive
                          animationBegin={0}
                          animationDuration={1200}
                        >
                          {genderData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              className="transition-transform duration-300 hover:scale-105"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v, name) => [`${v} employees`, name]}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #eee",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex items-center">
                        <div className="flex flex-col items-center px-2">
                          <FaMale className="text-blue-800 text-5xl sm:text-6xl" />
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-lg font-bold text-gray-800 dark:text-gray-300"
                          >
                            {maleCount}
                          </motion.span>
                        </div>
                        <div className="flex flex-col items-center px-2">
                          <FaFemale className="text-pink-600 text-5xl sm:text-6xl" />
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-lg font-bold text-gray-800 dark:text-gray-300"
                          >
                            {femaleCount}
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-gray-700 font-semibold text-md dark:text-gray-300">
                    Total Employees: {maleCount + femaleCount}
                  </div>
                </motion.div>

                {/* Age Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-md dark:bg-gray-800">
                  <div className="flex justify-between mb-2">
                    <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                      🎂 Age Group Distribution
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={ageData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bucket" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS[3]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Tenure Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-md dark:bg-gray-800">
                  <div className="flex justify-between mb-2">
                    <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                      ⌛ Tenure Distribution
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      layout="vertical"
                      data={tenureData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="bucket" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Education Levels */}
                <div className="bg-white p-6 rounded-2xl shadow-md dark:bg-gray-800">
                  <div className="flex justify-between mb-2">
                    <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                      🎓 Education Levels
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={eduData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={COLORS[4]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Department Headcount */}
                <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 dark:bg-gray-800">
                  <div className="flex justify-between mb-2">
                    <h2 className="font-semibold mb-6 text-gray-700 dark:text-gray-300">
                      🏢 Department Headcount
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deptData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="male" stackId="a" fill={COLORS[0]} />
                      <Bar dataKey="female" stackId="a" fill={COLORS[1]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Workforce by Location */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between mb-5 ">
                    <h2 className="font-semibold text-gray-700 dark:text-gray-300">
                      🗺 Workforce by Location
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
                      Live Data
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                    {/* Map */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="h-[450px] rounded-xl overflow-hidden shadow-md border border-gray-200"
                    >
                      <MapContainer
                        center={[30.3753, 69.3451]} // Pakistan center
                        zoom={5}
                        style={{ height: "100%", width: "100%" }}
                        className="z-0"
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MarkerClusterGroup chunkedLoading>
                          {summary?.cityAgg?.map(
                            (loc, i) =>
                              loc.lat &&
                              loc.lon && (
                                <Marker
                                  key={i}
                                  position={[loc.lat, loc.lon]}
                                >
                                  <Popup>
                                    <h3 className="font-bold text-gray-800 ">
                                      {loc._id}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      Employees:{" "}
                                      <span className="font-semibold">
                                        {loc.count}
                                      </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {loc.percentage}% of total
                                    </p>
                                  </Popup>
                                </Marker>
                              )
                          )}
                        </MarkerClusterGroup>
                      </MapContainer>
                    </motion.div>

                    {/* Donut */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.7,
                        ease: "easeOut",
                        delay: 0.2,
                      }}
                      className="flex flex-col justify-center items-center bg-white rounded-xl shadow-md p-5 dark:bg-gray-800"
                    >
                      <h3 className="font-semibold text-gray-700 mb-3 text-lg dark:text-gray-300">
                        📊 Employee Distribution by City
                      </h3>
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={cityPieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={120}
                            paddingAngle={4}
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            animationBegin={0}
                            animationDuration={1200}
                          >
                            {cityPieData.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={COLORS[i % COLORS.length]}
                                className="transition-transform duration-200 hover:scale-105"
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(v, name) => [`${v} employees`, name]}
                            contentStyle={{
                              borderRadius: "12px",
                              border: "1px solid #eee",
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: "12px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </ErrorBoundary>
            <Footer />
          </main>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
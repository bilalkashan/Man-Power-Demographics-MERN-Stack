import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, Clock, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "All Job Category",
    type: "All Job Type",
    location: "All Job Location",
  });
  const [categories, setCategories] = useState(["All Job Category"]);
  const [types, setTypes] = useState(["All Job Type"]);
  const [locations, setLocations] = useState(["All Job Location"]);

  // Fetch Jobs on Filter Change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Convert filters to query string
        const params = new URLSearchParams();
        if (filters.keyword) params.append("keyword", filters.keyword);
        if (filters.category !== "All Job Category")
          params.append("category", filters.category);
        if (filters.type !== "All Job Type")
          params.append("type", filters.type);
        if (filters.location !== "All Job Location")
          params.append("location", filters.location);

        const res = await api.get(`/jobs?${params.toString()}`);
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [filters]);

  // Fetch all jobs once to derive dynamic filter options
  useEffect(() => {
    const fetchAllForFilters = async () => {
      try {
        const res = await api.get("/jobs");
        const all = res.data || [];

        const cats = new Set();
        const typs = new Set();
        const locs = new Set();

        all.forEach((j) => {
          if (j.category) cats.add(j.category);
          if (j.type) typs.add(j.type);
          if (j.location) locs.add(j.location);
        });

        setCategories(["All Job Category", ...Array.from(cats).sort()]);
        setTypes(["All Job Type", ...Array.from(typs).sort()]);
        setLocations(["All Job Location", ...Array.from(locs).sort()]);
      } catch (err) {
        console.error("Error fetching jobs for filters", err);
      }
    };
    fetchAllForFilters();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* 1. Header / Search Section */}
      <div className="bg-primary py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Find Your Dream Job
          </h1>

          {/* Search Bar & Filters Container */}
          <div className="bg-white p-4 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Keyword Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                placeholder="Search job title..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                onChange={handleFilterChange}
              />
            </div>

            {/* Category Filter */}
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Job Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <div className="text-center text-gray-500 py-10">
              No jobs found matching your criteria.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// --- Sub Component: Job Card ---
const JobCard = ({ job }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-center group">
    <div className="mb-4 md:mb-0 text-center md:text-left">
      <h3 className="text-xl font-bold text-primary group-hover:text-accent transition">
        {job.title}
      </h3>
      <div className="flex flex-col md:flex-row items-center text-sm text-gray-500 mt-2 space-y-1 md:space-y-0 md:space-x-4">
        <span className="flex items-center">
          <Briefcase className="w-4 h-4 mr-1" /> {job.category}
        </span>
        <span className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" /> {job.location}
        </span>
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" /> {job.type}
        </span>
      </div>
    </div>

    <Link
      to={`/jobs/${job._id}`}
      className="px-6 py-2 bg-blue-50 text-accent font-bold rounded-full hover:bg-accent hover:text-white transition"
    >
      More Details
    </Link>
  </div>
);

export default Jobs;

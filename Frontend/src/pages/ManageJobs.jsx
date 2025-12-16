import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Edit2, X, Search, Plus } from "lucide-react";
import api from "../api";
import { toast } from "react-toastify";
import AdminLayout from "../admin/AdminLayout";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search and status
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((j) => j.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      setJobs(res.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?"))
      return;

    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.patch(`/jobs/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setJobs(jobs.map((j) => (j._id === id ? res.data.job : j)));
        toast.success(`Job marked as ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsViewing(true);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Manage Jobs">
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-600">Loading jobs...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Manage Jobs">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Jobs</h1>
        <p className="text-gray-600">View, close, and delete job postings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Jobs" value={jobs.length} color="bg-blue-500" />
        <StatCard
          label="Active"
          value={jobs.filter((j) => j.status === "Active").length}
          color="bg-green-600"
        />
        <StatCard
          label="Closed"
          value={jobs.filter((j) => j.status === "Closed").length}
          color="bg-red-600"
        />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No jobs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Posted Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <motion.tr
                    key={job._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.type}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={job.status || "Active"}
                        onChange={(e) =>
                          handleStatusChange(job._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(
                          job.status || "Active"
                        )}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(job.postedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(job)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setShowModal(false);
                setIsViewing(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedJob.title}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedJob.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedJob.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Type</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedJob.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Salary</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedJob.salary || "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Description
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Requirements
                </p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedJob.requirements || "Not specified"}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Posted on:{" "}
                  {new Date(selectedJob.postedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsViewing(false);
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color }) => (
  <motion.div
    whileHover={{ translateY: -5 }}
    className={`${color} text-white rounded-lg shadow-md p-6 text-center`}
  >
    <p className="text-sm font-medium opacity-90">{label}</p>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </motion.div>
);

export default ManageJobs;

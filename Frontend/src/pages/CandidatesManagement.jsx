import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  Edit2,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import api from "../api";
import { toast } from "react-toastify";
import AdminLayout from "../admin/AdminLayout";

const CandidatesManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    status: "Applied",
  });

  // Fetch candidates on mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Filter candidates based on search and status
  useEffect(() => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, statusFilter]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications");
      setCandidates(res.data.applications || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;

    try {
      await api.delete(`/applications/${id}`);
      setCandidates(candidates.filter((c) => c._id !== id));
      toast.success("Candidate deleted successfully");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Failed to delete candidate");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await api.patch(`/applications/${id}/status`, {
        status: newStatus,
      });
      setCandidates(
        candidates.map((c) => (c._id === id ? res.data.application : c))
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      candidateName: candidate.candidateName,
      candidateEmail: candidate.candidateEmail,
      candidatePhone: candidate.candidatePhone || "",
      status: candidate.status,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewResume = (candidate) => {
    if (candidate.resume) {
      window.open(`http://localhost:8080${candidate.resume}`, "_blank");
    } else {
      toast.error("No resume available");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await api.patch(
          `/applications/${selectedCandidate._id}/status`,
          {
            status: formData.status,
          }
        );
        setCandidates(
          candidates.map((c) =>
            c._id === selectedCandidate._id ? res.data.application : c
          )
        );
        toast.success("Candidate updated successfully");
      }
      setShowModal(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save changes");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Reviewed":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Loading candidates...</p>
      </div>
    );
  }

  return (
    <AdminLayout pageTitle="Candidates Management">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Candidates"
          value={candidates.length}
          color="bg-blue-500"
        />
        <StatCard
          label="Applied"
          value={candidates.filter((c) => c.status === "Applied").length}
          color="bg-blue-600"
        />
        <StatCard
          label="Shortlisted"
          value={candidates.filter((c) => c.status === "Shortlisted").length}
          color="bg-green-600"
        />
        <StatCard
          label="Hired"
          value={candidates.filter((c) => c.status === "Hired").length}
          color="bg-purple-600"
        />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
            <option value="Applied">Applied</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredCandidates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No candidates found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Applied For
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <motion.tr
                    key={candidate._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {candidate.candidateName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {candidate.candidateEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {candidate.candidatePhone || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {candidate.jobId?.title || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={candidate.status}
                        onChange={(e) =>
                          handleStatusUpdate(candidate._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(
                          candidate.status
                        )}`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Hired">Hired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(candidate.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewResume(candidate)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                          title="View Resume"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(candidate._id)}
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

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Edit Candidate
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) =>
                    setFormData({ ...formData, candidateName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.candidateEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, candidateEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Applied">Applied</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
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

export default CandidatesManagement;

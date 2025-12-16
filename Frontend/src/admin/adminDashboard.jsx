import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  MessageSquare,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";
import api from "../api";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    contacts: 0,
    recentActivity: [],
  });
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) setName(user.name);
  }, []);

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const res = await api.get("/jobs/stats/dashboard");
        setStats(res.data);
      } catch (error) {
        console.log("Using fallback data for design...");
        // Fallback data if backend isn't ready
        setStats({
          jobs: 12,
          applications: 87,
          contacts: 34,
          recentActivity: [
            {
              id: 1,
              type: "Application",
              name: "Ali Khan",
              detail: "Applied for Senior Dev",
              time: "10 mins ago",
              status: "Applied",
            },
            {
              id: 2,
              type: "Contact",
              name: "TechCorp Inc.",
              detail: "Inquiry about RPO",
              time: "2 hours ago",
              status: "Pending",
            },
            {
              id: 3,
              type: "Job",
              name: "HR Executive",
              detail: "Job Post Published",
              time: "5 hours ago",
              status: "Active",
            },
            {
              id: 4,
              type: "Application",
              name: "Sara Ahmed",
              detail: "Applied for Designer",
              time: "1 day ago",
              status: "Reviewed",
            },
          ],
        });
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout pageTitle="Dashboard">
      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {name}
          </h1>
          <p className="text-gray-500">
            Here's what's happening with your recruitment today.
          </p>
        </div>
        <Link
          to="/admin/post-job"
          className="bg-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center shadow-lg transition transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5 mr-2" /> Post New Job
        </Link>
      </div>

      {/* 3. Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          count={stats.applications}
          icon={<Users className="w-8 h-8 text-blue-600" />}
          color="bg-blue-50 border-blue-100"
        />
        <StatCard
          title="Active Jobs Posted"
          count={stats.jobs}
          icon={<Briefcase className="w-8 h-8 text-emerald-600" />}
          color="bg-emerald-50 border-emerald-100"
        />
        <StatCard
          title="Contact Inquiries"
          count={stats.contacts}
          icon={<MessageSquare className="w-8 h-8 text-purple-600" />}
          color="bg-purple-50 border-purple-100"
        />
      </div>

      {/* 4. Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
          <button className="text-sm text-accent hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Name / Title</th>
                <th className="px-6 py-3">Detail</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentActivity.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {item.detail}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-xs font-semibold text-gray-600">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
                          item.status
                        )}`}
                      ></div>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

// --- Helper Components ---

const StatCard = ({ title, count, icon, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-6 rounded-xl border ${color} shadow-sm`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-4xl font-bold text-gray-800 mt-1">{count}</h3>
      </div>
      <div className="p-3 bg-white rounded-lg shadow-sm">{icon}</div>
    </div>
    
  </motion.div>
);

const getTypeColor = (type) => {
  switch (type) {
    case "Application":
      return "bg-blue-100 text-blue-700";
    case "Job":
      return "bg-green-100 text-green-700";
    case "Contact":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "bg-blue-500";
    case "Active":
      return "bg-green-500";
    case "Pending":
      return "bg-orange-500";
    default:
      return "bg-gray-400";
  }
};

export default AdminDashboard;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Users, LayoutDashboard, LogOut, Mail } from "lucide-react";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) setName(user.name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!", { duration: 2000 });
    navigate("/login");
  };

  return (
    <div className="w-64 bg-primary text-white hidden md:flex flex-col fixed h-screen left-0 top-0">
      <div className="p-6 text-2xl font-bold flex items-center">
        <Briefcase className="w-8 h-8 mr-2 text-accent" />
        {name}
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-6">
        <Link
          to="/adminDashboard"
          className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-blue-700 hover:text-white transition"
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </Link>
        <Link
          to="/admin/manage-jobs"
          className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-blue-700 hover:text-white transition"
        >
          <Briefcase className="w-5 h-5 mr-3" />
          Manage Jobs
        </Link>
        <Link
          to="/candidates"
          className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-blue-700 hover:text-white transition"
        >
          <Users className="w-5 h-5 mr-3" />
          Candidates
        </Link>
        <Link
          to="/admin/messages"
          className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-blue-700 hover:text-white transition"
        >
          <Mail className="w-5 h-5 mr-3" />
          Check Messages
        </Link>
        <Link
          to="/admin/news"
          className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-blue-700 hover:text-white transition"
        >
          <Mail className="w-5 h-5 mr-3" />
          Manage News
        </Link>
      </nav>
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-300 hover:text-white transition w-full"
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

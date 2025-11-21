import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaChartLine,
  FaSignOutAlt,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { PiMathOperationsFill } from "react-icons/pi";
import { MdSchool } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { RiUserSearchFill } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { BsFillMotherboardFill } from "react-icons/bs";
import logo from "../assets/MMC-Logo.png"; 

const sidebarItems = {
  admin: [
    { name: "Dashboard", path: "/adminDashboard" },
    { name: "Demographics", path: "/demographics-dashboard" },
    { name: "HR Operations", path: "/hr-operation-dashboard" },
    { name: "Hirings", path: "/hiring-dashboard" },
    { name: "Leavers", path: "/leavers-dashboard" },
    { name: "Training & Development", path: "/training-development-dashboard" },
    { name: "Employee Engagement", path: "/employee-engagement-dashboard" },
    { name: "Other Metrics", path: "/metrics-dashboard" },
    { name: "Payroll", path: "/payroll-dashboard" },
  ],
  user: [
    { name: "Dashboard", path: "/userDashboard" },
    { name: "Demographics", path: "/demographics-dashboard" },
    { name: "HR Operations", path: "/hr-operation-dashboard" },
    { name: "Hirings", path: "/hiring-dashboard" },
    { name: "Leavers", path: "/leavers-dashboard" },
    { name: "Training & Development", path: "/training-development-dashboard" },
    { name: "Employee Engagement", path: "/employee-engagement-dashboard" },
    { name: "Other Metrics", path: "/metrics-dashboard" },
    { name: "Payroll", path: "/payroll-dashboard" },
  ],
};

const icons = {
  Dashboard: <FaChartLine />,
  Hirings: <RiUserSearchFill />,
  Leavers: <GiExitDoor />,
  "HR Operations": <PiMathOperationsFill />,
  "Training & Development": <MdSchool />,
  Payroll: <FaMoneyCheckAlt />,
  Profile: <FaUser />,
  Demographics: <FaPeopleGroup />,
  "Employee Engagement": <IoIosCreate />,
  "Other Metrics": <BsFillMotherboardFill />,
};

const Sidebar = ({ role, active, setActive, sidebarOpen, setSidebarOpen, darkMode }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) setName(user.name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed md:relative z-50 w-64 flex flex-col h-full transform transition-transform duration-300 shadow-lg hover:shadow-md
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
      `}
    >
      {/* Logo + Header */}
      <div className="flex flex-col items-center p-6">
        <img src={logo} alt="MMC Logo" className="h-16 mb-2 object-contain" />
        <div className="w-full flex items-center">
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-gray-200" : "text-gray-800"} text-left w-full`}
          >
            {name}
          </h1>
        </div>
        <button
          className={`absolute top-4 right-4 md:hidden ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {(sidebarItems[role] || []).map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActive(item.name);
              navigate(item.path);
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full p-2 rounded-lg transition-colors
              ${
                active === item.name
                  ? darkMode
                    ? "bg-gray-700 text-white font-semibold"
                    : "bg-indigo-200 text-gray-900 font-semibold"
                  : darkMode
                  ? "hover:bg-gray-800 hover:text-indigo-300"
                  : "text-gray-700 hover:bg-indigo-100"
              }
            `}
          >
            <span className="mr-3">{icons[item.name]}</span>
            {item.name}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div
        className={`p-4 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <button
          className={`flex items-center w-full p-2 rounded-lg transition-colors
            ${darkMode ? "text-red-400 hover:bg-gray-800" : "text-red-500 hover:bg-red-100"}
          `}
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

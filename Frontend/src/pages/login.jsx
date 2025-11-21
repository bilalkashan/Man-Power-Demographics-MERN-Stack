import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../toast";
import api from "../api";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/MMC-Logo.png"; // <-- Your logo path

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      const result = res.data;

      if (result.success) {
        handleSuccess(result.message);
        const { user } = result;
        
        // Save data to local storage
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", user.role);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ 
            _id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            success: result.success 
          })
        );

        setTimeout(() => {
          // Normalize role to lowercase for comparison
          const role = user.role?.toLowerCase().trim();
          
          // --- Updated Logic Below ---
          if (role === "superadmin") {
            navigate("/superAdminDashboard");
          } else if (role === "admin") {
            navigate("/adminDashboard");
          } else if (role === "user") { 
            navigate("/userdashboard");
          } else {
            // Optional: Handle unknown roles
            navigate("/"); 
          }
          // ---------------------------
          
        }, 1000);
      } else {
        handleError(result.message || "Login failed");
      }
    } catch (err) {
      handleError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <motion.div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        >
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-13" />
          </div>

          <h2 className="text-center text-lg font-semibold text-gray-700 mb-6">
            Please sign in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email..."
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password..."
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                />
                <label htmlFor="showPassword" className="text-sm text-gray-600 cursor-pointer">
                  Show Password
                </label>
              </div>
              
              <Link
                to="/forgot-password"
                className="block text-xs text-blue-500 hover:underline mt-2 text-right"
              >
                Forgot Password?
              </Link>
         
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transform transition hover:scale-105"
            >
              Log In
            </button>

            <div className="text-center">
              <span className="mt-6 text-center text-gray-500 text-sm font-semibold">Developed by: Human Resource Department</span>
            </div>
          </form>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;

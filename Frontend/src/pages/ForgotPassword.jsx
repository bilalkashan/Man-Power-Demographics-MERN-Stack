import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from "../toast";
import { ToastContainer } from "react-toastify";
import api from "../api";
import { FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/MMC-Logo.png";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // NEW: Add a loading state to prevent multiple clicks
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Disable button

    try {
      const response = await api.post("/auth/forget", { email });
      if (response.data.success) {
        // Use the message from the backend for better security and consistency
        handleSuccess("OTP sent to your email.");

        // Delay navigation to allow the user to see the toast
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 2000); // 2-second delay
      } else {
        handleError(response.data.message || "Failed to send OTP.");
        setIsLoading(false); // Re-enable button on failure
      }
    } catch (err) {
      handleError(err.response?.data?.message || "An error occurred.");
      setIsLoading(false); // Re-enable button on error
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <motion.div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        >
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-13" />
          </div>
          <h2 className="text-center text-xl font-semibold text-gray-700 mb-2">
            Forgot Your Password?
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Enter your email and we'll send you an OTP to reset it.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
            <div className="text-center">
              <span className="mt-6 text-center text-gray-500 text-sm font-semibold">
                Developed by: Human Resource Department
              </span>
            </div>
          </form>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ForgotPassword;

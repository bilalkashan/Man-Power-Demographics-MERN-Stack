// src/pages/ResetPassword.js

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { handleSuccess, handleError } from "../toast";
import { ToastContainer } from "react-toastify";
import api from "../api";
import { motion } from "framer-motion";
import { FaKey, FaLock } from "react-icons/fa";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!email) {
      handleError("No email found. Please start the process again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleResendOtp = async () => {
    if (isResendDisabled) return;
    setIsResendDisabled(true);
    try {
      await api.post("/auth/forget", { email });
      handleSuccess("A new OTP has been sent to your email.");
      setTimer(60);
    } catch (err) {
      handleError(err.response?.data?.message || "Failed to resend OTP.");
      setIsResendDisabled(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/verify-reset-otp", { email, otp });
      if (response.data.success) {
        handleSuccess("OTP Verified! Please set your new password.");
        setIsOtpVerified(true);
      } else {
        handleError(response.data.message || "Failed to verify OTP.");
      }
    } catch (err) {
      handleError(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = passwords;

    if (password !== confirmPassword) {
      return handleError("Passwords do not match.");
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
      return handleError("Password must be 8+ chars with upper, lower, number & special char");
    }

    try {
      const response = await api.post("/auth/resetPassword", { email, otp, password });
      if (response.data.success) {
        handleSuccess("Password has been reset successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        handleError(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      handleError(err.response?.data?.message || "An error occurred.");
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
          {!isOtpVerified ? (
            <>
              <h2 className="text-center text-xl font-semibold text-gray-700 mb-2">Verify Your Identity</h2>
              <p className="text-center text-sm text-gray-500 mb-6">
                An OTP was sent to <strong>{email}</strong>.
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="relative">
                  <FaKey className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter the 6-digit OTP..."
                    value={otp}
                    onChange={handleOtpChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                  />
                </div>

                {/* MODIFIED: Combined "Back to Login" and "Resend OTP" into one line */}
                <div className="flex justify-between items-center text-sm">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled}
                    className="text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  </button>
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Back to Login &rarr;
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transform transition hover:scale-105"
                >
                  Verify OTP
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-center text-xl font-semibold text-gray-700 mb-2">Set New Password</h2>
              <p className="text-center text-sm text-gray-500 mb-6">
                Create a new, strong password for your account.
              </p>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password..."
                    value={passwords.password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password..."
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                  />
                </div>
                <div className="flex items-center gap-2 ">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                  <label htmlFor="showPassword" className="text-sm text-gray-600 cursor-pointer">Show Passwords</label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transform transition hover:scale-105"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}

          <div className="text-center mt-6">
            <span className="text-gray-500 text-sm font-semibold">Developed by: Human Resource Department</span>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ResetPassword;
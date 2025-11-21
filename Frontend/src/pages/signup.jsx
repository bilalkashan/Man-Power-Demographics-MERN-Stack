import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../toast";
import api from "../api";

function Signup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [signupInfo, setSignupInfo] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!/^[A-Za-z ]{3,}$/.test(value)) {
                    return "Name must be at least 3 letters, only alphabets allowed";
                }
                return "";
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Please enter a valid email address";
                }
                return "";
            case "password":
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value)) {
                    return "Password must be 8+ chars, include uppercase, lowercase, number, special character";
                }
                return "";
            case "confirmPassword":
                if (value !== signupInfo.password) {
                    return "Passwords do not match";
                }
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));

        // live validation
        const errorMsg = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {};
        Object.keys(signupInfo).forEach((field) => {
            newErrors[field] = validateField(field, signupInfo[field]);
        });
        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((msg) => msg);
        if (hasError) return handleError("Please fix errors before submitting");

        try {
            const { name, email, password } = signupInfo;
            const response = await api.post("/auth/signup", { name, email, password, role: "user" });
            const result = response.data;

            if (!result.success) return handleError(result.message);

            handleSuccess(result.message);
            setTimeout(() => navigate("/login"), 800);
        } catch (error) {
            console.log("Signup Error:", error);
            if (error.response && error.response.data) {
                handleError(error.response.data.message);
            } else {
                handleError("Network error. Please try again.");
            }
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Sign Up</h3>
                    <p className="text-gray-500 text-center mb-6">Create your account</p>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Name */}
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name..."
                                value={signupInfo.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email..."
                                value={signupInfo.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password..."
                                value={signupInfo.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password..."
                                value={signupInfo.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${errors.confirmPassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Toggle Show Password */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="cursor-pointer"
                            />
                            <label htmlFor="showPassword" className="text-sm text-gray-600 cursor-pointer">
                                Show Passwords
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition"
                        >
                            Sign Up
                        </button>

                        {/* Redirect to Login */}
                        <p className="text-gray-500 text-sm text-center">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default Signup;

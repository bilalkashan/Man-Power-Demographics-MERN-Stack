import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("loggedInUser");
  const publicRoutes = [
    "/",
    "/home",
    "/my-hr-admin-login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  useEffect(() => {
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, [userData]);

  if (isLoading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // If user is logged in and accessing public route, redirect to dashboard
  if (token && user && publicRoutes.includes(location.pathname)) {
    if (user.role === "admin") return <Navigate to="/adminDashboard" replace />;
  }

  // If user is NOT logged in and trying to access protected route
  if (!token || !user) {
    if (!publicRoutes.includes(location.pathname)) {
      return <Navigate to="/my-hr-admin-login" replace />;
    } else {
      return element;
    }
  }

  // Role-based route protection
  if (allowedRole && !allowedRole.includes(user.role)) {
    return (
      <h2 style={{ textAlign: "center", color: "red" }}>
        403 - Forbidden: You are not authorized
      </h2>
    );
  }

  return React.cloneElement(element, { userRole: user.role });
};

export default ProtectedRoute;

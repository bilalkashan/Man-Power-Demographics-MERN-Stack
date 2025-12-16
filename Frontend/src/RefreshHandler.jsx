import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function RefreshHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      localStorage.clear();
      navigate("/my-hr-admin-login", { replace: true });
      return;
    }

    if (token && user) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.clear();
          navigate("/my-hr-admin-login", { replace: true });
          return;
        }

        const role = user.role;
        const isOnPublicRoute = ["/", "/my-hr-admin-login", "/signup"].includes(
          location.pathname
        );

        if (isOnPublicRoute) {
          if (role === "admin") navigate("/adminDashboard", { replace: true });
        }
      } catch (err) {
        localStorage.clear();
        navigate("/my-hr-admin-login", { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
}

export default RefreshHandler;

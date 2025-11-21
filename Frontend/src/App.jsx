import './App.css'
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/login";
import Signup from "./pages/signup";
import RefreshHandler from "./RefreshHandler";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./pages/home";
import ForgotPassword from './pages/ForgotPassword'; 
import ResetPassword from './pages/ResetPassword';   

// User
import UserDashboard from "./user/userDashboard";

// Admin
import AdminDashboard from "./admin/adminDashboard";
import PayrollDashboard from "./pages/Payroll/PayrollDashboard"; 
import HiringDashboard from './pages/Hiring/HiringDashboard';
import LeaversDashboard from './pages/Leavers/LeaversDashboard';
import HrOperationsDashboard from './pages/HrOperation/HrOperationsDashboard';
import TrainingDevelopmentDashboard from './pages/TrainingDevelopment/TrainingDevelopmentDashboard';
import EngagementDashboard from './pages/Engagement/EngagementDashboard';
import DemographicsDasboard from "./pages/Demographics/DemographicsDashboard";
import MetricsDashboard from "./pages/Metrics/MetricsDashboard";
import SuperAdminDashboard from './admin/superAdminDashboard';

function App() {
  return (
    <>
      <RefreshHandler />
      <ToastContainer />
      <Routes>
        {/* Home , Login , Signup */}
        <Route path="/login" element={<ProtectedRoute element={<Login />} />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<ProtectedRoute element={<Signup />} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User */}
        <Route
          path="/userDashboard"
          element={<ProtectedRoute element={<UserDashboard />} allowedRole="user" />}
        />

        {/* Admin */}
        <Route
          path="/adminDashboard"
          element={<ProtectedRoute element={<AdminDashboard />} allowedRole="admin" />}
        />
        <Route
          path="/superAdminDashboard"
          element={<ProtectedRoute element={<SuperAdminDashboard />} allowedRole="superAdmin" />}
        />

        <Route
          path="/payroll-dashboard"
          element={<ProtectedRoute element={<PayrollDashboard />} allowedRole={["admin", "user"]}/>}
        />

        <Route
          path="/hiring-dashboard"
          element={<ProtectedRoute element={<HiringDashboard />} allowedRole={["admin", "user"]} />}
        />

        <Route
          path="/leavers-dashboard"
          element={<ProtectedRoute element={<LeaversDashboard />} allowedRole={["admin", "user"]} />}
        />

        <Route
          path="/hr-operation-dashboard"
          element={<ProtectedRoute element={<HrOperationsDashboard />} allowedRole={["admin", "user"]} />}
        />

        <Route
          path="/training-development-dashboard"
          element={<ProtectedRoute element={<TrainingDevelopmentDashboard />} allowedRole={["admin", "user"]}/>} 
        />

        <Route
          path="/employee-engagement-dashboard"
          element={<ProtectedRoute element={<EngagementDashboard />} allowedRole={["admin", "user"]}/>} 
        />

        <Route
          path="/demographics-dashboard"
          element={<ProtectedRoute element={<DemographicsDasboard />} allowedRole={["admin", "user"]}/>} 
        />

        <Route
          path="/metrics-dashboard"
          element={<ProtectedRoute element={<MetricsDashboard />} allowedRole={["admin", "user"]}/>} 
        />
      </Routes>
    </>
  );
}

export default App;

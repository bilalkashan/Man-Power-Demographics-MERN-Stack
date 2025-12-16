import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login";
import Signup from "./pages/signup";
import RefreshHandler from "./RefreshHandler";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./pages/home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Clients from "./pages/Clients";
import News from "./pages/News";
import OurTeam from "./pages/OurTeam";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import AdminCreateJob from "./pages/AdminCreateJob";
import AdminDashboard from "./admin/adminDashboard";
import CandidatesManagement from "./pages/CandidatesManagement";
import ManageJobs from "./pages/ManageJobs";
import CheckMessages from "./pages/CheckMessages";
import AdminNews from "./admin/AdminNews";

function App() {
  return (
    <>
      <RefreshHandler />
      <ToastContainer />
      <Routes>
        {/* Home , Login , Signup */}
        <Route
          path="/my-hr-admin-login"
          element={<ProtectedRoute element={<Login />} />}
        />
        <Route
          path="/adminDashboard"
          element={<ProtectedRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/candidates"
          element={<ProtectedRoute element={<CandidatesManagement />} />}
        />
        <Route
          path="/admin/manage-jobs"
          element={<ProtectedRoute element={<ManageJobs />} />}
        />
        <Route
          path="/admin/messages"
          element={<ProtectedRoute element={<CheckMessages />} />}
        />
        <Route
          path="/admin/news"
          element={<ProtectedRoute element={<AdminNews />} />}
        />
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={<ProtectedRoute element={<Signup />} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/news" element={<News />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/careers" element={<Jobs />} />{" "}
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/admin/post-job" element={<AdminCreateJob />} />
      </Routes>
    </>
  );
}

export default App;

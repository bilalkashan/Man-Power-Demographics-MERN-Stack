import express from "express";
const router = express.Router();
import {
  getJobs,
  createJob,
  getJobById,
  getAllJobs,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobController.js";
import { getDashboardStats } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";

// Public routes
router.get("/", getJobs);

// Protected / admin routes
router.post("/", verifyToken, createJob);
router.get("/all/admin", verifyToken, getAllJobs);
router.get("/stats/dashboard", verifyToken, getDashboardStats);
router.patch("/:id/status", verifyToken, updateJobStatus);
router.delete("/:id", verifyToken, deleteJob);

// Keep dynamic id route last to avoid shadowing specific routes
router.get("/:id", getJobById);

export default router;

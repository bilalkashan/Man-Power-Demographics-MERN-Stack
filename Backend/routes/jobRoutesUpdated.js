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
router.get("/:id", getJobById);

// Protected routes
router.post("/", verifyToken, createJob);
router.get("/all/admin", verifyToken, getAllJobs);
router.patch("/:id/status", verifyToken, updateJobStatus);
router.delete("/:id", verifyToken, deleteJob);
router.get("/stats/dashboard", verifyToken, getDashboardStats);

export default router;

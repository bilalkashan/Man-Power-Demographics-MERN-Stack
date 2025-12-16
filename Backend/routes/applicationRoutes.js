import express from "express";
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationsByJob,
  getApplicationCount,
} from "../controllers/applicationController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", upload.single("resume"), createApplication);

// Protected routes (require admin/auth)
router.get("/", verifyToken, getAllApplications);
router.get("/count", verifyToken, getApplicationCount);
router.get("/job/:jobId", verifyToken, getApplicationsByJob);
router.get("/:id", verifyToken, getApplicationById);
router.patch("/:id/status", verifyToken, updateApplicationStatus);
router.delete("/:id", verifyToken, deleteApplication);

export default router;

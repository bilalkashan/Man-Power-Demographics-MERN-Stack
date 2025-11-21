import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";

import { signup, login, verify, forgetPassword, resetPassword, verifyResetOtp } from "../controllers/AuthController.js";

// Public Routes
router.post("/login", login);
router.post("/signup", signup);
router.post("/verify", verify);
router.post("/forget", forgetPassword);
router.post("/resetPassword", resetPassword);
router.post("/verify-reset-otp", verifyResetOtp);

export default router;


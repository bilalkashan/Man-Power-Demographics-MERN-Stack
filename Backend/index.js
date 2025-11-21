import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import "./models/db.js";

import AuthRouter from "./routes/AuthRouter.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import hiringRoutes from "./routes/hiringRoutes.js";
import leaverRoutes from "./routes/leaverRoutes.js";
import hrOpsRoutes from "./routes/hrOpsRoutes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import engagementRoutes from "./routes/engagementRoutes.js";
import demographicsRoutes from "./routes/demographicsRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Required for ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/auth", AuthRouter);
app.use("/payroll", payrollRoutes);
app.use("/hiring", hiringRoutes);
app.use("/leavers", leaverRoutes);
app.use("/hr-operations", hrOpsRoutes);
app.use("/training", trainingRoutes);
app.use("/engagement", engagementRoutes);
app.use("/demographics", demographicsRoutes);
app.use("/metrics", metricsRoutes);

app.use(express.static(path.join(__dirname, "dist")));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.message) {
    return res.status(400).json({ message: err.message, success: false });
  }
  res.status(500).json({ message: "Something went wrong!", success: false });
});

app.listen(PORT, "localhost", () => {
  // Updated the console log to match
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
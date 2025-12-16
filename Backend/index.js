import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./models/db.js";
import AuthRouter from "./routes/AuthRouter.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/auth", AuthRouter);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);
app.use("/messages", messageRoutes);
app.use("/news", newsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.message) {
    return res.status(400).json({ message: err.message, success: false });
  }
  res.status(500).json({ message: "Something went wrong!", success: false });
});

app.listen(PORT, "localhost", () => {
  console.log(`===> Server running at http://localhost:${PORT}`);
});

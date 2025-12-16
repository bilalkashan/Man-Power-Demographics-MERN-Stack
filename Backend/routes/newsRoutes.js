import express from "express";
const router = express.Router();
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  togglePublish,
} from "../controllers/newsController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import imageUpload from "../middleware/imageUpload.js";

// Public
router.get("/", getNews);
router.get("/:id", getNewsById);

// Admin protected
router.post("/", verifyToken, imageUpload.single("image"), createNews);
router.patch("/:id", verifyToken, imageUpload.single("image"), updateNews);
router.patch("/:id/publish", verifyToken, togglePublish);
router.delete("/:id", verifyToken, deleteNews);

export default router;

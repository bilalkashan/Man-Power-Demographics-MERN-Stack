import express from "express";
const router = express.Router();
import {
  getAllMessages,
  getMessageById,
  createMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/verifyToken.js";

// Public route - anyone can send a message
router.post("/", createMessage);

// Admin protected routes
router.get("/", verifyToken, getAllMessages);
router.get("/unread/count", verifyToken, getUnreadCount);
router.get("/:id", verifyToken, getMessageById);
router.patch("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteMessage);

export default router;

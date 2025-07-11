import express from "express";
import {
  getNotifications,
  markAllRead,
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();
router.get("/", protect, getNotifications);
router.put("/read", protect, markAllRead);
export default router;

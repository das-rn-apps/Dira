import express from "express";
import authRoutes from "./authRoutes";
import projectRoutes from "./projectRoutes";
import taskRoutes from "./taskRoutes";
import commentRoutes from "./commentRoutes";
import notificationRoutes from "./notificationRoutes";

const router = express.Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/comments", commentRoutes);
router.use("/notifications", notificationRoutes);

export default router;

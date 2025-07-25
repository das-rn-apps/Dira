import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
} from "../controllers/taskController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();
router.get("/:project_id", protect, getTasks);
router.post("/", protect, createTask);
router.put("/:taskId", protect, updateTask);
export default router;

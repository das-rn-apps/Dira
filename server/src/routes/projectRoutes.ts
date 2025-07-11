import express from "express";
import {
  createProject,
  getMyProjects,
  inviteMember,
  getProjectMembers,
  getProjectById,
} from "../controllers/projectController";
import { protect } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = express.Router();
router.post("/", protect, createProject);
router.get("/", protect, getMyProjects);
router.get("/:projectId", protect, getProjectById);
router.get("/:projectId/members", protect, getProjectMembers);
router.post(
  "/:projectId/invite",
  protect,
  requireRole(["admin"]),
  inviteMember
);
export default router;

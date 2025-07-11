import express from "express";
import { addComment, getComments } from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();
router.get("/:taskId", protect, getComments);
router.post("/:taskId", protect, addComment);
export default router;

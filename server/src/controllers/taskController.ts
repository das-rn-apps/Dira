import { Request, Response } from "express";
import { Task } from "../models/Task";
import { io } from "../index";
import { Notification } from "../models/Notification";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate(
      "assignee",
      "name email"
    );
    // .populate("owner", "name email"); // ✅ populate owner

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, assignee } = req.body;
  const task = await Task.create({
    project: req.body.project,
    title,
    description,
    assignee,
  });

  if (assignee) {
    await Notification.create({
      user: assignee,
      message: `You were assigned to: ${title}`,
      link: `/projects/${req.body.project}`,
    });
  }

  io.to(req.body.project).emit("update_task", { type: "created", task });
  res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
    new: true,
  });
  if (!task) return res.status(404).json({ message: "Not found" });

  io.to(task.project.toString()).emit("update_task", { type: "moved", task });
  res.json(task);
};

export const addCommentToTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = (req as any).userId;

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.comments.push(text);
  await task.save();

  // Real-time notify (broadcast comment)
  const io = req.app.get("io");
  if (io) {
    io.to(task.project.toString()).emit(
      "comment_added",
      `New comment on task: ${task.title}`
    );
  }

  res.json(task);
};

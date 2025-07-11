import { Request, Response } from "express";
import { Task } from "../models/Task";
import { io } from "../index";
import { Notification } from "../models/Notification";
import { Project } from "../models/Project";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ project_id: req.params.project_id })
      .populate("assignee", "name email")
      .populate("project_id", "name description")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name email",
        },
      });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, assignee, project_id } = req.body;
  const task = await Task.create({
    project_id,
    title,
    description,
    assignee,
  });

  await Project.findByIdAndUpdate(project_id, {
    $push: { tasks: task._id },
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

  io.to(task.project_id.toString()).emit("update_task", {
    type: "moved",
    task,
  });
  res.json(task);
};

export const addCommentToTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.comments.push(text);
  await task.save();

  // Real-time notify (broadcast comment)
  const io = req.app.get("io");
  if (io) {
    io.to(task.project_id.toString()).emit(
      "comment_added",
      `New comment on task: ${task.title}`
    );
  }

  res.json(task);
};

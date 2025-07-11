import { Request, Response } from "express";
import { Comment } from "../models/Comment";
import { Task } from "../models/Task";
import { Notification } from "../models/Notification";
import { io } from "../index";

export const getComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.json(comments);
};

export const addComment = async (req: Request, res: Response) => {
  const { text } = req.body;
  const { taskId } = req.params;

  const comment = await Comment.create({
    text,
    task: taskId,
    author: req.user._id,
  });

  const full = await comment.populate("author", "name");

  const task = await Task.findById(taskId);
  if (task?.assignee && task.assignee.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: task.assignee,
      message: `New comment on task: ${task.title}`,
      link: `/projects/${task.project}`,
    });
  }

  io.to(task?.project.toString()!).emit("comment-added", {
    taskId,
    comment: full,
  });

  res.status(201).json(full);
};

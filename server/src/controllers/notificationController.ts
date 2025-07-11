import { Request, Response } from "express";
import { Notification } from "../models/Notification";

export const getNotifications = async (req: Request, res: Response) => {
  const notifications = await Notification.find({ user: req.user?._id }).sort({
    createdAt: -1,
  });
  res.json(notifications);
};

export const markAllRead = async (req: Request, res: Response) => {
  await Notification.updateMany(
    { user: req.user?._id, read: false },
    { read: true }
  );
  res.json({ message: "Marked all as read" });
};

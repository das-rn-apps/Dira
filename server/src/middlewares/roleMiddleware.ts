import { Request, Response, NextFunction } from "express";
import { Project } from "../models/Project";

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || !roles.includes(member.role)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};

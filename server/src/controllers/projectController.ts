import { Request, Response } from "express";
import { Project } from "../models/Project";
import { User } from "../models/User";

export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "admin" }],
  });

  res.status(201).json(project);
};

export const getMyProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ "members.user": req.user._id })
      .populate("members.user", "name email") // ✅ populate each member
      .populate("owner", "name email"); // ✅ populate owner

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("members.user", "name email")
      .populate("owner", "name email"); // 👈 populate owner info

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjectMembers = async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.projectId).populate(
    "members.user",
    "name email"
  );
  if (!project) return res.status(404).json({ message: "Project not found" });

  res.json(
    project.members.map((m) => ({
      _id: m.user._id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
    }))
  );
};

export const inviteMember = async (req: Request, res: Response) => {
  const { email, role = "member" } = req.body;
  const project = await Project.findById(req.params.projectId);
  const user = await User.findOne({ email });

  if (!project || !user) return res.status(404).json({ message: "Invalid" });

  const already = project.members.find(
    (m) => m.user.toString() === user._id.toString()
  );
  if (already) return res.status(400).json({ message: "Already a member" });

  project.members.push({ user: user._id, role });
  await project.save();

  res.json({ message: `${user.name} added as ${role}` });
};

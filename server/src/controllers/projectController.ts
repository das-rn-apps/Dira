import { Request, Response } from "express";
import { Project } from "../models/Project";
import { IUser, User } from "../models/User";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, members } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user?._id,
      members,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner") // full owner
      .populate({
        path: "members.user",
        model: "User",
      });

    res.status(201).json(populatedProject);
  } catch (err) {
    console.error("Failed to create project:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { "members.user": userId }],
    })
      .populate("owner", "name email")
      .populate({
        path: "members.user",
        model: "User",
        select: "name email",
      });

    res.json(
      projects.map((project) => ({
        ...project.toObject(),
        members: project.members.map((m) => ({
          role: m.role,
          user: {
            _id: (m.user as any)._id,
            name: (m.user as any).name,
            email: (m.user as any).email,
          },
        })),
      }))
    );
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.project_id)
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
  const project = await Project.findById(req.params.project_id).populate(
    "members.user",
    "name email"
  );
  if (!project) return res.status(404).json({ message: "Project not found" });

  res.json(
    project.members.map((m) => {
      const user = m.user as IUser;
      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        role: m.role,
      };
    })
  );
};

export const inviteMember = async (req: Request, res: Response) => {
  const { email, role = "member" } = req.body;
  const project = await Project.findById(req.params.project_id);
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

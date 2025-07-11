import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(401).json({ message: "Fill all details" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already used" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.status(201).json({ token: generateToken(user._id), user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong password" });

  res.json({ token: generateToken(user._id), user });
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json(users);
};

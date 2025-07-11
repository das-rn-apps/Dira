import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IUser } from "./User";
import { ITask } from "./Task";

interface Member {
  user: ObjectId | IUser;
  role: "admin" | "member" | "tester";
}

export interface IProject extends Document {
  name: string;
  description: string;
  owner: ObjectId | IUser;
  members: Member[];
  tasks: ObjectId[] | ITask[];
}

const projectSchema = new Schema<IProject>(
  {
    name: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["admin", "member", "tester"],
          default: "member",
        },
      },
    ],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);

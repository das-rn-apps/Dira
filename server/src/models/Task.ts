import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";

export interface ITask extends Document {
  project_id: ObjectId;
  title: string;
  description: string;
  comments: ObjectId[] | IUser[];
  status: "todo" | "in-progress" | "done" | "testing";
  assignee?: ObjectId | IUser;
}

const taskSchema = new Schema<ITask>(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    title: String,
    description: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    status: {
      type: String,
      enum: ["todo", "in-progress", "done", "testing"],
      default: "todo",
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);

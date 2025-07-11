import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ITask extends Document {
  project: ObjectId;
  title: string;
  description: string;
  comments: [String];
  status: string;
  assignee?: string;
}

const taskSchema = new Schema<ITask>(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    title: String,
    description: String,
    comments: [String],
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);

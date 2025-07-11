import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";

export interface IComment extends Document {
  task: ObjectId | IUser;
  author: ObjectId | IUser;
  text: string;
}

const commentSchema = new Schema<IComment>(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);

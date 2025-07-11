import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { IUser } from "./User";

export interface INotification extends Document {
  user: ObjectId | IUser;
  message: string;
  link: string;
  read: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    link: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

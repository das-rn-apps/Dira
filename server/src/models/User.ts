import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // ✅ Adds createdAt and updatedAt fields automatically
);

export const User = mongoose.model<IUser>("User", userSchema);

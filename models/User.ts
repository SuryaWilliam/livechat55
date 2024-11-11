// models/User.ts

import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  role: mongoose.Types.ObjectId;
  isAvailable: boolean;
  isActive: boolean;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  isAvailable: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

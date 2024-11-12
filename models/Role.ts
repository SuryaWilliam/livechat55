// models/Role.ts

import mongoose, { Schema, Document } from "mongoose";

interface IRole extends Document {
  name: string;
  permissions: string[];
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: { type: [String], required: true },
});

export default mongoose.models.Role ||
  mongoose.model<IRole>("Role", RoleSchema);

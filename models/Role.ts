// models/Role.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IRole extends Document {
  name: string; // Role name (e.g., "Admin", "Agent", "User")
  permissions: string[]; // List of permissions assigned to the role
  createdAt: Date; // When the role was created
}

const RoleSchema: Schema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: { type: [String], required: true }, // Array of permission strings
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite during hot reloads
const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);

export default Role;

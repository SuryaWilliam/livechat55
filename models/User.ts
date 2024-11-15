import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  name: string; // User's full name
  email: string; // User's email address
  password?: string; // Optional, for systems that require passwords
  role: string; // User's role (e.g., "admin", "agent", "user")
  isActive: boolean; // Whether the user is active
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last account update timestamp
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, required: true, default: "user" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

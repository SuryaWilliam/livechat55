// models/SystemSettings.ts

import mongoose, { Schema, Document } from "mongoose";

interface ISystemSettings extends Document {
  maxQueueSize: number;
  notificationPreferences: string[];
  agentAvailability: { day: string; startTime: string; endTime: string }[];
  chatAutoCloseDuration: number;
  sessionTimeout: number;
  loggingLevel: "basic" | "detailed" | "none";
  autoResponseMessages: {
    queue: string;
    assigned: string;
    noAgent: string;
  };
}

const SystemSettingsSchema = new Schema<ISystemSettings>({
  maxQueueSize: { type: Number, default: 10 },
  notificationPreferences: { type: [String], default: ["email"] },
  agentAvailability: [{ day: String, startTime: String, endTime: String }],
  chatAutoCloseDuration: { type: Number, default: 30 },
  sessionTimeout: { type: Number, default: 15 },
  loggingLevel: {
    type: String,
    enum: ["basic", "detailed", "none"],
    default: "basic",
  },
  autoResponseMessages: {
    queue: { type: String, default: "Thank you for waiting." },
    assigned: { type: String, default: "An agent is now assigned to you." },
    noAgent: { type: String, default: "No agent available. Please try later." },
  },
});

export default mongoose.models.SystemSettings ||
  mongoose.model<ISystemSettings>("SystemSettings", SystemSettingsSchema);

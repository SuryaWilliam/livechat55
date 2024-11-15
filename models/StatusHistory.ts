// models/StatusHistory.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IStatusHistory extends Document {
  entityId: string; // ID of the entity (e.g., chat session, user)
  entityType: string; // Type of the entity (e.g., "ChatSession", "User")
  status: string; // The new status (e.g., "Active", "Resolved", "Inactive")
  changedBy: string; // User ID or name of the person making the change
  changedAt: Date; // When the status was changed
}

const StatusHistorySchema: Schema = new Schema<IStatusHistory>({
  entityId: { type: String, required: true }, // ID of the entity being tracked
  entityType: { type: String, required: true }, // Type of the entity
  status: { type: String, required: true }, // New status value
  changedBy: { type: String, required: true }, // Who made the change
  changedAt: { type: Date, default: Date.now }, // Timestamp of the change
});

// Prevent model overwrite during hot reloads
const StatusHistory: Model<IStatusHistory> =
  mongoose.models.StatusHistory ||
  mongoose.model<IStatusHistory>("StatusHistory", StatusHistorySchema);

export default StatusHistory;

// models/AuditLog.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IAuditLog extends Document {
  action: string;
  performedBy: string;
  details?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema<IAuditLog>({
  action: { type: String, required: true },
  performedBy: { type: String, required: true }, // Could be a user ID, name, or system
  details: { type: String, default: "" }, // Optional additional details
  timestamp: { type: Date, default: Date.now },
});

// Check if the model is already defined to prevent overwriting during hot reloads
const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;

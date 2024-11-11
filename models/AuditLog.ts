// models/AuditLog.ts

import mongoose, { Schema, Document } from "mongoose";

interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  details: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

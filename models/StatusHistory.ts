// models/StatusHistory.ts

import mongoose, { Schema, Document } from "mongoose";

interface IStatusHistory extends Document {
  agentId: mongoose.Types.ObjectId;
  status: "available" | "unavailable";
  timestamp: Date;
}

const StatusHistorySchema = new Schema({
  agentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["available", "unavailable"], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.StatusHistory ||
  mongoose.model<IStatusHistory>("StatusHistory", StatusHistorySchema);

// models/ChatSession.ts

import mongoose, { Schema, Document, Types } from "mongoose";

interface IChatSession extends Document {
  username: string;
  description: string;
  category: string;
  isActive: boolean;
  assignedAgent?: Types.ObjectId;
}

const ChatSessionSchema = new Schema<IChatSession>({
  username: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  assignedAgent: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.models.ChatSession ||
  mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);

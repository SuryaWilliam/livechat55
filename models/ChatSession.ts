// models/ChatSession.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IChatSession extends Document {
  username: string;
  description: string;
  category: string;
  isActive: boolean;
  startedAt: Date;
  endedAt?: Date;
}

const ChatSessionSchema: Schema = new Schema<IChatSession>({
  username: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }, // Optional, for when the chat ends
});

// Prevent model overwrite during hot reloads
const ChatSession: Model<IChatSession> =
  mongoose.models.ChatSession ||
  mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);

export default ChatSession;

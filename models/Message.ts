// models/Message.ts

import mongoose, { Schema, Document } from "mongoose";

interface IMessage extends Document {
  sessionId: mongoose.Types.ObjectId;
  sender: string;
  content: string;
  timestamp: Date;
}

const MessageSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "ChatSession",
    required: true,
  },
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);

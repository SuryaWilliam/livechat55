// models/OfflineMessage.ts

import mongoose, { Schema, Document } from "mongoose";

interface IOfflineMessage extends Document {
  username: string;
  email: string;
  message: string;
}

const OfflineMessageSchema = new Schema<IOfflineMessage>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

export default mongoose.models.OfflineMessage ||
  mongoose.model<IOfflineMessage>("OfflineMessage", OfflineMessageSchema);

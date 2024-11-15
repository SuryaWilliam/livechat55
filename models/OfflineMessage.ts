import mongoose, { Schema, Document, Model } from "mongoose";

interface IOfflineMessage extends Document {
  name: string;
  email: string;
  message: string;
  category: string;
  submittedAt: Date;
}

const OfflineMessageSchema: Schema = new Schema<IOfflineMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, required: true }, // Problem category (e.g., "Billing", "Technical Support")
  submittedAt: { type: Date, default: Date.now },
});

// Prevent model overwrite during hot reloads
const OfflineMessage: Model<IOfflineMessage> =
  mongoose.models.OfflineMessage ||
  mongoose.model<IOfflineMessage>("OfflineMessage", OfflineMessageSchema);

export default OfflineMessage;

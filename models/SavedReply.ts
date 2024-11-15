// models/SavedReply.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface ISavedReply extends Document {
  title: string; // Short title or label for the saved reply
  content: string; // Full text of the saved reply
  category: string; // Category for easier filtering
  createdAt: Date; // When the saved reply was created
  createdBy: string; // User ID or name of the person who created the reply
}

const SavedReplySchema: Schema = new Schema<ISavedReply>({
  title: { type: String, required: true, unique: true }, // Ensures each reply has a unique title
  content: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }, // Tracks who created the reply
});

// Prevent model overwrite during hot reloads
const SavedReply: Model<ISavedReply> =
  mongoose.models.SavedReply ||
  mongoose.model<ISavedReply>("SavedReply", SavedReplySchema);

export default SavedReply;

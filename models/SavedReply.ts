// models/SavedReply.ts

import mongoose, { Schema, Document } from "mongoose";

interface ISavedReply extends Document {
  message: string;
  category: string;
}

const SavedReplySchema = new Schema({
  message: { type: String, required: true },
  category: { type: String, required: true },
});

export default mongoose.models.SavedReply ||
  mongoose.model<ISavedReply>("SavedReply", SavedReplySchema);

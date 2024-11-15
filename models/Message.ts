import mongoose, { Schema, Document, Model } from "mongoose";

interface IMessage extends Document {
  sessionId: string;
  sender: string;
  content: string;
  timestamp: Date;
}

// Generic message schema
const MessageSchema: Schema = new Schema<IMessage>({
  sessionId: { type: String, required: true }, // Session ID for reference
  sender: { type: String, required: true }, // e.g., "user" or "agent"
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

/**
 * Dynamically creates a model for a specific session collection.
 * @param sessionId The ID of the session (used as the collection name)
 */
const getMessageModel = (sessionId: string): Model<IMessage> => {
  const collectionName = `session_${sessionId}`;
  return (
    mongoose.models[collectionName] ||
    mongoose.model<IMessage>(collectionName, MessageSchema, collectionName)
  );
};

export default getMessageModel;

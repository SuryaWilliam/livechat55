// models/Rating.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IRating extends Document {
  sessionId: string; // Reference to the chat session
  rating: number; // Rating value (e.g., 1-5)
  feedback?: string; // Optional user feedback
  submittedAt: Date; // When the rating was submitted
}

const RatingSchema: Schema = new Schema<IRating>({
  sessionId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now },
});

// Prevent model overwrite during hot reloads
const Rating: Model<IRating> =
  mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);

export default Rating;

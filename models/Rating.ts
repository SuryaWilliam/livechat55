// models/Rating.ts

import mongoose, { Schema, Document } from "mongoose";

interface IRating extends Document {
  sessionId: mongoose.Types.ObjectId;
  rating: number;
  feedback?: string;
}

const RatingSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "ChatSession",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: false },
});

export default mongoose.models.Rating ||
  mongoose.model<IRating>("Rating", RatingSchema);

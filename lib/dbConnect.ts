// lib/dbConnect.ts

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function dbConnect(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

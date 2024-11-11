// lib/dbConnect.ts

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function dbConnect(): Promise<void> {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
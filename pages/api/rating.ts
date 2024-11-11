// pages/api/rating.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import Rating from "../../models/Rating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    if (req.method === "POST") {
      const { sessionId, rating, feedback } = req.body;

      if (!sessionId || typeof rating !== "number") {
        return res
          .status(400)
          .json({ error: "Session ID and rating are required" });
      }

      const newRating = new Rating({ sessionId, rating, feedback });
      await newRating.save();

      return res.status(201).json(newRating);
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error processing rating request:", error);
    res.status(500).json({ error: "Failed to process rating request" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import Rating from "../../models/Rating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { sessionId, rating, feedback } = req.body;

    if (!sessionId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Valid session ID and rating (1-5) are required." });
    }

    try {
      const ratingEntry = new Rating({
        sessionId,
        rating,
        feedback: feedback || "",
        submittedAt: new Date(),
      });
      await ratingEntry.save();
      res.status(201).json({
        message: "Rating submitted successfully.",
        rating: ratingEntry,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit rating." });
    }
  } else if (req.method === "GET") {
    try {
      const { sessionId } = req.query;

      if (!sessionId || typeof sessionId !== "string") {
        return res.status(400).json({ error: "Session ID is required." });
      }

      const ratings = await Rating.find({ sessionId }).sort({
        submittedAt: -1,
      });
      res.status(200).json(ratings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ratings." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

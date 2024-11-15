import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";
import Rating from "../../../models/Rating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  try {
    // Fetch statistics for reports
    const totalChats = await ChatSession.countDocuments();
    const resolvedChats = await ChatSession.countDocuments({ isActive: false });
    const unresolvedChats = totalChats - resolvedChats;

    const averageRating = await Rating.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    res.status(200).json({
      totalChats,
      resolvedChats,
      unresolvedChats,
      averageRating: averageRating[0]?.avgRating || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate reports." });
  }
}

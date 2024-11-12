// pages/api/admin/chatStatistics.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";
import Rating from "../../../models/Rating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const totalChats = await ChatSession.countDocuments();
      const completedChats = await ChatSession.countDocuments({
        isActive: false,
      });

      const ratings = await Rating.find({});
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return res
        .status(200)
        .json({ totalChats, completedChats, averageRating });
    } catch (error) {
      console.error("Error fetching chat statistics:", error);
      return res.status(500).json({ error: "Failed to fetch chat statistics" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

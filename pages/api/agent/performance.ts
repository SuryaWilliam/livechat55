// pages/api/agent/performance.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";
import Rating from "../../../models/Rating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { agentId } = req.query;

  if (req.method === "GET") {
    try {
      const totalChats = await ChatSession.countDocuments({
        assignedAgent: agentId,
        isActive: false,
      });

      const avgResponseTimeData = await ChatSession.aggregate([
        { $match: { assignedAgent: agentId, isActive: false } },
        { $group: { _id: null, avgResponseTime: { $avg: "$responseTime" } } },
      ]);
      const avgResponseTime = avgResponseTimeData[0]?.avgResponseTime || 0;

      const avgRatingData = await Rating.aggregate([
        { $match: { agentId } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]);
      const avgRating = avgRatingData[0]?.avgRating || 0;

      res.status(200).json({
        totalChats,
        avgResponseTime,
        avgRating,
      });
    } catch (error) {
      console.error("Error fetching agent performance data:", error);
      res.status(500).json({ error: "Failed to fetch performance data." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

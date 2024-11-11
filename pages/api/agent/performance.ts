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

  try {
    const totalChats = await ChatSession.countDocuments({
      assignedAgent: agentId,
      isActive: false,
    });
    const avgResponseTime = await ChatSession.aggregate([
      { $match: { assignedAgent: agentId, isActive: false } },
      { $group: { _id: null, avgResponseTime: { $avg: "$responseTime" } } },
    ]);
    const avgRating = await Rating.aggregate([
      { $match: { agentId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    res.status(200).json({
      totalChats,
      avgResponseTime: avgResponseTime[0]?.avgResponseTime || 0,
      avgRating: avgRating[0]?.avgRating || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch performance data." });
  }
}

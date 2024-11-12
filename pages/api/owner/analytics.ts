// pages/api/owner/analytics.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";
import Rating from "../../../models/Rating";
import User from "../../../models/User";
import Role from "../../../models/Role";

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

      const avgRatingData = await Rating.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]);
      const avgRating = avgRatingData.length > 0 ? avgRatingData[0].avg : 0;

      const agentRole = await Role.findOne({ name: "agent" });
      if (!agentRole) {
        return res.status(404).json({ error: "Role 'agent' not found" });
      }

      const totalAgents = await User.countDocuments({ role: agentRole._id });

      res.status(200).json({
        totalChats,
        completedChats,
        avgRating,
        totalAgents,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

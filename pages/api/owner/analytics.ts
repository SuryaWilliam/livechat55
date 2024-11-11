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
  await dbConnect(); // Connect to the database

  if (req.method === "GET") {
    try {
      // Fetching total chats
      const totalChats = await ChatSession.countDocuments();
      const completedChats = await ChatSession.countDocuments({
        isActive: false,
      });

      // Calculate average rating
      const avgRating = await Rating.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]);

      // Fetch total agents by role
      const agentRole = await Role.findOne({ name: "agent" });
      const totalAgents = agentRole
        ? await User.countDocuments({ role: agentRole._id })
        : 0;

      const agentChats = await ChatSession.aggregate([
        { $match: { isActive: false } },
        { $group: { _id: "$assignedAgent", chats: { $sum: 1 } } },
      ]);

      const analyticsData = {
        totalChats,
        completedChats,
        avgRating: avgRating[0]?.avg || 0,
        agentChats,
        totalAgents,
      };

      res.status(200).json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      res.status(500).json({ error: "Failed to fetch analytics data" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

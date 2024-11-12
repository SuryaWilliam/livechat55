// pages/api/owner/agentAnalytics.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";
import User from "../../../models/User";
import Role from "../../../models/Role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const agentRole = await Role.findOne({ name: "agent" });
      if (!agentRole) {
        return res.status(404).json({ error: "Role 'agent' not found" });
      }

      const agentData = await User.aggregate([
        { $match: { role: agentRole._id } },
        {
          $lookup: {
            from: "chatsessions",
            localField: "_id",
            foreignField: "assignedAgent",
            as: "chats",
          },
        },
        {
          $addFields: {
            totalChats: { $size: "$chats" },
            avgResponseTime: { $avg: "$chats.responseTime" },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalChats: 1,
            avgResponseTime: 1,
          },
        },
      ]);

      res.status(200).json(agentData);
    } catch (error) {
      console.error("Error fetching agent analytics:", error);
      res.status(500).json({ error: "Failed to fetch agent analytics" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

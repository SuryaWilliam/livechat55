// pages/api/owner/agentAnalytics.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";
import User from "../../../models/User";
import Role from "../../../models/Role";
import Rating from "../../../models/Rating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

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
          avgRating: {
            $avg: {
              $map: {
                input: "$chats._id",
                as: "sessionId",
                in: {
                  $avg: {
                    $filter: {
                      input: "$chats.ratings",
                      as: "rating",
                      cond: { $eq: ["$$rating.sessionId", "$$sessionId"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({ agentData });
  } catch (error) {
    console.error("Error fetching agent analytics:", error);
    res.status(500).json({ error: "Failed to fetch agent analytics" });
  }
}

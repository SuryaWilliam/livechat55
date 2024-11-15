import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { agentId } = req.query;

    if (!agentId || typeof agentId !== "string") {
      return res.status(400).json({ error: "Agent ID is required." });
    }

    const totalChats = await ChatSession.countDocuments({
      assignedAgent: agentId,
    });
    const resolvedChats = await ChatSession.countDocuments({
      assignedAgent: agentId,
      isActive: false,
    });

    const averageResolutionTime = await ChatSession.aggregate([
      { $match: { assignedAgent: agentId, isActive: false } },
      {
        $group: {
          _id: null,
          avgResolutionTime: {
            $avg: { $subtract: ["$endedAt", "$startedAt"] },
          },
        },
      },
    ]);

    res.status(200).json({
      totalChats,
      resolvedChats,
      averageResolutionTime: averageResolutionTime[0]?.avgResolutionTime || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agent analytics data." });
  }
}

// pages/api/agent/activeChats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Establish database connection

  if (req.method === "GET") {
    const { agentId } = req.query;

    try {
      const activeChats = await ChatSession.find({
        isActive: true,
        assignedAgent: agentId,
      });
      return res.status(200).json(activeChats);
    } catch (error) {
      console.error("Error fetching active chats for agent:", error);
      return res.status(500).json({ error: "Failed to fetch active chats" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

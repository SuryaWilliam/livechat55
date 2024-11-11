// pages/api/agent/activeChats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const activeChats = await ChatSession.find({
        isActive: true,
        assignedAgent: req.query.agentId,
      });
      res.status(200).json(activeChats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active chats" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

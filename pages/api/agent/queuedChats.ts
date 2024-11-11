// pages/api/agent/queuedChats.ts

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
      const queuedChats = await ChatSession.find({
        isActive: false,
        assignedAgent: null,
      });
      res.status(200).json(queuedChats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch queued chats" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

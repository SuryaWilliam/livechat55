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
    const queuedChats = await ChatSession.find({
      isActive: true,
      assignedAgent: null,
    }).sort({ startedAt: 1 }); // Oldest queued chats first
    res.status(200).json(queuedChats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch queued chats." });
  }
}

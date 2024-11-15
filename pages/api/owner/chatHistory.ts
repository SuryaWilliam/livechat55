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
    const { limit = 100, agentId } = req.query;

    const filters: { [key: string]: any } = { isActive: false };
    if (agentId) filters.assignedAgent = agentId;

    const chatHistory = await ChatSession.find(filters)
      .sort({ endedAt: -1 })
      .limit(Number(limit));

    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
}

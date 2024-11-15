import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const { sessionId, agentId } = req.body;

  if (!sessionId || !agentId) {
    return res
      .status(400)
      .json({ error: "Session ID and Agent ID are required." });
  }

  try {
    const chatSession = await ChatSession.findOneAndUpdate(
      { _id: sessionId, assignedAgent: agentId, isActive: true },
      { isActive: false, endedAt: new Date() },
      { new: true }
    );

    if (!chatSession) {
      return res.status(404).json({
        error: "Active chat session not found or not assigned to this agent.",
      });
    }

    res
      .status(200)
      .json({ message: "Chat session ended successfully.", chatSession });
  } catch (error) {
    res.status(500).json({ error: "Failed to end chat session." });
  }
}

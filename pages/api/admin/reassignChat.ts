import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const { sessionId, agentId } = req.body;

  if (!sessionId || !agentId) {
    return res
      .status(400)
      .json({ error: "Session ID and agent ID are required." });
  }

  try {
    const chatSession = await ChatSession.findByIdAndUpdate(
      sessionId,
      { assignedAgent: agentId },
      { new: true }
    );

    if (!chatSession) {
      return res.status(404).json({ error: "Chat session not found." });
    }

    res
      .status(200)
      .json({ message: "Chat reassigned successfully.", chatSession });
  } catch (error) {
    res.status(500).json({ error: "Failed to reassign chat session." });
  }
}

// pages/api/agent/endChat.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "PUT") {
    const { sessionId } = req.body;

    try {
      const chat = await ChatSession.findByIdAndUpdate(
        sessionId,
        { isActive: false },
        { new: true }
      );

      if (!chat) {
        return res.status(404).json({ error: "Chat session not found" });
      }

      res.status(200).json(chat);
    } catch (error) {
      console.error("Error ending chat session:", error);
      res.status(500).json({ error: "Failed to end chat" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

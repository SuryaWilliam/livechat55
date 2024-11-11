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
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to end chat" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

// pages/api/agent/messages.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import Message from "../../../models/Message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    const { sessionId } = req.query;
    if (!sessionId)
      return res.status(400).json({ error: "Session ID required." });

    try {
      const messages = await Message.find({ sessionId }).sort({ timestamp: 1 });
      return res.status(200).json({ messages });
    } catch (error) {
      console.error("Error retrieving messages:", error);
      return res.status(500).json({ error: "Failed to retrieve messages." });
    }
  } else if (req.method === "POST") {
    const { sessionId, sender, content } = req.body;
    if (!sessionId || !sender || !content)
      return res.status(400).json({ error: "All fields are required." });

    try {
      const newMessage = new Message({ sessionId, sender, content });
      await newMessage.save();
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error saving new message:", error);
      return res.status(500).json({ error: "Failed to save message." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

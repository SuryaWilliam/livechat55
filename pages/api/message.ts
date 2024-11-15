import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import getMessageModel from "../../models/Message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Session ID is required." });
  }

  if (req.method === "GET") {
    try {
      const MessageModel = getMessageModel(sessionId);
      const messages = await MessageModel.find().sort({ timestamp: 1 }); // Oldest messages first
      res.status(200).json(messages);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch messages for this session." });
    }
  } else if (req.method === "POST") {
    const { sender, content } = req.body;

    if (!sender || !content) {
      return res
        .status(400)
        .json({ error: "Sender and content are required." });
    }

    try {
      const MessageModel = getMessageModel(sessionId);
      const message = new MessageModel({
        sender,
        content,
        timestamp: new Date(),
      });
      await message.save();
      res
        .status(201)
        .json({ message: "Message sent successfully.", data: message });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

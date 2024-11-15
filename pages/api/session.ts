import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import ChatSession from "../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { username, description, category } = req.body;

    if (!username || !description || !category) {
      return res
        .status(400)
        .json({ error: "Username, description, and category are required." });
    }

    try {
      const newSession = new ChatSession({
        username,
        description,
        category,
        isActive: true,
        startedAt: new Date(),
      });
      await newSession.save();

      res.status(201).json({
        message: "Chat session created successfully.",
        session: newSession,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create chat session." });
    }
  } else if (req.method === "GET") {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "Session ID is required." });
    }

    try {
      const session = await ChatSession.findById(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Chat session not found." });
      }

      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat session." });
    }
  } else if (req.method === "DELETE") {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    try {
      const deletedSession = await ChatSession.findByIdAndDelete(sessionId);

      if (!deletedSession) {
        return res.status(404).json({ error: "Chat session not found." });
      }

      res.status(200).json({ message: "Chat session deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chat session." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

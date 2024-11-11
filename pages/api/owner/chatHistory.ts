// pages/api/owner/chatHistory.ts

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
      const { searchQuery } = req.query;
      const query = searchQuery
        ? { $text: { $search: searchQuery as string } }
        : {};

      const chatSessions = await ChatSession.find(query)
        .populate("assignedAgent", "name")
        .sort({ createdAt: -1 })
        .limit(50);

      res.status(200).json(chatSessions);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

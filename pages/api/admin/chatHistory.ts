// pages/api/admin/ChatHistory.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";
import Message from "../../../models/Message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    const { query } = req.query;

    try {
      const sessions = await ChatSession.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });

      const chatHistories = await Promise.all(
        sessions.map(async (session) => {
          const messages = await Message.find({ sessionId: session._id }).sort({
            timestamp: 1,
          });
          return { session, messages };
        })
      );

      res.status(200).json(chatHistories);
    } catch (error) {
      console.error("Error retrieving chat history:", error);
      res.status(500).json({ error: "Failed to retrieve chat history" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

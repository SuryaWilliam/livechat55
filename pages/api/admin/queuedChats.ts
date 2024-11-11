// pages/api/admin/queuedChats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Establish database connection

  if (req.method === "GET") {
    try {
      const queuedChats = await ChatSession.find({ isActive: false }); // Query for queued chats
      return res.status(200).json(queuedChats);
    } catch (error) {
      console.error("Error fetching queued chats:", error);
      return res.status(500).json({ error: "Failed to fetch queued chats" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
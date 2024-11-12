// pages/api/admin/activeChats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import ChatSession from "@/models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const activeChats = await ChatSession.find({ isActive: true });
      return res.status(200).json(activeChats);
    } catch (error) {
      console.error("Error fetching active chats:", error);
      return res.status(500).json({ error: "Failed to fetch active chats" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ error: "Method Not Allowed" });
}

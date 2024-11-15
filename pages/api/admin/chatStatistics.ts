import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  try {
    const totalChats = await ChatSession.countDocuments();
    const activeChats = await ChatSession.countDocuments({ isActive: true });
    const resolvedChats = totalChats - activeChats;

    res.status(200).json({
      totalChats,
      activeChats,
      resolvedChats,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat statistics." });
  }
}

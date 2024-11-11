// pages/api/session.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import ChatSession from "../../models/ChatSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    if (req.method === "POST") {
      const { username, description, category } = req.body;

      if (!username || !description || !category) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const session = new ChatSession({ username, description, category });
      await session.save();

      return res.status(201).json({ sessionId: session._id });
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
}

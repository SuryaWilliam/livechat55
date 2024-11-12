// pages/api/session.ts

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
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const session = new ChatSession({ username, description, category });
      await session.save();
      return res.status(201).json({ sessionId: session._id });
    } catch (error) {
      console.error("Error creating session:", error);
      return res.status(500).json({ error: "Failed to create session" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

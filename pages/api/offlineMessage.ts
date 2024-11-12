// pages/api/offlineMessage.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import OfflineMessage from "../../models/OfflineMessage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { username, email, message } = req.body;

    if (!username || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const newOfflineMessage = new OfflineMessage({
        username,
        email,
        message,
      });
      await newOfflineMessage.save();
      return res.status(201).json(newOfflineMessage);
    } catch (error) {
      console.error("Error saving offline message:", error);
      return res.status(500).json({ error: "Failed to save offline message" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

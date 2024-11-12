// pages/api/savedReply.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import SavedReply from "../../models/SavedReply";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const replies = await SavedReply.find({});
      return res.status(200).json(replies);
    }

    if (req.method === "POST") {
      const { message, category } = req.body;

      if (!message || !category) {
        return res
          .status(400)
          .json({ error: "Message and category are required" });
      }

      const savedReply = new SavedReply({ message, category });
      await savedReply.save();

      return res.status(201).json(savedReply);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      await SavedReply.findByIdAndDelete(id);
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling saved reply request:", error);
    res.status(500).json({ error: "Server error" });
  }
}

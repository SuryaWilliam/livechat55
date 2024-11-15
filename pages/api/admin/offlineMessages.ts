import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import OfflineMessage from "../../../models/OfflineMessage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await dbConnect();

    try {
      const { limit = 50 } = req.query; // Default to fetching the latest 50 messages
      const offlineMessages = await OfflineMessage.find()
        .sort({ submittedAt: -1 })
        .limit(Number(limit));
      res.status(200).json(offlineMessages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch offline messages." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import OfflineMessage from "../../models/OfflineMessage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { name, email, message, category } = req.body;

    if (!name || !email || !message || !category) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const offlineMessage = new OfflineMessage({
        name,
        email,
        message,
        category,
        submittedAt: new Date(),
      });
      await offlineMessage.save();
      res
        .status(201)
        .json({ message: "Offline message submitted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit offline message." });
    }
  } else if (req.method === "GET") {
    try {
      const { limit = 50 } = req.query;
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

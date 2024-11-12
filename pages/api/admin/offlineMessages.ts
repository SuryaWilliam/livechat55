// pages/api/admin/offlineMessages.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import OfflineMessage from "../../../models/OfflineMessage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const offlineMessages = await OfflineMessage.find({});
      return res.status(200).json(offlineMessages);
    } catch (error) {
      console.error("Error fetching offline messages:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch offline messages" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      await OfflineMessage.findByIdAndDelete(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting offline message:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete offline message" });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

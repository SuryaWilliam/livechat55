// pages/api/admin/reports.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";
import Rating from "../../../models/Rating";
import Message from "../../../models/Message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Establish database connection

  if (req.method === "GET") {
    try {
      // Fetching report data: total chats, average response time, average rating, etc.
      const completedChats = await ChatSession.countDocuments({
        isActive: false,
      });
      const averageResponseTimeData = await Message.aggregate([
        {
          $group: {
            _id: "$sessionId",
            avgResponseTime: { $avg: "$responseTime" },
          },
        },
      ]);
      const avgRatingData = await Rating.aggregate([
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]);

      const reportData = {
        completedChats,
        averageResponseTime: averageResponseTimeData[0]?.avgResponseTime || 0,
        avgRating: avgRatingData[0]?.avgRating || 0,
      };

      return res.status(200).json(reportData);
    } catch (error) {
      console.error("Error generating report:", error);
      return res.status(500).json({ error: "Failed to generate report" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

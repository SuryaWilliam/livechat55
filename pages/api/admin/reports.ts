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

      const avgResponseTime =
        averageResponseTimeData.length > 0
          ? averageResponseTimeData.reduce(
              (sum, doc) => sum + doc.avgResponseTime,
              0
            ) / averageResponseTimeData.length
          : 0;

      const avgRatingData = await Rating.aggregate([
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]);

      const avgRating =
        avgRatingData.length > 0 ? avgRatingData[0].avgRating : 0;

      res.status(200).json({
        completedChats,
        avgResponseTime,
        avgRating,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

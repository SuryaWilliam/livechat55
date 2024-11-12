// pages/api/admin/systemSettings.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import SystemSettings from "../../../models/SystemSettings";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Establish database connection

  if (req.method === "GET") {
    try {
      const settings = await SystemSettings.findOne({});
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error fetching system settings:", error);
      return res.status(500).json({ error: "Failed to fetch system settings" });
    }
  } else if (req.method === "PUT") {
    const {
      maxQueueSize,
      notificationPreferences,
      agentAvailability,
      chatAutoCloseDuration,
      sessionTimeout,
      loggingLevel,
      autoResponseMessages,
    } = req.body;

    try {
      const updatedSettings = await SystemSettings.findOneAndUpdate(
        {},
        {
          maxQueueSize,
          notificationPreferences,
          agentAvailability,
          chatAutoCloseDuration,
          sessionTimeout,
          loggingLevel,
          autoResponseMessages,
        },
        { new: true, upsert: true }
      );

      res.status(200).json(updatedSettings);
    } catch (error) {
      console.error("Error updating system settings:", error);
      res.status(500).json({ error: "Failed to update system settings" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

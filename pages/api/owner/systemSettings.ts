// pages/api/owner/systemSettings.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import SystemSettings from "../../../models/SystemSettings";

const defaultSettings = {
  maxQueueSize: 10,
  notificationPreferences: ["email"],
  agentAvailability: [
    { day: "Monday", startTime: "09:00", endTime: "17:00" },
    { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
  ],
  chatAutoCloseDuration: 30,
  sessionTimeout: 15,
  loggingLevel: "basic",
  autoResponseMessages: {
    queue: "Thank you for waiting. An agent will be with you soon.",
    assigned: "You are now connected to an agent.",
    noAgent: "No agents are available at the moment. Please try again later.",
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      let settings = await SystemSettings.findOne({});
      if (!settings) {
        // Use default settings if no document is found
        settings = new SystemSettings(defaultSettings);
        await settings.save();
      }
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
      return res.status(200).json(updatedSettings);
    } catch (error) {
      console.error("Error updating system settings:", error);
      return res
        .status(500)
        .json({ error: "Failed to update system settings" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

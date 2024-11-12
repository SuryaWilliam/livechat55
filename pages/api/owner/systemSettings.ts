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
        settings = new SystemSettings(defaultSettings);
        await settings.save();
      }
      res.status(200).json(settings);
    } catch (error) {
      console.error("Error fetching system settings:", error);
      res.status(500).json({ error: "Failed to fetch system settings" });
    }
  } else if (req.method === "PUT") {
    const updatedSettings = req.body;

    try {
      const settings = await SystemSettings.findOneAndUpdate(
        {},
        updatedSettings,
        { new: true, upsert: true }
      );
      res.status(200).json(settings);
    } catch (error) {
      console.error("Error updating system settings:", error);
      res.status(500).json({ error: "Failed to update system settings" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

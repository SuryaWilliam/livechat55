import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import SystemSettings from "../../../models/SystemSettings";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const settings = await SystemSettings.find().sort({ key: 1 }); // Sort by key alphabetically
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system settings." });
    }
  } else if (req.method === "POST") {
    const { key, value, description } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: "Key and value are required." });
    }

    try {
      const updatedSetting = await SystemSettings.findOneAndUpdate(
        { key },
        { value, description },
        { new: true, upsert: true } // Create the setting if it doesn't exist
      );
      res.status(200).json({
        message: "System setting updated successfully.",
        updatedSetting,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update system setting." });
    }
  } else if (req.method === "DELETE") {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "Key is required." });
    }

    try {
      const deletedSetting = await SystemSettings.findOneAndDelete({ key });

      if (!deletedSetting) {
        return res.status(404).json({ error: "System setting not found." });
      }

      res.status(200).json({ message: "System setting deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete system setting." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

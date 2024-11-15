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
      const settings = await SystemSettings.find();
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
        { new: true, upsert: true }
      );
      res.status(200).json({
        message: "System setting updated successfully.",
        updatedSetting,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update system setting." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

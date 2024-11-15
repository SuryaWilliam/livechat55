import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import AuditLog from "../../../models/AuditLog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { limit = 50 } = req.query; // Default to fetching the latest 50 logs
    const logs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(Number(limit));
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audit logs." });
  }
}

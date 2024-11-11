// pages/api/owner/auditLogs.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import AuditLog from "../../../models/AuditLog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Ensure a connection to the database

  if (req.method === "GET") {
    try {
      // Fetch the latest 50 audit logs, sorted by most recent first
      const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(50);
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

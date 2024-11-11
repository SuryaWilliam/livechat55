// pages/api/admin/AuditLogs.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import AuditLog from "../../../models/AuditLog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { page = 1, limit = 10, startDate, endDate, search } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  try {
    const query: any = {};

    // Date filtering if startDate or endDate is provided
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    // Text search if a search term is provided
    if (search) {
      query.message = { $regex: search as string, $options: "i" };
    }

    const totalLogs = await AuditLog.countDocuments(query);
    const totalPages = Math.ceil(totalLogs / limitNum);

    const logs = await AuditLog.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ timestamp: -1 }); // Sort by newest first

    res.status(200).json({ logs, totalPages });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
}

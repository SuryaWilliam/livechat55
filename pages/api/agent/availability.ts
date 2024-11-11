// pages/api/agent/availability.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { agentId } = req.query;

  if (req.method === "GET") {
    try {
      const agent = await User.findById(agentId);
      res.status(200).json({ isAvailable: agent.isAvailable });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch availability status." });
    }
  } else if (req.method === "PUT") {
    const { isAvailable } = req.body;

    try {
      const agent = await User.findByIdAndUpdate(
        agentId,
        { isAvailable },
        { new: true }
      );
      res.status(200).json({ isAvailable: agent.isAvailable });
    } catch (error) {
      res.status(500).json({ error: "Failed to update availability status." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

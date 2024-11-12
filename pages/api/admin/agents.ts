// pages/api/admin/agents.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Role from "@/models/Role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const agentRole = await Role.findOne({ name: "agent" });
      if (!agentRole) return res.status(200).json([]);

      const agents = await User.find({ role: agentRole._id });
      res.status(200).json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

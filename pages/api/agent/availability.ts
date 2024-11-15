import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "PUT") {
    const { agentId, isAvailable } = req.body;

    if (!agentId || typeof isAvailable !== "boolean") {
      return res
        .status(400)
        .json({ error: "Agent ID and availability status are required." });
    }

    try {
      const agent = await User.findByIdAndUpdate(
        agentId,
        { isAvailable },
        { new: true }
      );

      if (!agent) {
        return res.status(404).json({ error: "Agent not found." });
      }

      res
        .status(200)
        .json({ message: "Availability updated successfully.", agent });
    } catch (error) {
      res.status(500).json({ error: "Failed to update availability." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

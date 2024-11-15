import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  try {
    const agents = await User.find({ role: "agent", isActive: true }).sort({
      name: 1,
    });
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agents." });
  }
}

// pages/api/owner/users.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      try {
        const users = await User.find({});
        return res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
      }
    }

    if (req.method === "PUT") {
      const { userId, updates } = req.body;
      const user = await User.findByIdAndUpdate(userId, updates, { new: true });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    }

    if (req.method === "DELETE") {
      const { userId } = req.body;
      await User.findByIdAndDelete(userId);
      return res.status(204).end();
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error processing user request:", error);
    res.status(500).json({ error: "Failed to process user request" });
  }
}

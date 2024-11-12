// pages/api/admin/user.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect(); // Establish connection to the database

  if (req.method === "GET") {
    try {
      const users = await User.find({}); // Fetch all users from the database
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === "PUT") {
    const { userId, isActive } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user status:", error);
      return res.status(500).json({ error: "Failed to update user status" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

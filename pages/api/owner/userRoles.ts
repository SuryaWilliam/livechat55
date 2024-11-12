// pages/api/owner/userRoles.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";
import Role from "../../../models/Role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "PUT") {
    const { userId, roleName } = req.body;

    try {
      // Find the role by name
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(404).json({ error: `Role '${roleName}' not found` });
      }

      // Update the user’s role
      const user = await User.findByIdAndUpdate(
        userId,
        { role: role._id },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        message: `Role updated to '${roleName}' for user ${user.name}`,
        user,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import Role from "../../../models/Role";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const roles = await Role.find().sort({ name: 1 }); // Fetch all roles, sorted alphabetically by name
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch roles." });
    }
  } else if (req.method === "PUT") {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res
        .status(400)
        .json({ error: "User ID and Role ID are required." });
    }

    try {
      const role = await Role.findById(roleId);

      if (!role) {
        return res.status(404).json({ error: "Role not found." });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role: role.name },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json({
        message: "User role updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import Role from "../../../models/Role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const roles = await Role.find().sort({ name: 1 }); // Sort roles alphabetically by name
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch roles." });
    }
  } else if (req.method === "POST") {
    const { name, permissions } = req.body;

    if (!name || !Array.isArray(permissions) || permissions.length === 0) {
      return res
        .status(400)
        .json({ error: "Name and permissions are required." });
    }

    try {
      const newRole = new Role({ name, permissions });
      await newRole.save();
      res
        .status(201)
        .json({ message: "Role created successfully.", role: newRole });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Role name must be unique." });
      } else {
        res.status(500).json({ error: "Failed to create role." });
      }
    }
  } else if (req.method === "PUT") {
    const { roleId, name, permissions } = req.body;

    if (!roleId || !name || !Array.isArray(permissions)) {
      return res
        .status(400)
        .json({ error: "Role ID, name, and permissions are required." });
    }

    try {
      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        { name, permissions },
        { new: true }
      );

      if (!updatedRole) {
        return res.status(404).json({ error: "Role not found." });
      }

      res
        .status(200)
        .json({ message: "Role updated successfully.", role: updatedRole });
    } catch (error) {
      res.status(500).json({ error: "Failed to update role." });
    }
  } else if (req.method === "DELETE") {
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ error: "Role ID is required." });
    }

    try {
      const deletedRole = await Role.findByIdAndDelete(roleId);

      if (!deletedRole) {
        return res.status(404).json({ error: "Role not found." });
      }

      res.status(200).json({ message: "Role deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete role." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

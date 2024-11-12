// pages/api/owner/roles.ts

import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import Role from "../../../models/Role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    switch (req.method) {
      case "GET":
        try {
          const roles = await Role.find({});
          return res.status(200).json(roles);
        } catch (error) {
          console.error("Error fetching roles:", error);
          return res.status(500).json({ error: "Failed to fetch roles" });
        }

      case "POST":
        const { name, permissions } = req.body;
        try {
          const newRole = new Role({ name, permissions });
          await newRole.save();
          return res.status(201).json(newRole);
        } catch (error) {
          console.error("Error creating role:", error);
          return res.status(500).json({ error: "Failed to create role" });
        }

      case "PUT":
        const { id, updatedName, updatedPermissions } = req.body;
        try {
          const updatedRole = await Role.findByIdAndUpdate(
            id,
            { name: updatedName, permissions: updatedPermissions },
            { new: true }
          );
          if (!updatedRole) {
            return res.status(404).json({ error: "Role not found" });
          }
          return res.status(200).json(updatedRole);
        } catch (error) {
          console.error("Error updating role:", error);
          return res.status(500).json({ error: "Failed to update role" });
        }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Unexpected error in roles handler:", error);
    res.status(500).json({ error: "Server error" });
  }
}

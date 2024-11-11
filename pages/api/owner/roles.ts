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
        const newRole = new Role({ name, permissions });
        await newRole.save();
        return res.status(201).json(newRole);

      case "PUT":
        const { id, updatedName, updatedPermissions } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(
          id,
          { name: updatedName, permissions: updatedPermissions },
          { new: true }
        );
        return res.status(200).json(updatedRole);

      case "DELETE":
        const { roleId } = req.body;
        await Role.findByIdAndDelete(roleId);
        return res.status(204).end();

      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling role request:", error);
    res.status(500).json({ error: "Failed to process role request" });
  }
}

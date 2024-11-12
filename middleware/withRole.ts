// middleware/withRole.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import User from "../models/User";

export const withRole = (requiredPermission: string) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const session = await getSession({ req });

    if (!session) return res.status(403).json({ error: "Not authorized" });

    try {
      const user = await User.findById(session.user.id).populate("role");
      if (!user) return res.status(403).json({ error: "User not found" });

      const hasPermission = user.role.permissions.includes(requiredPermission);
      if (!hasPermission)
        return res.status(403).json({ error: "Access denied" });

      next();
    } catch (error) {
      console.error("Error verifying role:", error);
      res.status(500).json({ error: "Failed to verify role" });
    }
  };
};

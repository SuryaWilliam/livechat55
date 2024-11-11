// middleware/logAction.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import AuditLog from "../models/AuditLog";

export const logAction = (action: string, details: string) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const session = await getSession({ req });

    if (!session) return res.status(403).json({ error: "Not authorized" });

    try {
      const logEntry = new AuditLog({
        userId: session.user.id,
        action,
        details,
      });
      await logEntry.save();
      next();
    } catch (error) {
      console.error("Error logging action:", error);
      res.status(500).json({ error: "Failed to log action" });
    }
  };
};

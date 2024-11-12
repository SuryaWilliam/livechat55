// pages/api/admin/reassignChat.ts

import { withRole } from "../../../middleware/withRole";
import { dbConnect } from "../../../lib/dbConnect";
import ChatSession from "../../../models/ChatSession";

export default withRole("reassign_chats")(async (req, res) => {
  await dbConnect();

  if (req.method === "PUT") {
    const { sessionId, newAgentId } = req.body;

    try {
      const chatSession = await ChatSession.findByIdAndUpdate(
        sessionId,
        { assignedAgent: newAgentId },
        { new: true }
      );

      if (!chatSession) {
        return res.status(404).json({ error: "Chat session not found" });
      }

      res.status(200).json(chatSession);
    } catch (error) {
      console.error("Error reassigning chat:", error);
      res.status(500).json({ error: "Failed to reassign chat" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
});

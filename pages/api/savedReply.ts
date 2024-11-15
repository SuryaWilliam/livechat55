import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../lib/dbConnect";
import SavedReply from "../../models/SavedReply";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { category } = req.query;

      const filters: { [key: string]: any } = {};
      if (category) filters.category = category;

      const replies = await SavedReply.find(filters).sort({ title: 1 }); // Sort alphabetically by title
      res.status(200).json(replies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved replies." });
    }
  } else if (req.method === "POST") {
    const { title, content, category, createdBy } = req.body;

    if (!title || !content || !category || !createdBy) {
      return res.status(400).json({
        error: "Title, content, category, and createdBy are required.",
      });
    }

    try {
      const newReply = new SavedReply({ title, content, category, createdBy });
      await newReply.save();
      res.status(201).json({
        message: "Saved reply created successfully.",
        reply: newReply,
      });
    } catch (error) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({ error: "A reply with this title already exists." });
      } else {
        res.status(500).json({ error: "Failed to create saved reply." });
      }
    }
  } else if (req.method === "PUT") {
    const { replyId, title, content, category } = req.body;

    if (!replyId || !title || !content || !category) {
      return res.status(400).json({
        error: "Reply ID, title, content, and category are required.",
      });
    }

    try {
      const updatedReply = await SavedReply.findByIdAndUpdate(
        replyId,
        { title, content, category },
        { new: true }
      );

      if (!updatedReply) {
        return res.status(404).json({ error: "Saved reply not found." });
      }

      res.status(200).json({
        message: "Saved reply updated successfully.",
        reply: updatedReply,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update saved reply." });
    }
  } else if (req.method === "DELETE") {
    const { replyId } = req.body;

    if (!replyId) {
      return res.status(400).json({ error: "Reply ID is required." });
    }

    try {
      const deletedReply = await SavedReply.findByIdAndDelete(replyId);

      if (!deletedReply) {
        return res.status(404).json({ error: "Saved reply not found." });
      }

      res.status(200).json({ message: "Saved reply deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete saved reply." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

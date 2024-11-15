import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { role, isActive } = req.query;

      const filters: { [key: string]: any } = {};
      if (role) filters.role = role;
      if (isActive !== undefined) filters.isActive = isActive === "true";

      const users = await User.find(filters).sort({ name: 1 });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users." });
    }
  } else if (req.method === "POST") {
    const { name, email, role, password, isActive } = req.body;

    if (!name || !email || !role) {
      return res
        .status(400)
        .json({ error: "Name, email, and role are required." });
    }

    try {
      const newUser = new User({ name, email, role, password, isActive });
      await newUser.save();
      res
        .status(201)
        .json({ message: "User created successfully.", user: newUser });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Email already exists." });
      } else {
        res.status(500).json({ error: "Failed to create user." });
      }
    }
  } else if (req.method === "PUT") {
    const { userId, name, email, role, isActive } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, role, isActive },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found." });
      }

      res
        .status(200)
        .json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user." });
    }
  } else if (req.method === "DELETE") {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

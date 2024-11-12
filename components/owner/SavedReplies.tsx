// components/owner/SavedReplies.tsx

import { useState, useEffect } from "react";

interface Reply {
  _id: string;
  message: string;
  category: string;
}

const SavedReplies = () => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReplies = async () => {
      setError(null);
      try {
        const res = await fetch("/api/SavedReply");
        if (!res.ok) throw new Error("Failed to fetch saved replies");

        const data = await res.json();
        setReplies(data);
      } catch (error) {
        setError("Could not load saved replies. Please try again.");
        console.error("Error fetching saved replies:", error);
      }
    };
    fetchReplies();
  }, []);

  const addReply = async () => {
    if (!message.trim() || !category.trim()) {
      setError("Please provide both a message and a category.");
      return;
    }

    try {
      const res = await fetch("/api/SavedReply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, category }),
      });

      if (!res.ok) throw new Error("Failed to add reply");

      const data = await res.json();
      setReplies((prev) => [...prev, data]);
      setMessage("");
      setCategory("");
      setError(null);
    } catch (error) {
      setError("Could not add reply. Please try again.");
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Saved Replies</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ul>
        {replies.map((reply) => (
          <li key={reply._id} className="mb-4 border-b pb-2">
            <p>
              <strong>Message:</strong> {reply.message}
            </p>
            <p>
              <strong>Category:</strong> {reply.category}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <h3 className="text-md font-semibold">Add New Reply</h3>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reply Message"
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addReply}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Reply
        </button>
      </div>
    </div>
  );
};

export default SavedReplies;

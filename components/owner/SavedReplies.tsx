// components/owner/SavedReplies.tsx

import { useState, useEffect } from "react";

const SavedReplies = () => {
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await fetch("/api/SavedReply");
        const data = await res.json();
        setReplies(data);
      } catch (error) {
        console.error("Failed to fetch saved replies:", error);
      }
    };
    fetchReplies();
  }, []);

  const addReply = async () => {
    try {
      const res = await fetch("/api/SavedReply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, category }),
      });
      const data = await res.json();
      setReplies((prev) => [...prev, data]);
      setMessage("");
      setCategory("");
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const deleteReply = async (id: string) => {
    try {
      await fetch(`/api/SavedReply?id=${id}`, { method: "DELETE" });
      setReplies((prev) => prev.filter((reply) => reply._id !== id));
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Manage Saved Replies</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Reply message"
        className="w-full mb-2 p-2 border rounded-md"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full mb-2 p-2 border rounded-md"
      />
      <button
        onClick={addReply}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Reply
      </button>
      <div className="mt-4">
        {replies.map((reply) => (
          <div
            key={reply._id}
            className="flex items-center justify-between mb-2"
          >
            <p>
              {reply.message} ({reply.category})
            </p>
            <button
              onClick={() => deleteReply(reply._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedReplies;

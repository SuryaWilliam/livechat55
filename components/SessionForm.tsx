// components/SessionForm.tsx

import { useState } from "react";
import { useRouter } from "next/router";

const SessionForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startChat = async () => {
    if (!username || !description || !category) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, description, category }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/chat/${data.sessionId}`);
      } else {
        setError(data.error || "Failed to start chat.");
      }
    } catch (error) {
      setError("Error starting chat. Please try again.");
      console.error("Error starting chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Start a New Chat</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your issue"
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="border p-2 rounded w-full mb-2"
      />

      <button
        onClick={startChat}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Starting..." : "Start Chat"}
      </button>
    </div>
  );
};

export default SessionForm;

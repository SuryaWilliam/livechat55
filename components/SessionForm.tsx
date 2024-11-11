// components/SessionForm.tsx

import { useState } from "react";
import { useRouter } from "next/router";

const SessionForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const startChat = async () => {
    if (!username || !description || !category) {
      setError("All fields are required.");
      return;
    }

    setError("");

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
      console.error("Error starting chat session:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Start a Chat</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full mb-2 p-2 border rounded-md"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full mb-2 p-2 border rounded-md"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full mb-4 p-2 border rounded-md"
      />
      <button
        onClick={startChat}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Start Chat
      </button>
    </div>
  );
};

export default SessionForm;

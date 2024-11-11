// components/admin/ChatHistory.tsx

import { useState } from "react";

interface ChatMessage {
  _id: string;
  timestamp: string;
  sender: string;
  content: string;
}

interface ChatSession {
  _id: string;
  username: string;
  description: string;
  messages: ChatMessage[];
}

const ChatHistory = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/chatHistory?query=${query}`);
      if (!res.ok) throw new Error("Failed to fetch chat history");
      const data = await res.json();
      setResults(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Chat History</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by username or description"
        className="w-full p-2 border rounded-md mb-2"
      />
      <button
        onClick={searchChats}
        className="py-2 px-4 bg-blue-500 text-white rounded-md mb-4"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
      <div>
        {results.map(({ _id, username, description, messages }) => (
          <div key={_id} className="mb-4 p-2 border rounded-md">
            <p className="font-bold">
              {username} - {description}
            </p>
            <ul className="pl-4">
              {messages.map((msg) => (
                <li key={msg._id} className="text-sm mb-1">
                  <span className="text-gray-600">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>{" "}
                  - <strong>{msg.sender}</strong>: {msg.content}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;

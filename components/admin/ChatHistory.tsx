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
      setError("Could not load chat history. Please try again.");
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearResults = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Chat History</h2>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={handleSearchInputChange}
          placeholder="Search by username or description"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={searchChats}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
        >
          Clear
        </button>
      </div>

      {error && <div className="error-message mb-4">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="chat-history-list">
          {results.map((session) => (
            <li key={session._id} className="mb-4 border-b pb-2">
              <h3 className="font-bold">{session.username}</h3>
              <p>{session.description}</p>
              <ul className="messages-list">
                {session.messages.map((msg) => (
                  <li key={msg._id} className="pl-4">
                    <p>
                      <strong>{msg.sender}</strong>: {msg.content}
                    </p>
                    <small>{new Date(msg.timestamp).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatHistory;

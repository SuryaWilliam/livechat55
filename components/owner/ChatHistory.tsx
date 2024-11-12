// components/owner/ChatHistory.tsx

import { useEffect, useState } from "react";

interface ChatSession {
  _id: string;
  username: string;
  assignedAgent?: { name: string };
  createdAt: string;
}

const ChatHistory = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/owner/chatHistory?searchQuery=${searchQuery}`
      );
      if (!res.ok) throw new Error("Failed to fetch chat history");

      const data = await res.json();
      setChats(data);
    } catch (error) {
      setError("Could not load chat history. Please try again.");
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchChats();
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Chat History</h2>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search by username or agent name"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {loading ? (
        <p>Loading chat history...</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat._id} className="mb-4 border-b pb-2">
              <p>
                <strong>Username:</strong> {chat.username}
              </p>
              <p>
                <strong>Assigned Agent:</strong>{" "}
                {chat.assignedAgent?.name || "Unassigned"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(chat.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatHistory;

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

  useEffect(() => {
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
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <p>Loading chat history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Chat History</h2>
      <input
        type="text"
        placeholder="Search by keyword"
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 border rounded-md mb-4"
      />
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} className="mb-2">
            <p>
              <strong>User:</strong> {chat.username} <br />
              <strong>Agent:</strong> {chat.assignedAgent?.name || "Unassigned"}{" "}
              <br />
              <strong>Started:</strong>{" "}
              {new Date(chat.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;

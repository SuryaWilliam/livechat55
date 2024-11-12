// components/agent/AgentChatDashboard.tsx

import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Chat {
  _id: string;
  username: string;
  message: string;
  status: string;
}

const AgentChatDashboard = () => {
  const [activeChats, setActiveChats] = useState<Chat[]>([]);
  const [queuedChats, setQueuedChats] = useState<Chat[]>([]);
  const [offlineMessages, setOfflineMessages] = useState<Chat[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = io();

  useEffect(() => {
    fetchChats();

    // Real-time socket listeners
    socket.on("new_chat", (chat: Chat) =>
      setQueuedChats((prev) => [...prev, chat])
    );
    socket.on("chat_ended", (chatId: string) =>
      setActiveChats((prev) => prev.filter((chat) => chat._id !== chatId))
    );

    return () => {
      socket.off("new_chat");
      socket.off("chat_ended");
      socket.disconnect();
    };
  }, []);

  const fetchChats = async () => {
    setError(null);
    try {
      const [activeResponse, queuedResponse, offlineResponse] =
        await Promise.all([
          fetch("/api/agent/activeChats"),
          fetch("/api/agent/queuedChats"),
          fetch("/api/agent/offlineMessages"),
        ]);

      if (!activeResponse.ok || !queuedResponse.ok || !offlineResponse.ok) {
        throw new Error("Failed to fetch chat data");
      }

      const activeData = await activeResponse.json();
      const queuedData = await queuedResponse.json();
      const offlineData = await offlineResponse.json();

      setActiveChats(activeData);
      setQueuedChats(queuedData);
      setOfflineMessages(offlineData);
    } catch (error) {
      setError("Could not load chat data. Please try again.");
      console.error("Error fetching chat data:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Agent Chat Dashboard</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="mb-4">
        <p>
          <strong>Availability:</strong>{" "}
          {isAvailable ? "Available" : "Unavailable"}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Active Chats</h3>
        <ul>
          {activeChats.map((chat) => (
            <li key={chat._id} className="mb-2 border-b pb-2">
              <p>
                <strong>Username:</strong> {chat.username}
              </p>
              <p>
                <strong>Message:</strong> {chat.message}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Queued Chats</h3>
        <ul>
          {queuedChats.map((chat) => (
            <li key={chat._id} className="mb-2 border-b pb-2">
              <p>
                <strong>Username:</strong> {chat.username}
              </p>
              <p>
                <strong>Message:</strong> {chat.message}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Offline Messages</h3>
        <ul>
          {offlineMessages.map((msg) => (
            <li key={msg._id} className="mb-2 border-b pb-2">
              <p>
                <strong>Username:</strong> {msg.username}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgentChatDashboard;

// components/agent/AgentChatDashboard.tsx

import { useEffect, useState } from "react";
import io from "socket.io-client";

const AgentChatDashboard = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [queuedChats, setQueuedChats] = useState([]);
  const [offlineMessages, setOfflineMessages] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const socket = io();

  useEffect(() => {
    // Fetch initial data on load
    fetchChats();

    // Real-time socket listeners
    socket.on("new_chat", (chat) => setQueuedChats((prev) => [...prev, chat]));
    socket.on("chat_ended", (chatId) =>
      setActiveChats((prev) => prev.filter((chat) => chat._id !== chatId))
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchChats = async () => {
    try {
      const activeResponse = await fetch("/api/agent/activeChats");
      const queuedResponse = await fetch("/api/agent/queuedChats");
      const offlineResponse = await fetch("/api/agent/offlineMessages");

      setActiveChats(await activeResponse.json());
      setQueuedChats(await queuedResponse.json());
      setOfflineMessages(await offlineResponse.json());
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  };

  const handleAvailabilityToggle = async () => {
    setIsAvailable((prev) => !prev);
    await fetch("/api/agent/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !isAvailable }),
    });
  };

  const handleJoinChat = (chatId: string) => {
    socket.emit("join_chat", chatId);
    // Redirect to chat room component
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Agent Dashboard</h2>

      <button
        onClick={handleAvailabilityToggle}
        className={`py-2 px-4 mb-4 ${
          isAvailable ? "bg-green-500" : "bg-red-500"
        } text-white rounded-md`}
      >
        {isAvailable ? "Set Unavailable" : "Set Available"}
      </button>

      <h3 className="text-md font-semibold">Active Chats</h3>
      <ul>
        {activeChats.map((chat) => (
          <li key={chat._id}>
            <p>{chat.username}</p>
            <button
              onClick={() => handleJoinChat(chat._id)}
              className="text-blue-500 hover:underline"
            >
              Join Chat
            </button>
          </li>
        ))}
      </ul>

      <h3 className="text-md font-semibold mt-4">Queued Chats</h3>
      <ul>
        {queuedChats.map((chat) => (
          <li key={chat._id}>
            <p>{chat.username}</p>
            <button
              onClick={() => handleJoinChat(chat._id)}
              className="text-blue-500 hover:underline"
            >
              Accept Chat
            </button>
          </li>
        ))}
      </ul>

      <h3 className="text-md font-semibold mt-4">Offline Messages</h3>
      <ul>
        {offlineMessages.map((msg) => (
          <li key={msg._id}>
            <p>
              {msg.username}: {msg.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentChatDashboard;

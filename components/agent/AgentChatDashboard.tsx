// components/agent/AgentChatDashboard.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface Chat {
  sessionId: string;
  user: string;
  lastMessage: string;
  updatedAt: Date;
}

const AgentChatDashboard: React.FC = () => {
  const [assignedChats, setAssignedChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Request initial list of assigned chats
    socket.emit("get_assigned_chats");

    // Listen for updates to assigned chats
    socket.on("assigned_chats_update", (updatedChats: Chat[]) => {
      setAssignedChats(updatedChats);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("assigned_chats_update");
    };
  }, []);

  return (
    <div>
      <h3>My Assigned Chats</h3>
      <ul>
        {assignedChats.map((chat) => (
          <li key={chat.sessionId}>
            <strong>{chat.user}</strong> - {chat.lastMessage}
            <span>
              {" "}
              (Updated: {new Date(chat.updatedAt).toLocaleTimeString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentChatDashboard;

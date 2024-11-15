// components/admin/ActiveChats.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface ActiveChat {
  sessionId: string;
  user: string;
  startedAt: Date;
}

const ActiveChats: React.FC = () => {
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);

  useEffect(() => {
    // Listen for active chat updates from the server
    socket.on("active_chats_update", (updatedChats: ActiveChat[]) => {
      setActiveChats(updatedChats);
    });

    // Request initial active chats list on component mount
    socket.emit("get_active_chats");

    return () => {
      socket.off("active_chats_update");
    };
  }, []);

  return (
    <div>
      <h2>Active Chats</h2>
      <ul>
        {activeChats.map((chat) => (
          <li key={chat.sessionId}>
            {chat.user} - Started at{" "}
            {new Date(chat.startedAt).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveChats;

// components/admin/QueuedChats.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface QueuedChat {
  sessionId: string;
  user: string;
  joinedAt: Date;
}

const QueuedChats: React.FC = () => {
  const [queuedChats, setQueuedChats] = useState<QueuedChat[]>([]);

  useEffect(() => {
    // Request initial queued chats
    socket.emit("get_queued_chats");

    // Listen for updates to the queued chats
    socket.on("queued_chats_update", (updatedQueue: QueuedChat[]) => {
      setQueuedChats(updatedQueue);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("queued_chats_update");
    };
  }, []);

  return (
    <div>
      <h3>Queued Chats</h3>
      <ul>
        {queuedChats.map((chat) => (
          <li key={chat.sessionId}>
            {chat.user} - Joined at{" "}
            {new Date(chat.joinedAt).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QueuedChats;

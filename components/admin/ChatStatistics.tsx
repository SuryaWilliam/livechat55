// components/admin/ChatStatistics.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface ChatStatistics {
  activeChats: number;
  averageResponseTime: number; // in seconds
  resolvedChats: number;
}

const ChatStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<ChatStatistics>({
    activeChats: 0,
    averageResponseTime: 0,
    resolvedChats: 0,
  });

  useEffect(() => {
    // Request initial chat statistics
    socket.emit("get_chat_statistics");

    // Listen for updates to chat statistics
    socket.on("chat_statistics_update", (updatedStatistics: ChatStatistics) => {
      setStatistics(updatedStatistics);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("chat_statistics_update");
    };
  }, []);

  return (
    <div>
      <h3>Chat Statistics</h3>
      <ul>
        <li>Active Chats: {statistics.activeChats}</li>
        <li>Resolved Chats: {statistics.resolvedChats}</li>
        <li>Average Response Time: {statistics.averageResponseTime} seconds</li>
      </ul>
    </div>
  );
};

export default ChatStatistics;

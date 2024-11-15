// components/owner/ChatHistory.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface ChatHistoryEntry {
  sessionId: string;
  user: string;
  agent: string;
  messages: Array<{ sender: string; content: string; timestamp: Date }>;
  resolvedAt?: Date;
}

const ChatHistory: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);

  useEffect(() => {
    // Request initial chat history
    socket.emit("get_chat_history");

    // Listen for updates to the chat history
    socket.on("chat_history_update", (updatedHistory: ChatHistoryEntry[]) => {
      setChatHistory(updatedHistory);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("chat_history_update");
    };
  }, []);

  return (
    <div>
      <h3>Chat History</h3>
      <ul>
        {chatHistory.map((chat) => (
          <li key={chat.sessionId}>
            <h4>
              Session with {chat.user} (Agent: {chat.agent})
            </h4>
            <ul>
              {chat.messages.map((msg, index) => (
                <li key={index}>
                  <strong>
                    {msg.sender === "user" ? chat.user : chat.agent}:
                  </strong>{" "}
                  {msg.content} - {new Date(msg.timestamp).toLocaleTimeString()}
                </li>
              ))}
            </ul>
            {chat.resolvedAt && (
              <p>Resolved at: {new Date(chat.resolvedAt).toLocaleString()}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;

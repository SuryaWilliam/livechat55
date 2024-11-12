// components/admin/AdminChatInterface.tsx

import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io();

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

interface AdminChatInterfaceProps {
  sessionId: string;
}

const AdminChatInterface = ({ sessionId }: AdminChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chats/${sessionId}/messages`);
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        setError("Could not load messages. Please try again.");
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [sessionId]);

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReply(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!reply.trim()) return;
    try {
      await fetch(`/api/chats/${sessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: reply }),
      });
      setReply("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h1>Admin Chat Interface</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>
              <strong>{msg.sender}</strong>: {msg.content}
            </p>
            <p className="timestamp">{msg.timestamp}</p>
          </div>
        ))}
      </div>

      <div className="reply-box">
        <input
          type="text"
          value={reply}
          onChange={handleReplyChange}
          placeholder="Type a reply..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AdminChatInterface;

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chats/${sessionId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [sessionId]);

  const sendMessage = async () => {
    if (!reply.trim()) return;

    const message: Message = {
      sender: "admin",
      content: reply,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/chats/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      if (res.ok) {
        setMessages((prevMessages) => [...prevMessages, message]);
        socket.emit("adminReply", { sessionId, message });
        setReply("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Chat with User</h2>
      <div className="h-64 overflow-y-scroll border p-4 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === "admin" ? "text-right" : ""}`}
          >
            <p
              className={`${
                msg.sender === "admin" ? "text-blue-500" : "text-gray-700"
              }`}
            >
              {msg.content}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type a reply..."
          className="w-full p-2 border rounded-md mr-2"
        />
        <button
          onClick={sendMessage}
          className="py-2 px-4 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminChatInterface;

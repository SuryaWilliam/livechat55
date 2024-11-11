// pages/agent/chat/[sessionId].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import MessageInput from "../../../components/MessageInput";
import ChatBox from "../../../components/ChatBox";

let socket;

const AgentChatRoom = () => {
  const router = useRouter();
  const { sessionId } = router.query;
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    // Initialize socket connection
    socket = io();

    // Join the session room
    socket.emit("join_session", sessionId);

    // Listen for new messages
    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing events
    socket.on("typing", (typingStatus) => {
      setIsTyping(typingStatus);
    });

    // Fetch initial chat messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/agent/messages?sessionId=${sessionId}`);
        const data = await res.json();
        if (res.ok) setMessages(data.messages);
        else setError(data.error || "Failed to load messages.");
      } catch (err) {
        setError("Error loading chat messages.");
      }
    };

    fetchMessages();

    return () => socket.disconnect();
  }, [sessionId]);

  const handleSendMessage = async (content) => {
    if (!sessionId || !content.trim()) return;

    const message = { sessionId, sender: "agent", content };
    socket.emit("new_message", message);

    await fetch("/api/agent/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-center font-bold text-lg p-4">Chat with User</h1>
      <ChatBox messages={messages} isTyping={isTyping} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default AgentChatRoom;

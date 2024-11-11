// components/agent/AgentChatRoom.tsx

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import MessageInput from "../MessageInput";

const socket = io();

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const AgentChatRoom = ({ sessionId, username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Join the chat session via socket
    socket.emit("join_chat", sessionId);

    // Fetch initial chat history
    const fetchMessages = async () => {
      const res = await fetch(`/api/message?sessionId=${sessionId}`);
      const data = await res.json();
      setMessages(data.messages);
    };
    fetchMessages();

    // Listen for incoming messages
    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Handle typing indicator
    socket.on("typing", ({ typing, sender }) => {
      setIsTyping(typing && sender !== "agent");
    });

    return () => {
      socket.emit("leave_chat", sessionId); // Clean up on unmount
    };
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const message: Message = {
      sender: "agent",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);
    socket.emit("send_message", { sessionId, message });
    setInput("");

    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        content: message.content,
        sender: "agent",
      }),
    });
  };

  const handleTyping = (typing: boolean) => {
    socket.emit("typing", { sessionId, typing, sender: "agent" });
  };

  return (
    <div className="chat-room">
      <h2>Chat with {username}</h2>
      <div className="message-list">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === "agent" ? "agent" : "user"}`}
          >
            <span>{msg.content}</span>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      {isTyping && <p className="typing-indicator">User is typing...</p>}
      <MessageInput
        input={input}
        setInput={setInput}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
};

export default AgentChatRoom;

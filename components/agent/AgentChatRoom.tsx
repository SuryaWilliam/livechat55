// components/agent/AgentChatRoom.tsx

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import MessageInput from "../MessageInput";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

interface AgentChatRoomProps {
  sessionId: string;
  username: string;
}

const socket = io();

const AgentChatRoom = ({ sessionId, username }: AgentChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Join the chat session via socket
    socket.emit("join_chat", sessionId);

    // Fetch initial chat history
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/message?sessionId=${sessionId}`);
        if (!res.ok) throw new Error("Failed to load messages");

        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        setError("Could not load chat history. Please try again.");
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    // Listen for incoming messages
    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off("receive_message");
      socket.emit("leave_chat", sessionId);
    };
  }, [sessionId]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: username,
      content: input,
      timestamp: new Date().toISOString(),
    };

    try {
      socket.emit("send_message", { sessionId, message: newMessage });
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      scrollToBottom();
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-room p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Chat Room</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="messages mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="message mb-2">
            <p>
              <strong>{msg.sender}</strong>: {msg.content}
            </p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default AgentChatRoom;

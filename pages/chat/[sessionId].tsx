// pages/chat/[sessionId].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import ChatBox from "../../components/ChatBox";
import MessageInput from "../../components/MessageInput";

let socket: any;

const ChatRoom = () => {
  const router = useRouter();
  const { sessionId } = router.query;
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    // Connect to socket.io server
    socket = io();

    // Join the chat session
    socket.emit("join_session", sessionId);

    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch initial messages from the database
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/Message?sessionId=${sessionId}`);
        const data = await res.json();

        if (res.ok) {
          setMessages(data.messages);
        } else {
          setError(data.error || "Failed to load messages.");
        }
      } catch (err) {
        setError("An error occurred while loading the chat.");
      }
    };

    fetchMessages();

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    const message = { sessionId, sender: "user", content };

    // Emit the message to Socket.IO
    socket.emit("new_message", message);

    // Persist the message in the database
    await fetch("/api/Message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-center font-bold text-lg p-4">Chat Room</h1>
      <ChatBox messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;

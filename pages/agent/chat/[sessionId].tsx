// pages/agent/chat/[sessionId].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "../../../components/MessageInput";
import ChatBox from "../../../components/ChatBox";

let socket: Socket;

const AgentChatRoom = () => {
  const router = useRouter();
  const { sessionId } = router.query;
  const [messages, setMessages] = useState<
    Array<{ sender: string; content: string }>
  >([]);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    socket = io();

    socket.emit("join_session", sessionId);

    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("typing", (typingStatus) => {
      setIsTyping(typingStatus);
    });

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/agent/messages?sessionId=${sessionId}`);
        if (!res.ok) throw new Error("Failed to load messages");

        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        setError("Could not load messages. Please try again.");
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    return () => {
      socket.off("new_message");
      socket.off("typing");
      socket.disconnect();
    };
  }, [sessionId]);

  const handleSendMessage = (content: string) => {
    const message = { sender: "agent", content };
    socket.emit("send_message", message);
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">
        Chat Room - Session {sessionId}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <ChatBox messages={messages} isTyping={isTyping} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default AgentChatRoom;

// pages/chat/[sessionId].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChatBox from "../../components/ChatBox";
import MessageInput from "../../components/MessageInput";

let socket: Socket;

const ChatRoom = () => {
  const router = useRouter();
  const { sessionId } = router.query;
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    socket = io();

    socket.emit("join_session", sessionId);

    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/message?sessionId=${sessionId}`);
        const data = await res.json();

        if (res.ok) {
          setMessages(data.messages);
        } else {
          setError("Failed to load messages");
        }
      } catch (err) {
        setError("Error loading messages");
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    return () => {
      socket.off("new_message");
      socket.disconnect();
    };
  }, [sessionId]);

  const handleSendMessage = (content: string) => {
    const message = { sender: "user", content };
    socket.emit("send_message", message);
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">
        Chat Room - Session {sessionId}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <ChatBox messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;

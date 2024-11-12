// components/ChatRoom.tsx

import { useState, useEffect } from "react";
import ChatRating from "./ChatRating";
import io, { Socket } from "socket.io-client";

interface ChatRoomProps {
  sessionId: string;
}

let socket: Socket;

const ChatRoom: React.FC<ChatRoomProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<
    Array<{ sender: string; content: string; timestamp: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    socket = io();
    socket.emit("join_queue", { sessionId });

    socket.on("join_chat", () => {
      setInQueue(false);
      setQueuePosition(null);
    });

    socket.on("queue_position", ({ position }) => {
      setInQueue(true);
      setQueuePosition(position + 1);
    });

    socket.on("new_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("typing", (status) => setIsTyping(status));

    return () => {
      socket.off("join_chat");
      socket.off("queue_position");
      socket.off("new_message");
      socket.off("typing");
      socket.disconnect();
    };
  }, [sessionId]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
  };

  return (
    <div className="chat-room p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Chat Room</h2>

      {inQueue && queuePosition && (
        <p>Your position in queue: {queuePosition}</p>
      )}

      <div className="messages mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`p-2 inline-block ${
                msg.sender === "user" ? "bg-blue-200" : "bg-gray-200"
              } rounded-md`}
            >
              {msg.content}
            </span>
            <br />
            <small className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
        {isTyping && (
          <p className="text-sm italic text-gray-500">Agent is typing...</p>
        )}
      </div>

      <div className="message-input mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={() => socket.emit("typing", true)}
          placeholder="Type your message..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>

      {showRating && (
        <ChatRating
          sessionId={sessionId}
          onRatingSubmitted={() => setShowRating(false)}
        />
      )}
    </div>
  );
};

export default ChatRoom;

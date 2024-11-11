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
    socket.emit("join_queue");

    socket.on("join_chat", () => {
      setInQueue(false);
    });

    socket.on("queue_position", ({ position }) => {
      setInQueue(true);
      setQueuePosition(position + 1);
    });

    socket.on("new_message", (message) =>
      setMessages((prev) => [...prev, message])
    );
    socket.on("typing", (typing) => setIsTyping(typing));

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const message = {
      sessionId,
      sender: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    socket.emit("new_message", message);
    setMessages((prev) => [...prev, message]);
    setInput("");
    socket.emit("typing", { sessionId, typing: false });
  };

  return (
    <div className="flex flex-col h-screen">
      {inQueue ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p>Your position in the queue: {queuePosition}</p>
          <p>Please wait for an available agent...</p>
        </div>
      ) : (
        <>
          <div className="overflow-y-auto flex-1 p-4">
            {messages.map((msg, idx) => (
              <p key={idx} className="mb-2">
                <span className="text-gray-600">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>{" "}
                - <strong>{msg.sender}</strong>: {msg.content}
              </p>
            ))}
            {isTyping && (
              <p className="text-sm italic text-gray-500">User is typing...</p>
            )}
          </div>
          {!showRating ? (
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Send
              </button>
              <button
                onClick={() => setShowRating(true)}
                className="ml-2 p-2 bg-gray-300 rounded"
              >
                End Chat
              </button>
            </div>
          ) : (
            <ChatRating
              sessionId={sessionId}
              onRatingSubmitted={() => setShowRating(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ChatRoom;

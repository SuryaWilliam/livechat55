// components/ChatBox.tsx
import { useEffect, useRef, useState } from "react";
import socket from "../lib/socket";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  sessionId: string;
  initialMessages: Message[]; // Messages preloaded from the server
  isTyping?: boolean; // Optional typing indicator
}

const ChatBox: React.FC<ChatBoxProps> = ({
  sessionId,
  initialMessages,
  isTyping = false,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Join the chat session room
    socket.emit("join_session", sessionId);

    // Listen for new messages
    socket.on("new_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup listeners and leave session on unmount
    return () => {
      socket.emit("leave_session", sessionId);
      socket.off("new_message");
    };
  }, [sessionId]);

  // Automatically scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col p-4 overflow-y-auto max-h-80 border-b border-gray-300">
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
          <div className="text-xs text-gray-500">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
      {isTyping && (
        <p className="text-sm italic text-gray-500">User is typing...</p>
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatBox;

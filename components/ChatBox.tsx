// components/ChatBox.tsx

import { useEffect, useRef } from "react";

interface ChatBoxProps {
  messages: Array<{ sender: string; content: string }>;
  isTyping: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, isTyping }) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col p-4 overflow-y-auto max-h-80 border-b border-gray-300">
      {messages?.map((msg, index) => (
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

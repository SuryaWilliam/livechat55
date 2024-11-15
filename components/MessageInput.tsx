// components/MessageInput.tsx
import { useState } from "react";
import socket from "../lib/socket";

interface MessageInputProps {
  sessionId: string; // Chat session ID
  onMessageSent?: (message: string) => void; // Optional callback when a message is sent
}

const MessageInput: React.FC<MessageInputProps> = ({
  sessionId,
  onMessageSent,
}) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageData = {
        sessionId,
        sender: "user", // Adjust for agents if needed
        content: message,
        timestamp: new Date(),
      };

      // Emit the message to the server
      socket.emit("send_message", messageData);

      // Call the callback if provided
      if (onMessageSent) {
        onMessageSent(message);
      }

      setMessage(""); // Clear the input field
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="message-input-field"
      />
      <button onClick={handleSendMessage} className="send-message-button">
        Send
      </button>
    </div>
  );
};

export default MessageInput;

// components/admin/AdminChatInterface.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

interface AdminChatInterfaceProps {
  sessionId: string;
}

const AdminChatInterface: React.FC<AdminChatInterfaceProps> = ({
  sessionId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Join the chat room for the selected session
    socket.emit("join_session", sessionId);

    // Listen for incoming messages
    socket.on("new_message", (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup: leave session on component unmount
    return () => {
      socket.emit("leave_session", sessionId);
      socket.off("new_message");
    };
  }, [sessionId]);

  // Send a message to the chat session
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sessionId,
        sender: "admin",
        content: newMessage,
        timestamp: new Date(),
      };

      // Emit message to server
      socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage(""); // Clear input field
    }
  };

  return (
    <div>
      <h3>Chat with User</h3>
      <div className="message-area">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "admin" ? "admin-message" : "user-message"
            }`}
          >
            <span>{msg.content}</span>
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default AdminChatInterface;

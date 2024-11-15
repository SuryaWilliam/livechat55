// components/agent/AgentChatRoom.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface AgentChatRoomProps {
  sessionId: string;
  user: string;
}

const AgentChatRoom: React.FC<AgentChatRoomProps> = ({ sessionId, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Join the chat room
    socket.emit("join_session", sessionId);

    // Listen for new messages
    socket.on("new_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup listener and leave room on unmount
    return () => {
      socket.emit("leave_session", sessionId);
      socket.off("new_message");
    };
  }, [sessionId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sessionId,
        sender: "agent",
        content: newMessage,
        timestamp: new Date(),
      };

      // Emit the message to the server
      socket.emit("send_message", messageData);

      // Add the message to the local state
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage(""); // Clear the input field
    }
  };

  return (
    <div>
      <h3>Chat with {user}</h3>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "agent" ? "agent-message" : "user-message"
            }`}
          >
            <strong>{msg.sender === "agent" ? "You" : user}:</strong>{" "}
            {msg.content}
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
        placeholder="Type your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default AgentChatRoom;

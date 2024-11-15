// components/ChatRoom.tsx
import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import socket from "../lib/socket";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatRoomProps {
  sessionId: string;
  initialMessages: Message[]; // Preloaded messages from the server
}

const ChatRoom: React.FC<ChatRoomProps> = ({ sessionId, initialMessages }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Listen for new messages
    socket.on("new_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for typing status
    socket.on("typing_status", (status: boolean) => {
      setIsTyping(status);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("new_message");
      socket.off("typing_status");
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sessionId,
        sender: "user", // Replace with "agent" for agents
        content: newMessage,
        timestamp: new Date(),
      };

      // Emit the message to the server
      socket.emit("send_message", messageData);

      // Add the message locally
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage(""); // Clear the input field
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { sessionId, isTyping: true });
    setTimeout(
      () => socket.emit("typing", { sessionId, isTyping: false }),
      3000
    );
  };

  return (
    <div>
      <ChatBox
        sessionId={sessionId}
        initialMessages={messages}
        isTyping={isTyping}
      />
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type your message..."
          className="message-input-field"
        />
        <button onClick={handleSendMessage} className="send-message-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

// components/agent/EndChatButton.tsx
import socket from "../../lib/socket";

interface EndChatButtonProps {
  sessionId: string;
  onChatEnded: () => void; // Callback to handle UI updates after ending the chat
}

const EndChatButton: React.FC<EndChatButtonProps> = ({
  sessionId,
  onChatEnded,
}) => {
  const handleEndChat = () => {
    if (confirm("Are you sure you want to end this chat session?")) {
      socket.emit("end_chat", { sessionId });
      onChatEnded(); // Notify parent component or update local state
    }
  };

  return (
    <button onClick={handleEndChat} className="end-chat-button">
      End Chat
    </button>
  );
};

export default EndChatButton;

// components/agent/EndChatButton.tsx

import { useRouter } from "next/router";

const EndChatButton = ({ sessionId }) => {
  const router = useRouter();

  const handleEndChat = async () => {
    await fetch(`/api/agent/endChat`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    router.push("/agent/dashboard"); // Redirect to dashboard
  };

  return (
    <button onClick={handleEndChat} className="end-chat-button">
      End Chat
    </button>
  );
};

export default EndChatButton;

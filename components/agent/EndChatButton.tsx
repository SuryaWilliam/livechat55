// components/agent/EndChatButton.tsx

import { useRouter } from "next/router";
import { useState } from "react";

interface EndChatButtonProps {
  sessionId: string;
}

const EndChatButton = ({ sessionId }: EndChatButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEndChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/agent/endChat`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) throw new Error("Failed to end chat");

      router.push("/agent/dashboard"); // Redirect to dashboard
    } catch (error) {
      setError("Could not end chat. Please try again.");
      console.error("Error ending chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleEndChat}
        className="end-chat-button px-4 py-2 bg-red-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Ending..." : "End Chat"}
      </button>
    </div>
  );
};

export default EndChatButton;

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChatRoom from "../../../components/agent/ChatRoom";
import EndChatButton from "../../../components/agent/EndChatButton";
import AgentChatHeader from "../../../components/agent/AgentChatHeader";

const AgentChat = () => {
  const router = useRouter();
  const { sessionId } = router.query;
  const [chatDetails, setChatDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Fetch session details
      fetch(`/api/agent/messages?sessionId=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setChatDetails(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [sessionId]);

  if (loading) {
    return <div>Loading chat session...</div>;
  }

  if (!chatDetails) {
    return <div>Chat session not found.</div>;
  }

  return (
    <div className="agent-chat-page">
      <AgentChatHeader sessionId={sessionId} />
      <ChatRoom sessionId={sessionId} initialMessages={chatDetails.messages} />
      <EndChatButton
        sessionId={sessionId}
        onChatEnded={() => router.push("/agent/dashboard")}
      />
    </div>
  );
};

export default AgentChat;

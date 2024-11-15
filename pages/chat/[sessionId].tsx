import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChatRoom from "../../components/ChatRoom";
import ChatRating from "../../components/ChatRating";

const ChatPage = () => {
  const router = useRouter();
  const { sessionId } = router.query;

  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rated, setRated] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const fetchChatSession = async () => {
      try {
        const response = await fetch(`/api/session?sessionId=${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chat session");
        }
        const data = await response.json();
        setChatSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatSession();
  }, [sessionId]);

  if (loading) {
    return <div>Loading chat session...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!chatSession) {
    return <div>No chat session found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Chat Session</h1>
      <ChatRoom chatSession={chatSession} />
      {!rated && (
        <div className="mt-6">
          <ChatRating sessionId={sessionId} onRate={() => setRated(true)} />
        </div>
      )}
    </div>
  );
};

export default ChatPage;

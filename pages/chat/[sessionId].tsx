import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ChatRoom from "../../components/chat/ChatRoom";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatFooter from "../../components/chat/ChatFooter";

const ChatPage = () => {
  const router = useRouter();
  const { sessionId } = router.query;

  const [chatDetails, setChatDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/session?sessionId=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
            setChatDetails(null);
          } else {
            setChatDetails(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching chat session:", err);
          setLoading(false);
        });
    }
  }, [sessionId]);

  if (loading) {
    return <div>Loading chat session...</div>;
  }

  if (!chatDetails) {
    return <div>Chat session not found.</div>;
  }

  return (
    <div className="chat-page">
      <ChatHeader session={chatDetails} />
      <ChatRoom sessionId={sessionId} />
      <ChatFooter sessionId={sessionId} />
    </div>
  );
};

export default ChatPage;

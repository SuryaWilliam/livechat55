// pages/agent/dashboard.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import AgentAvailabilityToggle from "../../components/agent/AgentAvailabilityToggle";
import AgentPerformanceAnalytics from "../../components/agent/AgentPerformanceAnalytics";

const AgentDashboard = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [queuedChats, setQueuedChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const resActive = await fetch("/api/agent/activeChats");
        const resQueued = await fetch("/api/agent/queuedChats");
        const activeData = await resActive.json();
        const queuedData = await resQueued.json();

        setActiveChats(activeData);
        setQueuedChats(queuedData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return <p>Loading agent dashboard...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
      <AgentAvailabilityToggle />
      <AgentPerformanceAnalytics />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Active Chats</h2>
        {activeChats.length > 0 ? (
          <ul>
            {activeChats.map((chat) => (
              <li key={chat._id} className="mb-2">
                <p>
                  <strong>{chat.username}</strong> - {chat.category}
                </p>
                <Link href={`/agent/chat/${chat._id}`}>
                  <div className="text-blue-500 hover:underline">
                    Go to Chat
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No active chats at the moment.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Queued Chats</h2>
        {queuedChats.length > 0 ? (
          <ul>
            {queuedChats.map((chat) => (
              <li key={chat._id} className="mb-2">
                <p>
                  <strong>{chat.username}</strong> - {chat.category}
                </p>
                <Link href={`/agent/chat/${chat._id}`}>
                  <div className="text-blue-500 hover:underline">Join Chat</div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No queued chats.</p>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;

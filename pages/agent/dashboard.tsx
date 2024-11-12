// pages/agent/dashboard.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import AgentAvailabilityToggle from "../../components/agent/AgentAvailabilityToggle";
import AgentPerformanceAnalytics from "../../components/agent/AgentPerformanceAnalytics";

const AgentDashboard = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [queuedChats, setQueuedChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resActive, resQueued] = await Promise.all([
          fetch("/api/agent/activeChats"),
          fetch("/api/agent/queuedChats"),
        ]);

        if (!resActive.ok || !resQueued.ok)
          throw new Error("Failed to fetch chat data");

        const activeData = await resActive.json();
        const queuedData = await resQueued.json();

        setActiveChats(activeData);
        setQueuedChats(queuedData);
      } catch (error) {
        setError("Error loading chats. Please try again.");
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
      <AgentAvailabilityToggle />
      <AgentPerformanceAnalytics />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading chats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Active Chats</h2>
            <ul>
              {activeChats.map((chat) => (
                <li key={chat._id} className="mb-2">
                  <Link href={`/agent/chat/${chat._id}`}>
                    <div className="text-blue-500 underline">
                      Chat with {chat.username}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Queued Chats</h2>
            <ul>
              {queuedChats.map((chat) => (
                <li key={chat._id} className="mb-2">
                  <Link href={`/agent/chat/${chat._id}`}>
                    <div className="text-blue-500 underline">
                      Chat with {chat.username}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;

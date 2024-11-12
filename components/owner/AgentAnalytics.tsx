// components/owner/AgentAnalytics.tsx

import { useEffect, useState } from "react";

interface AgentData {
  _id: string;
  name: string;
  totalChats: number;
  avgResponseTime: number;
  avgRating: number;
}

const AgentAnalytics = () => {
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/owner/agentAnalytics");
        if (!res.ok) throw new Error("Failed to fetch agent analytics");

        const data = await res.json();
        setAgentData(data.agentData);
      } catch (error) {
        setError("Could not load agent analytics. Please try again.");
        console.error("Error fetching agent analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentAnalytics();
  }, []);

  if (loading) return <p>Loading agent analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Agent Analytics</h2>
      <ul>
        {agentData.map((agent) => (
          <li key={agent._id} className="mb-4 border-b pb-2">
            <p>
              <strong>Name:</strong> {agent.name}
            </p>
            <p>
              <strong>Total Chats:</strong> {agent.totalChats}
            </p>
            <p>
              <strong>Average Response Time:</strong>{" "}
              {agent.avgResponseTime.toFixed(2)} seconds
            </p>
            <p>
              <strong>Average Rating:</strong> {agent.avgRating.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentAnalytics;

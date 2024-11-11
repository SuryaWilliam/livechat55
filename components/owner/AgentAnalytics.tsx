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
        setError((error as Error).message);
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
      <h2 className="text-lg font-bold mb-2">Agent Performance Analytics</h2>
      <ul>
        {agentData.map((agent) => (
          <li key={agent._id} className="mb-4">
            <h3 className="text-md font-semibold">{agent.name}</h3>
            <p>Total Chats: {agent.totalChats}</p>
            <p>
              Average Response Time:{" "}
              {agent.avgResponseTime?.toFixed(2) || "N/A"} minutes
            </p>
            <p>Average Rating: {agent.avgRating?.toFixed(2) || "N/A"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentAnalytics;

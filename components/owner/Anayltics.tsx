// components/owner/Analytics.tsx

import { useEffect, useState } from "react";

interface AnalyticsData {
  totalChats: number;
  completedChats: number;
  avgRating: number;
  totalAgents: number;
  agentChats: { _id: string; chats: number }[];
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/owner/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");

        const result = await res.json();
        setData(result);
      } catch (error) {
        setError("Could not load analytics data. Please try again.");
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">System Analytics</h2>
      {data ? (
        <>
          <p>Total Chats: {data.totalChats}</p>
          <p>Completed Chats: {data.completedChats}</p>
          <p>Average Rating: {data.avgRating.toFixed(2)}</p>
          <p>Total Agents: {data.totalAgents}</p>
          <h3 className="text-md font-semibold mt-4">Chats per Agent:</h3>
          <ul>
            {data.agentChats.map((agent) => (
              <li key={agent._id}>
                Agent {agent._id}: {agent.chats} chats
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
};

export default Analytics;

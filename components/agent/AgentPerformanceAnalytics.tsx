// components/agent/AgentPerformanceAnalytics.tsx

import { useEffect, useState } from "react";

interface PerformanceData {
  totalChats: number;
  avgResponseTime: number;
  avgRating: number;
}

const AgentPerformanceAnalytics = () => {
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/agent/performance");
        if (!res.ok) throw new Error("Failed to fetch performance data.");

        const data = await res.json();
        setPerformanceData(data);
      } catch (error) {
        setError("Could not load performance data. Please try again.");
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) return <p>Loading performance data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Performance Analytics</h2>
      {performanceData && (
        <div>
          <p>Total Chats: {performanceData.totalChats}</p>
          <p>
            Average Response Time: {performanceData.avgResponseTime.toFixed(2)}{" "}
            seconds
          </p>
          <p>Average Rating: {performanceData.avgRating.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default AgentPerformanceAnalytics;

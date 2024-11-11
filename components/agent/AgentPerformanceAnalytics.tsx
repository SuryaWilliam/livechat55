// components/agent/AgentPerformanceAnalytics.tsx

import { useEffect, useState } from "react";

const AgentPerformanceAnalytics = () => {
  const [performanceData, setPerformanceData] = useState({
    totalChats: 0,
    avgResponseTime: 0,
    avgRating: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const res = await fetch("/api/agent/performance");
        const data = await res.json();
        setPerformanceData(data);
      } catch (err) {
        setError("Failed to fetch performance data.");
      }
    };

    fetchPerformanceData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Performance Analytics</h2>
      <p>Total Chats: {performanceData.totalChats}</p>
      <p>
        Average Response Time: {performanceData.avgResponseTime.toFixed(2)}{" "}
        minutes
      </p>
      <p>Average Rating: {performanceData.avgRating.toFixed(2)}</p>
    </div>
  );
};

export default AgentPerformanceAnalytics;

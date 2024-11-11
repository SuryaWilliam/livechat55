// components/admin/ChatStatistics.tsx

import { useEffect, useState } from "react";

interface ChatStatisticsData {
  totalChats: number;
  completedChats: number;
  averageRating: number;
}

const ChatStatistics = () => {
  const [stats, setStats] = useState<ChatStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/chatStatistics");
        if (!res.ok) throw new Error("Failed to fetch chat statistics");

        const data = await res.json();
        setStats(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading chat statistics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Chat Statistics</h2>
      {stats ? (
        <>
          <p>Total Chats: {stats.totalChats}</p>
          <p>Completed Chats: {stats.completedChats}</p>
          <p>Average Rating: {stats.averageRating.toFixed(2)}</p>
        </>
      ) : (
        <p>No statistics available.</p>
      )}
    </div>
  );
};

export default ChatStatistics;
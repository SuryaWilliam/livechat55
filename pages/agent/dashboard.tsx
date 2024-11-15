import { useEffect, useState } from "react";
import ActiveChats from "../../components/agent/AgentChatDashboard";
import AgentPerformanceAnalytics from "../../components/agent/AgentPerformanceAnalytics";

const AgentDashboard = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [performance, setPerformance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [chatsResponse, performanceResponse] = await Promise.all([
          fetch("/api/agent/activeChats"),
          fetch("/api/agent/performance"),
        ]);

        if (!chatsResponse.ok || !performanceResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const chatsData = await chatsResponse.json();
        const performanceData = await performanceResponse.json();

        setActiveChats(chatsData);
        setPerformance(performanceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Chats</h2>
          <ActiveChats chats={activeChats} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
          <AgentPerformanceAnalytics data={performance} />
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;

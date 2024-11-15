import { useEffect, useState } from "react";
import ActiveChats from "../../components/admin/ActiveChats";
import ChatStatistics from "../../components/admin/ChatStatistics";
import AgentAvailability from "../../components/admin/AgentAvailability";
import SystemSettings from "../../components/admin/SystemSettings";

const AdminDashboard = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [chatsResponse, statsResponse] = await Promise.all([
          fetch("/api/admin/activeChats"),
          fetch("/api/admin/chatStatistics"),
        ]);

        const chatsData = await chatsResponse.json();
        const statsData = await statsResponse.json();

        setActiveChats(chatsData);
        setStatistics(statsData);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Chats</h2>
          <ActiveChats chats={activeChats} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Chat Statistics</h2>
          <ChatStatistics statistics={statistics} />
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Agent Availability</h2>
        <AgentAvailability />
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">System Settings</h2>
        <SystemSettings />
      </div>
    </div>
  );
};

export default AdminDashboard;

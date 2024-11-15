import { useEffect, useState } from "react";
import ActiveChats from "../../components/agent/ActiveChats";
import QueuedChats from "../../components/agent/QueuedChats";
import AgentPerformanceAnalytics from "../../components/agent/AgentPerformanceAnalytics";
import AgentAvailabilityToggle from "../../components/agent/AgentAvailabilityToggle";

const AgentDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching or initialization
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="agent-dashboard">
      <h1>Agent Dashboard</h1>
      <div className="dashboard-section">
        <h2>My Active Chats</h2>
        <ActiveChats />
      </div>
      <div className="dashboard-section">
        <h2>Queued Chats</h2>
        <QueuedChats />
      </div>
      <div className="dashboard-section">
        <h2>My Performance Analytics</h2>
        <AgentPerformanceAnalytics />
      </div>
      <div className="dashboard-section">
        <h2>Availability</h2>
        <AgentAvailabilityToggle />
      </div>
    </div>
  );
};

export default AgentDashboard;

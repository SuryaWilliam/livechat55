import { useState, useEffect } from "react";
import OverviewStatistics from "../../components/owner/OverviewStatistics";
import AgentPerformance from "../../components/owner/AgentPerformance";
import SystemSettings from "../../components/owner/SystemSettings";
import AuditLogs from "../../components/owner/AuditLogs";

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching or initialization
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="owner-dashboard">
      <h1>Owner Dashboard</h1>

      <div className="dashboard-section">
        <h2>Overview Statistics</h2>
        <OverviewStatistics />
      </div>

      <div className="dashboard-section">
        <h2>Agent Performance</h2>
        <AgentPerformance />
      </div>

      <div className="dashboard-section">
        <h2>System Settings</h2>
        <SystemSettings />
      </div>

      <div className="dashboard-section">
        <h2>Audit Logs</h2>
        <AuditLogs />
      </div>
    </div>
  );
};

export default OwnerDashboard;

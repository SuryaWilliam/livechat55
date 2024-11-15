import { useEffect, useState } from "react";
import Analytics from "../../components/owner/Analytics";
import AgentAnalytics from "../../components/owner/AgentAnalytics";
import AuditLogs from "../../components/owner/AuditLogs";
import SystemSettings from "../../components/owner/SystemSettings";

const OwnerDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [agentAnalytics, setAgentAnalytics] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsResponse, agentAnalyticsResponse, auditLogsResponse] =
          await Promise.all([
            fetch("/api/owner/analytics"),
            fetch("/api/owner/agentAnalytics"),
            fetch("/api/owner/auditLogs"),
          ]);

        if (
          !analyticsResponse.ok ||
          !agentAnalyticsResponse.ok ||
          !auditLogsResponse.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        const analyticsData = await analyticsResponse.json();
        const agentAnalyticsData = await agentAnalyticsResponse.json();
        const auditLogsData = await auditLogsResponse.json();

        setAnalytics(analyticsData);
        setAgentAnalytics(agentAnalyticsData);
        setAuditLogs(auditLogsData);
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
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">System Analytics</h2>
          <Analytics data={analytics} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Agent Performance</h2>
          <AgentAnalytics data={agentAnalytics} />
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
        <AuditLogs logs={auditLogs} />
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">System Settings</h2>
        <SystemSettings />
      </div>
    </div>
  );
};

export default OwnerDashboard;

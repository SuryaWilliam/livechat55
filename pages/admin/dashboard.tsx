import { useEffect, useState } from "react";
import ActiveChats from "../../components/admin/ActiveChats";
import AuditLogViewer from "../../components/admin/AuditLogViewer";
import ChatStatistics from "../../components/admin/ChatStatistics";
import SystemSettings from "../../components/admin/SystemSettings";
import OfflineMessages from "../../components/admin/OfflineMessages";
import QueuedChats from "../../components/admin/QueuedChats";
import Reports from "../../components/admin/Reports";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching or initialization
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-section">
        <h2>Active Chats</h2>
        <ActiveChats />
      </div>
      <div className="dashboard-section">
        <h2>Audit Logs</h2>
        <AuditLogViewer />
      </div>
      <div className="dashboard-section">
        <h2>Chat Statistics</h2>
        <ChatStatistics />
      </div>
      <div className="dashboard-section">
        <h2>System Settings</h2>
        <SystemSettings />
      </div>
      <div className="dashboard-section">
        <h2>Offline Messages</h2>
        <OfflineMessages />
      </div>
      <div className="dashboard-section">
        <h2>Queued Chats</h2>
        <QueuedChats />
      </div>
      <div className="dashboard-section">
        <h2>Reports</h2>
        <Reports />
      </div>
    </div>
  );
};

export default AdminDashboard;

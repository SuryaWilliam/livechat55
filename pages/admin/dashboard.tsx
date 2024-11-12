// pages/admin/dashboard.tsx

import ActiveChats from "../../components/admin/ActiveChats";
import QueuedChats from "../../components/admin/QueuedChats";
import OfflineMessages from "../../components/admin/OfflineMessages";
import ChatStatistics from "../../components/admin/ChatStatistics";
import AdminNotifications from "../../components/admin/AdminNotifications";
import AgentAvailability from "../../components/admin/AgentAvailability";
import ChatHistory from "../../components/admin/ChatHistory";
import AuditLogViewer from "../../components/admin/AuditLogViewer";
import UserManagement from "../../components/admin/UserManagement";
import Reports from "../../components/admin/Reports";
import SystemSettings from "../../components/admin/SystemSettings";

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminNotifications />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActiveChats />
        <QueuedChats />
        <OfflineMessages />
        <ChatStatistics />
        <AgentAvailability />
        <ChatHistory />
        <AuditLogViewer />
        <UserManagement />
        <Reports />
        <SystemSettings />
      </div>
    </div>
  );
};

export default AdminDashboard;

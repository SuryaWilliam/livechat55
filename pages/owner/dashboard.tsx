// pages/owner/Dashboard.tsx

import UserManagement from "../../components/owner/UserManagement";
import RoleManagement from "../../components/owner/RoleManagement";
import SystemSettings from "../../components/owner/SystemSettings";
import AuditLogs from "../../components/owner/AuditLogs";
import Analytics from "../../components/owner/Analytics";

const OwnerDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserManagement />
        <RoleManagement />
        <SystemSettings />
        <AuditLogs />
        <Analytics />
      </div>
    </div>
  );
};

export default OwnerDashboard;

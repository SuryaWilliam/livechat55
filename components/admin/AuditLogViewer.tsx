// components/admin/AuditLogViewer.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface AuditLog {
  action: string;
  performedBy: string;
  timestamp: Date;
}

const AuditLogViewer: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    // Request initial audit logs
    socket.emit("get_audit_logs");

    // Listen for new audit logs
    socket.on("new_audit_log", (log: AuditLog) => {
      setAuditLogs((prevLogs) => [log, ...prevLogs]);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("new_audit_log");
    };
  }, []);

  return (
    <div>
      <h3>Audit Logs</h3>
      <ul>
        {auditLogs.map((log, index) => (
          <li key={index}>
            <strong>{log.action}</strong> by {log.performedBy} at{" "}
            {new Date(log.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogViewer;

// components/owner/AuditLogs.tsx

import { useEffect, useState } from "react";

interface AuditLog {
  _id: string;
  adminId: string;
  action: string;
  details: string;
  timestamp: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/owner/auditLogs");
        if (!res.ok) throw new Error("Failed to fetch audit logs");

        const data = await res.json();
        setLogs(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p>Loading audit logs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Audit Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log._id} className="mb-1">
            <p>
              <strong>{log.adminId}</strong> - {log.action}: {log.details} -{" "}
              <span className="text-gray-600">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogs;

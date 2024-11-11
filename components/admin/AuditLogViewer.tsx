// components/admin/AuditLogViewer.tsx

import { useEffect, useState } from "react";

interface AuditLog {
  id: number;
  message: string;
  timestamp: string;
  level?: string;
}

const AuditLogViewer = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    searchQuery: "",
    logLevel: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder: "desc",
        ...filters,
      });
      const res = await fetch(`/api/admin/auditLogs?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch audit logs");

      const data = await res.json();
      setAuditLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAuditLogs();
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      searchQuery: "",
      logLevel: "",
    });
    setPage(1);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Audit Log Viewer</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      {loading && <p>Loading audit logs...</p>}
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search logs"
          value={filters.searchQuery}
          onChange={(e) =>
            setFilters({ ...filters, searchQuery: e.target.value })
          }
          className="w-full p-2 border rounded-md mb-2"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="p-2 border rounded-md"
          />
          <select
            value={filters.logLevel}
            onChange={(e) =>
              setFilters({ ...filters, logLevel: e.target.value })
            }
            className="p-2 border rounded-md"
          >
            <option value="">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="py-2 px-4 bg-gray-300 text-gray-600 rounded-md"
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md"
          >
            Search
          </button>
        </div>
      </form>

      <ul>
        {auditLogs.map((log) => (
          <li key={log.id} className="mb-2 p-2 border-b">
            <p>{log.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleString()}{" "}
              {log.level && `[${log.level}]`}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="py-2 px-4 bg-gray-300 text-gray-600 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="py-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogViewer;

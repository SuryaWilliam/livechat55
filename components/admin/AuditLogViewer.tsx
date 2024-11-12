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
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError("Could not load audit logs. Please try again.");
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to page 1 when filters change
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Audit Logs</h2>

      {error && <div className="error-message mb-4">{error}</div>}

      <div className="filters mb-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          placeholder="Start Date"
          className="mr-2"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          placeholder="End Date"
          className="mr-2"
        />
        <input
          type="text"
          name="searchQuery"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          placeholder="Search..."
          className="mr-2"
        />
        <select
          name="logLevel"
          value={filters.logLevel}
          onChange={handleFilterChange}
          className="mr-2"
        >
          <option value="">All Levels</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="audit-logs mb-4">
          {auditLogs.map((log) => (
            <li key={log.id} className="mb-2 border-b pb-2">
              <p>{log.message}</p>
              <small>{new Date(log.timestamp).toLocaleString()}</small>
              {log.level && (
                <span className={`tag-${log.level}`}>{log.level}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogViewer;

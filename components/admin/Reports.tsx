// components/admin/Reports.tsx

import { useEffect, useState } from "react";

interface ReportData {
  completedChats: number;
  averageResponseTime: number;
  avgRating: number;
}

const Reports = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/reports");
        if (!res.ok) throw new Error("Failed to fetch reports");

        const data = await res.json();
        setReport(data);
      } catch (error) {
        setError("Could not load report data. Please try again.");
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <p>Loading report data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Reports</h2>
      {report && (
        <div>
          <p>Completed Chats: {report.completedChats}</p>
          <p>Average Response Time: {report.averageResponseTime} seconds</p>
          <p>Average Rating: {report.avgRating.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Reports;

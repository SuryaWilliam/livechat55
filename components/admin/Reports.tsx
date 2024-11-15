// components/admin/Reports.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface Report {
  title: string;
  value: number;
  lastUpdated: Date;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Request initial report data
    socket.emit("get_reports");

    // Listen for updates to reports
    socket.on("report_update", (updatedReports: Report[]) => {
      setReports(updatedReports);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("report_update");
    };
  }, []);

  return (
    <div>
      <h3>Reports</h3>
      <ul>
        {reports.map((report) => (
          <li key={report.title}>
            <strong>{report.title}</strong>: {report.value}
            <span>
              {" "}
              (Last updated: {new Date(report.lastUpdated).toLocaleTimeString()}
              )
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;

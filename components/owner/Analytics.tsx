// components/owner/Analytics.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface SystemAnalytics {
  totalChats: number;
  averageSatisfaction: number; // out of 5
  averageResponseTime: number; // in seconds
  totalAgents: number;
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<SystemAnalytics>({
    totalChats: 0,
    averageSatisfaction: 0,
    averageResponseTime: 0,
    totalAgents: 0,
  });

  useEffect(() => {
    // Request initial analytics data
    socket.emit("get_system_analytics");

    // Listen for updates to analytics data
    socket.on(
      "system_analytics_update",
      (updatedAnalytics: SystemAnalytics) => {
        setAnalytics(updatedAnalytics);
      }
    );

    // Cleanup listener on unmount
    return () => {
      socket.off("system_analytics_update");
    };
  }, []);

  return (
    <div>
      <h3>System Analytics</h3>
      <ul>
        <li>Total Chats: {analytics.totalChats}</li>
        <li>
          Average Satisfaction: {analytics.averageSatisfaction.toFixed(2)} / 5
        </li>
        <li>Average Response Time: {analytics.averageResponseTime} seconds</li>
        <li>Total Agents: {analytics.totalAgents}</li>
      </ul>
    </div>
  );
};

export default Analytics;

// components/agent/AgentPerformanceAnalytics.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface PerformanceData {
  resolvedChats: number;
  averageResponseTime: number; // in seconds
  rating: number; // out of 5
}

const AgentPerformanceAnalytics: React.FC = () => {
  const [performance, setPerformance] = useState<PerformanceData>({
    resolvedChats: 0,
    averageResponseTime: 0,
    rating: 0,
  });

  useEffect(() => {
    // Request initial performance metrics
    socket.emit("get_agent_performance");

    // Listen for performance updates
    socket.on(
      "agent_performance_update",
      (updatedPerformance: PerformanceData) => {
        setPerformance(updatedPerformance);
      }
    );

    // Cleanup listener on unmount
    return () => {
      socket.off("agent_performance_update");
    };
  }, []);

  return (
    <div>
      <h3>My Performance</h3>
      <ul>
        <li>Resolved Chats: {performance.resolvedChats}</li>
        <li>
          Average Response Time: {performance.averageResponseTime} seconds
        </li>
        <li>Rating: {performance.rating.toFixed(2)} / 5</li>
      </ul>
    </div>
  );
};

export default AgentPerformanceAnalytics;

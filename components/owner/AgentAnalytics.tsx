// components/owner/AgentAnalytics.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface AgentPerformance {
  agentId: string;
  name: string;
  resolvedChats: number;
  averageResponseTime: number; // in seconds
  rating: number; // out of 5
}

const AgentAnalytics: React.FC = () => {
  const [agentsPerformance, setAgentsPerformance] = useState<
    AgentPerformance[]
  >([]);

  useEffect(() => {
    // Request initial performance metrics for all agents
    socket.emit("get_agents_performance");

    // Listen for updates to agent performance
    socket.on(
      "agents_performance_update",
      (updatedPerformance: AgentPerformance[]) => {
        setAgentsPerformance(updatedPerformance);
      }
    );

    // Cleanup listener on unmount
    return () => {
      socket.off("agents_performance_update");
    };
  }, []);

  return (
    <div>
      <h3>Agent Performance Analytics</h3>
      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Resolved Chats</th>
            <th>Avg Response Time (s)</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {agentsPerformance.map((agent) => (
            <tr key={agent.agentId}>
              <td>{agent.name}</td>
              <td>{agent.resolvedChats}</td>
              <td>{agent.averageResponseTime}</td>
              <td>{agent.rating.toFixed(2)} / 5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentAnalytics;

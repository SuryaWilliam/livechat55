// components/admin/AgentAvailability.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface AgentStatus {
  agentId: string;
  name: string;
  isAvailable: boolean;
}

const AgentAvailability: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);

  useEffect(() => {
    // Fetch the initial agent statuses
    socket.emit("get_agents_status");

    // Listen for updates to agent statuses
    socket.on("agent_status_update", (updatedAgents: AgentStatus[]) => {
      setAgents(updatedAgents);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("agent_status_update");
    };
  }, []);

  // Toggle agent availability
  const toggleAvailability = (agentId: string, isAvailable: boolean) => {
    socket.emit("toggle_agent_status", { agentId, isAvailable: !isAvailable });
  };

  return (
    <div>
      <h3>Agent Availability</h3>
      <ul>
        {agents.map((agent) => (
          <li key={agent.agentId}>
            {agent.name} - {agent.isAvailable ? "Available" : "Unavailable"}
            <button
              onClick={() =>
                toggleAvailability(agent.agentId, agent.isAvailable)
              }
            >
              {agent.isAvailable ? "Set Unavailable" : "Set Available"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentAvailability;

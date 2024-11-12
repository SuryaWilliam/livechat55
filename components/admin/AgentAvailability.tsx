// components/admin/AgentAvailability.tsx

import { useEffect, useState } from "react";

interface Agent {
  _id: string;
  name: string;
  isAvailable: boolean;
}

const AgentAvailability = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/admin/agents");
        if (!res.ok) throw new Error("Failed to fetch agents");

        const data = await res.json();
        setAgents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load agent data. Please try again later.");
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgents();
  }, []);

  const toggleAvailability = async (agentId: string, isAvailable: boolean) => {
    try {
      const res = await fetch("/api/admin/agents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, isAvailable: !isAvailable }),
      });

      if (!res.ok) throw new Error("Failed to update availability");

      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent._id === agentId
            ? { ...agent, isAvailable: !isAvailable }
            : agent
        )
      );
    } catch (error) {
      setError("Failed to update agent availability. Please try again.");
      console.error("Error updating availability:", error);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Agent Availability</h2>
      <ul>
        {agents.map((agent) => (
          <li
            key={agent._id}
            className="mb-2 flex justify-between items-center"
          >
            <span>{agent.name}</span>
            <button
              className={`px-4 py-2 rounded-md ${
                agent.isAvailable ? "bg-green-500" : "bg-red-500"
              } text-white`}
              onClick={() => toggleAvailability(agent._id, agent.isAvailable)}
            >
              {agent.isAvailable ? "Available" : "Unavailable"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentAvailability;

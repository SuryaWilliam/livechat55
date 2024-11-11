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
        setError((err as Error).message);
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

      if (res.ok) {
        const updatedAgent = await res.json();
        setAgents((prevAgents) =>
          prevAgents.map((agent) =>
            agent._id === updatedAgent._id ? updatedAgent : agent
          )
        );
      } else {
        throw new Error("Failed to update agent status");
      }
    } catch (error) {
      console.error("Error updating agent status:", error);
    }
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Agent Availability</h2>
      <ul>
        {agents.map((agent) => (
          <li
            key={agent._id}
            className="mb-2 flex justify-between items-center"
          >
            <p>{agent.name}</p>
            <button
              onClick={() => toggleAvailability(agent._id, agent.isAvailable)}
              className={`py-1 px-3 rounded-md ${
                agent.isAvailable ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
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

// components/agent/AgentAvailabilityToggle.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

const AgentAvailabilityToggle: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Request initial availability status
    socket.emit("get_agent_availability");

    // Listen for updates to the agent's availability
    socket.on("agent_availability_update", (status: boolean) => {
      setIsAvailable(status);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("agent_availability_update");
    };
  }, []);

  const toggleAvailability = () => {
    socket.emit("set_agent_availability", !isAvailable);
  };

  return (
    <div>
      <h3>Agent Availability</h3>
      <button onClick={toggleAvailability}>
        {isAvailable ? "Set Unavailable" : "Set Available"}
      </button>
    </div>
  );
};

export default AgentAvailabilityToggle;

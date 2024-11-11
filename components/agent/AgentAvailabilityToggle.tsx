// components/agent/AgentAvailabilityToggle.tsx

import { useState, useEffect } from "react";

const AgentAvailabilityToggle = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Fetch initial availability status from the server
    const fetchAvailability = async () => {
      try {
        const res = await fetch("/api/agent/availability");
        const data = await res.json();
        setIsAvailable(data.isAvailable);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, []);

  const toggleAvailability = async () => {
    try {
      await fetch("/api/agent/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });
      setIsAvailable((prev) => !prev);
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span>{isAvailable ? "Available" : "Unavailable"}</span>
      <button
        onClick={toggleAvailability}
        className={`p-2 rounded-md ${
          isAvailable ? "bg-green-500" : "bg-gray-300"
        } text-white`}
      >
        {isAvailable ? "Set Unavailable" : "Set Available"}
      </button>
    </div>
  );
};

export default AgentAvailabilityToggle;

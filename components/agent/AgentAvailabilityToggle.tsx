// components/agent/AgentAvailabilityToggle.tsx

import { useState, useEffect } from "react";

const AgentAvailabilityToggle = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch("/api/agent/availability");
        const data = await res.json();
        setIsAvailable(data.isAvailable);
      } catch (error) {
        setError("Error fetching availability status. Please try again.");
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
      setError("Error updating availability status. Please try again.");
      console.error("Error updating availability:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Agent Availability</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <p>
        <strong>Status:</strong> {isAvailable ? "Available" : "Unavailable"}
      </p>
      <button
        onClick={toggleAvailability}
        className={`mt-2 px-4 py-2 rounded text-white ${
          isAvailable ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isAvailable ? "Set Unavailable" : "Set Available"}
      </button>
    </div>
  );
};

export default AgentAvailabilityToggle;

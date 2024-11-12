// components/owner/SystemSettings.tsx

import { useEffect, useState } from "react";

interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

interface AutoResponseMessages {
  queue: string;
  assigned: string;
  noAgent: string;
}

interface SystemSettingsData {
  maxQueueSize: number;
  notificationPreferences: string[];
  agentAvailability: Availability[];
  chatAutoCloseDuration: number;
  sessionTimeout: number;
  loggingLevel: string;
  autoResponseMessages: AutoResponseMessages;
}

const SystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/owner/systemSettings");
        if (!res.ok) throw new Error("Failed to load settings");

        const data = await res.json();
        setSettings(data);
      } catch (error) {
        setError("Could not load system settings. Please try again.");
        console.error("Error fetching system settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) return <p>Loading system settings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">System Settings</h2>
      {settings && (
        <div>
          <p>
            <strong>Max Queue Size:</strong> {settings.maxQueueSize}
          </p>
          <p>
            <strong>Notification Preferences:</strong>{" "}
            {settings.notificationPreferences.join(", ")}
          </p>
          <h3 className="font-semibold mt-4">Agent Availability:</h3>
          <ul>
            {settings.agentAvailability.map((availability, index) => (
              <li key={index} className="mb-2">
                <p>
                  <strong>Day:</strong> {availability.day}
                </p>
                <p>
                  <strong>Time:</strong> {availability.startTime} -{" "}
                  {availability.endTime}
                </p>
              </li>
            ))}
          </ul>
          <p>
            <strong>Chat Auto-Close Duration:</strong>{" "}
            {settings.chatAutoCloseDuration} minutes
          </p>
          <p>
            <strong>Session Timeout:</strong> {settings.sessionTimeout} minutes
          </p>
          <p>
            <strong>Logging Level:</strong> {settings.loggingLevel}
          </p>
          <h3 className="font-semibold mt-4">Auto-Response Messages:</h3>
          <ul>
            <li>
              <strong>Queue:</strong> {settings.autoResponseMessages.queue}
            </li>
            <li>
              <strong>Assigned:</strong>{" "}
              {settings.autoResponseMessages.assigned}
            </li>
            <li>
              <strong>No Agent Available:</strong>{" "}
              {settings.autoResponseMessages.noAgent}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;

// components/owner/SystemSettings.tsx

import { useEffect, useState } from "react";

interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

interface SystemSettingsData {
  maxQueueSize: number;
  notificationPreferences: string[];
  agentAvailability: Availability[];
  chatAutoCloseDuration: number;
  sessionTimeout: number;
  loggingLevel: string;
  autoResponseMessages: {
    queue: string;
    assigned: string;
    noAgent: string;
  };
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
        setSettings(data || defaultSettings);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async () => {
    if (!settings) return;
    try {
      const res = await fetch("/api/owner/systemSettings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");

      alert("Settings updated successfully!");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading) return <p>Loading settings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">System Settings</h2>

      <label>Max Queue Size</label>
      <input
        type="number"
        value={settings?.maxQueueSize || ""}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev!,
            maxQueueSize: parseInt(e.target.value, 10),
          }))
        }
        className="block w-full p-2 border rounded-md mb-4"
      />

      <label>Notification Preferences</label>
      <input
        type="text"
        value={settings?.notificationPreferences.join(", ") || ""}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev!,
            notificationPreferences: e.target.value.split(", "),
          }))
        }
        className="block w-full p-2 border rounded-md mb-4"
      />

      <label>Chat Auto-Close Duration (minutes)</label>
      <input
        type="number"
        value={settings?.chatAutoCloseDuration || ""}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev!,
            chatAutoCloseDuration: parseInt(e.target.value, 10),
          }))
        }
        className="block w-full p-2 border rounded-md mb-4"
      />

      <label>Session Timeout (minutes)</label>
      <input
        type="number"
        value={settings?.sessionTimeout || ""}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev!,
            sessionTimeout: parseInt(e.target.value, 10),
          }))
        }
        className="block w-full p-2 border rounded-md mb-4"
      />

      <label>Logging Level</label>
      <select
        value={settings?.loggingLevel || "basic"}
        onChange={(e) =>
          setSettings((prev) => ({ ...prev!, loggingLevel: e.target.value }))
        }
        className="block w-full p-2 border rounded-md mb-4"
      >
        <option value="basic">Basic</option>
        <option value="detailed">Detailed</option>
        <option value="none">None</option>
      </select>

      <h3 className="text-md font-semibold mt-6">Auto-Response Messages</h3>

      <label>Queue Message</label>
      <textarea
        value={settings?.autoResponseMessages.queue || ""}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev!,
            autoResponseMessages: {
              ...prev!.autoResponseMessages,
              queue: e.target.value,
            },
          }))
        }
        className="block w-full p-2 border rounded-md mb-4"
      />

      <label>Assigned Message</label>
      <textarea
        value={settings?.autoResponseMessages.assigned || ""}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev!,
            autoResponseMessages: {
              ...prev!.autoResponseMessages,
              assigned: e.target.value,
            },
          }))
        }
        className="block w-full p-2 border rounded-md mb-4"
      />

      <label>No Agent Available Message</label>
      <textarea
        value={settings?.autoResponseMessages.noAgent || ""}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev!,
            autoResponseMessages: {
              ...prev!.autoResponseMessages,
              noAgent: e.target.value,
            },
          }))
        }
        className="block w-full p-2 border rounded-md mb-4"
      />

      <h3 className="text-md font-semibold mt-6">Agent Availability</h3>
      {settings?.agentAvailability.map((availability, index) => (
        <div key={index} className="mb-4">
          <label>Day</label>
          <input
            type="text"
            value={availability.day}
            onChange={(e) => {
              const updatedAvailability = [...settings.agentAvailability];
              updatedAvailability[index].day = e.target.value;
              setSettings((prev) => ({
                ...prev!,
                agentAvailability: updatedAvailability,
              }));
            }}
            className="block w-full p-2 border rounded-md mb-2"
          />
          <label>Start Time</label>
          <input
            type="time"
            value={availability.startTime}
            onChange={(e) => {
              const updatedAvailability = [...settings.agentAvailability];
              updatedAvailability[index].startTime = e.target.value;
              setSettings((prev) => ({
                ...prev!,
                agentAvailability: updatedAvailability,
              }));
            }}
            className="block w-full p-2 border rounded-md mb-2"
          />
          <label>End Time</label>
          <input
            type="time"
            value={availability.endTime}
            onChange={(e) => {
              const updatedAvailability = [...settings.agentAvailability];
              updatedAvailability[index].endTime = e.target.value;
              setSettings((prev) => ({
                ...prev!,
                agentAvailability: updatedAvailability,
              }));
            }}
            className="block w-full p-2 border rounded-md mb-4"
          />
        </div>
      ))}

      <button
        onClick={updateSettings}
        className="py-2 px-4 bg-blue-500 text-white rounded-md mt-6"
      >
        Save Settings
      </button>
    </div>
  );
};

export default SystemSettings;

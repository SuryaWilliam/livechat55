// components/admin/SystemSettings.tsx

import { useEffect, useState } from "react";

interface AgentAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

interface SystemSettingsData {
  maxQueueSize: number;
  notificationPreferences: string[];
  agentAvailability: AgentAvailability[];
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
        const res = await fetch("/api/admin/systemSettings");
        if (!res.ok) throw new Error("Failed to load settings");

        const data = await res.json();
        setSettings(
          data || {
            maxQueueSize: 10,
            notificationPreferences: ["email"],
            agentAvailability: [],
          }
        );
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
      const res = await fetch("/api/admin/systemSettings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading) return <p>Loading settings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">System Settings</h2>
      <div>
        <label>Max Queue Size</label>
        <input
          type="number"
          value={settings?.maxQueueSize || ""}
          onChange={(e) =>
            setSettings({
              ...settings!,
              maxQueueSize: parseInt(e.target.value, 10),
            })
          }
          className="block w-full p-2 border rounded-md mb-2"
        />
        <label>Notification Preferences</label>
        <input
          type="text"
          value={settings?.notificationPreferences.join(", ") || ""}
          onChange={(e) =>
            setSettings({
              ...settings!,
              notificationPreferences: e.target.value.split(", "),
            })
          }
          className="block w-full p-2 border rounded-md mb-2"
        />
        <button
          onClick={updateSettings}
          className="py-2 px-4 bg-blue-500 text-white rounded-md"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;

// components/owner/SystemSettings.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface SystemSetting {
  key: string;
  value: string | number | boolean;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(
    null
  );

  useEffect(() => {
    // Request the initial list of system settings
    socket.emit("get_system_settings");

    // Listen for updates to system settings
    socket.on("system_settings_update", (updatedSettings: SystemSetting[]) => {
      setSettings(updatedSettings);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("system_settings_update");
    };
  }, []);

  const handleEditSetting = (setting: SystemSetting) => {
    setEditingSetting(setting);
  };

  const handleSaveSetting = () => {
    if (editingSetting) {
      socket.emit("update_system_setting", editingSetting);
      setEditingSetting(null);
    }
  };

  return (
    <div>
      <h3>System Settings</h3>
      <ul>
        {settings.map((setting) => (
          <li key={setting.key}>
            <strong>{setting.key}</strong>: {setting.value.toString()}
            <button onClick={() => handleEditSetting(setting)}>Edit</button>
          </li>
        ))}
      </ul>
      {editingSetting && (
        <div>
          <h4>Edit Setting</h4>
          <label>
            {editingSetting.key}:
            <input
              type="text"
              value={editingSetting.value.toString()}
              onChange={(e) =>
                setEditingSetting({
                  ...editingSetting,
                  value: e.target.value,
                })
              }
            />
          </label>
          <button onClick={handleSaveSetting}>Save</button>
          <button onClick={() => setEditingSetting(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;

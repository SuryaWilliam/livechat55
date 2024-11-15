// components/admin/SystemSettings.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface SystemSetting {
  key: string;
  value: string | number | boolean;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [editedSetting, setEditedSetting] = useState<SystemSetting | null>(
    null
  );

  useEffect(() => {
    // Request initial system settings
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

  const handleSave = () => {
    if (editedSetting) {
      socket.emit("update_system_setting", editedSetting);
      setEditedSetting(null); // Clear edit state
    }
  };

  const handleEdit = (setting: SystemSetting) => {
    setEditedSetting(setting);
  };

  return (
    <div>
      <h3>System Settings</h3>
      <ul>
        {settings.map((setting) => (
          <li key={setting.key}>
            <strong>{setting.key}</strong>: {setting.value.toString()}
            <button onClick={() => handleEdit(setting)}>Edit</button>
          </li>
        ))}
      </ul>
      {editedSetting && (
        <div>
          <h4>Edit Setting</h4>
          <label>
            {editedSetting.key}:
            <input
              type="text"
              value={editedSetting.value.toString()}
              onChange={(e) =>
                setEditedSetting({
                  ...editedSetting,
                  value: e.target.value,
                })
              }
            />
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditedSetting(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;

// components/admin/AdminNotifications.tsx

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io();

interface Notification {
  type: string;
  message?: string;
  position?: number;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    socket.on("admin_notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-md mb-4">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} className="mb-1">
            {notification.type === "queued_user" && (
              <p>A new user is queued. Position: {notification.position}</p>
            )}
            {notification.type === "chat_ended" && <p>A chat has ended.</p>}
            {notification.type === "offline_message" && (
              <p>New offline message: {notification.message}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifications;

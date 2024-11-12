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
    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("admin_notification", handleNotification);

    return () => {
      socket.off("admin_notification", handleNotification);
    };
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
            {notification.type === "chat_ended" && (
              <p>A chat session has ended.</p>
            )}
            {notification.message && <p>{notification.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifications;

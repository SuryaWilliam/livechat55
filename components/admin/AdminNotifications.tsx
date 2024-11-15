// components/admin/AdminNotifications.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface Notification {
  message: string;
  timestamp: Date;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Listen for new session notifications
    socket.on("new_session", (notification: Notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    // Listen for other relevant notifications (if any)
    socket.on("user_request", (notification: Notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("new_session");
      socket.off("user_request");
    };
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <strong>{notification.message}</strong>
            <span>
              {" "}
              - {new Date(notification.timestamp).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifications;

// components/admin/OfflineMessages.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface OfflineMessage {
  id: string;
  user: string;
  email: string;
  message: string;
  submittedAt: Date;
}

const OfflineMessages: React.FC = () => {
  const [offlineMessages, setOfflineMessages] = useState<OfflineMessage[]>([]);

  useEffect(() => {
    // Request initial offline messages
    socket.emit("get_offline_messages");

    // Listen for new offline messages
    socket.on("new_offline_message", (message: OfflineMessage) => {
      setOfflineMessages((prevMessages) => [message, ...prevMessages]);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("new_offline_message");
    };
  }, []);

  return (
    <div>
      <h3>Offline Messages</h3>
      <ul>
        {offlineMessages.map((message) => (
          <li key={message.id}>
            <strong>{message.user}</strong> ({message.email}) -{" "}
            {message.message}
            <span>
              {" "}
              at {new Date(message.submittedAt).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfflineMessages;

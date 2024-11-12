// components/admin/OfflineMessages.tsx

import { useEffect, useState } from "react";

interface OfflineMessage {
  _id: string;
  username: string;
  message: string;
}

const OfflineMessages = () => {
  const [offlineMessages, setOfflineMessages] = useState<OfflineMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfflineMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/offlineMessages");
        if (!res.ok) throw new Error("Failed to fetch offline messages");

        const data = await res.json();
        setOfflineMessages(data);
      } catch (error) {
        setError("Could not load offline messages. Please try again.");
        console.error("Error fetching offline messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfflineMessages();
  }, []);

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/offlineMessages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete message");

      setOfflineMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== id)
      );
    } catch (error) {
      setError("Failed to delete the message. Please try again.");
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Offline Messages</h2>

      {error && <div className="error-message mb-4">{error}</div>}

      {loading ? (
        <p>Loading offline messages...</p>
      ) : (
        <ul className="offline-messages">
          {offlineMessages.map((msg) => (
            <li key={msg._id} className="mb-4 border-b pb-2">
              <p>
                <strong>{msg.username}</strong>: {msg.message}
              </p>
              <button
                onClick={() => deleteMessage(msg._id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OfflineMessages;

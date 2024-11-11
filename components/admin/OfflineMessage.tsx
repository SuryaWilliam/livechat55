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
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchOfflineMessages();
  }, []);

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/offlineMessages?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOfflineMessages((messages) =>
          messages.filter((msg) => msg._id !== id)
        );
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  if (loading) return <p>Loading offline messages...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Offline Messages</h2>
      <ul>
        {offlineMessages.map((msg) => (
          <li key={msg._id} className="mb-2">
            <p>
              <strong>{msg.username}</strong>: {msg.message}
            </p>
            <button
              onClick={() => deleteMessage(msg._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfflineMessages;

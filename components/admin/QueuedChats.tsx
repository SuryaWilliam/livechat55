// components/admin/QueuedChats.tsx

import { useEffect, useState } from "react";

interface QueuedChat {
  _id: string;
  username: string;
  category: string;
}

const QueuedChats = () => {
  const [queuedChats, setQueuedChats] = useState<QueuedChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueuedChats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/queuedChats");
        if (!res.ok) throw new Error("Failed to fetch queued chats");

        const data = await res.json();
        setQueuedChats(data);
      } catch (error) {
        setError("Could not load queued chats. Please try again.");
        console.error("Error fetching queued chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueuedChats();
  }, []);

  if (loading) return <p>Loading queued chats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Queued Chats</h2>
      <ul>
        {queuedChats.map((chat) => (
          <li key={chat._id} className="mb-4 border-b pb-2">
            <p>
              <strong>Username:</strong> {chat.username}
            </p>
            <p>
              <strong>Category:</strong> {chat.category}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QueuedChats;

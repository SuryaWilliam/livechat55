// components/admin/ActiveChats.tsx

import { useEffect, useState } from "react";

interface Chat {
  _id: string;
  username: string;
  category: string;
}

interface Agent {
  _id: string;
  name: string;
}

const ActiveChats = () => {
  const [activeChats, setActiveChats] = useState<Chat[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Fetch active chats and agents concurrently
    const fetchData = async () => {
      try {
        const [chatsRes, agentsRes] = await Promise.all([
          fetch("/api/admin/activeChats"),
          fetch("/api/admin/agents"),
        ]);

        if (chatsRes.ok && agentsRes.ok) {
          const activeChatsData = await chatsRes.json();
          const agentsData = await agentsRes.json();
          setActiveChats(activeChatsData);
          setAgents(agentsData);
        } else {
          console.error("Failed to fetch active chats or agents");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const reassignChat = async (sessionId: string, newAgentId: string) => {
    try {
      await fetch("/api/admin/reassignChat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, newAgentId }),
      });
    } catch (error) {
      console.error("Failed to reassign chat:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Active Chats</h2>
      <ul>
        {activeChats.map((chat) => (
          <li key={chat._id} className="mb-2">
            <p>
              {chat.username} - {chat.category}
            </p>
            <a
              href={`/chat/${chat._id}`}
              className="text-blue-500 hover:underline"
            >
              Join Chat
            </a>
            <select
              onChange={(e) => reassignChat(chat._id, e.target.value)}
              className="ml-2"
            >
              <option value="">Reassign</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveChats;

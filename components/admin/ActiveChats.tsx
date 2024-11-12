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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch active chats and agents concurrently
    const fetchData = async () => {
      try {
        const [chatsRes, agentsRes] = await Promise.all([
          fetch("/api/admin/activeChats"),
          fetch("/api/admin/agents"),
        ]);

        if (!chatsRes.ok || !agentsRes.ok) {
          throw new Error("Failed to fetch active chats or agents");
        }

        const activeChatsData = await chatsRes.json();
        const agentsData = await agentsRes.json();

        setActiveChats(activeChatsData);
        setAgents(agentsData);
      } catch (error) {
        setError("An error occurred while fetching data. Please try again.");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h1>Active Chats</h1>
      <div className="chats-list">
        {activeChats.map((chat) => (
          <div key={chat._id} className="chat-item">
            <p>Username: {chat.username}</p>
            <p>Category: {chat.category}</p>
          </div>
        ))}
      </div>

      <h2>Available Agents</h2>
      <div className="agents-list">
        {agents.map((agent) => (
          <div key={agent._id} className="agent-item">
            <p>Agent: {agent.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveChats;

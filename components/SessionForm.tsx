// components/SessionForm.tsx
import { useState } from "react";
import socket from "../lib/socket";

interface SessionFormProps {
  onSessionCreated: (sessionId: string) => void; // Callback with the created session ID
}

const SessionForm: React.FC<SessionFormProps> = ({ onSessionCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !description.trim()) {
      setError("All fields are required.");
      return;
    }

    socket.emit(
      "create_session",
      { name, email, description },
      (response: { success: boolean; sessionId?: string }) => {
        if (response.success && response.sessionId) {
          onSessionCreated(response.sessionId);
          setName("");
          setEmail("");
          setDescription("");
          setError("");
        } else {
          setError("Failed to create a session. Please try again.");
        }
      }
    );
  };

  return (
    <div>
      <h3>Start a New Chat</h3>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue or question"
        />
      </div>
      <button onClick={handleSubmit} className="start-chat-button">
        Start Chat
      </button>
    </div>
  );
};

export default SessionForm;

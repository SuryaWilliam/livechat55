// components/OfflineMessageForm.tsx
import { useState } from "react";
import socket from "../lib/socket";

interface OfflineMessageFormProps {
  onMessageSubmitted: () => void; // Callback when the message is successfully submitted
}

const OfflineMessageForm: React.FC<OfflineMessageFormProps> = ({
  onMessageSubmitted,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required.");
      return;
    }

    socket.emit(
      "submit_offline_message",
      { name, email, message },
      (response: { success: boolean }) => {
        if (response.success) {
          onMessageSubmitted();
          setName("");
          setEmail("");
          setMessage("");
          setError("");
        } else {
          setError("Failed to submit your message. Please try again.");
        }
      }
    );
  };

  return (
    <div>
      <h3>Leave a Message</h3>
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
        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Message"
        />
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
};

export default OfflineMessageForm;

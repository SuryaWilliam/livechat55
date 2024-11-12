// components/OfflineMessageForm.tsx

import { useState } from "react";

const OfflineMessageForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const submitMessage = async () => {
    if (!username || !email || !message) {
      alert("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/offlineMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, message }),
      });

      if (res.ok) {
        setSuccess(true);
        setUsername("");
        setEmail("");
        setMessage("");
      } else {
        setError("Failed to submit message. Please try again.");
        console.error("Error:", await res.text());
      }
    } catch (error) {
      setError("Error submitting message. Please try again.");
      console.error("Error submitting offline message:", error);
    } finally {
      setLoading(false);
    }
  };

  return success ? (
    <p>Thank you for your message! We will get back to you soon.</p>
  ) : (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-bold mb-2">Leave a Message</h3>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 rounded w-full mb-2"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={submitMessage}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default OfflineMessageForm;

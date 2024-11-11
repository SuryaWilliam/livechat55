// components/OfflineMessageForm.tsx

import { useState } from "react";

const OfflineMessageForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submitMessage = async () => {
    if (!username || !email || !message) {
      alert("All fields are required.");
      return;
    }

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
        console.error("Failed to submit offline message:", await res.text());
      }
    } catch (error) {
      console.error("Error submitting offline message:", error);
    }
  };

  return success ? (
    <p>
      Thank you! Your message has been received. We'll get back to you soon.
    </p>
  ) : (
    <div className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Leave an Offline Message</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your Name"
        className="w-full mb-2 p-2 border rounded-md"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        className="w-full mb-2 p-2 border rounded-md"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Message"
        className="w-full p-2 border rounded-md"
      />
      <button
        onClick={submitMessage}
        className="w-full py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
};

export default OfflineMessageForm;

import { useState } from "react";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !description || !category) {
      setError("All fields are required.");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, description, category }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/chat/${data.session._id}`);
      } else {
        setError(data.error || "Failed to start chat session.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="start-chat-page">
      <h1>Start a Chat</h1>
      <form onSubmit={handleSubmit} className="start-chat-form">
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Your Name</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Describe Your Problem</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe your issue"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="billing">Billing</option>
            <option value="technical">Technical Support</option>
            <option value="general">General Inquiry</option>
          </select>
        </div>

        <button type="submit" className="start-chat-button">
          Start Chat
        </button>
      </form>
    </div>
  );
};

export default HomePage;

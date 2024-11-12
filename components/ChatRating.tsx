// components/ChatRating.tsx

import { useState } from "react";

interface ChatRatingProps {
  sessionId: string;
  onRatingSubmitted: () => void;
}

const ChatRating: React.FC<ChatRatingProps> = ({
  sessionId,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRating = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, rating, feedback }),
      });

      if (res.ok) {
        onRatingSubmitted();
        alert("Thank you for your feedback!");
        setRating(0);
        setFeedback("");
      } else {
        setError("Failed to submit rating. Please try again.");
        console.error("Failed to submit rating:", await res.text());
      }
    } catch (error) {
      setError("Error submitting rating. Please try again.");
      console.error("Error submitting rating:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-bold mb-2">Rate Your Chat Experience</h3>

      <div className="mb-4">
        <label className="block font-semibold">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Feedback (optional):</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Share your experience..."
        />
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={submitRating}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
};

export default ChatRating;

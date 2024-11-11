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

  const submitRating = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }

    try {
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, rating, feedback }),
      });

      if (res.ok) {
        onRatingSubmitted();
        alert("Thank you for your feedback!");
      } else {
        console.error("Failed to submit rating:", await res.text());
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Rate Your Chat Experience</h2>
      <div className="mb-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setRating(num)}
            className={`px-3 py-1 ${
              rating === num ? "bg-yellow-400" : "bg-gray-200"
            } rounded-md mx-1`}
          >
            {num}
          </button>
        ))}
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Additional feedback (optional)"
        className="w-full p-2 border rounded-md"
      />
      <button
        onClick={submitRating}
        className="w-full py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Submit Rating
      </button>
    </div>
  );
};

export default ChatRating;

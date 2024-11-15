// components/ChatRating.tsx
import { useState } from "react";
import socket from "../lib/socket";

interface ChatRatingProps {
  sessionId: string; // The session ID for which the rating is being given
  onRatingSubmitted: () => void; // Callback after rating is submitted
}

const ChatRating: React.FC<ChatRatingProps> = ({
  sessionId,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (rating !== null) {
      socket.emit("submit_rating", { sessionId, rating, feedback });
      onRatingSubmitted(); // Notify parent that the rating is submitted
    } else {
      alert("Please select a rating before submitting.");
    }
  };

  return (
    <div>
      <h3>Rate Your Chat Experience</h3>
      <div className="rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            className={`rating-button ${rating === value ? "selected" : ""}`}
            onClick={() => setRating(value)}
          >
            {value} ★
          </button>
        ))}
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Leave additional feedback (optional)"
        className="feedback-textarea"
      />
      <button onClick={handleSubmit} className="submit-rating-button">
        Submit Rating
      </button>
    </div>
  );
};

export default ChatRating;

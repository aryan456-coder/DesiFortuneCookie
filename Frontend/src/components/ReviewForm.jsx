
import { useState, useEffect } from "react";
import axios from "axios";

function ReviewForm({ onSuccess, onTokenReceived, editingReview, onCancelEdit }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingReview) {
      setName(editingReview.name || "");
      setRating(String(editingReview.rating) || "");
      setText(editingReview.text || "");
      setError("");
    }
  }, [editingReview]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const reviewData = {
      name: name || "Anonymous Beta",
      rating: Number(rating),
      text,
    };

    try {
      if (editingReview) {
      
        const tokens = JSON.parse(localStorage.getItem("review_tokens") || "{}");
        const token = tokens[editingReview.id] || null;

        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/reviews/${editingReview.id}`,
          reviewData,
          {
            headers: {
              "X-Review-Token": token,
            },
          }
        );
      } else {
      
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/reviews`,
          reviewData
        );

        if (res.data.ownership_token && onTokenReceived) {
          onTokenReceived(res.data.id, res.data.ownership_token);
        }
      }

      setName("");
      setRating("");
      setText("");

      if (onSuccess) onSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setError(msg);
    }
  }

  function handleCancel() {
    setName("");
    setRating("");
    setText("");
    setError("");
    if (onCancelEdit) onCancelEdit();
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      {error && <div className="review-error">{error}</div>}

      <input
        type="text"
        placeholder="Your name (optional)"
        className="review-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="review-input"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      >
        <option value="">Choose Rating</option>
        <option value="5">★★★★★</option>
        <option value="4">★★★★☆</option>
        <option value="3">★★★☆☆</option>
        <option value="2">★★☆☆☆</option>
        <option value="1">★☆☆☆☆</option>
      </select>

      <textarea
        rows="4"
        placeholder="Tell us what happened after your fortune..."
        className="review-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      ></textarea>

      <button type="submit" className="btn-primary submit-btn">
        {editingReview ? "Update Review ✏️" : "Submit Review ✨"}
      </button>

      {editingReview && (
        <button
          type="button"
          className="btn-primary cancel-btn"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default ReviewForm;
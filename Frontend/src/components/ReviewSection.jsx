
import { useState, useEffect } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";

function getAllReviewTokens() {
  try {
    const tokens = JSON.parse(localStorage.getItem("review_tokens") || "{}");
    return Object.values(tokens);
  } catch {
    return [];
  }
}

function saveReviewToken(id, token) {
  const tokens = JSON.parse(localStorage.getItem("review_tokens") || "{}");
  tokens[id] = token;
  localStorage.setItem("review_tokens", JSON.stringify(tokens));
}

function getReviewToken(id) {
  const tokens = JSON.parse(localStorage.getItem("review_tokens") || "{}");
  return tokens[id] || null;
}

function removeReviewToken(id) {
  const tokens = JSON.parse(localStorage.getItem("review_tokens") || "{}");
  delete tokens[id];
  localStorage.setItem("review_tokens", JSON.stringify(tokens));
}

function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReview, setEditingReview] = useState(null);

  function fetchReviews(page = 1) {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reviews?page=${page}&limit=5`, {
        headers: {
          "X-Review-Tokens": JSON.stringify(getAllReviewTokens()),
        },
      })
      .then((res) => {
        setReviews(res.data.reviews);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error("Failed to fetch reviews:", err));
  }

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  function handleTokenReceived(id, token) {
    saveReviewToken(id, token);
  }

  function handleReviewSuccess() {
    setEditingReview(null);
    fetchReviews(1);
  }

  function handleEdit(review) {
    setEditingReview(review);
  }

  function handleCancelEdit() {
    setEditingReview(null);
  }

  function handleDelete(id) {
    const token = getReviewToken(id);

    setReviews((prev) => prev.filter((r) => r.id !== id));

    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`, {
        headers: {
          "X-Review-Token": token,
        },
      })
      .then(() => {
        removeReviewToken(id);
        fetchReviews(currentPage);
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        fetchReviews(currentPage);
      });
  }

  return (
    <section className="section reveal" id="reviews">
      <div className="section-label">User Reviews</div>
      <h2 className="section-title">What the beta-log are saying</h2>

      <div className="testi-grid">
        <div className="testi-card review-card">
          <div className="stars">★★★★★</div>
          <p className="testi-text">
            Leave your honest feedback for Aunty Ji.
          </p>

          <ReviewForm
            onSuccess={handleReviewSuccess}
            onTokenReceived={handleTokenReceived}
            editingReview={editingReview}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {reviews?.length === 0 ? (
          <ReviewCard
            data={{
              name: "Aunty Ji",
              location: "Head Office",
              text: "No reviews yet. Be the first beta-log to bless this website.",
              rating: 5,
            }}
          />
        ) : (
          (reviews || []).map((item) => (
            <ReviewCard
              key={item.id}
              data={item}
              onEdit={item.isOwner ? handleEdit : undefined}
              onDelete={item.isOwner ? handleDelete : undefined}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="btn-primary pagination-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn-primary pagination-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}

export default ReviewSection;

import { useState, useEffect } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";

function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReview, setEditingReview] = useState(null);

  function fetchReviews(page = 1) {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reviews?page=${page}&limit=5`)
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
    setReviews((prev) => prev.filter((r) => r.id !== id));

    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`)
      .then(() => {
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
              onEdit={handleEdit}
              onDelete={handleDelete}
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
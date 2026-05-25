function ReviewCard({ data, onEdit, onDelete }) {
  if (!data) return null;

  const rating = Number(data.rating) || 0;

  return (
    <div className="testi-card">
      <div className="stars">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>

      <p className="testi-text">{data.text}</p>

      <div className="testi-author">{data.name}</div>

      <div className="testi-from">
        {data.location || "Fortune Cookie Universe"}
      </div>

      {(onEdit || onDelete) && (
        <div className="review-actions">
          {onEdit && (
            <button
              className="review-btn review-btn-edit"
              onClick={() => onEdit(data)}
            >
              Edit ✏️
            </button>
          )}
          {onDelete && (
            <button
              className="review-btn review-btn-delete"
              onClick={() => onDelete(data.id)}
            >
              Delete 🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
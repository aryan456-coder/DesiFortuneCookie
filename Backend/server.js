const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const db = require("./db");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/fortune/random", (req, res) => {
  const sql = "SELECT * FROM fortunes ORDER BY RAND() LIMIT 1";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    res.json(result[0]);
  });
});

function validateReview(body) {
  const { rating, text } = body;

  if (rating === undefined || rating === null || rating === "") {
    return "Rating is required.";
  }

  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return "Rating must be an integer between 1 and 5.";
  }

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return "Review text is required and cannot be empty.";
  }

  if (text.length > 500) {
    return "Review text must be 500 characters or less.";
  }

  return null;
}
app.get("/api/reviews", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 5);
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) AS total FROM reviews", (err, countResult) => {
    if (err) {
      console.error("GET /api/reviews COUNT error:", err);
      return res.status(500).json({ message: err.message });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(
      "SELECT `id`, `name`, `rating`, `message` AS `text`, `created_at` FROM reviews ORDER BY `id` DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err2, reviews) => {
        if (err2) {
          console.error("GET /api/reviews SELECT error:", err2);
          return res.status(500).json({ message: err2.message });
        }

        res.json({ reviews, totalPages, currentPage: page });
      }
    );
  });
});
app.post("/api/reviews", (req, res) => {
  const validationError = validateReview(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const name = req.body.name && req.body.name.trim() ? req.body.name.trim() : "Anonymous Beta";
  const rating = Number(req.body.rating);
  const text = req.body.text.trim();

  db.query(
    "INSERT INTO reviews (`name`, `rating`, `message`) VALUES (?, ?, ?)",
    [name, rating, text],
    (err, result) => {
      if (err) {
        console.error("POST /api/reviews error:", err);
        return res.status(500).json({ message: err.message });
      }

      res.status(201).json({
        id: result.insertId,
        name,
        rating,
        text,
      });
    }
  );
});

app.put("/api/reviews/:id", (req, res) => {
  const validationError = validateReview(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const id = req.params.id;
  const name = req.body.name && req.body.name.trim() ? req.body.name.trim() : "Anonymous Beta";
  const rating = Number(req.body.rating);
  const text = req.body.text.trim();

  db.query(
    "UPDATE reviews SET `name` = ?, `rating` = ?, `message` = ? WHERE `id` = ?",
    [name, rating, text, id],
    (err, result) => {
      if (err) {
        console.error("PUT /api/reviews error:", err);
        return res.status(500).json({ message: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Review not found." });
      }

      res.json({ id: Number(id), name, rating, text });
    }
  );
});

app.delete("/api/reviews/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM reviews WHERE `id` = ?", [id], (err, result) => {
    if (err) {
      console.error("DELETE /api/reviews error:", err);
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.json({ message: "Review deleted successfully." });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
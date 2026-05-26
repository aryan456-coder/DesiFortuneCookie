const express = require("express");
const { v4: uuidv4 } = require("uuid");
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

  // Parse ownership tokens from header
  let clientTokens = [];
  try {
    const header = req.headers["x-review-tokens"];
    if (header) clientTokens = JSON.parse(header);
  } catch (e) {
    // Ignore malformed header
  }

  db.query("SELECT COUNT(*) AS total FROM reviews", (err, countResult) => {
    if (err) {
      console.error("GET /api/reviews COUNT error:", err);
      return res.status(500).json({ message: err.message });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(
      "SELECT `id`, `name`, `rating`, `message` AS `text`, `created_at`, `ownership_token` FROM reviews ORDER BY `id` DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err2, reviews) => {
        if (err2) {
          console.error("GET /api/reviews SELECT error:", err2);
          return res.status(500).json({ message: err2.message });
        }

        // Add isOwner flag, strip ownership_token from response
        const safeReviews = reviews.map((r) => {
          const isOwner =
            r.ownership_token !== null &&
            clientTokens.includes(r.ownership_token);
          const { ownership_token, ...rest } = r;
          return { ...rest, isOwner };
        });

        res.json({ reviews: safeReviews, totalPages, currentPage: page });
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
  const ownership_token = uuidv4();

  db.query(
    "INSERT INTO reviews (`name`, `rating`, `message`, `ownership_token`) VALUES (?, ?, ?, ?)",
    [name, rating, text, ownership_token],
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
        ownership_token,
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
  const clientToken = req.headers["x-review-token"];

  db.query(
    "SELECT `ownership_token` FROM reviews WHERE `id` = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.error("PUT /api/reviews token check error:", err);
        return res.status(500).json({ message: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: "Review not found." });
      }

      const storedToken = rows[0].ownership_token;
      if (!storedToken || storedToken !== clientToken) {
        return res.status(403).json({ message: "You are not allowed to edit this review." });
      }

      const name = req.body.name && req.body.name.trim() ? req.body.name.trim() : "Anonymous Beta";
      const rating = Number(req.body.rating);
      const text = req.body.text.trim();

      db.query(
        "UPDATE reviews SET `name` = ?, `rating` = ?, `message` = ? WHERE `id` = ?",
        [name, rating, text, id],
        (err2, result) => {
          if (err2) {
            console.error("PUT /api/reviews error:", err2);
            return res.status(500).json({ message: err2.message });
          }

          res.json({ id: Number(id), name, rating, text });
        }
      );
    }
  );
});

app.delete("/api/reviews/:id", (req, res) => {
  const id = req.params.id;
  const clientToken = req.headers["x-review-token"];

  db.query(
    "SELECT `ownership_token` FROM reviews WHERE `id` = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.error("DELETE /api/reviews token check error:", err);
        return res.status(500).json({ message: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: "Review not found." });
      }

      const storedToken = rows[0].ownership_token;
      if (!storedToken || storedToken !== clientToken) {
        return res.status(403).json({ message: "You are not allowed to delete this review." });
      }

      db.query("DELETE FROM reviews WHERE `id` = ?", [id], (err2, result) => {
        if (err2) {
          console.error("DELETE /api/reviews error:", err2);
          return res.status(500).json({ message: err2.message });
        }

        res.json({ message: "Review deleted successfully." });
      });
    }
  );
});

const PORT = process.env.PORT || 5000; 

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
# 🍪 Desi Fortune Cookie

A fun full-stack web application that serves random "Aunty Ji" style fortunes with a desi twist and allows users to leave reviews.

## 🌐 Live Demo

Frontend: https://desi-fortune-cookie.vercel.app/

Backend API: https://desifortunecookie-production.up.railway.app

---

## ✨ Features

### 🍪 Random Fortune Generator
- Fetches a random fortune from a MySQL database.
- Desi/Aunty-style advice and predictions.
- Hindi punchlines included.

### ⭐ Review System
- Add reviews
- Edit reviews
- Delete reviews
- Review pagination
- Backend validation

### 📱 Responsive Design
- Works on desktop and mobile devices.
- Fun and playful UI.

### ☁️ Deployment
- Frontend deployed on Vercel
- Backend deployed on Railway
- MySQL database hosted on Railway

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Axios
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Deployment
- Vercel
- Railway

---

## 📂 Project Structure

```text
DesiFortuneCookie/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── data/
│   │
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── server.js
│   ├── db.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/aryan456-coder/DesiFortuneCookie.git
cd DesiFortuneCookie
```

---

## Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=5000
```

Run the backend:

```bash
npm start
```

---

## Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

---

## API Endpoints

### Get Random Fortune

```http
GET /api/fortune/random
```

Response:

```json
{
  "id": 1,
  "text": "Your hard work will pay off.",
  "hindi": "Mehnat rang layegi. ✨"
}
```

---

### Get Reviews

```http
GET /api/reviews?page=1&limit=5
```

---

### Create Review

```http
POST /api/reviews
```

---

### Update Review

```http
PUT /api/reviews/:id
```

---

### Delete Review

```http
DELETE /api/reviews/:id
```

---

## 🎯 Future Improvements

- Anonymous review ownership
- Rate limiting
- Review search
- Review sorting
- Dark mode
- Fortune categories
- User authentication

---


## 👨‍💻 Author

Aryan Patade

GitHub:
https://github.com/aryan456-coder

---


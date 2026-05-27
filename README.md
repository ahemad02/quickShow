# 🎬 Movie Ticket Booking Platform

A modern full-stack movie ticket booking application built using the MERN stack. This platform allows users to browse movies, select show timings, book seats, and make secure online payments using Stripe test integration. The project also includes a complete admin dashboard for managing movies and shows.

---

# 🚀 Features

## 👤 User Features

- Browse latest movies
- View movie details and descriptions
- Select show timings
- Seat booking functionality
- Secure online payments using Stripe
- Authentication & authorization
- Responsive UI for mobile and desktop
- Booking confirmation system

---

## 🛠️ Admin Features

- Admin dashboard
- Add/manage movies
- Fetch movies from TMDB API
- Create/manage movie shows
- Monitor bookings
- Manage movie availability

---

# 🧰 Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication
- Clerk Authentication

## Payments
- Stripe Test Payment Gateway

## External APIs
- TMDB API (The Movie Database)

---

# 📂 Project Structure

```bash
project-root/
│
├── frontend/        # React Frontend
├── backend/        # Express Backend
│
└── README.md
```

---

# ⚙️ Environment Variables

## Frontend `.env`

Create a `.env` file inside the `client` folder and add:

```env
VITE_BASE_URL=backend runnig url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=$
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
```

---

## Backend `.env`

Create a `.env` file inside the `server` folder and add:

```env
SENDER_EMAIL=
SMTP_USER=
SMTP_PASS=
TMDB_API_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
MONGODB_URI=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

```

---

# 🔧 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/ahemad02/quickShow.git
```

---

## 2️⃣ Move Into Project Folder

```bash
cd your-repo-name
```

---

# ▶️ Frontend Setup

## Go to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Start frontend server

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# ▶️ Backend Setup

## Open new terminal

## Go to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Start backend server

```bash
npm run server
```

or

```bash
nodemon server.js
```

Backend will run on:

```bash
http://localhost:3000
```

---

# 🔑 Required Services

Before running the project, make sure you create accounts and obtain API keys from:

- MongoDB Atlas
- Clerk Authentication
- Stripe
- TMDB API

---

# 💳 Stripe Test Card

Use this Stripe test card for demo payments:

```bash
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVV: Any 3 digits
```

---

# 🌐 API Integration

This project uses TMDB API to fetch:
- Movie posters
- Movie details
- Ratings
- Descriptions
- Trending movies

---

# 📸 Main Functionalities

- User Authentication
- Movie Listing
- Show Scheduling
- Seat Booking
- Payment Processing
- Booking Confirmation
- Admin Controls

---

# 🛡️ Authentication

Authentication is handled using Clerk:
- Sign Up
- Login
- Protected Routes
- User Sessions

---

# 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop
- Tablet
- Mobile Devices

---

# 🤝 Contributing

Contributions are welcome.

## Steps to Contribute

1. Fork the repository

2. Create feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Create Pull Request

---

# ⭐ Support

If you liked this project:
- Star the repository
- Fork the project
- Share feedback

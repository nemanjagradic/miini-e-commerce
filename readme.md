# Miini E-commerce App

A full-stack e-commerce web application where users can browse products freely, manage favorites, add items to the cart, and complete purchases using Stripe. Includes authentication and email notifications.

---

## Features

### Authentication & Users

- Sign Up / Log In (email & password)
- Public storefront – browse products without an account
- Anonymous cart – items saved locally until you log in or sign up
- Cart merge – anonymous cart items are merged after authentication
- Forgot / Reset Password
- Profile Management – update name, email, profile picture, and password

### Products & Favorites

- Browse products with images and details
- Add/remove products to favorites
- Favorites page to view all favorited products

### Cart & Checkout

- Add, update quantity, and delete products in the cart (works without login)
- Checkout review without an account; login required at payment
- Stripe payment integration
- Order history – view active and canceled orders; continue payment if needed

### Email Notifications

- Welcome email when a user signs up
- Password reset email
- Uses Resend for email delivery

---

## Tech Stack

- Frontend: React, Redux Toolkit, TailwindCSS
- Backend: Node.js, Express, MongoDB, JWT Authentication, Stripe, Resend
- Security: Helmet, Rate Limit, XSS-Clean, Mongo-Sanitize

---

## Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/nemanjagradic/miini-e-commerce.git
cd miini-e-commerce

# --- Install backend dependencies ---
cd backend
npm install

# --- Install frontend dependencies ---
cd ../frontend
npm install

# --- Set up environment variables ---

# Create a file backend/config.env with the following placeholders:
NODE_ENV=development
PORT=8000

DATABASE=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DATABASE_PASSWORD=<your_database_password>

FRONTEND_URL=http://localhost:3000

JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=90d
COOKIE_EXPIRES_IN=90

EMAIL_FROM=onboarding@resend.dev
RESEND_API_KEY=<your_resend_api_key>

STRIPE_SECRET_KEY=<your_stripe_secret_key>

# Create a file frontend/.env with:
REACT_APP_API_URL=http://localhost:8000/api

# --- Run the application in development mode ---

# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start

# --- Build frontend for production ---
npm run build
```

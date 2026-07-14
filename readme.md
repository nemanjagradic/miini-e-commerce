# Miini E-commerce App

A full-stack furniture store with a complete shopping experience and an admin panel to run the business. Customers can browse by category or search, save favorites and use a guest cart without signing up. At checkout they review their basket, enter a shipping address, log in if needed and pay securely. Afterward they can manage orders and profile settings from their account. Admins handle the catalog, fulfill orders, manage customers and keep an eye on sales and stock from a dedicated admin panel.

Live Demo: [miini-e-commerce.vercel.app](https://miini-e-commerce.vercel.app)

---

## Features

### Authentication & Accounts

- Sign up / log in with email and password
- Browse and shop as a guest — cart is saved in the browser and merged after login
- Forgot / reset password via email
- Profile Management — name, email, photo, shipping address, and password

### Storefront & Products

- Homepage with category highlights, best sellers, and trending products
- Browse, search, and sort by category
- Product pages with image gallery, specs, and stock status
- Favorites saved to the customer account

### Cart & Checkout

- Cart works without an account; login required to pay
- Basket → shipping address → payment
- Shipping to the US and Canada, with free shipping above a configurable threshold
- Secure payment via Stripe; order confirmed after successful payment
- Cart cleared after purchase

### Orders

- Order history in the profile
- Status flow from pending through paid, processing, shipped, and delivered (plus canceled and refunded)
- Resume payment on unpaid orders
- Cancel pending orders

### Email Notifications

- Welcome and password reset emails
- Order updates — paid, shipped, delivered, canceled, and refunded
- Low-stock alerts for admins

### Admin Panel

- **Dashboard** — sales overview (revenue, AOV, refunds, net), charts by period (today, 7 days, 30 days, all time, or custom), fulfillment queue, top sellers, recent orders, and low stock
- **Products** — create and edit products with multi-image upload, stock, category, and featured placement; archive, restore, or permanently delete
- **Categories** — create, edit, and delete categories, set sort order, and optionally upload a category image
- **Orders** — search and filter by status; update fulfillment status, tracking, and notes; cancel, refund, or resend order emails
- **Users** — search customers and activate or deactivate accounts
- **Settings** — low-stock and free-shipping thresholds
- **Audit log** — searchable history of admin actions

---

## Tech Stack

- **Frontend:** React 18, Redux Toolkit, React Router v6, Tailwind CSS, Font Awesome, Recharts, Stripe.js
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT (httpOnly cookies), Multer, Sharp
- **Payments:** Stripe Checkout + webhooks + refunds
- **Email:** Resend (React JSX templates)
- **Security:** Helmet, express-rate-limit, xss-clean, express-mongo-sanitize, compression, bcrypt
- **Hosting:** Vercel (frontend), Railway (backend)

---

## Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/nemanjagradic/miini-e-commerce.git
cd miini-e-commerce
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set up environment variables

Create a file `backend/config.env`:

```env
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
ADMIN_EMAIL=<optional_admin_alert_email>

STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
```

Create a file `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 4. Run in development

```bash
# Backend
cd backend
npm run dev

# Frontend (separate terminal)
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build and run in production

```bash
cd frontend
npm run build
npm run start:prod
```

---

## Deployment

Deployed on Vercel (frontend) and Railway (backend). For payments to work in production, configure a Stripe webhook endpoint on the backend (`POST /webhook-checkout`) and set `FRONTEND_URL`, `STRIPE_WEBHOOK_SECRET`, and your Resend credentials in the server environment. CORS allows the production frontend origin (`https://miini-e-commerce.vercel.app`) and local development.

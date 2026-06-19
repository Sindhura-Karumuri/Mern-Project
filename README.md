# 🍴 AromaOfEmotions — Campus Canteen Management System

A full-stack **MERN** application for campus canteen management with Razorpay payments, role-based dashboards, subscription plans, an AI chatbot assistant, and live admin statistics.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://canteen-nine-rouge.vercel.app |
| Backend API (Render) | https://mern-project-123-4mrk.onrender.com |

---

## ✨ Features

### 👤 Student
- Browse menu items by category (Breakfast, Lunch, Snacks, Beverages)
- Order food with secure **Razorpay** payment (cards, UPI, wallets, net banking)
- Subscribe to weekly / monthly **meal plans** via Razorpay
- View order history and active subscription on the **Profile** page
- Edit display name from Profile page
- Dark / Light mode toggle
- **AromaBot** — AI chatbot for menu, plans, orders, timings, payment info and more

### 🔐 Auth
- JWT-based login / signup with bcrypt password hashing
- Role-based access control (student / admin)
- Protected routes with redirect on unauthenticated access

### 🛠️ Admin Dashboard (tabbed)

| Tab | What it does |
|-----|-------------|
| 📊 Summary | Stat cards + bar charts (orders by status, revenue breakdown) + donut chart (payment status) |
| 🧾 Orders | View all orders, mark as Completed / Cancelled |
| 🍽️ Menu | Add / Edit / Delete menu items with image URL |
| 💳 Plans | Add / Edit / Delete subscription plans |
| 👥 Users | View all students with their active subscription |
| 💰 Payments | Full Razorpay payment history with type and status |

---

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Razorpay** — payment gateway with HMAC SHA256 signature verification
- **JWT** + **bcryptjs** — auth & password hashing
- **Multer** — image uploads
- **CORS** — dynamic origin matching for Vercel & Render deployments

### Frontend
- **React 18** + **Vite**
- **React Router v6**
- **Axios** with JWT interceptor
- **TailwindCSS** + custom CSS variables (glassmorphism, dark mode)
- **React Hot Toast** — notifications
- **React Icons**
- **Context API** — auth & theme state

---

## 📁 Project Structure

```
Mern-Project/
├── backend/
│   ├── controllers/
│   │   └── paymentController.js   # Razorpay order creation & verification
│   ├── middleware/
│   │   ├── auth.js                # JWT auth + admin guard
│   │   └── upload.js              # Multer config
│   ├── models/
│   │   ├── User.js                # name, email, password, role, subscription
│   │   ├── MenuItem.js            # name, price, category, image
│   │   ├── Plan.js                # name, price, duration, image
│   │   ├── Order.js               # user, items, totalAmount, status, paymentStatus
│   │   ├── Payment.js             # Razorpay order/payment IDs, status
│   │   └── Revenue.js             # type (order/subscription), amount, refs
│   ├── routes/
│   │   ├── auth.js                # login, signup, PUT /profile
│   │   ├── menu.js                # CRUD menu items
│   │   ├── plans.js               # CRUD plans + GET /my (user's active subscription)
│   │   ├── orders.js              # user orders + admin status update
│   │   ├── payments.js            # Razorpay food & plan payment flow
│   │   └── admin.js               # summary stats, payments list, users list
│   ├── createAdmin.js             # Seed admin user
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Chatbot.jsx        # AromaBot floating assistant
│       │   ├── AdminSummary.jsx   # Stat cards + SVG bar & donut charts
│       │   ├── AdminOrders.jsx
│       │   ├── AdminMenu.jsx
│       │   ├── AdminPlans.jsx
│       │   ├── AdminUsers.jsx
│       │   ├── AdminPayments.jsx
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── MenuCard.jsx
│       │   └── PlanCard.jsx
│       ├── pages/
│       │   ├── Home.jsx           # Landing page (hero, stats bar, features grid)
│       │   ├── Login.jsx          # Login / signup split-panel
│       │   ├── Dashboard.jsx      # Student dashboard (menu, plans, orders)
│       │   ├── AdminDashboard.jsx # Tabbed admin dashboard
│       │   └── Profile.jsx        # User profile, subscription & order history
│       ├── utils/
│       │   └── razorpay.js        # Razorpay SDK loader & payment initiators
│       ├── contexts/
│       │   └── ThemeContext.jsx
│       ├── AuthContext.jsx
│       ├── api.js                 # Axios instance with JWT interceptor
│       └── App.jsx
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone

```bash
git clone https://github.com/Sindhura-Karumuri/Mern-Project.git
cd Mern-Project
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
ATLAS_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXX
```

```bash
npm start
```

### 3. Frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### 4. Create Admin User

```bash
cd backend
node createAdmin.js
```

**Admin credentials:**
- Email: `superadmin@example.com`
- Password: `SuperSecure123`

---

## 💳 Payment Flow

### Food Order
1. Student clicks **Order** → `POST /api/payments/create-food-order`
2. Razorpay modal opens
3. On success → `POST /api/payments/verify-food-payment` (HMAC verified)
4. Order created in DB with `paymentStatus: completed`

### Subscription
1. Student clicks **Subscribe** → `POST /api/payments/create-plan-order`
2. Razorpay modal opens
3. On success → `POST /api/payments/verify-plan-payment` (HMAC verified)
4. `user.subscription` updated, revenue tracked

**Test card:** `4111 1111 1111 1111` · CVV: `123` · Expiry: any future date  
**Test UPI:** `success@razorpay`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| PUT | `/api/auth/profile` | Student | Update display name |

### Menu
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/menu` | Public |
| POST | `/api/menu` | Admin |
| PUT | `/api/menu/:id` | Admin |
| DELETE | `/api/menu/:id` | Admin |

### Plans
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/plans` | Public |
| GET | `/api/plans/my` | Student — returns active subscription |
| POST | `/api/plans` | Admin |
| PUT | `/api/plans/:id` | Admin |
| DELETE | `/api/plans/:id` | Admin |

### Orders
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/orders/my` | Student |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |

### Payments
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/payments/create-food-order` | Student |
| POST | `/api/payments/verify-food-payment` | Student |
| POST | `/api/payments/create-plan-order` | Student |
| POST | `/api/payments/verify-plan-payment` | Student |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/summary` | Stats (users, subscriptions, orders, revenue, menu count) |
| GET | `/api/admin/payments` | All payment records with user & plan info |
| GET | `/api/admin/users` | All students with populated subscription |

---

## 🌐 Deployment

### Backend — Render
- **Build command:** `npm install`
- **Start command:** `npm start`
- Add all `.env` variables under Render → Environment

### Frontend — Vercel
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- Add environment variable: `VITE_API_URL=https://mern-project-123-4mrk.onrender.com/api`

> CORS is configured to dynamically allow all `*.vercel.app` and `*.onrender.com` subdomains — no hardcoded URLs needed.

---

## 👩‍💻 Developer

**Sindhura Karumuri**  
GitHub: [@Sindhura-Karumuri](https://github.com/Sindhura-Karumuri)

---

## 📄 License

MIT

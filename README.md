# 🍴 AromaOfEmotions - MERN Canteen Management System

A comprehensive **full-stack MERN application** for modern canteen management with beautiful UI, role-based access, payment integration, and advanced admin features.

## 🌟 Live Demo
- **Frontend**: https://mern-project-frontend-olt6.onrender.com
- **Backend API**: https://mern-project-123-4mrk.onrender.com

---

## ✨ Key Features

### 🎯 **User Features**
- **Beautiful Hero Banner** with gradient animations
- **40+ Menu Items** across 4 categories (Breakfast, Lunch, Snacks, Beverages)
- **5 Subscription Plans** with flexible pricing
- **One-Click Ordering** with real-time status tracking
- **Plan Subscriptions** with instant activation
- **Order History** with detailed tracking
- **Responsive Design** - works on all devices
- **Dark/Light Mode** toggle with persistent settings

### 🔐 **Authentication & Security**
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Student/Admin)
- **Protected Routes** with automatic redirects
- **Password Encryption** using bcrypt

### 👨‍💼 **Admin Dashboard**
- **Revenue Tracking** - Real-time earnings from orders & subscriptions
- **Menu Management** - Add, Edit, Delete menu items with images
- **Plan Management** - Create and manage subscription plans
- **Order Management** - Update order status, track completions
- **User Analytics** - Total users, active subscriptions, daily orders
- **Modern UI** with tables, forms, and responsive design

### 📱 **Additional Pages**
- **About Page** - Company mission, vision, and story
- **Contact Page** - Contact form with business information
- **FAQ Page** - Expandable questions and answers
- **Feedback Page** - Star rating system and feedback collection

---

## 🚀 Tech Stack

### 🧠 **Backend**
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling

### 💻 **Frontend**
- **React 18** + **Vite** - Modern React setup
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Context API** - State management

### 🎨 **UI/UX**
- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - User preference toggle
- **Gradient Animations** - Smooth transitions
- **Modern Cards** - Glassmorphism effects
- **Loading States** - Better user experience

---

## ⚙️ Installation & Setup

### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/Sindhura-Karumuri/Mern-Project.git
cd Mern-Project
```

### 2️⃣ **Backend Setup**
```bash
cd backend
npm install
```

**Environment Variables** (`.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_canteen
ATLAS_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXX
FRONTEND_URL=http://localhost:5173
```

**Start Backend**:
```bash
npm start
```

### 3️⃣ **Frontend Setup**
```bash
cd ../frontend
npm install
```

**Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend**:
```bash
npm run dev
```

### 4️⃣ **Create Admin User**
```bash
cd backend
node createAdmin.js
```

**Admin Credentials**:
- **Email**: `superadmin@example.com`
- **Password**: `SuperSecure123`

---

## 📊 Database Schema

### **User Model**
- `name`, `email`, `password`, `role`, `subscription`

### **MenuItem Model**
- `name`, `price`, `category`, `image`, `available`

### **Plan Model**
- `name`, `price`, `duration`, `image`

### **Order Model**
- `user`, `items`, `totalAmount`, `status`, `paymentStatus`

### **Revenue Model**
- `type`, `amount`, `orderId`, `planId`, `userId`

---

## 🎯 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### **Menu**
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### **Plans**
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Add plan (Admin)
- `PUT /api/plans/:id` - Update plan (Admin)
- `DELETE /api/plans/:id` - Delete plan (Admin)

### **Orders**
- `GET /api/orders/my` - Get user orders
- `POST /api/orders` - Place new order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### **Payments**
- `POST /api/payments/create-order` - Subscribe to plan
- `POST /api/payments/verify` - Verify payment

### **Admin**
- `GET /api/admin/summary` - Dashboard analytics

---

## 🌐 Deployment

### **Backend** (Render)
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node.js

### **Frontend** (Render/Vercel)
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment: Node.js

---

## 📱 Screenshots

### **Hero Banner**
- Stunning gradient overlay with food background
- Animated text and call-to-action button
- Fully responsive design

### **Menu & Plans**
- 40+ diverse food items with images
- 5 subscription plans with different durations
- Easy ordering and subscription process

### **Admin Dashboard**
- Revenue tracking with real-time updates
- Complete CRUD operations for menu and plans
- Order management with status updates
- User analytics and insights

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Sindhura Karumuri**
- GitHub: [@Sindhura-Karumuri](https://github.com/Sindhura-Karumuri)
- Project: [AromaOfEmotions](https://github.com/Sindhura-Karumuri/Mern-Project)

---

## 🙏 Acknowledgments

- **Unsplash** for beautiful food images
- **TailwindCSS** for amazing utility classes
- **React Community** for excellent documentation
- **MongoDB** for flexible database solution

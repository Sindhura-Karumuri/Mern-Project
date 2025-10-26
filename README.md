# 🍴 MERN Canteen Management System

A full-stack **MERN application** for college canteen management, including authentication, role-based access, payments via Razorpay, and a modern admin dashboard.

---

## 🚀 Tech Stack

### 🧠 Backend
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Razorpay Integration for payments  

### 💻 Frontend
- React (Vite)  
- TailwindCSS + Shadcn/UI  
- Role-based views (Student / Admin)  
- Responsive and modern UI  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Sindhura-Karumuri/Meal-Plan-Portal.git
cd Meal-Plan-Portal


2️⃣ Backend Setup
cd backend
cp .env.example .env          # copy environment variables
npm install                    # install dependencies

Backend .env Configuration
Edit the .env file with your own credentials:
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_canteen
JWT_SECRET=your_jwt_secret          # Replace with a strong secret
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX   # Replace with your Razorpay key
RAZORPAY_KEY_SECRET=XXXXXXXXXXXX        # Replace with your Razorpay secret
FRONTEND_URL=http://localhost:5173


Run Backend Server
npm run dev     # uses nodemon for development
# or
npm start       # production mode


3️⃣ Frontend Setup
cd ../frontend
npm install

Run Frontend Server
npm run dev

Frontend will be available at: http://localhost:5173

4️⃣ Seeding Database (Optional)

If you want some initial data (users, plans, menu items):
cd backend
node seed.js

5️⃣ Features

Student login/signup and plan selection
Admin dashboard: manage menu, plans, and orders
Razorpay integration for payments
Modern responsive UI

6️⃣ Project Structure
backend/          # Express server + MongoDB models
frontend/         # React (Vite) frontend

7️⃣ Tips

Ensure MongoDB is running locally or use a cloud MongoDB Atlas URL
For image uploads, the uploads/ folder should exist and be writable
TailwindCSS classes and Shadcn/UI components are used for a modern admin dashboard

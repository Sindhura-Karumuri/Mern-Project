# Razorpay Integration Setup Guide

## Overview
This application now uses Razorpay payment gateway for all transactions. Students must complete payment successfully before orders are placed, and the admin dashboard shows proper payment status.

## Features Implemented

### 1. Food Order Payment Flow
- Students click "Order" on menu items
- Razorpay payment modal opens with order details
- Payment is processed securely through Razorpay
- Order is created ONLY after successful payment verification
- Failed payments do not create orders

### 2. Subscription Plan Payment Flow
- Students click "Subscribe" on plans
- Razorpay payment modal opens with plan details
- Payment is processed securely through Razorpay
- Subscription is activated ONLY after successful payment verification
- Revenue is tracked automatically

### 3. Admin Dashboard Updates
- Shows payment status (Paid/Pending) for each order
- Shows order fulfillment status (Pending/Completed/Cancelled)
- Admin can update order status after payment is confirmed
- Revenue tracking for both orders and subscriptions

## Setup Instructions

### Backend Setup

1. **Get Razorpay Credentials**
   - Sign up at https://razorpay.com/
   - Go to Settings > API Keys
   - Copy your Key ID and Key Secret

2. **Update Environment Variables**
   Edit `backend/.env` file:
   ```env
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
   ```

3. **Install Dependencies** (if not already installed)
   ```bash
   cd backend
   npm install
   ```

4. **Start Backend Server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **No additional configuration needed** - The frontend automatically loads Razorpay SDK

2. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```

## Testing Payment Integration

### Test Mode (Recommended for Development)
Use Razorpay test credentials (keys starting with `rzp_test_`)

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Test UPI:**
- UPI ID: `success@razorpay`

### Live Mode (Production)
1. Complete KYC verification on Razorpay dashboard
2. Switch to live mode API keys (starting with `rzp_live_`)
3. Update `.env` with live credentials

## Payment Flow Details

### Food Orders
1. User clicks "Order" button
2. Backend creates Razorpay order via `/api/payments/create-food-order`
3. Frontend opens Razorpay payment modal
4. User completes payment
5. Frontend sends payment details to `/api/payments/verify-food-payment`
6. Backend verifies signature and creates order
7. Order appears in user's order list and admin dashboard

### Subscription Plans
1. User clicks "Subscribe" button
2. Backend creates Razorpay order via `/api/payments/create-plan-order`
3. Frontend opens Razorpay payment modal
4. User completes payment
5. Frontend sends payment details to `/api/payments/verify-plan-payment`
6. Backend verifies signature and activates subscription
7. Revenue is tracked automatically

## Security Features

1. **Payment Signature Verification**: All payments are verified using HMAC SHA256 signature
2. **Server-side Validation**: Order creation happens only after payment verification
3. **Payment Status Tracking**: All payment attempts are logged in the database
4. **Failed Payment Handling**: Failed payments are marked and orders are not created

## Database Models Updated

### Payment Model
- Stores all payment attempts
- Tracks Razorpay order ID, payment ID, and signature
- Status: Pending, Succeeded, Failed

### Order Model
- Added `razorpay_order_id` and `razorpay_payment_id` fields
- `paymentStatus` field shows payment completion
- Orders created only with `paymentStatus: "completed"`

## API Endpoints

### Payment Endpoints
- `POST /api/payments/create-food-order` - Create Razorpay order for food
- `POST /api/payments/verify-food-payment` - Verify payment and create order
- `POST /api/payments/create-plan-order` - Create Razorpay order for subscription
- `POST /api/payments/verify-plan-payment` - Verify payment and activate subscription

### Order Endpoints
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/my` - Get user's orders
- `POST /api/orders` - Create order (requires completed payment)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## Troubleshooting

### Payment Modal Not Opening
- Check browser console for errors
- Ensure Razorpay script is loaded (check Network tab)
- Verify RAZORPAY_KEY_ID is set correctly

### Payment Verification Failed
- Check RAZORPAY_KEY_SECRET is correct
- Verify signature calculation matches Razorpay's format
- Check backend logs for detailed error messages

### Orders Not Created After Payment
- Verify payment verification endpoint is being called
- Check if payment signature is valid
- Ensure user is authenticated (JWT token present)

## Support
For Razorpay-specific issues, refer to:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

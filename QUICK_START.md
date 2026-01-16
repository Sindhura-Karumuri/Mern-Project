# Quick Start Guide - Razorpay Integration

## Setup in 5 Minutes

### Step 1: Get Razorpay Credentials
1. Go to https://razorpay.com/ and sign up
2. Navigate to Settings → API Keys
3. Copy your **Key ID** and **Key Secret**

### Step 2: Configure Backend
Edit `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

### Step 3: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Step 4: Test Payment
1. Open frontend (usually http://localhost:5173)
2. Login as a student
3. Click "Order" on any menu item
4. Use test card: **4111 1111 1111 1111**
5. CVV: **123**, Expiry: **12/25**
6. Complete payment

### Step 5: Verify Admin Dashboard
1. Login as admin
2. Check "Orders Management" - should show payment status as "Paid"
3. Check "Payment History" - should show successful transaction

## Test Credentials

### Razorpay Test Cards
- **Success**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **UPI**: success@razorpay

### What Changed?
✅ Students must complete Razorpay payment before order is placed
✅ Orders created only after successful payment verification
✅ Admin dashboard shows payment status (Paid/Pending)
✅ Payment history tracked in admin panel
✅ Revenue automatically tracked for completed payments

## Troubleshooting

**Payment modal not opening?**
- Check browser console for errors
- Verify RAZORPAY_KEY_ID is set in backend/.env
- Ensure backend server is running

**Payment verification failed?**
- Check RAZORPAY_KEY_SECRET is correct
- Look at backend console logs for detailed errors

**Orders not appearing?**
- Verify payment was successful
- Check if user is authenticated (JWT token present)
- Look at network tab for API errors

## Need Help?
See `RAZORPAY_SETUP.md` for detailed documentation
See `IMPLEMENTATION_SUMMARY.md` for technical details

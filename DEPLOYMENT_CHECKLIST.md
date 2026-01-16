# Razorpay Integration - Deployment Checklist

## Pre-Deployment Checklist

### 1. Razorpay Account Setup
- [ ] Sign up at https://razorpay.com/
- [ ] Verify email address
- [ ] Complete basic profile setup
- [ ] Navigate to Settings → API Keys
- [ ] Copy Test Key ID (starts with `rzp_test_`)
- [ ] Copy Test Key Secret

### 2. Backend Configuration
- [ ] Open `backend/.env` file
- [ ] Add `RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID`
- [ ] Add `RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET`
- [ ] Verify MongoDB connection string is correct
- [ ] Verify JWT_SECRET is set
- [ ] Save the file

### 3. Backend Dependencies
- [ ] Run `cd backend`
- [ ] Run `npm install` (razorpay package should install)
- [ ] Verify no errors in installation
- [ ] Check `package.json` includes `"razorpay": "^2.9.6"`

### 4. Frontend Dependencies
- [ ] Run `cd frontend`
- [ ] Run `npm install`
- [ ] Verify no errors in installation

### 5. Test Backend
- [ ] Run `cd backend && npm start`
- [ ] Verify server starts without errors
- [ ] Check console for "Server running on port 5000" (or your port)
- [ ] Verify no Razorpay initialization errors

### 6. Test Frontend
- [ ] Run `cd frontend && npm run dev`
- [ ] Verify Vite dev server starts
- [ ] Open browser to http://localhost:5173
- [ ] Check browser console for errors

## Testing Checklist

### 7. Test Food Order Payment
- [ ] Login as a student
- [ ] Navigate to menu section
- [ ] Click "Order" on any menu item
- [ ] Verify Razorpay modal opens
- [ ] Use test card: 4111 1111 1111 1111
- [ ] CVV: 123, Expiry: 12/25
- [ ] Complete payment
- [ ] Verify success message appears
- [ ] Check order appears in "My Orders"
- [ ] Verify order shows in admin dashboard

### 8. Test Subscription Payment
- [ ] Login as a student
- [ ] Navigate to plans section
- [ ] Click "Subscribe" on any plan
- [ ] Verify Razorpay modal opens
- [ ] Complete payment with test card
- [ ] Verify success message appears
- [ ] Check subscription is activated

### 9. Test Admin Dashboard
- [ ] Login as admin
- [ ] Navigate to "Orders Management"
- [ ] Verify orders show "Paid" status
- [ ] Verify order fulfillment status shows
- [ ] Navigate to "Payment History"
- [ ] Verify payment records appear
- [ ] Check payment type (Order/Subscription)
- [ ] Verify Razorpay transaction IDs are shown

### 10. Test Failed Payment Scenarios
- [ ] Try to place order
- [ ] Close Razorpay modal without paying
- [ ] Verify order is NOT created
- [ ] Check no order appears in "My Orders"
- [ ] Verify payment record shows "Pending" or "Failed"

### 11. Test Payment Verification
- [ ] Check backend console logs
- [ ] Verify signature verification messages
- [ ] Check for any error messages
- [ ] Verify revenue tracking logs

## Production Deployment Checklist

### 12. Razorpay Production Setup
- [ ] Complete KYC verification on Razorpay
- [ ] Wait for approval (usually 24-48 hours)
- [ ] Switch to "Live Mode" in Razorpay dashboard
- [ ] Generate Live API Keys (starts with `rzp_live_`)
- [ ] Copy Live Key ID and Secret

### 13. Production Environment Variables
- [ ] Update production `.env` with live keys
- [ ] `RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET`
- [ ] Verify all other environment variables are set
- [ ] DO NOT commit `.env` to version control

### 14. Security Checks
- [ ] Verify `.env` is in `.gitignore`
- [ ] Ensure Razorpay secrets are not exposed in frontend
- [ ] Check CORS settings allow only your domain
- [ ] Verify JWT authentication is working
- [ ] Test admin-only routes are protected

### 15. Database Checks
- [ ] Verify Payment model is created in MongoDB
- [ ] Check Order model has new fields (razorpay_order_id, razorpay_payment_id)
- [ ] Verify indexes are created
- [ ] Test database connection in production

### 16. Frontend Production Build
- [ ] Run `npm run build` in frontend directory
- [ ] Verify build completes without errors
- [ ] Check `dist` folder is created
- [ ] Test production build locally
- [ ] Deploy to hosting (Vercel/Netlify/etc.)

### 17. Backend Production Deployment
- [ ] Deploy backend to hosting (Render/Railway/Heroku/etc.)
- [ ] Set environment variables in hosting platform
- [ ] Verify backend URL is accessible
- [ ] Update frontend `.env` with production backend URL
- [ ] Test API endpoints are working

### 18. Post-Deployment Testing
- [ ] Test complete payment flow in production
- [ ] Use real payment method (small amount)
- [ ] Verify payment is processed
- [ ] Check order is created
- [ ] Verify admin dashboard updates
- [ ] Check payment appears in Razorpay dashboard
- [ ] Verify revenue tracking works

### 19. Monitoring Setup
- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Monitor Razorpay dashboard for transactions
- [ ] Set up alerts for failed payments
- [ ] Monitor server logs for errors
- [ ] Track payment success rate

### 20. Documentation
- [ ] Share `QUICK_START.md` with team
- [ ] Document any custom configurations
- [ ] Create runbook for common issues
- [ ] Document Razorpay webhook setup (if needed)
- [ ] Keep credentials secure and backed up

## Common Issues & Solutions

### Issue: Razorpay modal not opening
**Solution**: 
- Check browser console for errors
- Verify RAZORPAY_KEY_ID is correct
- Ensure Razorpay script is loading (check Network tab)

### Issue: Payment verification failed
**Solution**:
- Verify RAZORPAY_KEY_SECRET is correct
- Check backend logs for signature mismatch
- Ensure order_id and payment_id are being sent correctly

### Issue: Orders not appearing after payment
**Solution**:
- Check if payment verification endpoint is being called
- Verify user authentication (JWT token)
- Check backend logs for errors
- Verify database connection

### Issue: Admin dashboard not showing payments
**Solution**:
- Verify admin authentication
- Check if `/api/admin/payments` endpoint is working
- Verify Payment model is populated in database

## Support Resources

- **Razorpay Documentation**: https://razorpay.com/docs/
- **Razorpay Support**: https://razorpay.com/support/
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Integration Guide**: See `RAZORPAY_SETUP.md`
- **Technical Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Flow Diagram**: See `PAYMENT_FLOW_DIAGRAM.md`

## Emergency Contacts

- Razorpay Support Email: support@razorpay.com
- Razorpay Support Phone: +91-80-6890-6890

---

**Note**: Always test thoroughly in test mode before going live with real payments!

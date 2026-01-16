# Deploy Updated Code to Render

## Quick Deploy Steps

### 1. Commit Your Changes
```bash
git add .
git commit -m "Add Razorpay payment integration"
git push origin main
```

### 2. Render Auto-Deploy
- Render will automatically detect the push and redeploy
- Wait 2-5 minutes for deployment to complete
- Check Render dashboard for deployment status

### 3. Add Environment Variables on Render
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these variables:
   ```
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
   ```
5. Click "Save Changes"
6. Render will automatically redeploy

### 4. Verify Deployment
- Check Render logs for "Server running on port..."
- Test the endpoint: `https://mern-project-123-4mrk.onrender.com/api/payments/create-food-order`
- Should return error (not 404) if endpoint exists

### 5. Update Frontend .env
```env
VITE_API_URL=https://mern-project-123-4mrk.onrender.com/api
```

### 6. Redeploy Frontend (if on Vercel)
```bash
cd frontend
npm run build
# Or push to trigger auto-deploy
git push origin main
```

## Alternative: Manual Deploy on Render

If auto-deploy is disabled:
1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete

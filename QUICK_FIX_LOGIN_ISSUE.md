# 🚨 Quick Fix: Login/Signup Not Working

## The Problem
Your forms are submitting but nothing happens. The backend logs show no POST requests, which means the frontend isn't reaching the backend.

## Most Likely Cause: Missing VITE_API_URL

Vite embeds environment variables **at build time**. If `VITE_API_URL` wasn't set when your frontend was built, all API calls will fail silently.

---

## ✅ Step-by-Step Fix

### Step 1: Check Frontend Environment Variable

1. Go to your **frontend service** on Render
2. Click **"Environment"** tab
3. Look for `VITE_API_URL`
4. It should be: `https://notes-backend-kzi3.onrender.com`
   - ✅ Include `https://`
   - ✅ NO trailing slash
   - ✅ Use your actual backend URL

### Step 2: If Missing or Wrong, Add/Update It

1. Click **"Add Environment Variable"** (if missing)
2. **Key**: `VITE_API_URL`
3. **Value**: `https://notes-backend-kzi3.onrender.com` (your actual backend URL)
4. Click **"Save Changes"**

### Step 3: Rebuild Frontend (CRITICAL!)

**This is the most important step!** Environment variables are embedded at build time, so you MUST rebuild:

1. In your frontend service on Render
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Wait for rebuild to complete (~2-5 minutes)

### Step 4: Test Again

1. Visit your frontend URL
2. Open browser console (F12)
3. Try to login/signup
4. Check console for errors
5. Check Network tab to see if requests are being made

---

## 🔍 How to Verify It's Fixed

### Check Browser Console:
1. Open your frontend
2. Press F12 → Console tab
3. Type: `console.log(import.meta.env.VITE_API_URL)`
4. Should show: `https://notes-backend-kzi3.onrender.com`
5. If it shows `undefined`, the variable wasn't set during build!

### Check Network Tab:
1. F12 → Network tab
2. Try to login
3. You should see a POST request to:
   - `https://notes-backend-kzi3.onrender.com/api/token/`
4. If you see requests, it's working!

---

## 🐛 Other Possible Issues

### Issue 2: CORS Still Blocking
**Symptom**: Console shows "CORS policy" error

**Fix**: 
- Check backend `CORS_ALLOWED_ORIGINS` has your frontend URL (no trailing slash)
- Rebuild backend after updating

### Issue 3: Render Cold Start
**Symptom**: First request takes 30+ seconds

**Fix**: 
- This is normal for free tier
- Just wait, subsequent requests will be faster
- I've added a 60-second timeout to handle this

### Issue 4: Backend Not Running
**Symptom**: Network tab shows "Failed to fetch"

**Fix**:
- Check backend service status on Render
- Verify backend URL is correct
- Check backend logs for errors

---

## 📋 Quick Checklist

- [ ] `VITE_API_URL` is set in frontend environment variables
- [ ] Value is correct (your backend URL, no trailing slash)
- [ ] Frontend was **rebuilt** after setting the variable
- [ ] Backend is running (check Render dashboard)
- [ ] CORS is configured correctly
- [ ] Browser console shows no errors
- [ ] Network tab shows API requests

---

## 🎯 Most Common Solution

**99% of the time**, the fix is:
1. Set `VITE_API_URL` in frontend environment variables
2. **Rebuild the frontend** (this is critical!)

That's it! The issue is almost always that the environment variable wasn't set during the build.

---

## 💡 Pro Tip

After setting environment variables, always rebuild:
- Frontend: Manual Deploy → Deploy latest commit
- Backend: Usually auto-redeploys, but you can trigger manual deploy if needed


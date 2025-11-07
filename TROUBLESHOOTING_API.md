# 🔧 Troubleshooting: Login/Signup Not Working

## The Problem
Forms are taking too long and nothing happens after submission. Backend logs show no POST requests to API endpoints.

## Root Causes

### 1. **VITE_API_URL Not Set or Incorrect** (Most Likely)
Vite embeds environment variables at **build time**, not runtime. If `VITE_API_URL` wasn't set when the frontend was built, API calls will fail.

### 2. **CORS Preflight Issues**
Browser might be blocking requests due to CORS preflight failures.

### 3. **Render Free Tier Cold Start**
First request after inactivity can take 30+ seconds.

---

## ✅ Solution 1: Rebuild Frontend with Correct API URL

### Step 1: Verify Environment Variable
1. Go to your **frontend service** on Render
2. Click **"Environment"** tab
3. Check `VITE_API_URL`:
   - Should be: `https://notes-backend-kzi3.onrender.com`
   - **NO trailing slash**
   - Must include `https://`

### Step 2: Rebuild Frontend
1. In your frontend service on Render
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. This will rebuild with the correct environment variable

### Step 3: Verify Build Logs
Check the build logs to ensure:
- `VITE_API_URL` is being used
- Build completes successfully
- No errors about missing environment variables

---

## ✅ Solution 2: Check Browser Console

1. Open your frontend URL
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to login/signup
5. Look for errors like:
   - `Network Error`
   - `CORS policy`
   - `Failed to fetch`
   - `Request timeout`

### Common Console Errors:

**"Failed to fetch" or "Network Error"**
- API URL is incorrect or not set
- Backend is down or unreachable

**"CORS policy: No 'Access-Control-Allow-Origin' header"**
- CORS configuration issue
- Check backend CORS settings

**"Request timeout"**
- Render free tier cold start (wait 30+ seconds)
- Or backend is not responding

---

## ✅ Solution 3: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to login/signup
4. Look for requests to:
   - `https://notes-backend-kzi3.onrender.com/api/token/` (login)
   - `https://notes-backend-kzi3.onrender.com/api/user/register/` (register)

### What to Check:
- **Status Code**: Should be 200 or 201 (not 400, 401, 404, or CORS errors)
- **Request URL**: Should match your backend URL exactly
- **Request Method**: Should be POST
- **Request Headers**: Should include `Content-Type: application/json`

---

## ✅ Solution 4: Test Backend Directly

Test if your backend API is working:

### Test Login Endpoint:
Open in browser or use curl:
```
https://notes-backend-kzi3.onrender.com/api/token/
```

You should get a response (even if it's an error about missing data, that's fine - it means the endpoint exists).

### Test with curl (if you have it):
```bash
curl -X POST https://notes-backend-kzi3.onrender.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

---

## ✅ Solution 5: Add Request Timeout

The frontend might be timing out. Let's add a longer timeout for Render's free tier.

Update `frontend/src/api.js`:
```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 60000  // 60 seconds for Render free tier cold starts
})
```

Then rebuild and redeploy.

---

## 🔍 Debugging Checklist

- [ ] `VITE_API_URL` is set in frontend environment variables
- [ ] Frontend was rebuilt after setting `VITE_API_URL`
- [ ] Backend URL is correct (no trailing slash)
- [ ] Backend is running (check Render dashboard)
- [ ] CORS is configured correctly
- [ ] Browser console shows no errors
- [ ] Network tab shows API requests being made
- [ ] Backend logs show incoming requests

---

## 🚨 Quick Fix: Temporary Test

To quickly test if it's an environment variable issue:

1. Open browser console on your frontend
2. Run this command:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
```

If it shows `undefined`, the environment variable wasn't set during build!

---

## 📝 Most Common Issue

**90% of the time**, the issue is:
- `VITE_API_URL` not set in Render frontend environment variables
- OR frontend was built before the variable was set
- **Solution**: Set the variable and rebuild!


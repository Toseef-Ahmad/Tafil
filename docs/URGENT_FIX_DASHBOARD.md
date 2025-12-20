# ⚠️ URGENT - Fix Dashboard 500 Error

## The Problem

Dashboard environment variables are missing.

---

## ✅ SOLUTION - Do This Now (2 minutes)

### Step 1: Add Environment Variables

**Go to:** https://vercel.com/toseefahmads-projects/tafil-dashboard/settings/environment-variables

**Click "Add" and add these TWO variables:**

**Variable 1:**
```
Name: API_URL
Value: https://api.tafil.app
```

**Variable 2:**
```
Name: ADMIN_API_KEY
Value: [same key you used for server - copy from server's ADMIN_API_KEY]
```

**IMPORTANT:** 
- ❌ NO `NEXT_PUBLIC_` prefix!
- ✅ Just `API_URL` and `ADMIN_API_KEY`

---

### Step 2: Get ADMIN_API_KEY from Server

**Go to:** https://vercel.com/toseefahmads-projects/tafil-license-server/settings/environment-variables

**Find:** `ADMIN_API_KEY` and copy its value

**Paste it** as the value for dashboard's `ADMIN_API_KEY`

---

### Step 3: Redeploy Dashboard

After adding both variables, click the **Redeploy** button on the dashboard project.

Or run:
```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/tafil-node.js-license-server/dashboard
npx vercel --prod
```

---

### Step 4: Wait 30 Seconds

Deployment takes ~30 seconds.

---

### Step 5: Test

**Open:** https://dashboard.tafil.app

Should now work! ✅

---

## ✅ Summary

**Add to dashboard:**
```
API_URL = https://api.tafil.app
ADMIN_API_KEY = [copy from server]
```

**Then redeploy.**

**That's it!** 🎉


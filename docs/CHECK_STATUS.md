# ✅ Check Your Setup Status

## What's Working ✅

Your webhook is receiving Gumroad pings! This is what was received:

```
Email: ahmadtouseef946@gmail.com
Product: TAFIL Desktop App
Price: $49
Sale ID: 6pFNasf0D4n6fmpojDtsbA==
Test: true (this was a test ping)
```

---

## ⚠️ What Needs Fixing

The database tables need to be created. Here's how to fix it:

---

## 🔧 STEP-BY-STEP FIX

### 1. Check Environment Variables on Server

**Go to:** https://vercel.com/toseefahmads-projects/tafil-license-server/settings/environment-variables

**You should see:**
- ✅ `POSTGRES_URL` (auto-added by Neon database)
- ❓ `KEY_PASSPHRASE` (did you add this?)
- ❓ `ADMIN_API_KEY` (did you add this?)
- ❓ `JWT_SECRET` (did you add this?)

**If the last 3 are missing, add them:**

Generate keys:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Run 3 times, then add:
```
KEY_PASSPHRASE = [key 1]
ADMIN_API_KEY = [key 2]
JWT_SECRET = [key 3]
```

---

### 2. Check Environment Variables on Dashboard

**Go to:** https://vercel.com/toseefahmads-projects/tafil-dashboard/settings/environment-variables

**You should see:**
- ❓ `API_URL` = `https://api.tafil.app`
- ❓ `ADMIN_API_KEY` = [same as server's ADMIN_API_KEY]

**If missing, add them!**

---

### 3. Redeploy Both

After adding environment variables:

**Server:**
- Go to: https://vercel.com/toseefahmads-projects/tafil-license-server
- Click **Deployments** → **Redeploy** latest

**Dashboard:**
- Go to: https://vercel.com/toseefahmads-projects/tafil-dashboard
- Click **Deployments** → **Redeploy** latest

**Wait 1 minute for both to deploy**

---

### 4. Initialize Database

Run this locally to create tables:

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/tafil-node.js-license-server

# Set environment variables temporarily
export POSTGRES_URL="[copy from Vercel - tafil-license-server → settings → environment-variables]"

# Run init script
node scripts/init-vercel-db.js
```

This will create all tables in your Neon database.

---

### 5. Test Dashboard Again

**Open:** https://dashboard.tafil.app

Should work now! ✅

---

## 🔍 Quick Debug

If dashboard still doesn't work, check the logs:

**In browser:**
- Open https://dashboard.tafil.app
- Press F12 (Developer Tools)
- Click "Console" tab
- Look for errors

**In Vercel:**
- Go to: https://vercel.com/toseefahmads-projects/tafil-license-server
- Click "Deployments" → Latest deployment
- Click "View Function Logs"
- Look for database errors

---

## 🎯 Your Webhook URL (For Gumroad)

```
https://api.tafil.app/webhook/gumroad
```

**This is working!** ✅ (We saw it receive the ping)

---

## 📞 Need More Help?

Check if environment variables are set:
- Server should have: `POSTGRES_URL`, `KEY_PASSPHRASE`, `ADMIN_API_KEY`, `JWT_SECRET`
- Dashboard should have: `API_URL`, `ADMIN_API_KEY`

**After setting variables, always redeploy!**


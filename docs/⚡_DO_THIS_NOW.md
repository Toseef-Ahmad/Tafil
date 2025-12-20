# ⚡ DO THIS NOW - Fix Dashboard

## The Problem
Database tables don't exist yet in Neon.

---

## ✅ SOLUTION (5 Actions)

### 1. Generate Secure Keys (1 min)

Run this command **3 times**:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

**Copy each result**, you'll need 3 keys.

---

### 2. Add to License Server (2 min)

**Go to:** https://vercel.com/toseefahmads-projects/tafil-license-server/settings/environment-variables

**Click "Add" 3 times and add:**

```
Key: KEY_PASSPHRASE
Value: [paste key 1]
✅ Production ✅ Preview ✅ Development

Key: ADMIN_API_KEY
Value: [paste key 2]
✅ Production ✅ Preview ✅ Development

Key: JWT_SECRET
Value: [paste key 3]
✅ Production ✅ Preview ✅ Development
```

**Click "Save"**

---

### 3. Redeploy Server (1 min)

**Same page** → Click **"Deployments"** tab → Click **"Redeploy"** button

**Wait 30 seconds**

---

### 4. Add to Dashboard (1 min)

**Go to:** https://vercel.com/toseefahmads-projects/tafil-dashboard/settings/environment-variables

**Add these 2:**

```
Key: API_URL
Value: https://api.tafil.app
✅ Production ✅ Preview ✅ Development

Key: ADMIN_API_KEY
Value: [paste key 2 from step 2 - SAME VALUE]
✅ Production ✅ Preview ✅ Development
```

**Click "Save"**

**Go to Deployments** → Click **"Redeploy"**

**Wait 30 seconds**

---

### 5. Test Dashboard (30 sec)

**Open:** https://dashboard.tafil.app

Should work now! ✅

---

## 🔗 Webhook URL for Gumroad

```
https://api.tafil.app/webhook/gumroad
```

**Set this in Gumroad product settings → Ping section**

---

## ✅ That's All!

After these 5 steps, everything works! 🎉


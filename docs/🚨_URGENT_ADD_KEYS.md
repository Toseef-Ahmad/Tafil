# 🚨 URGENT - Add RSA Keys to Vercel

## Problem

Server can't sign licenses because RSA keys aren't on Vercel.

---

## ✅ SOLUTION (3 Steps)

### Step 1: Get Base64 Keys

Already created! Check these files:

```bash
cat /Users/sodaclick/Desktop/projects/Own\ Projects/tafil-node.js-license-server/keys/private.b64

cat /Users/sodaclick/Desktop/projects/Own\ Projects/tafil-node.js-license-server/keys/public.b64
```

### Step 2: Add to Vercel

**Go to:** https://vercel.com/toseefahmads-projects/tafil-license-server/settings/environment-variables

**Add Variable 1:**
```
Name: RSA_PRIVATE_KEY_BASE64
Value: [paste entire contents of private.b64]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Add Variable 2:**
```
Name: RSA_PUBLIC_KEY_BASE64
Value: [paste entire contents of public.b64]
Environment: ✅ Production ✅ Preview ✅ Development
```

### Step 3: Redeploy

Click **Redeploy** button.

---

## ✅ Test

After redeploy, try activation again in TAFIL app!

Should work! ✅


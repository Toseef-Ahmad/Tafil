# 🚀 TAFIL - Quick Vercel Deployment

Deploy all 3 components to Vercel in 15 minutes!

---

## 📋 Prerequisites

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

---

## 🎯 Deploy in 3 Steps

### Step 1: Deploy License Server (5 min)

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/tafil-node.js-license-server

# Install PostgreSQL driver
npm install pg --legacy-peer-deps

# Deploy to Vercel
vercel

# When prompted:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? tafil-license-server
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Note your URL:** `https://tafil-license-server-xxx.vercel.app`

#### Configure on Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select `tafil-license-server`
3. Go to **Storage** → **Create Database** → **Postgres**
4. Go to **Settings** → **Environment Variables**
5. Add these:

```bash
KEY_PASSPHRASE=your-super-secure-passphrase-64-chars
ADMIN_API_KEY=your-admin-api-key-64-chars  
JWT_SECRET=your-jwt-secret-32-chars
```

Generate secure keys:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

6. **Redeploy** after adding variables

---

### Step 2: Deploy Admin Dashboard (3 min)

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/tafil-node.js-license-server/dashboard

# Deploy
vercel
vercel --prod
```

#### Configure Environment

In Vercel Dashboard → `tafil-dashboard` → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://tafil-license-server-xxx.vercel.app
NEXT_PUBLIC_ADMIN_API_KEY=same-as-server-admin-api-key
```

**Redeploy** after adding variables.

**Your Dashboard:** `https://tafil-dashboard-xxx.vercel.app`

---

### Step 3: Deploy Landing Page (2 min)

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/node-project-manager/electron-node-manager/landing

# Deploy
vercel
vercel --prod
```

**Your Landing Page:** `https://tafil-landing-xxx.vercel.app`

---

## ✅ Quick Test

```bash
# Test server
curl https://YOUR-SERVER-URL.vercel.app/health

# Test dashboard (open in browser)
open https://YOUR-DASHBOARD-URL.vercel.app

# Test landing (open in browser)
open https://YOUR-LANDING-URL.vercel.app
```

---

## 🔗 Update URLs

### 1. Update Server CORS

Edit `tafil-license-server/app.js`:

```javascript
app.use(cors({
  origin: [
    'https://tafil-dashboard-xxx.vercel.app',  // Your dashboard URL
    'https://tafil-landing-xxx.vercel.app',     // Your landing URL
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Then redeploy:
```bash
cd tafil-license-server && vercel --prod
```

### 2. Update Landing Page Gumroad URL

Edit `landing/src/App.jsx`:

```javascript
const GUMROAD_URL = 'https://YOUR-USERNAME.gumroad.com/l/tafil';
```

Then redeploy:
```bash
cd landing && vercel --prod
```

### 3. Update TAFIL App

Edit `electron-node-manager/.env`:

```bash
LICENSE_SERVER_URL=https://YOUR-SERVER-URL.vercel.app
```

---

## 🎨 Custom Domains (Optional but Recommended)

### Add Domains in Vercel

1. **Landing:** `tafil.app` → tafil-landing project
2. **Dashboard:** `dashboard.tafil.app` → tafil-dashboard project  
3. **Server:** `api.tafil.app` → tafil-license-server project

### Configure DNS

Add these records to your domain provider:

```
Type  Name       Value
----  ----       -----
A     @          76.76.21.21
CNAME dashboard  cname.vercel-dns.com
CNAME api        cname.vercel-dns.com
```

(Use actual values from Vercel dashboard)

---

## 💳 Set Up Gumroad

1. Create product at https://gumroad.com/products
2. Enable "Generate license keys"
3. Add webhook:
   - URL: `https://YOUR-SERVER-URL.vercel.app/webhook/gumroad`
   - Event: "Sale"
4. Test with Ping button

---

## 🧪 Test Complete Flow

1. Visit landing page
2. Click "Buy Now" → complete test purchase
3. Check dashboard for new license
4. Use license key in TAFIL app
5. Verify activation works

---

## 📊 Your Deployed URLs

Write them here for reference:

- **Landing:** https://_______________________.vercel.app
- **Dashboard:** https://_______________________.vercel.app
- **Server:** https://_______________________.vercel.app

---

## 🆘 Troubleshooting

**Build fails?**
→ Check `vercel logs` for errors
→ Ensure all dependencies installed

**Database connection fails?**
→ Verify Vercel Postgres is created
→ Check environment variables

**Dashboard shows 403?**
→ Ensure API URL is correct
→ Check ADMIN_API_KEY matches

**CORS errors?**
→ Add dashboard and landing URLs to server CORS config

---

## 📖 Full Documentation

For detailed guides, see:
- `VERCEL_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `SYSTEM_OVERVIEW.md` - Architecture overview
- `TESTING_WALKTHROUGH.md` - Testing guide

---

## 🎉 You're Live!

Congratulations! Your TAFIL ecosystem is now deployed and ready to sell!

Next steps:
1. ✅ Test purchase flow end-to-end
2. ✅ Configure custom domains
3. ✅ Set up monitoring (UptimeRobot)
4. ✅ Announce to your audience!

**You're ready to start selling TAFIL!** 🚀


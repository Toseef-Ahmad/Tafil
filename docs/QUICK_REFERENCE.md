# 🚀 TAFIL - Quick Reference Card

## ✅ What's Deployed

| Component | Vercel URL | Custom Domain (After DNS) |
|-----------|-----------|---------------------------|
| Landing Page | https://tafil-landing.vercel.app | https://tafil.app |
| Downloads Page | Deploy next! → | https://download.tafil.app |
| Dashboard | https://tafil-dashboard.vercel.app | https://dashboard.tafil.app |
| License Server | https://tafil-license-server.vercel.app | https://api.tafil.app |

---

## 📝 Next 3 Steps

### 1️⃣ Deploy Downloads Page (5 min)

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/tafil-downloads
npx vercel --prod
```

### 2️⃣ Build TAFIL Desktop App (10 min)

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/node-project-manager/electron-node-manager

# Set production server
echo "LICENSE_SERVER_URL=https://api.tafil.app" > .env

# Build (creates .dmg for Mac)
npm run build:mac
```

### 3️⃣ Upload Builds to Downloads (5 min)

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects

# Copy builds
cp node-project-manager/electron-node-manager/release/*.dmg tafil-downloads/public/downloads/
cp node-project-manager/electron-node-manager/release/*.exe tafil-downloads/public/downloads/
cp node-project-manager/electron-node-manager/release/*.AppImage tafil-downloads/public/downloads/

# Redeploy
cd tafil-downloads && npx vercel --prod
```

---

## 🌐 Setting Up tafil.app Domain

### In Your Domain Registrar (Where you bought tafil.app):

Add these DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: download
Value: cname.vercel-dns.com

Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com

Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

### In Vercel Dashboard:

1. Go to each project → Settings → Domains
2. Add respective domain:
   - `tafil-landing` → Add `tafil.app` and `www.tafil.app`
   - `tafil-downloads` → Add `download.tafil.app`
   - `tafil-dashboard` → Add `dashboard.tafil.app`
   - `tafil-license-server` → Add `api.tafil.app`

---

## 💳 Gumroad Setup

### Create Product

1. Go to https://gumroad.com/products/new
2. Name: "TAFIL Pro - Project Command Center"
3. Price: $49
4. Enable "Generate license keys"

### Configure Webhook

1. Product Settings → Ping
2. URL: `https://api.tafil.app/webhook/gumroad`
3. Event: "Sale"
4. Test with Ping button

### Your Gumroad URL

`https://toseefahmad.gumroad.com/l/tafil`

Update in `landing/src/App.jsx`:
```javascript
const GUMROAD_URL = 'https://toseefahmad.gumroad.com/l/tafil';
```

---

## 🔐 Required Environment Variables

### License Server

In Vercel → tafil-license-server → Settings → Environment Variables:

```bash
KEY_PASSPHRASE=<generate with command below>
ADMIN_API_KEY=<generate with command below>
JWT_SECRET=<generate with command below>
POSTGRES_URL=<auto-added by Vercel Postgres>
```

Generate secure keys:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Run 3 times for each variable!

### Dashboard

In Vercel → tafil-dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://api.tafil.app
NEXT_PUBLIC_ADMIN_API_KEY=<same as server ADMIN_API_KEY>
```

---

## 🧪 Testing Checklist

- [ ] Visit https://tafil.app → Landing page loads
- [ ] Visit https://download.tafil.app → Download page loads
- [ ] Download TAFIL → File downloads correctly
- [ ] Install TAFIL → App opens
- [ ] Buy on Gumroad → Receive license key
- [ ] Check dashboard → License appears
- [ ] Activate in TAFIL → Success
- [ ] Check offline mode → Works

---

## 🚀 Deploy Commands

```bash
# Downloads page
cd tafil-downloads && npx vercel --prod

# Landing page  
cd landing && npx vercel --prod

# Dashboard
cd dashboard && npx vercel --prod

# Server
cd tafil-license-server && npx vercel --prod
```

---

## 📖 Full Documentation

- **COMPLETE_SETUP_GUIDE.md** - Detailed setup
- **VERCEL_DEPLOYMENT_GUIDE.md** - Complete deployment
- **START_HERE.md** - Getting started
- **DEPLOYMENT_COMPLETE.md** - Launch checklist

---

## 💰 Revenue Flow

```
Customer → tafil.app → Buy ($49) → Gumroad
                              ↓
                        Webhook → Server
                              ↓
                    License Key Generated
                              ↓
                    Email to Customer
                              ↓
            Customer → download.tafil.app
                              ↓
                      Downloads TAFIL
                              ↓
                  Enters License → Activated!
```

---

## 🎯 Your URLs (Final)

After DNS propagation:

- 🌐 **Home:** https://tafil.app
- 📥 **Download:** https://download.tafil.app
- 📊 **Dashboard:** https://dashboard.tafil.app
- 🔌 **API:** https://api.tafil.app
- 💳 **Buy:** https://toseefahmad.gumroad.com/l/tafil

---

## ⚡ Common Commands

```bash
# Check server health
curl https://api.tafil.app/health

# View Vercel logs
vercel logs tafil-license-server --follow

# Build TAFIL app
cd electron-node-manager && npm run build:mac

# Upload new version
cp release/*.dmg ../../../tafil-downloads/public/downloads/
cd ../../../tafil-downloads && npx vercel --prod

# Test license activation
curl -X POST https://api.tafil.app/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{"license_key":"YOUR-KEY","device_fingerprint":"test"}'
```

---

## 🎊 You're Ready to Sell!

Everything is in place:
- ✅ Complete licensing system
- ✅ Payment processing (Gumroad)
- ✅ Download hosting
- ✅ Admin dashboard
- ✅ Professional landing page

**Go launch!** 🚀


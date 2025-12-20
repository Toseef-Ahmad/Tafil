# 🎯 Complete TAFIL Setup Guide - Custom Domain & Downloads

## ✅ What You've Deployed

1. ✅ **License Server:** https://tafil-license-server.vercel.app
2. ✅ **Dashboard:** https://tafil-dashboard.vercel.app
3. ✅ **Landing Page:** https://tafil-landing.vercel.app
4. ⏳ **Downloads Page:** (need to deploy)

---

## 🌐 Setting Up Custom Domain (tafil.app)

You own `tafil.app` - let's map it properly!

### Recommended Domain Mapping

```
tafil.app                → Landing Page
download.tafil.app       → Downloads Page
dashboard.tafil.app      → Admin Dashboard
api.tafil.app            → License Server
```

### Step 1: Deploy Downloads Page

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/tafil-downloads
npx vercel --prod
```

### Step 2: Add Domains in Vercel

#### For Landing Page (tafil.app)

1. Go to https://vercel.com/dashboard
2. Click on `tafil-landing` project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `tafil.app` (without www)
6. Click **Add**
7. Also add: `www.tafil.app`

#### For Downloads Page (download.tafil.app)

1. Go to `tafil-downloads` project
2. Settings → Domains
3. Add: `download.tafil.app`

#### For Dashboard (dashboard.tafil.app)

1. Go to `tafil-dashboard` project
2. Settings → Domains
3. Add: `dashboard.tafil.app`

#### For License Server (api.tafil.app)

1. Go to `tafil-license-server` project
2. Settings → Domains
3. Add: `api.tafil.app`

### Step 3: Configure DNS

Vercel will show you DNS records to add. Go to your domain registrar (where you bought tafil.app) and add:

**For main domain (tafil.app):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For subdomains:**
```
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

**Note:** Use the actual values from Vercel dashboard (may vary).

### Step 4: Wait for DNS Propagation

- Usually takes 5-30 minutes
- Can take up to 48 hours
- Check status in Vercel dashboard

---

## 📦 Building & Uploading TAFIL Desktop App

### Step 1: Build TAFIL for All Platforms

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/node-project-manager/electron-node-manager

# Make sure production server URL is set
echo "LICENSE_SERVER_URL=https://api.tafil.app" > .env

# Build for all platforms (if on Mac)
npm run build:mac

# Or build for specific platforms:
npm run build:mac        # Creates .dmg file
npm run build:win        # Creates .exe (requires wine on Mac)
npm run build:linux      # Creates .AppImage
```

**Build outputs will be in:**
```
electron-node-manager/release/
├── TAFIL-1.0.0-darwin-x64.dmg          # macOS Intel
├── TAFIL-1.0.0-darwin-arm64.dmg        # macOS Apple Silicon  
├── TAFIL-1.0.0-mac-universal.dmg       # macOS Universal
├── TAFIL-1.0.0-win-x64.exe             # Windows
└── TAFIL-1.0.0-linux-x64.AppImage      # Linux
```

### Step 2: Copy Builds to Downloads Folder

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects

# Copy built files
cp node-project-manager/electron-node-manager/release/*.dmg tafil-downloads/public/downloads/
cp node-project-manager/electron-node-manager/release/*.exe tafil-downloads/public/downloads/
cp node-project-manager/electron-node-manager/release/*.AppImage tafil-downloads/public/downloads/

# Check files
ls -lh tafil-downloads/public/downloads/
```

### Step 3: Deploy Downloads Page

```bash
cd tafil-downloads
npx vercel --prod
```

Done! Your builds are now available at:
- https://download.tafil.app (after DNS setup)
- Or: https://tafil-downloads.vercel.app

---

## 🔗 Update All URLs After Domain Setup

### 1. Update Landing Page

Edit `landing/src/App.jsx`:

```javascript
const DOWNLOAD_URL = `https://download.tafil.app`;
const GUMROAD_URL = `https://toseefahmad.gumroad.com/l/tafil`;
```

Redeploy:
```bash
cd landing && npx vercel --prod
```

### 2. Update Dashboard Environment

In Vercel Dashboard → `tafil-dashboard` → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.tafil.app
```

Redeploy dashboard:
```bash
cd dashboard && npx vercel --prod
```

### 3. Update Server CORS

Edit `tafil-license-server/app.js`:

```javascript
app.use(cors({
  origin: [
    'https://tafil.app',
    'https://www.tafil.app',
    'https://download.tafil.app',
    'https://dashboard.tafil.app',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Redeploy server:
```bash
cd tafil-license-server && npx vercel --prod
```

---

## 💳 Setting Up Gumroad

### Step 1: Create Gumroad Product

1. Go to https://gumroad.com/products/new
2. Fill in:
   - **Product Name:** TAFIL Pro - Project Command Center
   - **Price:** $49 USD
   - **Product Type:** Software
   - **Description:** (copy from landing page)

3. **Enable License Keys:**
   - Scroll down to "License Keys"
   - Enable "Generate license keys"
   - Select "One license per purchase"

4. **Add Product Files:** (Optional - or just send license key)
   - Can upload a PDF guide
   - Or just send the download link

### Step 2: Configure Gumroad Webhook

1. Go to Product Settings
2. Scroll to "Ping"
3. Webhook URL: `https://api.tafil.app/webhook/gumroad`
4. Select events: **Sale**
5. Click **Ping** to test

### Step 3: Update Landing Page

Edit `landing/src/App.jsx`:

```javascript
const GUMROAD_URL = `https://toseefahmad.gumroad.com/l/tafil`;
```

Your Gumroad product URL will be something like:
`https://toseefahmad.gumroad.com/l/tafil`

Redeploy:
```bash
cd landing && npx vercel --prod
```

### Step 4: Configure Environment on Server

In Vercel → `tafil-license-server` → Settings → Environment Variables:

Make sure these are set:
```
KEY_PASSPHRASE=your-secure-passphrase
ADMIN_API_KEY=your-secure-api-key
JWT_SECRET=your-jwt-secret
```

Generate them:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### Step 5: Add Vercel Postgres Database

In Vercel → `tafil-license-server` → Storage → Create Database → Postgres

This will automatically add `POSTGRES_URL` environment variable.

---

## 🧪 Testing Complete Flow

### Test 1: Purchase Flow

1. Go to https://tafil.app (or tafil-landing.vercel.app for now)
2. Click "Buy TAFIL Pro"
3. Complete test purchase on Gumroad
4. Check email for license key
5. Check https://dashboard.tafil.app for new license

### Test 2: Download & Install

1. Go to https://download.tafil.app
2. Download for your platform
3. Install TAFIL
4. Enter license key from Gumroad
5. Verify activation works

### Test 3: Admin Access

1. Go to https://dashboard.tafil.app
2. Should show statistics
3. Search for test license
4. View devices
5. Test deactivation

---

## 📋 Complete Checklist

### Deployment
- [x] License server deployed
- [x] Dashboard deployed
- [x] Landing page deployed
- [ ] Downloads page deployed
- [ ] TAFIL desktop app built
- [ ] Builds uploaded to downloads page

### Domain Setup
- [ ] DNS records added for tafil.app
- [ ] DNS records added for download.tafil.app
- [ ] DNS records added for dashboard.tafil.app
- [ ] DNS records added for api.tafil.app
- [ ] SSL certificates verified (automatic)

### Configuration
- [ ] Server environment variables set
- [ ] Dashboard environment variables updated
- [ ] CORS updated with custom domains
- [ ] Landing page URLs updated
- [ ] Download page URLs updated

### Gumroad
- [ ] Gumroad product created
- [ ] License keys enabled
- [ ] Webhook configured
- [ ] Webhook tested
- [ ] Product URL updated in landing

### Testing
- [ ] Test purchase on Gumroad
- [ ] License key received
- [ ] License visible in dashboard
- [ ] Download works from download page
- [ ] TAFIL app activates successfully
- [ ] Offline mode works

---

## 🚀 Quick Commands Reference

```bash
# Deploy downloads page
cd tafil-downloads && npx vercel --prod

# Deploy landing page
cd landing && npx vercel --prod

# Deploy dashboard
cd dashboard && npx vercel --prod

# Deploy server
cd tafil-license-server && npx vercel --prod

# Build TAFIL app
cd electron-node-manager && npm run build:mac

# Copy builds
cp electron-node-manager/release/*.dmg tafil-downloads/public/downloads/
cp electron-node-manager/release/*.exe tafil-downloads/public/downloads/
cp electron-node-manager/release/*.AppImage tafil-downloads/public/downloads/

# Check Vercel logs
vercel logs --follow

# Check build status
vercel inspect <deployment-url>
```

---

## 🎯 Your Final URLs (After Domain Setup)

- **Landing:** https://tafil.app
- **Download:** https://download.tafil.app
- **Dashboard:** https://dashboard.tafil.app
- **API:** https://api.tafil.app
- **Gumroad:** https://toseefahmad.gumroad.com/l/tafil

---

## 💡 Pro Tips

### For Pakistan Payment Methods

Since you're in Pakistan, Gumroad is perfect because:
- ✅ Supports international payments
- ✅ Handles currency conversion
- ✅ Manages sales tax/VAT
- ✅ Sends payouts to PayPal/Bank
- ✅ No need for merchant account

### Alternative Payment Options

If you want more options in future:
- **Lemon Squeezy** - Good Gumroad alternative
- **Paddle** - Merchant of record
- **PayPal Business** - Direct payments

### Building for Windows/Linux on Mac

If you're on Mac and can't build for Windows:

**Option 1: Use GitHub Actions** (Free CI/CD)
```yaml
# .github/workflows/build.yml
# Automatically builds for all platforms
```

**Option 2: Build on each platform**
- Build macOS on Mac
- Build Windows on Windows VM
- Build Linux on Linux VM

**Option 3: Use Electron Forge** (simplifies multi-platform builds)

---

## 🆘 Troubleshooting

**Domain not working:**
- Wait 30 minutes for DNS propagation
- Check DNS with: `dig tafil.app`
- Verify records in Vercel dashboard

**Download links 404:**
- Ensure files are in `public/downloads/` folder
- Check file names match exactly
- Redeploy after adding files

**License activation fails:**
- Check server is running: `curl https://api.tafil.app/health`
- Check CORS is configured
- Check environment variables are set

**Gumroad webhook not working:**
- Check webhook URL is correct
- Test with "Ping" button
- Check Vercel logs for errors

---

## 🎉 You're Ready to Launch!

Once everything is set up:
1. ✅ All apps deployed
2. ✅ Custom domains configured
3. ✅ Downloads available
4. ✅ Gumroad product live
5. ✅ License system working

**Go make money!** 💰

Tweet something like:
```
🎉 Launching TAFIL - Your Project Command Center!

✨ One place for all your projects
🚀 One-click run & manage
💡 Built-in notes & diagrams
📱 3-device license

$49 - Lifetime access
Download: https://tafil.app

#indiehacker #buildinpublic #developer
```

---

**Need help? All documentation is in the tafil-license-server folder!**


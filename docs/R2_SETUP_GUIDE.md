# 🚀 Cloudflare R2 Setup Guide for TAFIL Downloads

## Overview

Host your TAFIL app downloads on Cloudflare R2 for **FREE bandwidth** and professional direct downloads.

**Your files will be accessible at:**
- `https://download.tafil.app/TAFIL-1.0.0-mac-universal.dmg`
- `https://download.tafil.app/TAFIL-1.0.0-windows.exe`
- `https://download.tafil.app/TAFIL-1.0.0-linux.AppImage`

---

## Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **R2 Object Storage** in the sidebar
3. Click **Create bucket**
4. Name: `tafil-downloads`
5. Location: **Automatic**
6. Click **Create bucket**

---

## Step 2: Enable Public Access

1. Go to your `tafil-downloads` bucket
2. Click **Settings** tab
3. Under **Public access** → Click **Allow Access**
4. Copy the public URL (something like: `https://pub-xxx.r2.dev`)

---

## Step 3: Connect Custom Domain (download.tafil.app)

1. In bucket settings → **Custom Domains**
2. Click **Connect Domain**
3. Enter: `download.tafil.app`
4. Cloudflare will auto-configure DNS (since tafil.app is on Cloudflare)
5. Wait 1-2 minutes for SSL

---

## Step 4: Upload Files

### Option A: Via Dashboard (Easy)

1. Go to your bucket → **Objects** tab
2. Click **Upload**
3. Upload your files:
   - `TAFIL-1.0.0-mac-universal.dmg` (from `electron-node-manager/release/`)
   - `TAFIL-1.0.0-windows.exe` (when you build Windows)
   - `TAFIL-1.0.0-linux.AppImage` (when you build Linux)

### Option B: Via CLI (Faster)

```bash
# Install Wrangler (Cloudflare CLI)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Upload macOS build
wrangler r2 object put tafil-downloads/TAFIL-1.0.0-mac-universal.dmg \
  --file="/Users/sodaclick/Desktop/projects/Own Projects/node-project-manager/electron-node-manager/release/Tafil-1.0.0-darwin-universal.dmg"

# Upload Windows build (when ready)
wrangler r2 object put tafil-downloads/TAFIL-1.0.0-windows.exe \
  --file="/path/to/windows/build.exe"

# Upload Linux build (when ready)
wrangler r2 object put tafil-downloads/TAFIL-1.0.0-linux.AppImage \
  --file="/path/to/linux/build.AppImage"
```

---

## Step 5: Test Downloads

After setup, test these URLs:

```
https://download.tafil.app/TAFIL-1.0.0-mac-universal.dmg
```

The file should download directly — no redirect, no GitHub page!

---

## Step 6: Deploy Landing Page

```bash
cd /Users/sodaclick/Desktop/projects/Own\ Projects/node-project-manager/electron-node-manager/landing
npm run build
npx vercel --prod
```

---

## 📊 Pricing

| Item | Cost |
|------|------|
| R2 Storage | $0.015/GB/month (~$0.003 for 200MB) |
| R2 Bandwidth | **FREE** (no egress charges!) |
| Custom Domain | **FREE** (you own tafil.app) |

**Total: ~$0.003/month** 🎉

---

## ✅ Final Checklist

- [ ] Create R2 bucket: `tafil-downloads`
- [ ] Enable public access
- [ ] Connect domain: `download.tafil.app`
- [ ] Upload macOS DMG
- [ ] Test download URL
- [ ] Deploy landing page with new download links

---

## 🎯 What Was Updated

### Landing Page (`landing/src/App.jsx`)
- ✅ Added Download section with all 3 platforms
- ✅ Auto-detects user's OS for main download button
- ✅ Direct R2 download links (no redirects)
- ✅ Updated Gumroad URL: `tafil.gumroad.com/l/tafil-license`
- ✅ Updated price: $29 (was $49)

### TAFIL App
- ✅ Updated Gumroad URL in renderer.js
- ✅ Updated Gumroad URL in license-ui.html
- ✅ Updated price to $29

### Download URLs (update when R2 is set up)
```
https://download.tafil.app/TAFIL-1.0.0-mac-universal.dmg
https://download.tafil.app/TAFIL-1.0.0-windows.exe
https://download.tafil.app/TAFIL-1.0.0-linux.AppImage
```


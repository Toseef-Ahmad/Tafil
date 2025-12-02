# ⚡ Quick Deployment Guide

## 🚀 Deploy in 3 Commands:

### Option 1: Use the deployment script (easiest)

```bash
cd "/Users/sodaclick/Desktop/projects/Own Projects/node-project-manager/electron-node-manager/landing"
./deploy.sh
```

### Option 2: Manual commands

```bash
# 1. Navigate
cd "/Users/sodaclick/Desktop/projects/Own Projects/node-project-manager/electron-node-manager/landing"

# 2. Install & Deploy
npm install
npm run deploy
```

---

## ⚙️ Configure GitHub Pages (ONE TIME ONLY)

1. Go to: https://github.com/Toseef-Ahmad/Tafil/settings/pages
2. Set:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Click **Save**

---

## 🌐 Your Live URL

```
https://toseef-ahmad.github.io/Tafil/
```

Wait 1-3 minutes after first deployment.

---

## 🔧 Troubleshooting

### If npm fails:
```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
```

### If still showing Electron UI:
1. Check GitHub Pages settings (above)
2. Wait 2-3 minutes
3. Clear browser cache (Cmd+Shift+R)

---

## ✅ What You'll See

✅ Beautiful React landing page with green gradients  
✅ "Tired of juggling dozens of Node.js projects?" headline  
✅ "Get Organized Now" button  

❌ NOT the Electron app (no sidebar, no project cards)

---

## 📂 Project Structure

```
electron-node-manager/          ← Electron app (stays on main branch)
├── main.js
├── renderer.js
├── index.html
└── landing/                    ← React landing page (deploys to gh-pages)
    ├── src/App.jsx
    ├── package.json
    └── deploy.sh               ← Run this!
```

Completely separated! 🎯


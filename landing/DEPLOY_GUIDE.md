# 🚀 Landing Page Deployment Guide

## ✅ Files are now configured correctly!

All URLs are updated to use `/Tafil/` (capital T) to match your GitHub repo name.

---

## 📋 Step-by-Step Deployment Instructions

### **Step 1: Fix npm permissions (ONE TIME ONLY)**

Open your terminal and run:

```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
```

- Enter your Mac password when prompted
- This fixes npm cache permission errors

---

### **Step 2: Navigate to the landing folder**

```bash
cd "/Users/sodaclick/Desktop/projects/Own Projects/node-project-manager/electron-node-manager/landing"
```

---

### **Step 3: Install dependencies**

```bash
npm install
```

This installs all dependencies for the **landing page only** (not Electron).

---

### **Step 4: Build the landing page**

```bash
npm run build
```

This creates the production build in `landing/dist/`

---

### **Step 5: Deploy to GitHub Pages**

```bash
npm run deploy
```

This will:
- Build your React landing page
- Create/update the `gh-pages` branch in your repo
- Push only the built landing page (no Electron code)
- Takes about 30-60 seconds

You should see output like:
```
Published
```

---

### **Step 6: Configure GitHub Pages (REQUIRED - ONE TIME)**

**In your web browser:**

1. Go to: `https://github.com/Toseef-Ahmad/Tafil/settings/pages`

2. Under **"Build and deployment"**:
   - **Source**: Select **"Deploy from a branch"**
   - **Branch**: Select **`gh-pages`**
   - **Folder**: Select **`/ (root)`**

3. Click **"Save"**

4. Wait 1-3 minutes for GitHub to deploy

---

### **Step 7: View your landing page!**

Open in your browser:

```
https://toseef-ahmad.github.io/Tafil/
```

or

```
https://Toseef-Ahmad.github.io/Tafil/
```

(Both work - GitHub is case-insensitive)

---

## 🎉 What You Should See

✅ **Your beautiful React landing page** with:
- Green gradient background
- "Tired of juggling dozens of Node.js projects?" headline
- "Get Organized Now" button
- Modern, animated UI

❌ **NOT the Electron app UI** (sidebar, project cards, etc.)

---

## 🔄 How to Update the Landing Page Later

Whenever you make changes to the landing page:

```bash
cd "/Users/sodaclick/Desktop/projects/Own Projects/node-project-manager/electron-node-manager/landing"
npm run deploy
```

That's it! Changes will be live in 1-3 minutes.

---

## 📂 What's Happening Behind the Scenes

### Your Repo Structure:

```
Tafil (GitHub repo)
├── main branch
│   ├── main.js, renderer.js, index.html     ← Electron app
│   ├── landing/
│   │   ├── src/App.jsx                      ← React landing page source
│   │   ├── package.json
│   │   └── vite.config.js
│   └── ... (other Electron files)
│
└── gh-pages branch (auto-created by npm run deploy)
    ├── index.html                            ← Built React app
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── ... (static files only)
```

### What Gets Deployed:

- **GitHub Pages** serves files from the **`gh-pages` branch**
- Only the **built React app** (`landing/dist/`) is pushed there
- Your **Electron code** stays on the **`main` branch**
- They are **completely separated**

---

## 🐛 Troubleshooting

### Issue: Still seeing Electron UI

**Solution:**
1. Check GitHub Pages settings (Step 6)
2. Make sure it's set to `gh-pages` branch, not `main`
3. Wait 2-3 minutes after changing settings
4. Clear browser cache or try incognito mode

### Issue: 404 Error

**Solution:**
1. Verify the `gh-pages` branch exists: `https://github.com/Toseef-Ahmad/Tafil/tree/gh-pages`
2. Re-run `npm run deploy` in the `landing/` folder
3. Check GitHub Pages is enabled in repo settings

### Issue: npm install fails

**Solution:**
```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
cd landing
npm install
```

### Issue: Blank white page

**Solution:**
1. Check browser console for errors (F12)
2. Verify `base: '/Tafil/'` in `vite.config.js`
3. Re-run `npm run build && npm run deploy`

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] `npm run deploy` completed successfully
- [ ] GitHub Pages settings point to `gh-pages` branch
- [ ] `https://toseef-ahmad.github.io/Tafil/` shows React landing page
- [ ] No Electron UI visible (no sidebar, no project cards)
- [ ] "Get Organized Now" button is visible
- [ ] Green gradient background is visible

---

## 📝 Summary of Commands

```bash
# 1. Fix npm (once)
sudo chown -R $(id -u):$(id -g) ~/.npm

# 2. Navigate to landing
cd "/Users/sodaclick/Desktop/projects/Own Projects/node-project-manager/electron-node-manager/landing"

# 3. Install & deploy
npm install
npm run deploy
```

Then configure GitHub Pages settings in your browser (Step 6).

---

## 🎯 Next Steps

1. Run the commands above
2. Configure GitHub Pages
3. Wait 2-3 minutes
4. Visit `https://toseef-ahmad.github.io/Tafil/`
5. Share your beautiful landing page! 🎉

---

**Need help?** Check the troubleshooting section or re-run `npm run deploy`.


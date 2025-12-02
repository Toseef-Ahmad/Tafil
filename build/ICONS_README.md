# App Icon Setup for Tafil

## ✅ Icons Configured

All icons are properly set up in the `build/` directory:

```
build/
├── icon.icns        # macOS app icon (152 KB) ✅
├── icon.ico         # Windows app icon (30 KB) ✅
├── icon.png         # Linux/Universal icon (73 KB, 512x512) ✅
└── icons/
    └── 256x256.png  # Linux additional sizes
```

## 🎯 Where Icons Are Used

### 1. **Window Icon** (All Platforms)
- **Location**: Window title bar and taskbar
- **Set in**: `main.js` → `createWindow()` → `icon: iconPath`
- **Development**: Shows in window
- **Production**: Shows in dock/taskbar

### 2. **macOS Dock Icon**
- **Location**: macOS Dock
- **Set in**: `main.js` → `app.whenReady()` → `app.dock.setIcon()`
- **File**: `build/icon.png` (512x512 PNG)
- **Note**: In dev mode, might show default Electron icon until first build

### 3. **System Tray Icon**
- **Location**: Menu bar (top-right)
- **Set in**: `main.js` → `createTray()`
- **File**: `assets/icons8-drawboard-doodle/icons8-drawboard-16.png`

### 4. **Built App Icon**
- **Location**: After `npm run build:mac/win/linux`
- **Set in**: `package.json` → `build.mac.icon`, `build.win.icon`, `build.linux.icon`
- **These icons are embedded in the final .dmg/.exe/.AppImage**

## 📝 Icon Behavior

| Mode | Dock/Taskbar Icon | Window Icon | Tray Icon |
|------|-------------------|-------------|-----------|
| **Dev Mode (`npm run dev`)** | May show Electron default | Shows custom icon | Shows custom icon |
| **Production Build** | Shows custom icon | Shows custom icon | Shows custom icon |

## 🔧 If Icons Don't Show in Development

This is **normal** for Electron apps in development mode:

**macOS:**
- The dock icon might show the default Electron icon in dev mode
- **After building** (`npm run build:mac`), the .dmg will have the correct icon
- The tray icon should always show

**Windows:**
- The taskbar icon should show in dev mode
- **After building** (`npm run build:win`), the .exe will have the correct icon

**Linux:**
- Icons depend on window manager
- **After building** (`npm run build:linux`), the AppImage/deb/rpm will have icons

## ✅ Verification

Run the app and check:
```bash
npm run dev
```

You should see:
- ✅ Tray icon in menu bar (top-right)
- ✅ Window title bar icon (may be small/default in dev)
- ✅ After `npm run build:mac`, the .app will have full icon

**The icons are properly configured!** If you don't see them in dev mode, that's normal - they will appear in the production build.


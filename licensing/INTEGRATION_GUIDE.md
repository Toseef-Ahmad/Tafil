# TAFIL License System Integration Guide

## Overview

This guide shows how to integrate the license system into TAFIL without breaking existing functionality.

## Step 1: Update main.js

Add these imports at the top of `main.js`:

```javascript
const licenseManager = require('./licensing/license-manager');
const { registerLicenseHandlers } = require('./licensing/license-ipc');
```

In your `app.whenReady()` function, add license initialization:

```javascript
app.whenReady().then(async () => {
  // Register license IPC handlers
  registerLicenseHandlers();
  
  // Initialize license manager
  const licenseStatus = await licenseManager.initialize();
  
  if (!licenseStatus.valid) {
    // Show license window
    createLicenseWindow();
  } else {
    // Show main window
    createWindow();
  }
});
```

Add function to create license window:

```javascript
let licenseWindow = null;

function createLicenseWindow() {
  licenseWindow = new BrowserWindow({
    width: 600,
    height: 700,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  licenseWindow.loadFile('licensing/license-ui.html');
  
  // When license is activated, close license window and open main window
  licenseWindow.on('closed', () => {
    licenseWindow = null;
    // Re-check license
    if (licenseManager.hasValidLicense()) {
      createWindow();
    } else {
      app.quit();
    }
  });
}
```

## Step 2: Update preload.js

Add license API to your existing contextBridge:

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('license', {
  getStatus: () => ipcRenderer.invoke('license:getStatus'),
  activate: (licenseKey) => ipcRenderer.invoke('license:activate', licenseKey),
  sync: () => ipcRenderer.invoke('license:sync'),
  deactivate: () => ipcRenderer.invoke('license:deactivate'),
  isValid: () => ipcRenderer.invoke('license:isValid'),
  getFingerprint: () => ipcRenderer.invoke('license:getFingerprint')
});

// Your existing APIs...
```

## Step 3: Add License Menu Item

Add a menu item to check license status:

```javascript
// In your menu template
{
  label: 'License',
  submenu: [
    {
      label: 'View License',
      click: async () => {
        const isValid = await licenseManager.hasValidLicense();
        if (isValid) {
          // Show license info dialog or window
          createLicenseWindow();
        } else {
          createLicenseWindow();
        }
      }
    },
    {
      label: 'Sync License',
      click: async () => {
        try {
          await licenseManager.syncWithServer();
          dialog.showMessageBox({
            type: 'info',
            title: 'License Synced',
            message: 'License synced successfully with server'
          });
        } catch (error) {
          dialog.showMessageBox({
            type: 'error',
            title: 'Sync Failed',
            message: 'Failed to sync license: ' + error.message
          });
        }
      }
    }
  ]
}
```

## Step 4: Update Public Key

After generating RSA keys on the server:

1. Run `node scripts/generate-keys.js` on the server
2. Copy the contents of `keys/public.pem`
3. Replace the `PUBLIC_KEY` constant in `licensing/license-manager.js`

## Step 5: Environment Configuration

Create `.env` file in the TAFIL root (optional):

```
LICENSE_SERVER_URL=https://license.tafil.app
```

For development:
```
LICENSE_SERVER_URL=http://localhost:3000
```

## Step 6: Package.json Updates

Add to `package.json` files section in electron-builder config:

```json
"files": [
  "licensing/**/*",
  // ... existing files
]
```

## Optional: Grace Period Handling

Add periodic license check (e.g., every 24 hours):

```javascript
// In main.js
setInterval(async () => {
  const status = await licenseManager.initialize();
  if (!status.valid) {
    // Show warning dialog
    dialog.showMessageBox({
      type: 'warning',
      title: 'License Issue',
      message: 'There is an issue with your license. Please check your license status.',
      buttons: ['Check License', 'Continue']
    }).then(result => {
      if (result.response === 0) {
        createLicenseWindow();
      }
    });
  }
}, 24 * 60 * 60 * 1000); // 24 hours
```

## Testing

### Development Testing

1. Start license server: `cd tafil-node.js-license-server && npm run dev`
2. Create test license via admin API
3. Start TAFIL: `npm start`
4. Enter license key
5. Verify activation works

### Testing Scenarios

- ✅ Fresh install (no license)
- ✅ Valid license (offline mode)
- ✅ License sync
- ✅ Device deactivation
- ✅ License expiry
- ✅ Invalid license key
- ✅ Network offline (grace period)

## Production Checklist

- [ ] Replace PUBLIC_KEY with actual production key
- [ ] Set LICENSE_SERVER_URL to production URL
- [ ] Test offline functionality
- [ ] Test license window UI on all platforms
- [ ] Verify license data is encrypted locally
- [ ] Test app startup with valid/invalid licenses
- [ ] Document license activation process for users

## User Flow

1. User purchases TAFIL on Gumroad
2. Receives license key via email
3. Downloads and installs TAFIL
4. On first launch, sees license activation screen
5. Enters license key
6. App activates and creates signed license blob locally
7. App runs normally, checking license on startup
8. Syncs with server every 14 days (configurable)
9. Works offline for 30+ days grace period

## Support Scenarios

### User Reinstalled OS
- Launch TAFIL
- Enter same license key
- If under device limit, reactivates
- If over limit, shows "limit reached" error
- User must deactivate old device via dashboard or contact support

### User Wants to Move License
1. Open TAFIL on old device
2. Go to License menu → Deactivate
3. Install on new device
4. Activate with same key

### License Expired
- App shows expiry warning
- User must purchase renewal
- New license key issued

## Troubleshooting

### "Device limit reached"
- User has activated max devices
- Must deactivate old device first
- Or upgrade license via Gumroad

### "Invalid signature"
- License file corrupted
- Delete and re-activate

### "Network error"
- Activation requires internet
- Verification works offline (within grace period)

## Security Notes

- Private key NEVER included in app
- Public key embedded (safe to distribute)
- License blob signed, can't be forged
- Device fingerprint prevents sharing
- Encrypted local storage (basic obfuscation)
- Grace period allows offline work

## Future Enhancements

- [ ] Automatic license key detection from clipboard
- [ ] In-app license purchase (Gumroad overlay)
- [ ] License transfer wizard
- [ ] Family/team licenses
- [ ] Trial period support
- [ ] License usage analytics


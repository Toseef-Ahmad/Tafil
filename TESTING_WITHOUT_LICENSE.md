# Testing Without License

This guide explains how to test the app without a license attached.

## Quick Method

### Option 1: Using npm script (Recommended)
```bash
npm run remove-license
```

### Option 2: Using Node.js directly
```bash
node remove-license.js
```

### Option 3: Using shell script
```bash
./remove-license.sh
```

## What It Does

The script removes license files from these locations:

1. **`~/.tafil/license.json`** - License file used by `licenseLoader.js`
2. **`[userData]/.tafil-license`** - Encrypted license file used by `license-manager.js`
   - macOS: `~/Library/Application Support/electron-node-manager/.tafil-license`
   - Linux: `~/.config/electron-node-manager/.tafil-license`
   - Windows: `~/AppData/Roaming/electron-node-manager/.tafil-license`

## After Removing License

1. **Restart the app** - The app needs to be restarted for changes to take effect
2. **Test unlicensed features** - The app should now show the license activation screen
3. **Verify behavior** - Check that free vs pro features are properly restricted

## Restoring License

To restore your license, simply activate it again through the app's license activation flow.

## Manual Removal

If you prefer to manually remove license files:

**macOS:**
```bash
rm ~/.tafil/license.json
rm ~/Library/Application\ Support/electron-node-manager/.tafil-license
```

**Linux:**
```bash
rm ~/.tafil/license.json
rm ~/.config/electron-node-manager/.tafil-license
```

**Windows:**
```bash
del %USERPROFILE%\.tafil\license.json
del %USERPROFILE%\AppData\Roaming\electron-node-manager\.tafil-license
```

## Notes

- The script is safe to run multiple times
- It will only remove files that exist
- Your license key is not deleted from the server, you can reactivate anytime
- Make sure the app is closed before running the script


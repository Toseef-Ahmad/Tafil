# macOS Installation

## Download

Download the appropriate version for your Mac:

| Chip | File |
|------|------|
| Apple Silicon (M1/M2/M3/M4) | `Tafil-x.x.x-mac-arm64.dmg` |
| Intel | `Tafil-x.x.x-mac-x64.dmg` |

[Download from GitHub Releases →](https://github.com/Toseef-Ahmad/Tafil/releases)

## Installation Steps

1. Download the `.dmg` file for your Mac
2. Open the `.dmg` file
3. Drag **Tafil** to the Applications folder
4. Eject the disk image

## First Launch

Since Tafil is not signed with an Apple Developer certificate, macOS will show a security warning.

**To open the app:**

1. Right-click (or Control-click) on Tafil in Applications
2. Click **Open** from the context menu
3. Click **Open** again in the dialog

You only need to do this once.

**Alternative method (Terminal):**

```bash
xattr -cr /Applications/Tafil.app
```

This removes the quarantine attribute and allows the app to open normally.

## Uninstall

To uninstall Tafil:

1. Quit Tafil if running
2. Drag Tafil from Applications to Trash
3. (Optional) Remove preferences:
   ```bash
   rm -rf ~/Library/Application\ Support/Tafil
   rm -rf ~/Library/Preferences/com.tafil.app.plist
   ```


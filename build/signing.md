# Code Signing Guide for Tafil

## macOS Code Signing

### Prerequisites
1. Apple Developer Account ($99/year)
2. Developer ID Application certificate

### Environment Variables
Set these before building:

```bash
# Your Apple Developer certificate name
export CSC_NAME="Developer ID Application: Your Name (TEAM_ID)"

# Or use certificate file
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password

# For notarization (required for macOS 10.15+)
export APPLE_ID=your@email.com
export APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
export APPLE_TEAM_ID=YOUR_TEAM_ID
```

### Building Signed App
```bash
# Build signed macOS app
npm run build:mac

# Build universal (Intel + Apple Silicon)
npm run build:mac-universal
```

---

## Windows Code Signing

### Prerequisites
1. Code signing certificate from trusted CA (DigiCert, Comodo, etc.)
2. Or Windows SDK for self-signing (development only)

### Environment Variables
```bash
# Certificate file path
export WIN_CSC_LINK=/path/to/certificate.pfx
export WIN_CSC_KEY_PASSWORD=your_password

# Or use certificate from Windows Certificate Store
# The certificate must be in "Personal" store
```

### Building Signed App
```bash
npm run build:win
```

### Self-Signing for Development
```powershell
# Create self-signed certificate (PowerShell as Admin)
New-SelfSignedCertificate -Type CodeSigning -Subject "CN=Tafil Dev" -KeyUsage DigitalSignature -FriendlyName "Tafil Development" -CertStoreLocation Cert:\CurrentUser\My -NotAfter (Get-Date).AddYears(5)
```

---

## Linux Code Signing

Linux doesn't require traditional code signing, but you can use GPG signing for packages.

### Building
```bash
npm run build:linux
```

---

## Build Commands Reference

| Command | Description |
|---------|-------------|
| `npm run build` | Build for current platform |
| `npm run build:mac` | Build for macOS (DMG + ZIP) |
| `npm run build:mac-universal` | Build universal macOS binary |
| `npm run build:win` | Build for Windows (NSIS + Portable) |
| `npm run build:linux` | Build for Linux (AppImage, DEB, RPM) |
| `npm run build:all` | Build for all platforms |

---

## Troubleshooting

### macOS: "App is damaged" error
- Ensure you have signed and notarized the app
- Or allow unsigned apps: `xattr -cr /Applications/Tafil.app`

### Windows: SmartScreen warning
- Without an EV certificate, users will see SmartScreen warning
- The warning goes away after gaining reputation (many downloads)

### Linux: Permission issues
- Make AppImage executable: `chmod +x Tafil-*.AppImage`


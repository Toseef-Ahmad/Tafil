# Build from Source

Build Tafil yourself from the source code.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

## Clone Repository

```bash
git clone https://github.com/Toseef-Ahmad/Tafil.git
cd Tafil
```

## Install Dependencies

```bash
npm install
```

## Development Mode

Run with hot-reload for development:

```bash
npm run dev
```

## Build for Production

### macOS

```bash
npm run build:mac
```

Outputs: `.dmg` and `.zip` in `release/` folder.

### Windows

```bash
npm run build:win
```

Outputs: `.exe` installer and portable in `release/` folder.

### Linux

```bash
npm run build:linux
```

Outputs: `.AppImage`, `.deb`, `.rpm` in `release/` folder.

### All Platforms

```bash
npm run build:all
```

## Code Signing (Optional)

For distribution, you may want to sign your builds:

| Platform | Requirement | Cost |
|----------|-------------|------|
| macOS | Apple Developer account | $99/year |
| Windows | EV Code Signing Certificate | $300-500/year |
| Linux | Not required | Free |

## Project Structure

```
Tafil/
├── main.js          # Electron main process
├── preload.js       # Preload script
├── renderer.js      # Renderer process
├── index.html       # Main window
├── styles.css       # Tailwind styles
├── utils/           # Utility modules
├── build/           # Build resources
└── release/         # Build output
```


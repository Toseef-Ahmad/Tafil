# Development Setup

Set up your local environment to contribute to Tafil.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

## Clone Repository

```bash
# Fork first on GitHub, then:
git clone https://github.com/YOUR_USERNAME/Tafil.git
cd Tafil
```

## Install Dependencies

```bash
npm install
```

## Run Development Mode

```bash
npm run dev
```

This starts:
- Electron app with hot reload
- Tailwind CSS watcher

## Project Structure

```
Tafil/
├── main.js           # Electron main process
├── preload.js        # Preload script (IPC bridge)
├── renderer.js       # Renderer process (UI logic)
├── index.html        # Main window HTML
├── styles.css        # Source styles
├── output.css        # Generated Tailwind CSS
├── utils/            # Utility modules
│   ├── externalProcessDetector.js
│   └── projectActions.js
├── build/            # Build resources
│   ├── entitlements.mac.plist
│   └── icon.png
├── docs/             # Documentation (VitePress)
└── landing/          # Landing page (Vite + React)
```

## Key Files

| File | Purpose |
|------|---------|
| `main.js` | Electron main process, IPC handlers |
| `preload.js` | Secure bridge between main and renderer |
| `renderer.js` | UI logic, DOM manipulation |
| `index.html` | Main window structure |

## Testing Changes

1. Make your changes
2. The app reloads automatically
3. Test the feature manually
4. Test on other platforms if possible

## Building

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

## Submitting Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature
   ```

4. Open a Pull Request on GitHub


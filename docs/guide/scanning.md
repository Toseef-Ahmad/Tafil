# Scanning Projects

Tafil automatically detects Node.js projects by looking for `package.json` files.

## Scan Methods

### Scan Home

Scans your entire home directory. Good for initial setup.

**Note:** This may take a while if you have many files. Consider using Scan Folder for better performance.

### Scan Folder

Scans a specific directory. Recommended for:
- Faster scanning
- Focused results
- Multiple project locations

## What Gets Detected

Tafil detects any folder containing a `package.json` file and identifies:

### Framework Detection

| Framework | Detection |
|-----------|-----------|
| React | `react` in dependencies |
| Vue | `vue` in dependencies |
| Next.js | `next` in dependencies |
| Nuxt | `nuxt` in dependencies |
| Vite | `vite` in dependencies |
| Angular | `@angular/core` in dependencies |
| Express | `express` in dependencies |
| NestJS | `@nestjs/core` in dependencies |
| Gatsby | `gatsby` in dependencies |
| Remix | `@remix-run` in dependencies |

### Project Information

- **Name** from `package.json`
- **Path** - Location on disk
- **Dependencies** - Installed status
- **Git** - Branch and last commit
- **Scripts** - Available npm scripts

## Excluded Directories

Tafil automatically skips:

- `node_modules`
- `.git`
- `dist`
- `build`
- `coverage`
- `.next`
- `.nuxt`

## Refresh Projects

Click **Refresh** or press `⌘R` / `Ctrl+R` to rescan without changing directories.


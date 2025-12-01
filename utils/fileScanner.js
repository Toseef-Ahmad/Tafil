// utils/fileScanner.js
const fs = require('fs');
const path = require('path');
const os = require('os');

/** Check if project is React, Next, or Express-based */
function isReactOrNextOrNodeProject(pkg) {
  const { dependencies = {}, devDependencies = {} } = pkg;

  // React
  const hasReact =
    dependencies['react'] ||
    devDependencies['react'] ||
    dependencies['react-scripts'] ||
    devDependencies['react-scripts'];

  // Next.js
  const hasNext =
    dependencies['next'] ||
    devDependencies['next'];

  // Express
  const hasExpress =
    dependencies['express'] ||
    devDependencies['express'];

  return Boolean(hasReact || hasNext || hasExpress);
}


/**
 * Recursively scan for React/Next/Express projects up to maxDepth.
 * Skips "node_modules" and hidden folders (leading ".").
 */
async function scanFolder(baseDir, results, depth, maxDepth) {
  if (depth > maxDepth) return;

  let entries;
  try {
    entries = fs.readdirSync(baseDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    // Skip node_modules and dot-folders
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    const subPath = path.join(baseDir, entry.name);
    const pkgPath = path.join(subPath, 'package.json');

    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (isReactOrNextOrNodeProject(pkg)) {
          results.push({
            name: pkg.name || entry.name,
            path: subPath
          });
        }
      } catch {
        // ignore invalid JSON
      }
    }

    // Recurse deeper
    await scanFolder(subPath, results, depth + 1, maxDepth);
  }
}

/**
 * Main function: scans for React/Next/Express projects in `folder`.
 * Default folder = user home. Depth limit = 8 (customizable).
 */
async function scanForRNProjects(folder = os.homedir(), maxDepth = 8) {
  const results = [];
  await scanFolder(folder, results, 0, maxDepth);
  return results;
}

module.exports = {
  scanForRNProjects
};
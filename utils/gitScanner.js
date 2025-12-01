// utils/gitScanner.js

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * Determine if a directory is a Node.js project by checking if package.json exists
 * and has either dependencies or devDependencies.
 */
function isNodeProject(dirPath) {
  const pkgPath = path.join(dirPath, 'package.json');
  if (!fs.existsSync(pkgPath)) return false;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return (
      (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) ||
      (pkg.devDependencies && Object.keys(pkg.devDependencies).length > 0)
    );
  } catch (err) {
    console.error(`Failed to read or parse package.json in ${dirPath}: ${err.message}`);
    return false;
  }
}

/**
 * Retrieve the most recent commit from a Git repo.
 * Returns an object { timestamp, message }.
 * If no commits exist, timestamp=0, message='No commits yet'.
 */
function getRecentCommit(repoPath) {
  return new Promise((resolve, reject) => {
    exec(`git log --pretty=format:'%at %s' -1`, { cwd: repoPath }, (err, stdout) => {
      if (err) {
        // Some repos might not have commits yet
        if (err.message.includes('does not have any commits yet')) {
          return resolve({ timestamp: 0, message: 'No commits yet' });
        }
        return reject(err);
      }
      const [timestampString, ...rest] = stdout.trim().split(' ');
      const message = rest.join(' ');
      const timestamp = parseInt(timestampString, 10) || 0;
      resolve({ timestamp, message });
    });
  });
}

/**
 * Recursively scan for Node.js projects up to maxDepth.
 * Skips node_modules, .git subfolders, Library, AppData, hidden folders, etc.
 * Returns an array of project objects:
 *   { name, path, timestamp, message }
 */
async function scanNodeProjects(baseDir, maxDepth = 5, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];

  let entries = [];
  try {
    // Attempt to read dir; might fail on permissions
    entries = fs.readdirSync(baseDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'EPERM' || err.code === 'EACCES') {
      console.warn(`Permission denied for ${baseDir}. Skipping...`);
    } else {
      console.error(`Error reading directory ${baseDir}: ${err.message}`);
    }
    return [];
  }

  const results = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue; // Only look at directories
    const entryName = entry.name;
    const entryPath = path.join(baseDir, entryName);

    // Skip known problematic folders or hidden dirs
    // Adjust the pattern as needed for your platform
    if (
      entryName.startsWith('.') ||                 // hidden dir (includes .git)
      entryName === 'node_modules' ||
      entryName === 'Library' ||
      entryName === 'AppData'
    ) {
      continue;
    }

    // If this folder has a package.json with dependencies, treat as Node project
    if (isNodeProject(entryPath)) {
      // Check if it's a Git repo
      const gitFolder = path.join(entryPath, '.git');
      if (fs.existsSync(gitFolder)) {
        try {
          const recentCommit = await getRecentCommit(entryPath);
          results.push({
            name: path.basename(entryPath),
            path: entryPath,
            timestamp: recentCommit.timestamp,
            message: recentCommit.message,
          });
        } catch (err) {
          console.error(`Failed to retrieve commit info for ${entryPath}: ${err.message}`);
          results.push({
            name: path.basename(entryPath),
            path: entryPath,
            timestamp: 0,
            message: 'Git Error',
          });
        }
      } else {
        // Node.js project but no Git
        results.push({
          name: path.basename(entryPath),
          path: entryPath,
          timestamp: 0,
          message: 'No Git history',
        });
      }
    } else {
      // Recurse deeper
      const subResults = await scanNodeProjects(entryPath, maxDepth, currentDepth + 1);
      results.push(...subResults);
    }
  }

  return results;
}

/**
 * Convenience function that scans a given path (defaulting to the user's HOME),
 * sorts by timestamp descending, and returns only the top 5 recent projects.
 */
async function scanRecentNodeProjects(basePath) {
  try {
    const rootDir = basePath || process.env.HOME || process.env.USERPROFILE;
    const projects = await scanNodeProjects(rootDir);
    projects.sort((a, b) => b.timestamp - a.timestamp);
    return projects.slice(0, 5);
  } catch (err) {
    console.error(`Error scanning for Node.js projects: ${err.message}`);
    return [];
  }
}

// Export whichever functions you need
module.exports = {
  scanNodeProjects,
  scanRecentNodeProjects,
};
// utils/autoRunner.js (CommonJS)

// CommonJS-friendly modules can still be require()'d:
const portfinder = require('portfinder');
const fs = require('fs');
const path = require('path');

/**
 * Dynamically load "execa" (ESM-only) within CommonJS.
 */
async function loadExeca() {
  // execa exports a named export `{ execa }`
  const execaModule = await import('execa'); 
  // execaModule = { execa: [Function], ... }
  return execaModule.execa;
}

/**
 * Dynamically load "wait-port" (ESM-only) within CommonJS.
 */
async function loadWaitPort() {
  // wait-port provides a default export
  const waitPortModule = await import('wait-port');
  // waitPortModule = { default: [Function], ... }
  return waitPortModule.default;
}

/**
 * Dynamically load "detect-package-manager" (ESM-only) within CommonJS.
 */
async function detectPM(cwd) {
  const { default: detect } = await import('detect-package-manager');
  return detect({ cwd });
}

/**
 * Attempt to auto-run a dev server: 
 *  1) Determine if there's a "dev" or "start" script
 *  2) Detect the correct package manager (npm, yarn, pnpm)
 *  3) Find a free port
 *  4) Spawn the process with execa
 *  5) Wait for that port to open with wait-port
 *  6) Return the child process when ready
 */
async function autoRunner(projectPath) {
  // 1) Read package.json
  const pkgPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`No package.json found in ${projectPath}`);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const scripts = pkg.scripts || {};

  // Choose a script: prefer "dev", else "start"
  let scriptToRun;
  if (scripts.dev) {
    scriptToRun = 'dev';
  } else if (scripts.start) {
    scriptToRun = 'start';
  } else {
    throw new Error('No "dev" or "start" script found in package.json');
  }

  // 2) Detect the package manager (npm, yarn, or pnpm)
  const pm = await detectPM(projectPath);

  // 3) Find a free port via portfinder
  const port = await portfinder.getPortPromise({ startPort: 3000 });

  // 4) Prepare command & env
  //    If npm/pnpm => "npm run dev", "pnpm run dev"
  //    If yarn     => "yarn dev"
  let pmCmd = pm; // 'npm' | 'yarn' | 'pnpm'
  let spawnArgs = [];
  if (pm === 'npm' || pm === 'pnpm') {
    spawnArgs = ['run', scriptToRun];
  } else if (pm === 'yarn') {
    spawnArgs = [scriptToRun];
  }

  // Build environment with our chosen PORT
  const env = { ...process.env, PORT: String(port) };

  // 5) Dynamically import execa & wait-port so they won't break in CJS
  const execa = await loadExeca();
  const waitPort = await loadWaitPort();

  console.log(`Running "${pmCmd} ${spawnArgs.join(' ')}" on port ${port}`);

  // Spawn the dev server
  const subprocess = execa(pmCmd, spawnArgs, {
    cwd: projectPath,
    env,
    all: true, // combine stdout/stderr in subprocess.all
  });

  // Optional: log all output to console
  subprocess.all?.pipe(process.stdout);

  // 6) Wait until the server actually listens on the port (max 30s)
  const opened = await waitPort({
    host: '127.0.0.1',
    port,
    timeout: 30_000, // ms
    output: 'silent',
  });

  if (!opened) {
    // If the port never opened, kill & throw
    subprocess.kill('SIGINT');
    throw new Error(`Server never opened port ${port} after 30s`);
  }

  console.log(`Dev server is up at http://localhost:${port}`);
  return { child: subprocess, port };
}

module.exports = {
  autoRunner
};
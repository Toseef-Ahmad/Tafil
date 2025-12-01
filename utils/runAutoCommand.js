// utils/runAutoCommand.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const net = require('net');
const portfinder = require('portfinder');

/**
 * Auto-detect the best dev/start command for the given project, 
 * then spawn the process and wait until the port is actually open.
 * 
 * Returns a Promise that resolves to: { child, port, command }
 * or rejects on failure.
 */
async function autoDetectAndRunCommand(projectPath) {
  // 1) Read package.json
  const pkgPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`No package.json found in ${projectPath}`);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const { dependencies = {}, devDependencies = {}, scripts = {} } = pkg;

  // 2) Determine if the project uses a known framework
  const hasVite = !!(dependencies.vite || devDependencies.vite);
  const hasNext = !!(dependencies.next || devDependencies.next);
  const hasCRA = !!(dependencies['react-scripts'] || devDependencies['react-scripts']);
  // Add more as needed (Nuxt, Angular, etc.)

  // 3) Figure out the best script name (or raw command) to run
  //  - For a typical Vite project: "npm run dev"
  //  - For Next: "npm run dev" or "next start"
  //  - For CRA: "npm start"
  //  - Or fallback to scripts we see in package.json: 'dev', 'start', 'serve', 'build', etc.
  
  // We'll keep a list of candidate script names in priority order.
  const scriptCandidates = [];

  // If we found Vite
  if (hasVite) {
    // If there's a "dev" script (common for Vite), prefer that:
    if (scripts.dev) scriptCandidates.push('dev');
    // If there's a "serve" or "preview" script, we might push them too
    if (scripts.serve) scriptCandidates.push('serve');
    if (scripts.preview) scriptCandidates.push('preview');
  }

  // If we found Next
  if (hasNext) {
    // Typically "dev" is the main Next command in dev mode
    if (scripts.dev) scriptCandidates.push('dev');
    // If there's a "start" script, that might do production mode
    if (scripts.start) scriptCandidates.push('start');
  }

  // If we found CRA
  if (hasCRA) {
    // Usually "start"
    if (scripts.start) scriptCandidates.push('start');
  }

  // If we haven't pushed anything yet, let's just push the commonly used ones
  if (!scriptCandidates.length) {
    // if user has them in scripts, we push them
    if (scripts.dev) scriptCandidates.push('dev');
    if (scripts.start) scriptCandidates.push('start');
    if (scripts.serve) scriptCandidates.push('serve');
    if (scripts.preview) scriptCandidates.push('preview');
  }

  // If STILL no candidates, it means there's no recognized scripts
  if (!scriptCandidates.length) {
    throw new Error(`No recognized start/dev scripts found in package.json`);
  }

  // 4) Find a free port for the dev server
  const port = await portfinder.getPortPromise({ startPort: 8000 }); // or 3000

  // 5) Try each candidate script in the order we built above
  //    We'll build a final command like: "npx cross-env PORT=xxxx npm run dev".
  for (const script of scriptCandidates) {
    // Some frameworks might ignore PORT; but let's try anyway
    const fullCmd = `npx cross-env PORT=${port} npm run ${script}`;

    try {
      const result = await attemptCommand(projectPath, fullCmd, port);
      return result; // success, e.g. { child, port, command: fullCmd }
    } catch (err) {
      console.error(`[autoDetectAndRunCommand] Command "${fullCmd}" failed: ${err.message}`);
    }
  }

  // 6) If none of them worked, throw an error
  throw new Error(`All candidate scripts failed for ${projectPath}.`);
}

/**
 * Spawns the command in the given cwd, checks for the port to open.
 */
function attemptCommand(projectPath, command, port) {
  return new Promise((resolve, reject) => {
    console.log(`[autoDetectAndRunCommand] Spawning: ${command}`);
    const childProcess = exec(command, { cwd: projectPath, shell: true });

    let closed = false;
    let errMsg = '';

    childProcess.stderr.on('data', (data) => {
      errMsg += data.toString();
    });

    childProcess.once('close', (code) => {
      closed = true;
      if (code !== 0) {
        return reject(new Error(`Process exited (code ${code}):\n${errMsg}`));
      }
      // If code == 0 quickly, it might be a build script or ephemeral. Not a dev server.
      return reject(new Error(`Process ended immediately with code 0. Probably not a dev server.\n${errMsg}`));
    });

    childProcess.once('error', (err) => {
      errMsg += `\nSpawn error: ${err.message}`;
      childProcess.kill('SIGINT');
      return reject(new Error(errMsg));
    });

    // Check if the port is open
    const maxWaitSeconds = 30;
    let elapsedSeconds = 0;

    const intervalId = setInterval(() => {
      elapsedSeconds++;
      if (closed) {
        // Process ended early, so just clear and exit
        clearInterval(intervalId);
      } else {
        isPortOpen(port, (open) => {
          if (open) {
            clearInterval(intervalId);
            console.log(`[autoDetectAndRunCommand] SUCCESS: "${command}" listening on port ${port}`);
            return resolve({ child: childProcess, port, command });
          }
          if (elapsedSeconds >= maxWaitSeconds) {
            clearInterval(intervalId);
            childProcess.kill('SIGINT');
            return reject(new Error(`Timed out after ${maxWaitSeconds}s - port ${port} not open.\n${errMsg}`));
          }
        });
      }
    }, 1000);
  });
}

/**
 * Test if the given port is open on localhost.
 */
function isPortOpen(port, callback) {
  const socket = new net.Socket();
  let connected = false;

  socket.setTimeout(1500);
  socket.once('connect', () => {
    connected = true;
    socket.end();
  });
  socket.once('timeout', () => socket.destroy());
  socket.once('error', () => {});
  socket.once('close', () => callback(connected));

  socket.connect(port, '127.0.0.1');
}

module.exports = {
  autoDetectAndRunCommand
};
// utils/projectActions.js
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { findFreePort } = require("./portFinder");

/** Attempt multiple scripts for React/Next/Express */
async function tryMultipleScripts(projectPath) {
  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("No package.json found in project.");
  }

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const scripts = pkg.scripts || {};

  // Priority: Choose the appropriate script
  const possibleScripts = ["dev", "start", "serve", "build"];
  let foundScript = null;
  for (const s of possibleScripts) {
    if (scripts[s]) {
      foundScript = s;
      break;
    }
  }

  if (!foundScript) {
    throw new Error("No recognized script (dev, start, serve, build) found.");
  }

  // Find a free port dynamically
  const freePort = await findFreePort(3000, 3100);
  if (!freePort) {
    throw new Error("No free port found between 3000 and 3100.");
  }

  console.log(`Running script "${foundScript}" on port ${freePort}.`);
  return runNpmScript(projectPath, foundScript, freePort);
}

/** Runs `npm run <script>` with environment variables (PORT) */
function runNpmScript(projectPath, scriptName, port) {
  return new Promise((resolve, reject) => {
    const cmd = /^win/.test(process.platform) ? "npm.cmd" : "npm";
    const env = {
      ...process.env,
      PORT: port, // Dynamic port assignment
      CI: "true", // Avoid interactive prompts for CRA
    };

    const child = spawn(cmd, ["run", scriptName], {
      cwd: projectPath,
      detached: true,
      shell: true,
      env,
    });

    child.stdout.on("data", (data) => {
      console.log(`[${scriptName} STDOUT] ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`[${scriptName} STDERR] ${data}`);
    });

    child.on("error", (err) => reject(err));

    // Resolve the PID and port when the process starts successfully
    resolve({ pid: child.pid, port, scriptName });
  });
}

/** Install dependencies (`npm install`) */
function installDependencies(projectPath) {
  return new Promise((resolve, reject) => {
    const cmd = /^win/.test(process.platform) ? "npm.cmd" : "npm";
    const child = spawn(cmd, ["install"], {
      cwd: projectPath,
      shell: true,
    });

    child.stdout.on("data", (data) => {
      console.log(`[INSTALL:stdout] ${data}`);
    });
    
    child.stderr.on("data", (data) => {
      console.error(`[INSTALL:stderr] ${data}`);
    });
    
    child.on("error", (error) => {
      console.error("Error installing dependencies:", error);
      reject(error);
    });
    
    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ Dependencies installed for ${projectPath}`);
        resolve({ success: true });
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });
}

/**
 * Remove the node_modules folder from a given project to save disk space.
 */
function removeNodeModules(projectPath) {
  return new Promise((resolve, reject) => {
    const nodeModulesPath = path.join(projectPath, "node_modules");
    
    if (!fs.existsSync(nodeModulesPath)) {
      return resolve({
        success: false,
        message: "No node_modules folder found.",
      });
    }

    // Try to set permissions first (silently fail if not needed)
    exec(`chmod -R 777 "${nodeModulesPath}"`, (chmodErr) => {
      // Proceed with removal regardless of chmod result
      exec(`rm -rf "${nodeModulesPath}"`, (rmErr) => {
        if (rmErr) {
          console.error("Error removing node_modules:", rmErr);
          return reject({
            success: false,
            message: `Error removing node_modules: ${rmErr.message}`,
          });
        }

        console.log(`✅ node_modules removed from ${projectPath}`);
        resolve({ success: true });
      });
    });
  });
}

module.exports = {
  tryMultipleScripts,
  installDependencies,
  removeNodeModules,
};

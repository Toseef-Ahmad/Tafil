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
    const isWindows = /^win/.test(process.platform);
    const cmd = isWindows ? "npm.cmd" : "npm";
    const env = {
      ...process.env,
      PORT: port, // Dynamic port assignment
      CI: "true", // Avoid interactive prompts for CRA
    };

    // Check if this is a UNC path (Windows network/VM shared folder)
    const normalizedPath = path.normalize(projectPath);
    const isUNCPath = isWindows && (
      normalizedPath.startsWith('\\\\') || 
      projectPath.startsWith('\\\\')
    );
    
    if (isWindows && isUNCPath) {
      // UNC paths require exec() with pushd workaround
      console.log(`🔧 Running script on UNC path: ${projectPath}`);
      let winPath = normalizedPath.replace(/\//g, '\\');
      if (winPath.endsWith('\\') && !winPath.endsWith(':\\')) {
        winPath = winPath.slice(0, -1);
      }
      const uncCommand = `pushd "${winPath}" && npm run ${scriptName}`;
      console.log(`🔧 UNC Command: ${uncCommand}`);
      
      // Use exec for UNC paths
      const child = exec(uncCommand, { 
        env, 
        maxBuffer: 10 * 1024 * 1024 
      });
      
      child.stdout?.on("data", (data) => {
        console.log(`[${scriptName} STDOUT] ${data}`);
      });
      child.stderr?.on("data", (data) => {
        console.error(`[${scriptName} STDERR] ${data}`);
      });
      child.on("error", (err) => reject(err));
      
      resolve({ pid: child.pid, port, scriptName });
      return;
    }
    
    // Standard path
    const child = spawn(cmd, ["run", scriptName], { 
      cwd: projectPath, 
      detached: true, 
      shell: true, 
      env 
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
    const isWindows = /^win/.test(process.platform);
    const cmd = isWindows ? "npm.cmd" : "npm";
    
    // Check if this is a UNC path (Windows network/VM shared folder)
    const normalizedPath = path.normalize(projectPath);
    const isUNCPath = isWindows && (
      normalizedPath.startsWith('\\\\') || 
      projectPath.startsWith('\\\\')
    );
    
    if (isWindows && isUNCPath) {
      // UNC paths require exec() with pushd workaround
      console.log(`🔧 Installing dependencies on UNC path: ${projectPath}`);
      let winPath = normalizedPath.replace(/\//g, '\\');
      if (winPath.endsWith('\\') && !winPath.endsWith(':\\')) {
        winPath = winPath.slice(0, -1);
      }
      const uncCommand = `pushd "${winPath}" && npm install`;
      console.log(`🔧 UNC Command: ${uncCommand}`);
      
      // Use exec for UNC paths - more reliable
      exec(uncCommand, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (stdout) console.log(`[INSTALL:stdout] ${stdout}`);
        if (stderr) console.error(`[INSTALL:stderr] ${stderr}`);
        
        if (error) {
          console.error("Error installing dependencies:", error);
          reject(error);
        } else {
          console.log(`✅ Dependencies installed for ${projectPath}`);
          resolve({ success: true });
        }
      });
      return;
    }
    
    // Standard path
    const child = spawn(cmd, ["install"], { cwd: projectPath, shell: true });

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
    const isWindows = /^win/.test(process.platform);
    
    if (!fs.existsSync(nodeModulesPath)) {
      return resolve({
        success: false,
        message: "No node_modules folder found.",
      });
    }

    console.log(`🗑️ Attempting to remove: ${nodeModulesPath}`);

    if (isWindows) {
      // Windows: Use rmdir /s /q which works with UNC paths
      exec(`rmdir /s /q "${nodeModulesPath}"`, { timeout: 120000 }, (rmErr) => {
        // Verify deletion
        if (fs.existsSync(nodeModulesPath)) {
          console.error("❌ node_modules still exists after rmdir");
          return reject({
            success: false,
            message: "Failed to delete node_modules. Try running as Administrator or delete manually.",
          });
        }
        
        if (rmErr) {
          console.warn("rmdir reported error but folder may be gone:", rmErr.message);
        }

        console.log(`✅ node_modules removed from ${projectPath}`);
        resolve({ success: true });
      });
    } else {
      // Unix: Multiple deletion strategies
      const deleteStrategies = [
        // Strategy 1: Direct rm -rf
        () => new Promise((res, rej) => {
          exec(`rm -rf "${nodeModulesPath}"`, { timeout: 120000 }, (err) => {
            if (err) rej(err); else res();
          });
        }),
        // Strategy 2: Fix permissions then delete
        () => new Promise((res, rej) => {
          exec(`chmod -R 777 "${nodeModulesPath}" && rm -rf "${nodeModulesPath}"`, { timeout: 120000 }, (err) => {
            if (err) rej(err); else res();
          });
        }),
        // Strategy 3: Use find to delete files first
        () => new Promise((res, rej) => {
          exec(`find "${nodeModulesPath}" -type f -delete && find "${nodeModulesPath}" -type d -empty -delete && rm -rf "${nodeModulesPath}"`, { timeout: 180000 }, (err) => {
            if (err) rej(err); else res();
          });
        }),
      ];
      
      // Try strategies in order
      (async () => {
        for (let i = 0; i < deleteStrategies.length; i++) {
          try {
            await deleteStrategies[i]();
            
            // Verify deletion
            if (!fs.existsSync(nodeModulesPath)) {
              console.log(`✅ node_modules removed (strategy ${i + 1})`);
              return resolve({ success: true });
            }
          } catch (err) {
            console.warn(`Strategy ${i + 1} failed:`, err.message);
          }
        }
        
        // All strategies failed
        if (fs.existsSync(nodeModulesPath)) {
          console.error("❌ All deletion strategies failed");
          return reject({
            success: false,
            message: `Could not delete node_modules. Please run manually:\nsudo rm -rf "${nodeModulesPath}"`,
          });
        }
        
        resolve({ success: true });
      })();
    }
  });
}

module.exports = {
  tryMultipleScripts,
  installDependencies,
  removeNodeModules,
};

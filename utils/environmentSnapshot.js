// utils/environmentSnapshot.js
// Environment Snapshot + Restore (Pro Feature)
// Captures Node version, global tooling, and project-level environment for one-click restore
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const os = require('os');

const execAsync = promisify(exec);
const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';

/**
 * Detect Node.js version from multiple sources
 * Priority: package.json engines > .nvmrc > volta > fnm > asdf > current node
 */
async function detectNodeVersion(projectPath) {
  const sources = [];
  
  try {
    // 1. Check package.json engines
    const pkgPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      if (pkg.engines && pkg.engines.node) {
        const version = pkg.engines.node.replace(/[>=<~^]/g, '').trim();
        sources.push({ source: 'package.json engines', version, raw: pkg.engines.node });
      }
    }
  } catch (err) {
    // ignore
  }

  // 2. Check .nvmrc
  const nvmrcPath = path.join(projectPath, '.nvmrc');
  if (await fs.pathExists(nvmrcPath)) {
    try {
      const content = await fs.readFile(nvmrcPath, 'utf8');
      const version = content.trim();
      if (version) {
        sources.push({ source: '.nvmrc', version, raw: version });
      }
    } catch (err) {
      // ignore
    }
  }

  // 3. Check .node-version (used by fnm/asdf)
  const nodeVersionPath = path.join(projectPath, '.node-version');
  if (await fs.pathExists(nodeVersionPath)) {
    try {
      const content = await fs.readFile(nodeVersionPath, 'utf8');
      const version = content.trim();
      if (version) {
        sources.push({ source: '.node-version', version, raw: version });
      }
    } catch (err) {
      // ignore
    }
  }

  // 4. Check volta in package.json
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      if (pkg.volta && pkg.volta.node) {
        sources.push({ source: 'volta', version: pkg.volta.node, raw: pkg.volta.node });
      }
    }
  } catch (err) {
    // ignore
  }

  // 5. Check .tool-versions (asdf)
  const toolVersionsPath = path.join(projectPath, '.tool-versions');
  if (await fs.pathExists(toolVersionsPath)) {
    try {
      const content = await fs.readFile(toolVersionsPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('nodejs')) {
          const version = line.split(/\s+/)[1]?.trim();
          if (version) {
            sources.push({ source: '.tool-versions (asdf)', version, raw: line.trim() });
          }
        }
      }
    } catch (err) {
      // ignore
    }
  }

  // 6. Get current Node version as fallback
  try {
    const { stdout } = await execAsync('node --version');
    const currentVersion = stdout.trim().replace('v', '');
    sources.push({ source: 'current node', version: currentVersion, raw: stdout.trim() });
  } catch (err) {
    // ignore
  }

  return {
    detected: sources.length > 0 ? sources[0] : null,
    allSources: sources,
    current: sources[sources.length - 1]?.version || null,
  };
}

/**
 * Detect global tooling availability
 * Checks for npm, yarn, pnpm, and optionally lists npm globals
 */
async function detectGlobalTooling(includeGlobals = false) {
  const tooling = {
    npm: { available: false, version: null },
    yarn: { available: false, version: null },
    pnpm: { available: false, version: null },
    globals: [],
  };

  // Check npm
  try {
    const { stdout } = await execAsync('npm --version');
    tooling.npm = { available: true, version: stdout.trim() };
  } catch (err) {
    tooling.npm = { available: false, version: null };
  }

  // Check yarn
  try {
    const { stdout } = await execAsync('yarn --version');
    tooling.yarn = { available: true, version: stdout.trim() };
  } catch (err) {
    tooling.yarn = { available: false, version: null };
  }

  // Check pnpm
  try {
    const { stdout } = await execAsync('pnpm --version');
    tooling.pnpm = { available: true, version: stdout.trim() };
  } catch (err) {
    tooling.pnpm = { available: false, version: null };
  }

  // Optionally list npm globals
  if (includeGlobals && tooling.npm.available) {
    try {
      const { stdout } = await execAsync('npm list -g --depth=0 --json');
      const globalPkgs = JSON.parse(stdout);
      if (globalPkgs.dependencies) {
        tooling.globals = Object.keys(globalPkgs.dependencies).slice(0, 50); // Limit to 50
      }
    } catch (err) {
      // ignore
    }
  }

  return tooling;
}

/**
 * Detect project-level environment configuration
 * Finds .env.example, .env.template, and extracts env keys
 */
async function detectProjectEnvironment(projectPath) {
  const envConfig = {
    envTemplates: [],
    detectedKeys: [],
    hasEnvFile: false,
  };

  // Check for .env.example
  const envExamplePath = path.join(projectPath, '.env.example');
  if (await fs.pathExists(envExamplePath)) {
    try {
      const content = await fs.readFile(envExamplePath, 'utf8');
      envConfig.envTemplates.push({
        file: '.env.example',
        path: envExamplePath,
        content: content,
        keys: extractEnvKeys(content),
      });
      envConfig.detectedKeys.push(...extractEnvKeys(content));
    } catch (err) {
      // ignore
    }
  }

  // Check for .env.template
  const envTemplatePath = path.join(projectPath, '.env.template');
  if (await fs.pathExists(envTemplatePath)) {
    try {
      const content = await fs.readFile(envTemplatePath, 'utf8');
      envConfig.envTemplates.push({
        file: '.env.template',
        path: envTemplatePath,
        content: content,
        keys: extractEnvKeys(content),
      });
      envConfig.detectedKeys.push(...extractEnvKeys(content));
    } catch (err) {
      // ignore
    }
  }

  // Check for .env (but don't include content for security)
  const envPath = path.join(projectPath, '.env');
  if (await fs.pathExists(envPath)) {
    envConfig.hasEnvFile = true;
    try {
      const content = await fs.readFile(envPath, 'utf8');
      envConfig.detectedKeys.push(...extractEnvKeys(content));
    } catch (err) {
      // ignore
    }
  }

  // Remove duplicates
  envConfig.detectedKeys = Array.from(new Set(envConfig.detectedKeys));

  return envConfig;
}

/**
 * Extract environment variable keys from text
 */
function extractEnvKeys(text) {
  const keys = [];
  const patterns = [
    /^([A-Z0-9_]{2,})\s*=/gm, // KEY=value format
    /process\.env\.([A-Z0-9_]{2,})/g, // process.env.KEY
    /\$\{?([A-Z0-9_]{2,})\}?/g, // ${KEY} or $KEY
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const key = match[1];
      if (key && key.length >= 2) {
        keys.push(key);
      }
    }
  }
  
  return Array.from(new Set(keys));
}

/**
 * Detect startup command from package.json
 */
async function detectStartupCommand(projectPath) {
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    if (!(await fs.pathExists(pkgPath))) {
      return null;
    }

    const pkg = await fs.readJson(pkgPath);
    const scripts = pkg.scripts || {};

    // Prefer dev, then start, then serve
    if (scripts.dev) {
      return { command: 'dev', full: `npm run dev`, script: scripts.dev };
    }
    if (scripts.start) {
      return { command: 'start', full: `npm start`, script: scripts.start };
    }
    if (scripts.serve) {
      return { command: 'serve', full: `npm run serve`, script: scripts.serve };
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Create a complete environment snapshot for a project
 */
async function createSnapshot(projectPath, options = {}) {
  const {
    includeGlobals = false,
    includeEnvContent = false, // For security, don't include .env content by default
  } = options;

  const snapshot = {
    projectPath,
    createdAt: new Date().toISOString(),
    node: await detectNodeVersion(projectPath),
    tooling: await detectGlobalTooling(includeGlobals),
    environment: await detectProjectEnvironment(projectPath),
    startup: await detectStartupCommand(projectPath),
    platform: {
      os: os.platform(),
      arch: os.arch(),
      homedir: os.homedir(),
    },
  };

  // If not including env content, remove it from templates
  if (!includeEnvContent && snapshot.environment.envTemplates) {
    snapshot.environment.envTemplates = snapshot.environment.envTemplates.map(t => ({
      file: t.file,
      path: t.path,
      keys: t.keys,
      // Don't include content
    }));
  }

  return snapshot;
}

/**
 * Validate prerequisites for restore
 * Checks if Node.js and package managers are available
 */
async function validatePrerequisites(snapshot) {
  const issues = [];
  const warnings = [];

  // Check Node version if specified
  if (snapshot.node.detected) {
    try {
      const { stdout } = await execAsync('node --version');
      const currentVersion = stdout.trim().replace('v', '');
      const requiredVersion = snapshot.node.detected.version;

      // Simple version comparison (basic)
      if (currentVersion !== requiredVersion) {
        warnings.push({
          type: 'node_version_mismatch',
          message: `Node version mismatch: required ${requiredVersion}, found ${currentVersion}`,
          required: requiredVersion,
          current: currentVersion,
        });
      }
    } catch (err) {
      issues.push({
        type: 'node_not_found',
        message: 'Node.js is not installed or not in PATH',
      });
    }
  }

  // Check package managers
  if (snapshot.tooling) {
    const requiredPMs = [];
    if (snapshot.tooling.npm?.available) requiredPMs.push('npm');
    if (snapshot.tooling.yarn?.available) requiredPMs.push('yarn');
    if (snapshot.tooling.pnpm?.available) requiredPMs.push('pnpm');

    if (requiredPMs.length === 0) {
      issues.push({
        type: 'no_package_manager',
        message: 'No package manager (npm/yarn/pnpm) found',
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}

module.exports = {
  createSnapshot,
  detectNodeVersion,
  detectGlobalTooling,
  detectProjectEnvironment,
  detectStartupCommand,
  validatePrerequisites,
  extractEnvKeys,
};


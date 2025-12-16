// utils/restoreEverything.js
// Guided restore functionality for Pro feature
// Restores environment, installs deps, and starts projects
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const os = require('os');

const execAsync = promisify(exec);
const isWindows = os.platform() === 'win32';

/**
 * Restore project environment from snapshot
 * Steps:
 * 1. Validate prerequisites
 * 2. Ensure Node version (if possible)
 * 3. Install dependencies
 * 4. Create .env file from template (if needed)
 * 5. Return status
 */
async function restoreProject(snapshot, options = {}) {
  const {
    installDeps = true,
    createEnvFile = true,
    startProject = false,
  } = options;

  const steps = [];
  const errors = [];
  const warnings = [];

  // Step 1: Validate prerequisites
  const { validatePrerequisites } = require('./environmentSnapshot');
  const validation = await validatePrerequisites(snapshot);
  
  if (!validation.valid) {
    return {
      success: false,
      error: 'Prerequisites validation failed',
      steps,
      errors: validation.issues,
      warnings: validation.warnings,
    };
  }

  warnings.push(...validation.warnings);
  steps.push({ step: 'validate_prerequisites', status: 'completed', message: 'Prerequisites validated' });

  // Step 2: Ensure Node version (best effort - just warn if mismatch)
  if (snapshot.node.detected && validation.warnings.length > 0) {
    const nodeWarning = validation.warnings.find(w => w.type === 'node_version_mismatch');
    if (nodeWarning) {
      warnings.push({
        step: 'node_version',
        message: `Node version mismatch detected. Consider using nvm/fnm/asdf to switch to ${nodeWarning.required}`,
        action: `nvm use ${nodeWarning.required} || fnm use ${nodeWarning.required} || asdf install nodejs ${nodeWarning.required}`,
      });
    }
  }
  steps.push({ step: 'check_node_version', status: 'completed', message: 'Node version checked' });

  // Step 3: Install dependencies
  if (installDeps) {
    try {
      const projectPath = snapshot.projectPath;
      
      // Detect package manager
      let pm = 'npm';
      try {
        await execAsync('yarn --version', { cwd: projectPath });
        pm = 'yarn';
      } catch {
        try {
          await execAsync('pnpm --version', { cwd: projectPath });
          pm = 'pnpm';
        } catch {
          pm = 'npm';
        }
      }

      // Check if node_modules exists
      const nodeModulesPath = path.join(projectPath, 'node_modules');
      const hasNodeModules = await fs.pathExists(nodeModulesPath);

      if (!hasNodeModules) {
        steps.push({ step: 'install_dependencies', status: 'in_progress', message: `Installing dependencies with ${pm}...` });
        
        const installCmd = pm === 'yarn' ? 'yarn install' : pm === 'pnpm' ? 'pnpm install' : 'npm install';
        await execAsync(installCmd, { 
          cwd: projectPath,
          timeout: 300000, // 5 minutes timeout
        });
        
        steps.push({ step: 'install_dependencies', status: 'completed', message: `Dependencies installed with ${pm}` });
      } else {
        steps.push({ step: 'install_dependencies', status: 'skipped', message: 'node_modules already exists' });
      }
    } catch (err) {
      errors.push({
        step: 'install_dependencies',
        error: err.message || 'Failed to install dependencies',
        details: err.stderr || err.stdout || '',
      });
      steps.push({ step: 'install_dependencies', status: 'failed', message: `Failed: ${err.message}` });
    }
  } else {
    steps.push({ step: 'install_dependencies', status: 'skipped', message: 'Dependency installation skipped' });
  }

  // Step 4: Create .env file from template
  if (createEnvFile && snapshot.environment.envTemplates && snapshot.environment.envTemplates.length > 0) {
    try {
      const projectPath = snapshot.projectPath;
      const envPath = path.join(projectPath, '.env');
      const hasEnvFile = await fs.pathExists(envPath);

      if (!hasEnvFile) {
        // Use first template found
        const template = snapshot.environment.envTemplates[0];
        
        // If we have content, use it; otherwise create from keys
        if (template.content) {
          await fs.writeFile(envPath, template.content, 'utf8');
          steps.push({ 
            step: 'create_env_file', 
            status: 'completed', 
            message: `Created .env from ${template.file}` 
          });
        } else if (template.keys && template.keys.length > 0) {
          // Create template with placeholder values
          const envContent = template.keys.map(key => `${key}=`).join('\n') + '\n';
          await fs.writeFile(envPath, envContent, 'utf8');
          steps.push({ 
            step: 'create_env_file', 
            status: 'completed', 
            message: `Created .env template with keys: ${template.keys.join(', ')}` 
          });
          warnings.push({
            step: 'create_env_file',
            message: 'Please fill in the values in .env file',
          });
        }
      } else {
        steps.push({ step: 'create_env_file', status: 'skipped', message: '.env file already exists' });
      }
    } catch (err) {
      errors.push({
        step: 'create_env_file',
        error: err.message || 'Failed to create .env file',
      });
      steps.push({ step: 'create_env_file', status: 'failed', message: `Failed: ${err.message}` });
    }
  } else {
    steps.push({ step: 'create_env_file', status: 'skipped', message: 'No env template found or skipped' });
  }

  // Step 5: Start project (if requested)
  if (startProject && snapshot.startup) {
    // This will be handled by the main process via IPC
    steps.push({ step: 'start_project', status: 'pending', message: 'Project start requested' });
  }

  return {
    success: errors.length === 0,
    steps,
    errors,
    warnings,
    snapshot: {
      node: snapshot.node,
      tooling: snapshot.tooling,
      environment: snapshot.environment,
      startup: snapshot.startup,
    },
  };
}

/**
 * Restore global tooling (optional)
 * Installs npm globals from snapshot
 */
async function restoreGlobalTooling(snapshot, options = {}) {
  const { installGlobals = false } = options;
  
  if (!installGlobals || !snapshot.tooling.globals || snapshot.tooling.globals.length === 0) {
    return {
      success: true,
      skipped: true,
      message: 'Global tooling restore skipped',
    };
  }

  const steps = [];
  const errors = [];
  const installed = [];

  for (const pkg of snapshot.tooling.globals.slice(0, 20)) { // Limit to 20
    try {
      await execAsync(`npm install -g ${pkg}`, { timeout: 60000 });
      installed.push(pkg);
      steps.push({ step: `install_${pkg}`, status: 'completed', message: `Installed ${pkg}` });
    } catch (err) {
      errors.push({ pkg, error: err.message });
      steps.push({ step: `install_${pkg}`, status: 'failed', message: `Failed to install ${pkg}` });
    }
  }

  return {
    success: errors.length === 0,
    installed,
    errors,
    steps,
  };
}

/**
 * Get restore instructions for manual steps
 */
function getRestoreInstructions(snapshot) {
  const instructions = [];

  // Node version instructions
  if (snapshot.node.detected) {
    const nodeVersion = snapshot.node.detected.version;
    instructions.push({
      category: 'Node Version',
      commands: [
        `# Using nvm:`,
        `nvm install ${nodeVersion}`,
        `nvm use ${nodeVersion}`,
        ``,
        `# Using fnm:`,
        `fnm install ${nodeVersion}`,
        `fnm use ${nodeVersion}`,
        ``,
        `# Using asdf:`,
        `asdf install nodejs ${nodeVersion}`,
        `asdf local nodejs ${nodeVersion}`,
      ],
    });
  }

  // Package manager instructions
  if (snapshot.tooling) {
    const pmInstructions = [];
    if (!snapshot.tooling.npm.available) pmInstructions.push('npm is not available');
    if (!snapshot.tooling.yarn.available && snapshot.tooling.yarn.version) {
      pmInstructions.push(`yarn ${snapshot.tooling.yarn.version} was used`);
    }
    if (!snapshot.tooling.pnpm.available && snapshot.tooling.pnpm.version) {
      pmInstructions.push(`pnpm ${snapshot.tooling.pnpm.version} was used`);
    }
    
    if (pmInstructions.length > 0) {
      instructions.push({
        category: 'Package Manager',
        commands: pmInstructions,
      });
    }
  }

  // Environment variables
  if (snapshot.environment.detectedKeys && snapshot.environment.detectedKeys.length > 0) {
    instructions.push({
      category: 'Environment Variables',
      commands: [
        `# Required environment variables:`,
        ...snapshot.environment.detectedKeys.map(key => `export ${key}=<value>`),
        ``,
        `# Or add to .env file:`,
        ...snapshot.environment.detectedKeys.map(key => `${key}=`),
      ],
    });
  }

  // Startup command
  if (snapshot.startup) {
    instructions.push({
      category: 'Start Project',
      commands: [
        `cd ${snapshot.projectPath}`,
        snapshot.startup.full || `npm run ${snapshot.startup.command}`,
      ],
    });
  }

  return instructions;
}

module.exports = {
  restoreProject,
  restoreGlobalTooling,
  getRestoreInstructions,
};


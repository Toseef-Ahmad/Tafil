// main.js
const { app, BrowserWindow, ipcMain, dialog, shell, MenuItem, Menu, nativeImage, Tray } = require('electron');
const os = require("os");
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const psTree = require('ps-tree');
const projectBrain = require('./utils/projectBrain');

// Licensing module
const licensing = require('./licensing');

// ========================================
// Error Intelligence (deterministic, offline)
// ========================================
function extractFirstPort(text, fallbackPort = null) {
  const t = typeof text === 'string' ? text : '';
  const patterns = [
    /localhost:(\d{4,5})/i,
    /\bport\s+(\d{4,5})\b/i,
    /\b:(\d{4,5})\b/,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m) {
      const p = parseInt(m[1], 10);
      if (!Number.isNaN(p) && p >= 1000 && p <= 65535) return p;
    }
  }
  return fallbackPort;
}

function uniqueNonEmpty(arr) {
  return Array.from(new Set((arr || []).map(String).map(s => s.trim()).filter(Boolean)));
}

function extractEnvKeys(text) {
  const t = typeof text === 'string' ? text : '';
  const keys = [];
  const patterns = [
    /Missing(?: required)? (?:environment variable|env var|env)\s*[:=]?\s*([A-Z0-9_]{2,})/gi,
    /Please set(?: the)? (?:environment variable|env var|env)\s*[:=]?\s*([A-Z0-9_]{2,})/gi,
    /\bprocess\.env\.([A-Z0-9_]{2,})\b/g,
    /\b([A-Z0-9_]{2,})\s+is\s+not\s+defined\b/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(t)) !== null) keys.push(m[1]);
  }
  return uniqueNonEmpty(keys).slice(0, 10);
}

function detectNodeMismatch(text) {
  const t = typeof text === 'string' ? text : '';
  const engineMatch = t.match(/The engine "node" is incompatible.*Expected version "?([^"\n]+)"?/i);
  if (engineMatch) return { kind: 'NODE_ENGINE_MISMATCH', required: engineMatch[1] };
  const reqMatch = t.match(/requires Node(?:\.js)?\s*(?:version)?\s*v?(\d+(?:\.\d+)?(?:\.\d+)?)/i);
  if (reqMatch) return { kind: 'NODE_ENGINE_MISMATCH', required: reqMatch[1] };
  const ossl = t.includes('ERR_OSSL_EVP_UNSUPPORTED');
  if (ossl) return { kind: 'NODE_OPENSSL_INCOMPAT', required: 'Node 16/18 LTS (or set NODE_OPTIONS=--openssl-legacy-provider)' };
  return null;
}

function buildFailureDiagnostic({ projectPath, framework, suggestedPort, stdout, stderr, code, errorMessage }) {
  const combined = `${stdout || ''}\n${stderr || ''}\n${errorMessage || ''}`;

  // Port in use
  const hasPortConflict =
    /EADDRINUSE/i.test(combined) ||
    /address already in use/i.test(combined) ||
    /Something is already running on port/i.test(combined) ||
    /\bport\b.*\balready in use\b/i.test(combined);
  if (hasPortConflict) {
    const port = extractFirstPort(combined, suggestedPort);
    const ownership = port ? checkPortOwnership(port) : { isTafil: false, projectPath: null };
    return {
      kind: 'PORT_IN_USE',
      title: port ? `Port ${port} is already in use` : 'Port is already in use',
      details: ownership.isTafil
        ? `That port is already used by another Tafil project: ${path.basename(ownership.projectPath)}`
        : 'Another process is already using this port.',
      data: {
        port,
        ownedByTafil: ownership.isTafil,
        ownerProjectPath: ownership.projectPath,
        framework: framework || null,
        exitCode: code ?? null,
      },
      suggestions: uniqueNonEmpty([
        ownership.isTafil && ownership.projectPath ? 'Stop the conflicting Tafil project' : null,
        'Switch to a different port',
        'Check what is running on the port (External Processes panel)',
      ]),
    };
  }

  // Missing env vars
  const envKeys = extractEnvKeys(combined);
  if (envKeys.length > 0 && /env|environment/i.test(combined)) {
    return {
      kind: 'MISSING_ENV',
      title: envKeys.length === 1 ? `Missing env var: ${envKeys[0]}` : `Missing env vars: ${envKeys.slice(0, 3).join(', ')}${envKeys.length > 3 ? '…' : ''}`,
      details: 'This project appears to require environment variables that are not set.',
      data: { keys: envKeys, framework: framework || null, exitCode: code ?? null },
      suggestions: ['Add them to a .env file (or your shell env) and run again'],
    };
  }

  // Node mismatch / OpenSSL mismatch
  const nodeIssue = detectNodeMismatch(combined);
  if (nodeIssue) {
    return {
      kind: nodeIssue.kind,
      title: 'Node.js version mismatch',
      details: nodeIssue.required ? `Required: ${nodeIssue.required}` : 'This project likely needs a different Node.js version.',
      data: { required: nodeIssue.required || null, framework: framework || null, exitCode: code ?? null },
      suggestions: ['Use an LTS Node version (via nvm/volta) and re-run'],
    };
  }

  return null;
}
const { exec, spawn } = require('child_process');
const { Worker } = require('worker_threads');
const portfinder = require('portfinder');
const { detectExternalNodeProcesses, getProcessOnPort } = require('./utils/externalProcessDetector');
const { scanNodeProjects } = require('./utils/gitScanner');
const { Client } = require('ssh2');
const net = require('net');

const {
  installDependencies,
  removeNodeModules,
} = require('./utils/projectActions');

const {
  createProject,
  getTemplates,
  getTemplateLibrary,
  validateProjectName,
} = require('./utils/projectCreator');

// Platform detection
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

console.log(`Running on: ${process.platform} (${os.type()} ${os.release()})`);

// Delay isDev check until app is ready
let isDev = false;

if (process.env.NODE_ENV !== 'development') {
  process.env.NODE_ENV = 'production';
}

// Fix PATH for packaged apps (critical for finding npm/node on all platforms)
function fixPath() {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  
  // Common paths by platform
  let additionalPaths = [];
  
  if (isMac) {
    additionalPaths = [
      '/usr/local/bin',
      '/usr/bin',
      '/bin',
      '/usr/sbin',
      '/sbin',
      '/opt/homebrew/bin',           // M1/M2/M3 Mac Homebrew
      '/opt/homebrew/sbin',
      '/opt/local/bin',              // MacPorts
      `${home}/.nvm/versions/node`,  // NVM (will check subdirs)
      `${home}/.volta/bin`,          // Volta
      `${home}/.fnm/current/bin`,    // FNM
      `${home}/.asdf/shims`,         // ASDF
      '/usr/local/opt/node/bin',     // Homebrew node
    ];
  } else if (isWindows) {
    const appData = process.env.APPDATA || '';
    const localAppData = process.env.LOCALAPPDATA || '';
    const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    
    additionalPaths = [
      `${programFiles}\\nodejs`,
      `${programFilesX86}\\nodejs`,
      `${appData}\\npm`,
      `${localAppData}\\Programs\\nodejs`,
      `${home}\\.nvm`,               // NVM for Windows
      `${home}\\.volta\\bin`,        // Volta
      `${appData}\\nvm`,             // NVM for Windows alternative
      `${localAppData}\\Volta\\bin`, // Volta alternative
    ];
  } else if (isLinux) {
    additionalPaths = [
      '/usr/local/bin',
      '/usr/bin',
      '/bin',
      '/usr/local/sbin',
      '/usr/sbin',
      '/sbin',
      `${home}/.nvm/versions/node`,  // NVM
      `${home}/.volta/bin`,          // Volta
      `${home}/.fnm/current/bin`,    // FNM
      `${home}/.asdf/shims`,         // ASDF
      '/snap/bin',                   // Snap packages
      `${home}/.local/bin`,          // User local bin
    ];
  }
  
  // Process paths - expand NVM versions and filter to existing
  const expandedPaths = [];
  
  for (const p of additionalPaths) {
    try {
      // Handle NVM path which has version subdirectories
      if (p.includes('.nvm/versions/node')) {
        if (fs.existsSync(p)) {
          const versions = fs.readdirSync(p).filter(v => v.startsWith('v'));
          if (versions.length > 0) {
            // Sort versions and use the latest
            const sortedVersions = versions.sort((a, b) => {
              const aParts = a.replace('v', '').split('.').map(Number);
              const bParts = b.replace('v', '').split('.').map(Number);
              for (let i = 0; i < 3; i++) {
                if (aParts[i] !== bParts[i]) return bParts[i] - aParts[i];
              }
              return 0;
            });
            
            // Add bin paths for available versions
            for (const version of sortedVersions) {
              const binPath = path.join(p, version, 'bin');
              if (fs.existsSync(binPath)) {
                console.log(`📍 Found NVM Node.js ${version} at: ${binPath}`);
                expandedPaths.push(binPath);
              }
            }
          }
        }
      } else if (fs.existsSync(p)) {
        expandedPaths.push(p);
      }
    } catch (err) {
      // Ignore errors for individual paths
    }
  }
  
  // Merge with existing PATH (new paths first for priority)
  const existingPath = process.env.PATH || '';
  const pathSeparator = isWindows ? ';' : ':';
  const allPaths = [...new Set([...expandedPaths, ...existingPath.split(pathSeparator)])];
  
  process.env.PATH = allPaths.filter(Boolean).join(pathSeparator);
  console.log(`✅ Fixed PATH for ${process.platform}:`, process.env.PATH.substring(0, 300) + '...');
}

// Apply PATH fix for packaged apps
if (!isDev) {
  fixPath();
}

let mainWindow;
let runningProcesses = new Map();

// path to your tray icon .png or .ico
let tray = null;

/**
 * Validate that a project path is legitimate and safe (CROSS-PLATFORM)
 * Now supports Parallels/VM shared folders (\\Mac\Home\..., \\wsl$\...)
 */
function isValidProjectPath(projectPath) {
  console.log('Validating project path:', projectPath, 'Type:', typeof projectPath);
  
  if (!projectPath || typeof projectPath !== 'string') {
    console.log('Validation failed: path is empty or not a string');
    return false;
  }
  
  // Normalize the path for current platform
  const normalizedPath = path.normalize(projectPath);
  console.log('Normalized path:', normalizedPath);
  
  // Check if it's a UNC/network path (Windows VM shared folders)
  // Examples: \\Mac\Home\..., \\wsl$\..., \\server\share\...
  const isUNCPath = isWindows && normalizedPath.startsWith('\\\\');
  
  // Ensure it's an absolute path OR a UNC path
  if (!path.isAbsolute(normalizedPath) && !isUNCPath) {
    console.log('Validation failed: path is not absolute or UNC');
    return false;
  }
  
  // Check if the path exists
  try {
    const exists = fs.existsSync(normalizedPath);
    console.log('Path exists:', exists, '(UNC path:', isUNCPath, ')');
    return exists;
  } catch (err) {
    console.error(`Error checking project path: ${err.message}`);
    return false;
  }
}

/**
 * Get the appropriate npm command for the platform
 */
/**
 * Get npm command with full path in production
 */
function getNpmCommand() {
  if (isDev) {
    return isWindows ? 'npm.cmd' : 'npm';
  }
  
  const home = process.env.HOME || process.env.USERPROFILE || '';
  
  // In production, try to find npm's full path
  if (isWindows) {
    const npmPaths = [
      'C:\\Program Files\\nodejs\\npm.cmd',
      'C:\\Program Files (x86)\\nodejs\\npm.cmd',
      process.env.APPDATA + '\\npm\\npm.cmd',
      home + '\\.volta\\bin\\npm.cmd',
    ];
    
    for (const npmPath of npmPaths) {
      if (fs.existsSync(npmPath)) {
        console.log('Found npm at:', npmPath);
        return npmPath;
      }
    }
    return 'npm.cmd'; // Fallback
  } else {
    // Unix-like systems
    
    // First check common static locations
    const staticPaths = [
      '/opt/homebrew/bin/npm',    // M1/M2/M3 Mac Homebrew (most common)
      '/usr/local/bin/npm',        // Intel Mac Homebrew / standard
      '/usr/bin/npm',              // System npm
      home + '/.volta/bin/npm',    // Volta
      home + '/.fnm/current/bin/npm', // FNM
      home + '/.asdf/shims/npm',   // ASDF
    ];
    
    for (const npmPath of staticPaths) {
      if (fs.existsSync(npmPath)) {
        console.log('Found npm at:', npmPath);
        return npmPath;
      }
    }
    
    // Check NVM - iterate through versions
    const nvmDir = path.join(home, '.nvm', 'versions', 'node');
    if (fs.existsSync(nvmDir)) {
      try {
        const versions = fs.readdirSync(nvmDir).filter(v => v.startsWith('v')).sort().reverse();
        for (const version of versions) {
          const npmPath = path.join(nvmDir, version, 'bin', 'npm');
          if (fs.existsSync(npmPath)) {
            console.log('Found npm via NVM at:', npmPath);
            return npmPath;
          }
        }
      } catch (err) {
        console.warn('Error scanning NVM directory:', err.message);
      }
    }
    
    // Try 'which npm' as last resort
    try {
const { execSync } = require('child_process');
      const npmPath = execSync('which npm 2>/dev/null || echo ""', { encoding: 'utf8' }).trim();
      if (npmPath && fs.existsSync(npmPath)) {
        console.log('Found npm via which at:', npmPath);
        return npmPath;
      }
    } catch (err) {
      console.warn('Could not find npm with which:', err.message);
    }
    
    console.warn('⚠️ npm not found in any known location, falling back to PATH');
    return 'npm'; // Fallback to PATH
  }
}

/**
 * Get the appropriate shell for the platform
 */
function getShell() {
  if (isWindows) {
    return process.env.COMSPEC || 'cmd.exe';
  }
  return process.env.SHELL || '/bin/sh';
}

/**
 * Detect installed IDEs/Editors - Cross-platform
 */
async function detectInstalledIDEs() {
  const ides = [];
  
  // Windows app paths helper
  const getWindowsAppPaths = (appName) => {
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env['LOCALAPPDATA'] || '';
    const appData = process.env['APPDATA'] || '';
    
    return {
      programFiles,
      programFilesX86,
      localAppData,
      appData
    };
  };
  
  const ideList = [
    {
      name: 'Visual Studio Code',
      command: 'code',
      icon: '💻',
      testCommands: isWindows ? ['code.cmd', 'code'] : ['code'],
      macAppPath: '/Applications/Visual Studio Code.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\Programs\\Microsoft VS Code\\Code.exe`,
        `${process.env['ProgramFiles']}\\Microsoft VS Code\\Code.exe`
      ] : []
    },
    {
      name: 'VS Code Insiders',
      command: 'code-insiders',
      icon: '💻',
      testCommands: isWindows ? ['code-insiders.cmd', 'code-insiders'] : ['code-insiders'],
      macAppPath: '/Applications/Visual Studio Code - Insiders.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\Programs\\Microsoft VS Code Insiders\\Code - Insiders.exe`
      ] : []
    },
    {
      name: 'WebStorm',
      command: 'webstorm',
      icon: '🌊',
      testCommands: isWindows 
        ? ['webstorm.cmd', 'webstorm']
        : ['webstorm'],
      macAppPath: '/Applications/WebStorm.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\JetBrains\\Toolbox\\scripts\\webstorm.cmd`,
        `${process.env['ProgramFiles']}\\JetBrains\\WebStorm\\bin\\webstorm64.exe`
      ] : []
    },
    {
      name: 'IntelliJ IDEA',
      command: 'idea',
      icon: '💡',
      testCommands: isWindows 
        ? ['idea.cmd', 'idea']
        : ['idea'],
      macAppPath: '/Applications/IntelliJ IDEA.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\JetBrains\\Toolbox\\scripts\\idea.cmd`,
        `${process.env['ProgramFiles']}\\JetBrains\\IntelliJ IDEA\\bin\\idea64.exe`
      ] : []
    },
    {
      name: 'PyCharm',
      command: 'pycharm',
      icon: '🐍',
      testCommands: isWindows 
        ? ['pycharm.cmd', 'pycharm']
        : ['pycharm'],
      macAppPath: '/Applications/PyCharm.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\JetBrains\\Toolbox\\scripts\\pycharm.cmd`,
        `${process.env['ProgramFiles']}\\JetBrains\\PyCharm\\bin\\pycharm64.exe`
      ] : []
    },
    {
      name: 'PhpStorm',
      command: 'phpstorm',
      icon: '🐘',
      testCommands: isWindows 
        ? ['phpstorm.cmd', 'phpstorm']
        : ['phpstorm'],
      macAppPath: '/Applications/PhpStorm.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\JetBrains\\Toolbox\\scripts\\phpstorm.cmd`,
        `${process.env['ProgramFiles']}\\JetBrains\\PhpStorm\\bin\\phpstorm64.exe`
      ] : []
    },
    {
      name: 'RubyMine',
      command: 'rubymine',
      icon: '💎',
      testCommands: isWindows 
        ? ['rubymine.cmd', 'rubymine']
        : ['rubymine'],
      macAppPath: '/Applications/RubyMine.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\JetBrains\\Toolbox\\scripts\\rubymine.cmd`
      ] : []
    },
    {
      name: 'CLion',
      command: 'clion',
      icon: '🔧',
      testCommands: isWindows 
        ? ['clion.cmd', 'clion']
        : ['clion'],
      macAppPath: '/Applications/CLion.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\JetBrains\\Toolbox\\scripts\\clion.cmd`
      ] : []
    },
    {
      name: 'Sublime Text',
      command: 'subl',
      icon: '📝',
      testCommands: isWindows 
        ? ['subl.exe']
        : ['subl'],
      macAppPath: '/Applications/Sublime Text.app',
      winPaths: isWindows ? [
        `${process.env['ProgramFiles']}\\Sublime Text\\subl.exe`,
        `${process.env['ProgramFiles']}\\Sublime Text 3\\subl.exe`
      ] : []
    },
    {
      name: 'Atom',
      command: 'atom',
      icon: '⚛️',
      testCommands: isWindows 
        ? ['atom.cmd', 'atom']
        : ['atom'],
      macAppPath: '/Applications/Atom.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\atom\\atom.exe`
      ] : []
    },
    {
      name: 'Vim',
      command: 'vim',
      icon: '📟',
      testCommands: ['vim']
    },
    {
      name: 'Neovim',
      command: 'nvim',
      icon: '🌙',
      testCommands: ['nvim']
    },
    {
      name: 'Emacs',
      command: 'emacs',
      icon: '🔧',
      testCommands: ['emacs']
    },
    {
      name: 'Cursor',
      command: 'cursor',
      icon: '🎯',
      testCommands: isWindows ? ['cursor.cmd', 'cursor'] : ['cursor'],
      macAppPath: '/Applications/Cursor.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\Programs\\cursor\\Cursor.exe`,
        `${process.env['LOCALAPPDATA']}\\cursor\\Cursor.exe`
      ] : []
    },
    {
      name: 'Zed',
      command: 'zed',
      icon: '⚡',
      testCommands: ['zed'],
      macAppPath: '/Applications/Zed.app'
    },
    {
      name: 'Nova',
      command: 'nova',
      icon: '⭐',
      testCommands: ['nova'],
      macAppPath: '/Applications/Nova.app'
    },
    {
      name: 'Fleet',
      command: 'fleet',
      icon: '🚀',
      testCommands: ['fleet'],
      macAppPath: '/Applications/Fleet.app',
      winPaths: isWindows ? [
        `${process.env['LOCALAPPDATA']}\\JetBrains\\Toolbox\\scripts\\fleet.cmd`
      ] : []
    },
    {
      name: 'Notepad++',
      command: 'notepad++',
      icon: '📝',
      testCommands: isWindows ? ['notepad++'] : [],
      windowsOnly: true,
      winPaths: isWindows ? [
        `${process.env['ProgramFiles']}\\Notepad++\\notepad++.exe`,
        `${process.env['ProgramFiles(x86)']}\\Notepad++\\notepad++.exe`
      ] : []
    }
  ];

  for (const ide of ideList) {
    let found = false;
    
    // On macOS, check for .app bundle first
    if (isMac && ide.macAppPath && fs.existsSync(ide.macAppPath)) {
      ides.push({
        name: ide.name,
        command: ide.macAppPath, // Store app path for macOS
        icon: ide.icon,
        isMacApp: true
      });
      found = true;
      continue;
    }
    
    // On Windows, check known installation paths first
    if (isWindows && ide.winPaths && ide.winPaths.length > 0) {
      for (const winPath of ide.winPaths) {
        try {
          if (fs.existsSync(winPath)) {
            ides.push({
              name: ide.name,
              command: `"${winPath}"`, // Quote the path for execution
              icon: ide.icon,
              isMacApp: false,
              isWinPath: true
            });
            found = true;
            break;
          }
        } catch (err) {
          // Path doesn't exist, continue
        }
      }
      if (found) continue;
    }
    
    // Test command-line commands
    if (!found && ide.testCommands) {
      for (const testCmd of ide.testCommands) {
        try {
          // Test if command exists
          const testCommand = isWindows 
            ? `where ${testCmd.includes('\\') ? `"${testCmd}"` : testCmd}`
            : `which ${testCmd}`;
          
          await new Promise((resolve, reject) => {
            exec(testCommand, { timeout: 2000 }, (error, stdout) => {
              if (!error && stdout && stdout.trim()) {
                ides.push({
                  name: ide.name,
                  command: testCmd,
                  icon: ide.icon,
                  isMacApp: false,
                  isWinPath: false
                });
                resolve();
              } else {
                reject();
              }
            });
          });
          found = true;
          break; // Found, no need to test other commands
        } catch (err) {
          // Not found, continue to next
        }
      }
    }
  }

  // Always add system file manager as fallback
  if (isWindows) {
    ides.push({ name: 'File Explorer', command: 'explorer', icon: '📁', isMacApp: false });
  } else if (isMac) {
    ides.push({ name: 'Finder', command: 'open', icon: '📁', isMacApp: false });
  } else if (isLinux) {
    ides.push({ name: 'File Manager', command: 'xdg-open', icon: '📁', isMacApp: false });
  }

  return ides;
}

/**
 * Detect installed Terminals - Cross-platform
 */
async function detectInstalledTerminals() {
  const terminals = [];
  
  const terminalList = [
    {
      name: 'iTerm',
      command: 'iTerm',
      icon: '⚡',
      macAppPath: '/Applications/iTerm.app',
      testCommands: ['iterm']
    },
    {
      name: 'Terminal',
      command: 'Terminal',
      icon: '💻',
      macAppPath: '/System/Applications/Utilities/Terminal.app',
      default: isMac
    },
    {
      name: 'Kitty',
      command: 'kitty',
      icon: '🐱',
      macAppPath: '/Applications/kitty.app',
      testCommands: ['kitty']
    },
    {
      name: 'Alacritty',
      command: 'alacritty',
      icon: '🚀',
      macAppPath: '/Applications/Alacritty.app',
      testCommands: ['alacritty']
    },
    {
      name: 'Warp',
      command: 'warp',
      icon: '🌊',
      macAppPath: '/Applications/Warp.app',
      testCommands: ['warp']
    },
    {
      name: 'Hyper',
      command: 'hyper',
      icon: '⚛️',
      macAppPath: '/Applications/Hyper.app',
      testCommands: ['hyper']
    },
    {
      name: 'Windows Terminal',
      command: 'wt',
      icon: '⚡',
      windowsOnly: true,
      testCommands: ['wt']
    },
    {
      name: 'PowerShell',
      command: 'powershell',
      icon: '💻',
      windowsOnly: true,
      testCommands: ['powershell'],
      default: isWindows
    },
    {
      name: 'CMD',
      command: 'cmd',
      icon: '📟',
      windowsOnly: true,
      testCommands: ['cmd']
    },
    {
      name: 'GNOME Terminal',
      command: 'gnome-terminal',
      icon: '💻',
      linuxOnly: true,
      testCommands: ['gnome-terminal']
    },
    {
      name: 'Konsole',
      command: 'konsole',
      icon: '⚡',
      linuxOnly: true,
      testCommands: ['konsole']
    },
    {
      name: 'xterm',
      command: 'xterm',
      icon: '📟',
      linuxOnly: true,
      testCommands: ['xterm']
    }
  ];

  for (const terminal of terminalList) {
    // Skip platform-specific terminals
    if (terminal.windowsOnly && !isWindows) continue;
    if (terminal.linuxOnly && !isLinux) continue;
    if (terminal.macOnly && !isMac) continue;
    
    let found = false;
    
    // On macOS, check for .app bundle first
    if (isMac && terminal.macAppPath && fs.existsSync(terminal.macAppPath)) {
      terminals.push({
        name: terminal.name,
        command: terminal.command,
        icon: terminal.icon,
        isMacApp: true,
        isDefault: terminal.default || false
      });
      found = true;
      continue;
    }
    
    // Test command-line commands
    if (!found && terminal.testCommands) {
      for (const testCmd of terminal.testCommands) {
        try {
          const testCommand = isWindows 
            ? `where ${testCmd}`
            : `which ${testCmd}`;
          
          await new Promise((resolve, reject) => {
            exec(testCommand, { timeout: 1000 }, (error, stdout) => {
              if (!error && stdout && stdout.trim()) {
                terminals.push({
                  name: terminal.name,
                  command: terminal.command,
                  icon: terminal.icon,
                  isMacApp: false,
                  isDefault: terminal.default || false
                });
                resolve();
              } else {
                reject();
              }
            });
          });
          found = true;
          break;
        } catch (err) {
          // Not found, continue to next
        }
      }
    }
  }

  // Sort: default terminals first
  terminals.sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  return terminals;
}


const { execSync } = require('child_process');

// Single-instance lock (prevents two Tafils fighting over ports/process state)
// Must be set before `app.whenReady()`.
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

/**
 * Check permissions - macOS specific
 */
function hasFullDiskAccess() {
  if (!isMac) return true; // Not applicable on other platforms
  
  try {
    // Try listing a system-protected folder
    execSync('ls /Library/Application\\ Support', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Ensure proper permissions based on platform
 */
function ensureFullPermissions() {
  if (isMac) {
    try {
      console.log("Checking Full Disk Access (macOS)...");
      execSync("ls /System", { stdio: "ignore" });
      console.log("✅ Full Disk Access already granted.");
    } catch (err) {
      console.log("🚨 Full Disk Access not granted!");
      dialog.showMessageBoxSync({
        type: "warning",
        title: "Permissions Required",
        message:
          "This app needs Full Disk Access to manage Node.js projects. Please grant it manually in System Preferences → Security & Privacy → Full Disk Access.",
        buttons: ["OK"],
      });
      shell.openExternal("x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles");
    }
  } else if (isWindows) {
    console.log("Running on Windows - no additional permissions needed");
  } else if (isLinux) {
    console.log("Running on Linux - no additional permissions needed");
  }
}

/**
 * Check Full Disk Access (macOS only)
 */
function checkFullDiskAccess() {
  if (!isMac) return; // Only relevant for macOS
  
  if (!hasFullDiskAccess()) {
    dialog.showMessageBoxSync({
      type: 'warning',
      title: 'Full Disk Access Required',
      message: `This app needs Full Disk Access to manage Node.js projects.\n\nPlease grant access manually:\n\nSystem Preferences → Security & Privacy → Full Disk Access`,
      buttons: ['OK']
    });
    execSync('open "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles"');
  }
}

// Register new license system IPC handlers
licensing.registerLicenseHandlers();

// CRITICAL: Prevent running as root (causes permission nightmares)
if (process.getuid && process.getuid() === 0) {
  dialog.showErrorBox(
    'Cannot Run as Root',
    'TAFIL must not be run with sudo.\n\n' +
    'Running as root causes permission issues with your projects and files.\n\n' +
    'Please restart TAFIL normally:\n' +
    '  npm start\n\n' +
    'If you need help, visit: https://tafil.app/docs'
  );
  app.quit();
  process.exit(1);
}

// ensureAdminPrivileges();
// Once app is ready, create the tray
app.whenReady().then(() => {
  // Root check already done above, this is redundant now
  const isRunningAsRoot = process.getuid && process.getuid() === 0;
  if (isRunningAsRoot) {
    console.warn('⚠️ WARNING: Tafil is running as root (sudo)!');
    console.warn('   Projects created will be owned by root and may cause permission issues.');
    console.warn('   Please restart Tafil without sudo: npm start');
    
    // Show warning dialog
    dialog.showMessageBox({
      type: 'warning',
      title: 'Running as Root',
      message: 'Tafil is running with root privileges (sudo)',
      detail: 'This can cause permission problems:\n\n' +
              '• Projects will be owned by root\n' +
              '• VS Code may not be able to edit files\n' +
              '• Files may be created in /var/root instead of your home folder\n\n' +
              'Recommendation: Close Tafil and restart without sudo:\n\n' +
              '  npm start\n\n' +
              'Do you want to continue anyway?',
      buttons: ['Continue Anyway', 'Quit'],
      defaultId: 1,
      cancelId: 1,
    }).then(result => {
      if (result.response === 1) {
        app.quit();
      }
    });
  }
  
  // Now we can safely check if dev
  isDev = !app.isPackaged;
  console.log(`Is Development: ${isDev}`);
  
  // Set dock icon on macOS
  if (isMac && app.dock) {
    const dockIconPath = path.join(__dirname, 'build', 'icon.png');
    if (fs.existsSync(dockIconPath)) {
      const dockIcon = nativeImage.createFromPath(dockIconPath);
      if (!dockIcon.isEmpty()) {
        app.dock.setIcon(dockIcon);
        console.log('✅ Dock icon set');
      }
    }
  }
  
  // Set app icon globally
  const appIconPath = isMac 
    ? path.join(__dirname, 'build', 'icon.png')
    : isWindows 
      ? path.join(__dirname, 'build', 'icon.ico')
      : path.join(__dirname, 'build', 'icon.png');
  
  if (fs.existsSync(appIconPath)) {
    console.log(`✅ App icon exists at: ${appIconPath}`);
  } else {
    console.warn(`⚠️ App icon not found at: ${appIconPath}`);
  }
  
  createWindow(); // Create the main window first
  checkFullDiskAccess(); // Ensure required permissions
  ensureFullPermissions();
  createTray(); // Create system tray menu
});

function createTray() {
  // Use a template image on macOS for dynamic dark/light mode
  // or just a normal .png/.ico
  const iconPath = path.join(__dirname, 'assets/icons8-drawboard-doodle', 'icons8-drawboard-16.png');
  const trayIcon = nativeImage.createFromPath(iconPath);

  tray = new Tray(trayIcon);
  tray.setToolTip('Tafil');

  // Build an initial context menu
  const contextMenu = Menu.buildFromTemplate([
    { label: 'No running projects yet', enabled: false }
  ]);
  tray.setContextMenu(contextMenu);

  // If you want a click event on the tray icon
  tray.on('click', () => {
    // Possibly show/hide the main window or do something else
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
}

function updateTrayMenu(runningProjectsMap) {
  if (!tray) return;

  const runningPaths = Array.from(runningProjectsMap.keys());
  if (runningPaths.length === 0) {
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'No running projects', enabled: false }
    ]));
    return;
  }

  // Build menu dynamically
  const trayItems = runningPaths.map((projPath) => {
    return {
      label: path.basename(projPath),
      submenu: [
        {
          label: 'Open in Browser',
          click: () => mainWindow?.webContents.send('tray-open-browser', projPath)
        },
        {
          label: 'Open in Editor',
          click: () => mainWindow?.webContents.send('tray-open-editor', projPath)
        },
        {
          label: 'Show in Electron App',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
              mainWindow.webContents.send('focus-project', projPath);
            }
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Stop Project',
          click: () => mainWindow?.webContents.send('tray-stop-project', projPath)
        }
      ]
    };
  });

  trayItems.push({ type: 'separator' });
  trayItems.push({
    label: 'Quit App',
    click: () => app.quit()
  });

  tray.setContextMenu(Menu.buildFromTemplate(trayItems));
}

// You can call updateTrayMenu(runningProcesses) whenever a project starts or stops

function createWindow() {
  // Set app icon based on platform
  let iconPath;
  if (isMac) {
    // Try .icns first for better quality, fallback to .png
    const icnsPath = path.join(__dirname, 'build', 'icon.icns');
    const pngPath = path.join(__dirname, 'build', 'icon.png');
    iconPath = fs.existsSync(icnsPath) ? icnsPath : pngPath;
  } else if (isWindows) {
    iconPath = path.join(__dirname, 'build', 'icon.ico');
  } else {
    iconPath = path.join(__dirname, 'build', 'icon.png');
  }
  
  console.log(`Using app icon: ${iconPath}`);
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Tafil',
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });


  // const indexPath = isDev 
  // ? path.join(__dirname, 'index.html')
  // : path.join(app.getAppPath(), 'index.html');
  mainWindow.loadFile(
    isDev ? path.join(__dirname, 'index.html') : path.join(app.getAppPath(), 'index.html')
  );

  // NOTE: CSP is defined in `index.html` via a meta tag.
  // Avoid injecting CSP headers here; doing both can cause mismatched policies and break Monaco/Workers in production.

  mainWindow.on('closed', () => {
    // Kill all child processes on window close
    for (const [projectPath, info] of runningProcesses.entries()) {
      // IMPORTANT: map stores objects: { process: ChildProcess, port, ... }
      const child = info?.process || info;
      const pid = child?.pid;
      if (!pid) continue;

      try {
        if (isWindows) {
          exec(`taskkill /F /T /PID ${pid}`, (error) => {
            if (error) console.warn(`Windows taskkill error (close cleanup): ${error.message}`);
          });
        } else {
          psTree(pid, (err, children) => {
            if (!err && Array.isArray(children)) {
              children.forEach((c) => {
                try { process.kill(parseInt(c.PID, 10), 'SIGTERM'); } catch {}
              });
            }
            try { process.kill(parseInt(pid, 10), 'SIGTERM'); } catch {}
          });
        }
      } catch (err) {
        console.error(`Error killing process for ${projectPath}:`, err);
      }
    }
    runningProcesses.clear();
    mainWindow = null;
  });
}


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// -------------------------------------------------
// Licensing IPC Handlers
// -------------------------------------------------

// Get license status (OFFLINE - no network call)
ipcMain.handle('license-get-status', async () => {
  try {
    return licensing.getLicenseStatus();
  } catch (e) {
    console.error('Error getting license status:', e);
    return { status: 'error', message: e.message, needsActivation: true };
  }
});

// Get device ID for display
ipcMain.handle('license-get-device-id', async () => {
  try {
    return {
      deviceId: licensing.getDeviceId(),
      shortId: licensing.getShortDeviceId(),
    };
  } catch (e) {
    console.error('Error getting device ID:', e);
    return { deviceId: 'unknown', shortId: 'UNKNOWN' };
  }
});

// Activate license (requires network)
ipcMain.handle('license-activate', async (_event, { licenseKey, email }) => {
  try {
    console.log('Activating license:', licenseKey, 'for', email);
    const result = await licensing.activateLicense(licenseKey, email);
    
    if (result.success) {
      console.log('License activated successfully');
    } else {
      console.error('License activation failed:', result.error);
    }
    
    return result;
  } catch (e) {
    console.error('Error activating license:', e);
    return { success: false, error: e.message };
  }
});

// Deactivate license (requires network)
ipcMain.handle('license-deactivate', async (_event, { licenseKey, email }) => {
  try {
    console.log('Deactivating license:', licenseKey);
    const result = await licensing.deactivateLicense(licenseKey, email);
    return result;
  } catch (e) {
    console.error('Error deactivating license:', e);
    return { success: false, error: e.message };
  }
});

// Check if specific action is allowed (OFFLINE)
ipcMain.handle('license-check-action', async (_event, actionName) => {
  try {
    return licensing.guardAction(actionName);
  } catch (e) {
    return { allowed: false, reason: e.message };
  }
});

// Get license info (OFFLINE)
ipcMain.handle('license-get-info', async () => {
  try {
    return licensing.getLicenseInfo();
  } catch (e) {
    return null;
  }
});

// Check server connectivity
ipcMain.handle('license-check-server', async () => {
  try {
    return await licensing.checkServerConnection();
  } catch (e) {
    return { connected: false, error: e.message };
  }
});

// -------------------------------------------------
// Feature Limits IPC Handlers (Free vs Pro)
// -------------------------------------------------

ipcMain.handle('limits:getCurrentTier', async () => {
  try {
    return licensing.featureLimits.getCurrentTier();
  } catch (e) {
    return 'free';
  }
});

ipcMain.handle('limits:isPro', async () => {
  try {
    return licensing.featureLimits.isPro();
  } catch (e) {
    return false;
  }
});

ipcMain.handle('limits:canCreateProject', async (_event, count) => {
  try {
    return licensing.featureLimits.canCreateProject(count);
  } catch (e) {
    return { allowed: true }; // Fail open
  }
});

ipcMain.handle('limits:canSaveSnippet', async (_event, count) => {
  try {
    return licensing.featureLimits.canSaveSnippet(count);
  } catch (e) {
    return { allowed: true }; // Fail open
  }
});

ipcMain.handle('limits:getProjectLimitInfo', async (_event, count) => {
  try {
    return licensing.featureLimits.getProjectLimitInfo(count);
  } catch (e) {
    return { tier: 'free', limit: 3, current: count, remaining: 3 - count };
  }
});

ipcMain.handle('limits:getSnippetLimitInfo', async (_event, count) => {
  try {
    return licensing.featureLimits.getSnippetLimitInfo(count);
  } catch (e) {
    return { tier: 'free', limit: 10, current: count, remaining: 10 - count };
  }
});

ipcMain.handle('limits:getHistoryLimitInfo', async () => {
  try {
    return licensing.featureLimits.getHistoryLimitInfo();
  } catch (e) {
    return { tier: 'free', days: '7 days', isLimited: true };
  }
});

ipcMain.handle('limits:isLanguageAvailable', async (_event, lang) => {
  try {
    return licensing.featureLimits.isLanguageAvailable(lang);
  } catch (e) {
    return { allowed: true }; // Fail open
  }
});

ipcMain.handle('limits:getAvailableLanguages', async () => {
  try {
    return licensing.featureLimits.getAvailableLanguages();
  } catch (e) {
    return { languages: ['javascript', 'python', 'shell'], isLimited: true };
  }
});

ipcMain.handle('limits:canExport', async (_event, format) => {
  try {
    return licensing.featureLimits.canExport(format);
  } catch (e) {
    return { allowed: format === 'clipboard' }; // Always allow clipboard
  }
});

ipcMain.handle('limits:getAvailableExports', async () => {
  try {
    return licensing.featureLimits.getAvailableExports();
  } catch (e) {
    return { tier: 'free', formats: ['clipboard'], isLimited: true };
  }
});

ipcMain.handle('limits:getFeatureSummary', async () => {
  try {
    return licensing.featureLimits.getFeatureSummary();
  } catch (e) {
    return { tier: 'free', isPro: false };
  }
});

ipcMain.handle('limits:getUpgradeMessage', async (_event, type, params) => {
  try {
    return licensing.featureLimits.getUpgradeMessage(type, params);
  } catch (e) {
    return { title: 'Upgrade to Pro', message: 'Unlock all features.' };
  }
});

// -------------------------------------------------
// IPC Handlers
// -------------------------------------------------

// 1) Scan all Node.js projects in the home dir
ipcMain.handle('scan-all-projects', async (_event, customPaths = null) => {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    
    // Comprehensive list of directories to scan
    const defaultScanDirs = [
      // User home directory
      homeDir,
      
      // Common project locations
      path.join(homeDir, 'Desktop'),
      path.join(homeDir, 'Documents'),
      path.join(homeDir, 'Downloads'),
      path.join(homeDir, 'Developer'),        // macOS Xcode default
      path.join(homeDir, 'Projects'),
      path.join(homeDir, 'projects'),
      path.join(homeDir, 'Code'),
      path.join(homeDir, 'code'),
      path.join(homeDir, 'repos'),
      path.join(homeDir, 'Repos'),
      path.join(homeDir, 'workspace'),
      path.join(homeDir, 'Workspace'),
      path.join(homeDir, 'dev'),
      path.join(homeDir, 'Dev'),
      path.join(homeDir, 'src'),
      path.join(homeDir, 'Sites'),           // macOS Sites folder
      path.join(homeDir, 'www'),
      
      // System-level common locations
      '/var/www',                            // Linux web server
      '/var/www/html',
      '/opt/projects',
      '/private/var/root/Downloads',         // Root downloads (if accessible)
      '/root/Downloads',                     // Linux root downloads
      '/root/projects',
      
      // Windows common locations (cross-platform safety)
      'C:\\Users\\Public\\Projects',
      'C:\\Projects',
      'C:\\dev',
    ];
    
    // Combine default paths with custom paths from renderer
    const customPathsList = Array.isArray(customPaths) 
      ? customPaths.filter(p => typeof p === 'string' && p.trim().length > 0)
      : [];
    
    // Merge all paths and remove duplicates
    const allPaths = [...new Set([...defaultScanDirs, ...customPathsList])];
    
    console.log(`🔍 Scanning ${allPaths.length} locations for Node.js projects...`);

    const allProjects = [];
    let scannedCount = 0;
    let projectsFound = 0;
    
    for (const p of allPaths) {
      try {
        const normalized = path.normalize(p);
        
        // Skip if doesn't exist or not accessible
        if (!fs.existsSync(normalized)) continue;
        
        const stat = fs.statSync(normalized);
        if (!stat.isDirectory()) continue;
        
        scannedCount++;
        const projects = await scanNodeProjects(normalized);
        
        if (Array.isArray(projects) && projects.length > 0) {
          projectsFound += projects.length;
          allProjects.push(...projects);
          console.log(`  ✓ Found ${projects.length} projects in: ${normalized}`);
        }
      } catch (e) {
        // Silently skip permission denied and other errors
        if (e.code !== 'EACCES' && e.code !== 'EPERM') {
          console.warn(`scan-all-projects: failed scanning ${p}:`, e?.message || e);
        }
      }
    }
    
    console.log(`📊 Scanned ${scannedCount} directories, found ${projectsFound} total projects`);

    // De-dupe by path (renderer expects unique project paths)
    const byPath = new Map();
    for (const proj of allProjects) {
      const projPath = proj?.path;
      if (typeof projPath !== 'string') continue;
      byPath.set(projPath, proj);
    }

    const projects = Array.from(byPath.values());
    console.log(`📋 After de-duplication: ${projects.length} unique projects`);
    
    projects.sort((a, b) => b.timestamp - a.timestamp);
    return projects;
  } catch (err) {
    console.error('Error scanning Node.js projects:', err);
    throw err;
  }
});

// 1b) Scan custom folder
ipcMain.handle('scan-custom-folder', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Folder to Scan for Node.js Projects'
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return null; // User cancelled
    }

    const selectedPath = result.filePaths[0];
    console.log(`Scanning custom folder: ${selectedPath}`);
    
    const projects = await scanNodeProjects(selectedPath);
    projects.sort((a, b) => b.timestamp - a.timestamp);
    
    // Return both the path and projects so renderer can save the path
    return {
      scannedPath: selectedPath,
      projects: projects,
    };
  } catch (err) {
    console.error('Error scanning custom folder:', err);
    throw err;
  }
});

// -------------------------------------------------
// Project Creation IPC Handlers
// -------------------------------------------------

// Get available project templates
ipcMain.handle('get-project-templates', async () => {
  try {
    return getTemplates();
  } catch (err) {
    console.error('Error getting templates:', err);
    return {};
  }
});

// Get template library (pre-configured templates)
ipcMain.handle('get-template-library', async () => {
  try {
    return getTemplateLibrary();
  } catch (err) {
    console.error('Error getting template library:', err);
    return {};
  }
});

// Validate project name
ipcMain.handle('validate-project-name', async (_event, name) => {
  try {
    return validateProjectName(name);
  } catch (err) {
    console.error('Error validating project name:', err);
    return { valid: false, errors: [err.message], sanitized: null };
  }
});

// Select directory for new project
ipcMain.handle('select-project-directory', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'createDirectory'],
      title: 'Select Location for New Project',
      buttonLabel: 'Select Folder',
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  } catch (err) {
    console.error('Error selecting directory:', err);
    throw err;
  }
});

// Create new project
ipcMain.handle('create-project', async (_event, options) => {
  try {
    console.log('Creating project with options:', options);
    
    // Warn if running as root
    const isRunningAsRoot = process.getuid && process.getuid() === 0;
    if (isRunningAsRoot) {
      console.warn('⚠️ Creating project as root - files will be owned by root!');
    }
    
    const result = await createProject({
      ...options,
      onProgress: (progress) => {
        // Send progress updates to renderer
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('project-creation-progress', progress);
        }
      },
    });
    
    if (result.success) {
      console.log(`✅ Project created: ${result.projectPath}`);
      
      // Immediately scan the new project to add it to the dashboard
      try {
        const projects = await scanNodeProjects(result.projectPath);
        if (projects && projects.length > 0) {
          return {
            ...result,
            project: projects[0], // Return the scanned project data
          };
        }
      } catch (scanErr) {
        console.warn('Could not scan new project:', scanErr);
      }
    }
    
    return result;
  } catch (err) {
    console.error('Error creating project:', err);
    return {
      success: false,
      error: err.message || 'Unknown error occurred',
      phase: 'unknown',
    };
  }
});

// 1b) Get installed IDEs
ipcMain.handle('get-installed-ides', async () => {
  try {
    const ides = await detectInstalledIDEs();
    console.log(`Detected ${ides.length} installed IDEs:`, ides.map(i => i.name).join(', '));
    return ides;
  } catch (err) {
    console.error('Error detecting IDEs:', err);
    return [];
  }
});

// 1c) Get installed Terminals
ipcMain.handle('get-installed-terminals', async () => {
  try {
    const terminals = await detectInstalledTerminals();
    console.log(`Detected ${terminals.length} installed Terminals:`, terminals.map(t => t.name).join(', '));
    return terminals;
  } catch (err) {
    console.error('Error detecting Terminals:', err);
    return [];
  }
});

// 1d) Execute JavaScript in sandbox (Playground) - WITH INLINE EVALUATION
// ========================================
// Playground Execution Engine v2.0
// RunJS/Quokka-style instant evaluation
// ========================================

// Expression cache for incremental evaluation
const playgroundCache = {
  lastCode: '',
  lastExpressions: new Map(), // expressionId -> { code, result, line, col }
  context: null,
};

// Helper to format values for inline display
function formatPlaygroundValue(val, maxLen = 80) {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'function') {
    const name = val.name || 'anonymous';
    return `ƒ ${name}()`;
  }
  if (typeof val === 'symbol') return val.toString();
  if (val instanceof Error) return `Error: ${val.message}`;
  if (val instanceof Date) return val.toISOString();
  if (val instanceof RegExp) return val.toString();
  if (val instanceof Map) return `Map(${val.size})`;
  if (val instanceof Set) return `Set(${val.size})`;
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    if (val.length <= 5) {
      const items = val.map(v => formatPlaygroundValue(v, 20)).join(', ');
      return items.length > maxLen ? `Array(${val.length})` : `[${items}]`;
    }
    return `Array(${val.length})`;
  }
  if (typeof val === 'object') {
    try {
      const keys = Object.keys(val);
      if (keys.length === 0) return '{}';
      if (keys.length <= 3) {
        const pairs = keys.map(k => `${k}: ${formatPlaygroundValue(val[k], 15)}`).join(', ');
        return pairs.length > maxLen ? `{${keys.length} keys}` : `{${pairs}}`;
      }
      return `{${keys.length} keys}`;
    } catch {
      return String(val);
    }
  }
  if (typeof val === 'string') {
    if (val.length > maxLen) return `"${val.slice(0, maxLen - 3)}..."`;
    return `"${val}"`;
  }
  return String(val);
}

// Simple expression extractor (line-based with smarter detection)
function extractExpressions(code) {
  const expressions = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }
    
    // Magic comment: //?  - Force capture this expression
    if (line.includes('//?')) {
      const expr = line.split('//?')[0].trim();
      if (expr) {
        expressions.push({
          id: `magic-${lineNum}`,
          line: lineNum,
          col: line.length,
          expr: expr,
          type: 'magic',
        });
      }
      return;
    }
    
    // Skip control structures and blocks
    const skipPatterns = [
      /^(if|else|for|while|do|switch|case|break|continue|return|throw|try|catch|finally)\b/,
      /^(function|class|const|let|var)\s+\w+/,
      /^(import|export)\b/,
      /^[\{\}\(\)\[\];,]+$/,
      /\{[\s]*$/,  // ends with {
      /^[\}\)\]]+[;\s]*$/,  // just closing brackets
    ];
    
    if (skipPatterns.some(p => p.test(trimmed))) {
      return;
    }
    
    // Variable declarations with assignment - capture the value
    const varMatch = trimmed.match(/^(const|let|var)\s+(\w+)\s*=\s*(.+?)[;]?$/);
    if (varMatch) {
      expressions.push({
        id: `var-${lineNum}-${varMatch[2]}`,
        line: lineNum,
        col: line.length,
        expr: varMatch[2], // Just capture the variable name after declaration
        varName: varMatch[2],
        type: 'declaration',
      });
      return;
    }
    
    // Assignment expressions
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+?)[;]?$/);
    if (assignMatch && !trimmed.includes('==') && !trimmed.includes('===')) {
      expressions.push({
        id: `assign-${lineNum}-${assignMatch[1]}`,
        line: lineNum,
        col: line.length,
        expr: assignMatch[1],
        type: 'assignment',
      });
      return;
    }
    
    // Standalone expressions (function calls, variables, etc.)
    // Must not be console.log or similar
    if (!trimmed.includes('console.') && !trimmed.endsWith('{') && !trimmed.endsWith(',')) {
      // Remove trailing semicolon for evaluation
      const exprClean = trimmed.replace(/;$/, '').trim();
      if (exprClean && !exprClean.includes('=')) {
        expressions.push({
          id: `expr-${lineNum}`,
          line: lineNum,
          col: line.length,
          expr: exprClean,
          type: 'expression',
        });
      }
    }
  });
  
  return expressions;
}

ipcMain.handle('execute-js', async (_event, code, language = 'javascript') => {
  try {
    // Handle different languages
    if (language === 'python') {
      return await runPythonCode(code);
    }
    
    let jsCode = code;
    
    // TypeScript: Transpile to JavaScript
    if (language === 'typescript') {
      try {
        jsCode = await transpileTypeScript(code);
      } catch (tsErr) {
        return {
          success: false,
          error: `TypeScript Error: ${tsErr.message}`,
          logs: [],
          inlineResults: [],
          errors: [{ line: 1, message: tsErr.message, type: 'TypeScriptError' }],
          executionTime: 0,
        };
      }
    }
    
    // Extract expressions for inline results
    const expressions = extractExpressions(jsCode);
    
    // Build instrumented code with expression capture
    const captureCode = expressions.map(e => 
      `try { __capture("${e.id}", ${e.line}, ${e.expr}); } catch(e) { __captureError("${e.id}", ${e.line}, e.message); }`
    ).join('\n');
    
    const result = await runPlaygroundInWorker(jsCode, captureCode, 2000);
    return result;
  } catch (err) {
    return { 
      success: false, 
      error: err.message, 
      logs: [], 
      inlineResults: [],
      errors: [{ line: 1, message: err.message, type: 'Error' }],
      executionTime: 0,
    };
  }
});

// TypeScript transpilation
async function transpileTypeScript(code) {
  // Use esbuild for fast TypeScript transpilation
  const esbuild = require('esbuild');
  
  const result = await esbuild.transform(code, {
    loader: 'ts',
    target: 'es2020',
    format: 'cjs',
  });
  
  return result.code;
}

// Python execution with inline results
async function runPythonCode(code) {
  const { spawn } = require('child_process');
  const startTime = Date.now();
  
  // Instrument Python code to capture inline results
  const instrumentedCode = instrumentPythonCode(code);
  
  return new Promise((resolve) => {
    const logs = [];
    const inlineResults = [];
    let stdout = '';
    let stderr = '';
    
    // Try python3 first, then python
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    const pythonProcess = spawn(pythonCmd, ['-u', '-c', instrumentedCode], {
      timeout: 5000,
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
    });
    
    pythonProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(l => l.trim());
      lines.forEach(line => {
        stdout += line + '\n';
        
        // Check for inline result marker
        const inlineMatch = line.match(/^__INLINE__:(\d+):(.*)$/);
        if (inlineMatch) {
          inlineResults.push({
            id: `py-${inlineMatch[1]}`,
            line: parseInt(inlineMatch[1]),
            value: inlineMatch[2],
            type: 'value',
          });
        } else {
          logs.push({ type: 'log', message: line });
        }
      });
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (exitCode) => {
      const executionTime = Date.now() - startTime;
      
      if (exitCode !== 0 || stderr) {
        // Parse Python error for line number
        const lineMatch = stderr.match(/line (\d+)/i);
        const errorLine = lineMatch ? parseInt(lineMatch[1]) : 1;
        
        resolve({
          success: false,
          error: stderr.trim() || `Process exited with code ${exitCode}`,
          errorLine,
          logs,
          inlineResults,
          errors: [{ line: errorLine, message: stderr.trim(), type: 'PythonError' }],
          executionTime,
        });
      } else {
        resolve({
          success: true,
          logs,
          inlineResults,
          errors: [],
          executionTime,
        });
      }
    });
    
    pythonProcess.on('error', (err) => {
      resolve({
        success: false,
        error: `Python not found. Please install Python and add it to PATH.\n${err.message}`,
        logs: [],
        inlineResults: [],
        errors: [{ line: 1, message: err.message, type: 'PythonError' }],
        executionTime: Date.now() - startTime,
      });
    });
    
    // Timeout after 5 seconds
    setTimeout(() => {
      pythonProcess.kill();
      resolve({
        success: false,
        error: 'Execution timed out (5s)',
        logs,
        inlineResults,
        errors: [{ line: 1, message: 'Timeout', type: 'TimeoutError' }],
        executionTime: 5000,
      });
    }, 5000);
  });
}

// Instrument Python code to capture expression values
function instrumentPythonCode(code) {
  const lines = code.split('\n');
  const instrumentedLines = [];
  
  // Add helper function
  instrumentedLines.push(`
def __capture__(line, val):
    print(f"__INLINE__:{line}:{repr(val)}")
    return val
`);
  
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();
    const indent = line.match(/^(\s*)/)[1];
    
    // Skip empty lines, comments, imports, function/class defs, control structures
    if (!trimmed || 
        trimmed.startsWith('#') || 
        trimmed.startsWith('import ') || 
        trimmed.startsWith('from ') ||
        trimmed.startsWith('def ') || 
        trimmed.startsWith('class ') ||
        trimmed.startsWith('if ') || 
        trimmed.startsWith('elif ') ||
        trimmed.startsWith('else:') ||
        trimmed.startsWith('for ') || 
        trimmed.startsWith('while ') ||
        trimmed.startsWith('try:') ||
        trimmed.startsWith('except') ||
        trimmed.startsWith('finally:') ||
        trimmed.startsWith('with ') ||
        trimmed.startsWith('return ') ||
        trimmed.startsWith('raise ') ||
        trimmed.startsWith('pass') ||
        trimmed.startsWith('break') ||
        trimmed.startsWith('continue') ||
        trimmed.endsWith(':') ||
        trimmed.startsWith('@')) {
      instrumentedLines.push(line);
      return;
    }
    
    // Variable assignment: capture the value
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch && !trimmed.includes('==')) {
      const varName = assignMatch[1];
      instrumentedLines.push(line);
      instrumentedLines.push(`${indent}__capture__(${lineNum}, ${varName})`);
      return;
    }
    
    // print() statement: just pass through (already outputs)
    if (trimmed.startsWith('print(')) {
      instrumentedLines.push(line);
      return;
    }
    
    // Standalone expression: wrap to capture and display
    if (!trimmed.includes('=') || trimmed.includes('==') || trimmed.includes('!=')) {
      instrumentedLines.push(`${indent}__capture__(${lineNum}, ${trimmed})`);
      return;
    }
    
    instrumentedLines.push(line);
  });
  
  return instrumentedLines.join('\n');
}

async function runPlaygroundInWorker(code, captureCode, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const worker = new Worker(`
      const { parentPort } = require('worker_threads');
      const vm = require('vm');

      function formatPlaygroundValue(val, maxLen = 80) {
        if (val === null) return 'null';
        if (val === undefined) return 'undefined';
        if (typeof val === 'function') {
          const name = val.name || 'anonymous';
          return \`ƒ \${name}()\`;
        }
        if (typeof val === 'symbol') return val.toString();
        if (val instanceof Error) return \`Error: \${val.message}\`;
        if (val instanceof Date) return val.toISOString();
        if (val instanceof RegExp) return val.toString();
        if (val instanceof Map) return \`Map(\${val.size})\`;
        if (val instanceof Set) return \`Set(\${val.size})\`;
        if (Array.isArray(val)) {
          if (val.length === 0) return '[]';
          if (val.length <= 5) {
            const items = val.map(v => formatPlaygroundValue(v, 20)).join(', ');
            return items.length > maxLen ? \`Array(\${val.length})\` : \`[\${items}]\`;
          }
          return \`Array(\${val.length})\`;
        }
        if (typeof val === 'object') {
          try {
            const keys = Object.keys(val);
            if (keys.length === 0) return '{}';
            if (keys.length <= 3) {
              const pairs = keys.map(k => \`\${k}: \${formatPlaygroundValue(val[k], 15)}\`).join(', ');
              return pairs.length > maxLen ? \`{\${keys.length} keys}\` : \`{\${pairs}}\`;
            }
            return \`{\${keys.length} keys}\`;
          } catch {
            return String(val);
          }
        }
        if (typeof val === 'string') {
          if (val.length > maxLen) return \`"\${val.slice(0, maxLen - 3)}..."\`;
          return \`"\${val}"\`;
        }
        return String(val);
      }

      parentPort.on('message', async ({ code, captureCode, timeoutMs }) => {
        const startTime = Date.now();
        const logs = [];
        const inlineResults = [];
        const errors = [];
        const capturedValues = new Map();
        const capturedErrors = new Map();
        const valueHistory = new Map(); // Time Travel: Track all values
        let logLineCounter = 1;

        const customConsole = {
          log: (...args) => logs.push({ type: 'log', message: args.map(a => formatPlaygroundValue(a)).join(' '), line: logLineCounter++ }),
          error: (...args) => logs.push({ type: 'error', message: args.map(a => formatPlaygroundValue(a)).join(' '), line: logLineCounter++ }),
          warn: (...args) => logs.push({ type: 'warn', message: args.map(a => formatPlaygroundValue(a)).join(' '), line: logLineCounter++ }),
          info: (...args) => logs.push({ type: 'info', message: args.map(a => formatPlaygroundValue(a)).join(' '), line: logLineCounter++ }),
          dir: (obj) => logs.push({ type: 'log', message: formatPlaygroundValue(obj), rawValue: obj, line: logLineCounter++ }),
          table: (data) => logs.push({ type: 'log', message: formatPlaygroundValue(data), rawValue: data, line: logLineCounter++ }),
          clear: () => logs.length = 0,
          time: () => {},
          timeEnd: () => {},
          trace: () => {},
          assert: () => {},
          count: () => {},
          group: () => {},
          groupEnd: () => {},
        };

        const wrappedCode = \`
          (async () => {
            const console = __console;
            \${code}
            \${captureCode}
          })()
        \`;

        const context = vm.createContext({
          __console: customConsole,
          __capture: (id, line, value) => {
            const formatted = formatPlaygroundValue(value);
            // Time Travel: Accumulate history
            if (!valueHistory.has(id)) {
              valueHistory.set(id, []);
            }
            valueHistory.get(id).push(formatted);
            capturedValues.set(id, { line, value: formatted });
          },
          __captureError: (id, line, msg) => {
            capturedErrors.set(id, { line, error: msg });
          },
          setTimeout, setInterval, clearTimeout, clearInterval,
          Promise, JSON, Math, Date, Array, Object, String, Number, Boolean,
          RegExp, Error, Map, Set, WeakMap, WeakSet, Buffer,
          Infinity, NaN, undefined, null: null,
          parseInt, parseFloat, isNaN, isFinite, encodeURI, decodeURI,
          encodeURIComponent, decodeURIComponent,
          require: (mod) => { throw new Error("Module '" + mod + "' not allowed"); },
          fetch: global.fetch,
        });

        try {
          const script = new vm.Script(wrappedCode, { timeout: timeoutMs, filename: 'playground.js' });
          const result = script.runInContext(context, { timeout: timeoutMs });
          if (result && typeof result.then === 'function') {
            await Promise.race([
              result,
              new Promise((_, reject) => setTimeout(() => reject(new Error('Execution timeout')), timeoutMs))
            ]);
          }
        } catch (execError) {
          const lineMatch = execError.stack && execError.stack.match(/:(\\d+):/);
          const errorLine = lineMatch ? parseInt(lineMatch[1]) : 1;
          errors.push({
            line: errorLine,
            message: execError.message,
            type: execError.name || 'Error',
          });
        }

        capturedValues.forEach((data, id) => {
          const history = valueHistory.get(id) || [];
          inlineResults.push({ 
            id, 
            line: data.line, 
            value: data.value, 
            type: 'value',
            history: history.length > 1 ? history : null // Only include if multiple values
          });
        });
        capturedErrors.forEach((data, id) => {
          inlineResults.push({ id, line: data.line, value: \`\${data.error}\`, type: 'error' });
        });
        inlineResults.sort((a, b) => a.line - b.line);

        const cappedLogs = logs.slice(0, 200);

        parentPort.postMessage({
          success: errors.length === 0,
          logs: cappedLogs,
          inlineResults,
          errors,
          executionTime: Date.now() - startTime,
        });
      });
    `, { eval: true });

    const hardTimeout = setTimeout(() => {
      worker.terminate();
      resolve({ success: false, error: 'Execution timed out', logs: [], inlineResults: [], errors: [{ message: 'Execution timed out' }] });
    }, timeoutMs + 750);

    worker.on('message', (msg) => {
      clearTimeout(hardTimeout);
      worker.terminate();
      resolve(msg);
    });

    worker.on('error', (err) => {
      clearTimeout(hardTimeout);
      worker.terminate();
      resolve({ success: false, error: err.message, logs: [], inlineResults: [], errors: [{ message: err.message }] });
    });

    worker.postMessage({ code, captureCode, timeoutMs });
  });
}

// SSH Module IPC Handlers
ipcMain.handle('select-ssh-key-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select SSH Key File',
      filters: [
        { name: 'SSH Keys', extensions: ['pem', 'ppk', 'key'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });
    
    if (result.canceled || result.filePaths.length === 0) {
      return { success: false };
    }
    
    return { success: true, filePath: result.filePaths[0] };
  } catch (err) {
    console.error('Error selecting SSH key file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('save-ssh-host', async (_event, host) => {
  try {
    // Validate host data
    if (!host.hostname || !host.username) {
      return { success: false, error: 'Hostname and username are required' };
    }
    
    // TODO: Encrypt password before storing
    // For now, just save to a secure location
    const userDataPath = app.getPath('userData');
    const sshHostsPath = path.join(userDataPath, 'ssh-hosts.json');
    
    let hosts = [];
    if (fs.existsSync(sshHostsPath)) {
      try {
        hosts = JSON.parse(fs.readFileSync(sshHostsPath, 'utf8'));
      } catch (err) {
        console.error('Error reading SSH hosts file:', err);
      }
    }
    
    // Update or add host
    const existingIndex = hosts.findIndex(h => h.id === host.id);
    if (existingIndex >= 0) {
      hosts[existingIndex] = host;
    } else {
      hosts.push(host);
    }
    
    // Write back
    fs.writeFileSync(sshHostsPath, JSON.stringify(hosts, null, 2), 'utf8');
    
    return { success: true };
  } catch (err) {
    console.error('Error saving SSH host:', err);
    return { success: false, error: err.message };
  }
});

// SSH Sessions tracking
const sshSessions = new Map();

ipcMain.handle('connect-ssh-host', async (_event, host) => {
  try {
    console.log('Connecting to SSH host:', host.hostname);
    console.log('Host config:', {
      hostname: host.hostname,
      port: host.port,
      username: host.username,
      authMethod: host.authMethod,
      hasKeyPath: !!host.keyPath,
      hasTunnel: !!host.tunnel
    });
    
    const sessionId = `ssh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const conn = new Client();
    
    // Prepare connection config
    const config = {
      host: host.hostname,
      port: host.port || 22,
      username: host.username,
      readyTimeout: 20000,
    };
    
    // Add authentication
    if (host.authMethod === 'key' && host.keyPath) {
      try {
        // Handle key paths with spaces - they might be quoted in the original command
        const keyPath = host.keyPath.trim().replace(/^["']|["']$/g, '');
        if (!fs.existsSync(keyPath)) {
          return { success: false, error: `SSH key file not found: ${keyPath}` };
        }
        const keyData = fs.readFileSync(keyPath, 'utf8');
        config.privateKey = keyData;
        // Try to detect if it's a passphrase-protected key
        if (keyData.includes('ENCRYPTED')) {
          // TODO: Prompt for passphrase
          console.warn('Encrypted key detected - passphrase support coming soon');
        }
      } catch (keyErr) {
        const errorMsg = keyErr.message || keyErr.toString() || 'Failed to read key file';
        return { success: false, error: `Failed to read key file: ${errorMsg}` };
      }
    } else if (host.authMethod === 'password' && host.password) {
      config.password = host.password;
    } else {
      return { success: false, error: 'No authentication method provided' };
    }
    
    try {
      return await new Promise((resolve, reject) => {
        let tunnelServer = null;
        
        conn.on('ready', () => {
        console.log('SSH connection established:', host.hostname);
        
        // Set up port forwarding if configured
        if (host.tunnel && host.tunnel.localPort && host.tunnel.remoteHost && host.tunnel.remotePort) {
          try {
            // Create local server that forwards to remote host
            tunnelServer = net.createServer((localConn) => {
              conn.forwardOut(
                localConn.remoteAddress,
                localConn.remotePort,
                host.tunnel.remoteHost,
                host.tunnel.remotePort,
                (err, remoteConn) => {
                  if (err) {
                    console.error('SSH tunnel forward error:', err);
                    localConn.end();
                    return;
                  }
                  
                  localConn.pipe(remoteConn).pipe(localConn);
                }
              );
            });

            tunnelServer.listen(host.tunnel.localPort, '127.0.0.1', () => {
              console.log(`SSH tunnel established: localhost:${host.tunnel.localPort} -> ${host.tunnel.remoteHost}:${host.tunnel.remotePort}`);
              if (mainWindow && mainWindow.webContents) {
                mainWindow.webContents.send('ssh-tunnel-established', {
                  sessionId,
                  localPort: host.tunnel.localPort,
                  remoteHost: host.tunnel.remoteHost,
                  remotePort: host.tunnel.remotePort
                });
              }
            });

            tunnelServer.on('error', (err) => {
              console.error('SSH tunnel server error:', err);
              if (err.code === 'EADDRINUSE') {
                console.warn(`Port ${host.tunnel.localPort} is already in use`);
                // Don't reject the connection if tunnel port is in use, just warn
              } else {
                console.error('Tunnel server error:', err.message);
              }
            });
          } catch (tunnelErr) {
            console.error('Error setting up SSH tunnel:', tunnelErr);
            // Don't fail the connection if tunnel setup fails, just log it
          }
        }
        
        // Create shell session
        conn.shell((err, stream) => {
          if (err) {
            if (tunnelServer) {
              try {
                tunnelServer.close();
              } catch (closeErr) {
                console.error('Error closing tunnel server:', closeErr);
              }
            }
            conn.end();
            const errorMsg = err.message || err.toString() || 'Failed to create shell';
            return reject({ success: false, error: errorMsg });
          }
          
          // Store session
          sshSessions.set(sessionId, {
            id: sessionId,
            hostId: host.id,
            host: host,
            connection: conn,
            stream: stream,
            tunnelServer: tunnelServer
          });
          
          // Handle stream data
          stream.on('data', (data) => {
            if (mainWindow && mainWindow.webContents) {
              mainWindow.webContents.send('ssh-data', {
                sessionId,
                type: 'stdout',
                data: data.toString()
              });
            }
          });
          
          stream.stderr.on('data', (data) => {
            if (mainWindow && mainWindow.webContents) {
              mainWindow.webContents.send('ssh-data', {
                sessionId,
                type: 'stderr',
                data: data.toString()
              });
            }
          });
          
          stream.on('close', () => {
            console.log('SSH stream closed:', sessionId);
            const session = sshSessions.get(sessionId);
            if (session && session.tunnelServer) {
              session.tunnelServer.close();
            }
            sshSessions.delete(sessionId);
            if (mainWindow && mainWindow.webContents) {
              mainWindow.webContents.send('ssh-data', {
                sessionId,
                type: 'close',
                data: '\n\rConnection closed.\r\n'
              });
            }
          });
          
          resolve({ success: true, sessionId });
        });
      });
      
        conn.on('error', (err) => {
          console.error('SSH connection error:', err);
          if (tunnelServer) {
            try {
              tunnelServer.close();
            } catch (closeErr) {
              console.error('Error closing tunnel server on connection error:', closeErr);
            }
          }
          const errorMessage = err.message || err.toString() || 'Unknown SSH connection error';
          reject({ success: false, error: errorMessage });
        });
        
        // Handle connection timeout
        conn.on('timeout', () => {
          console.error('SSH connection timeout');
          if (tunnelServer) {
            try {
              tunnelServer.close();
            } catch (closeErr) {
              console.error('Error closing tunnel server on timeout:', closeErr);
            }
          }
          reject({ success: false, error: 'Connection timeout - server did not respond' });
        });
        
        conn.connect(config);
      });
    } catch (promiseErr) {
      console.error('Error in SSH connection promise:', promiseErr);
      const errorMsg = promiseErr && promiseErr.error ? promiseErr.error : (promiseErr.message || promiseErr.toString() || 'Unknown error');
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    console.error('Error connecting to SSH host:', err);
    const errorMessage = err.message || err.toString() || 'Unknown error';
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('disconnect-ssh', async (_event, sessionId) => {
  try {
    const session = sshSessions.get(sessionId);
    if (session) {
      // Close tunnel server if exists
      if (session.tunnelServer) {
        session.tunnelServer.close();
        console.log('SSH tunnel closed for session:', sessionId);
      }
      if (session.stream) session.stream.end();
      if (session.connection) session.connection.end();
      sshSessions.delete(sessionId);
      console.log('SSH session disconnected:', sessionId);
      return { success: true };
    }
    return { success: false, error: 'Session not found' };
  } catch (err) {
    console.error('Error disconnecting SSH:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('send-ssh-input', async (_event, sessionId, data) => {
  try {
    const session = sshSessions.get(sessionId);
    if (session && session.stream) {
      session.stream.write(data);
      return { success: true };
    }
    return { success: false, error: 'Session not found or stream not available' };
  } catch (err) {
    console.error('Error sending SSH input:', err);
    return { success: false, error: err.message };
  }
});

// 2) Check process status by pid
ipcMain.handle('check-process-status', async (_event, pid) => {
  try {
    const pidNum = typeof pid === 'number' ? pid : parseInt(String(pid), 10);
    if (!Number.isFinite(pidNum)) return false;
    process.kill(pidNum, 0);
    return true;
  } catch (err) {
    // EPERM means “process exists but we don't have permission”.
    // For Tafils' own child processes this should be rare, but treating EPERM as dead causes false "stopped" states.
    if (err && err.code === 'EPERM') return true;
    return false;
  }
});

// 3) Remove node_modules
ipcMain.handle('remove-node-modules', async (_event, projectPath) => {
  try {
    // Validate project path
    if (!isValidProjectPath(projectPath)) {
      return {
        success: false,
        message: 'Invalid project path provided.',
      };
    }
    
    return await removeNodeModules(projectPath);
  } catch (err) {
    console.error('Error removing node_modules:', err);
    // Return a structured error
    return {
      success: false,
      message: err.message,
    };
  }
});


// Helper to check if we have execution permissions with detailed diagnostics
async function checkExecutePermissions(projectPath) {
  const diagnostics = {
    canAccessDir: false,
    canReadPackageJson: false,
    canAccessNodeModules: true, // Assume true if doesn't exist
    issues: []
  };
  
  try {
    // Check 1: Can we access the project directory?
    try {
      const stats = await fsPromises.stat(projectPath);
      if (!stats.isDirectory()) {
        diagnostics.issues.push('Project path is not a directory');
        return { success: false, diagnostics };
      }
      diagnostics.canAccessDir = true;
    } catch (err) {
      diagnostics.issues.push(`Cannot access project directory: ${err.code || err.message}`);
      return { success: false, diagnostics };
    }
    
    // Check 2: Can we read package.json?
    const packageJsonPath = path.join(projectPath, 'package.json');
    try {
      await fsPromises.access(packageJsonPath, fs.constants.R_OK);
      diagnostics.canReadPackageJson = true;
    } catch (err) {
      diagnostics.issues.push(`Cannot read package.json: ${err.code || err.message}`);
    }
    
    // Check 3: Can we access node_modules (if it exists)?
    const nodeModulesPath = path.join(projectPath, 'node_modules');
    try {
      if (fs.existsSync(nodeModulesPath)) {
        await fsPromises.access(nodeModulesPath, fs.constants.R_OK | fs.constants.X_OK);
        
        // Check .bin directory specifically (common permission issue spot)
        const binPath = path.join(nodeModulesPath, '.bin');
        if (fs.existsSync(binPath)) {
          await fsPromises.access(binPath, fs.constants.R_OK | fs.constants.X_OK);
        }
        diagnostics.canAccessNodeModules = true;
      }
    } catch (err) {
      diagnostics.canAccessNodeModules = false;
      diagnostics.issues.push(`Cannot access node_modules: ${err.code || err.message}`);
    }
    
    // All critical checks passed?
    const success = diagnostics.canAccessDir && diagnostics.canReadPackageJson && diagnostics.canAccessNodeModules;
    
    if (!success) {
      console.warn('Permission check failed:', diagnostics);
    }
    
    return { success, diagnostics };
  } catch (err) {
    console.error('Error checking permissions:', err);
    diagnostics.issues.push(`Unexpected error: ${err.message}`);
    return { success: false, diagnostics };
  }
}

// Helper to fix common permission issues with multiple strategies
async function fixProjectPermissions(projectPath, aggressive = false) {
  if (isWindows) {
    // Windows: Try to reset permissions using icacls
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      // Grant full control to current user
      const username = process.env.USERNAME || process.env.USER;
      if (username) {
        await execAsync(`icacls "${projectPath}" /grant "${username}:F" /T /C /Q`);
        console.log(`✅ Fixed Windows permissions for: ${projectPath}`);
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to fix Windows permissions:', err);
      return { 
        success: false, 
        message: 'Could not fix permissions automatically.',
        manual: `Please run in Command Prompt as Administrator:\nicacls "${projectPath}" /grant "%USERNAME%:F" /T`
      };
    }
    return { success: true };
  }
  
  // macOS/Linux
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  const binPath = path.join(nodeModulesPath, '.bin');
  
  const strategies = [
    {
      name: 'Remove macOS quarantine attributes',
      cmd: `xattr -rd com.apple.quarantine "${projectPath}" 2>/dev/null || true`,
      description: 'Remove quarantine flags that can block execution',
      condition: () => isMac
    },
    {
      name: 'Fix user permissions',
      cmd: `chmod -R u+rwX "${projectPath}"`,
      description: 'Grant read/write/execute to current user'
    },
    {
      name: 'Fix node_modules permissions',
      cmd: `chmod -R 755 "${nodeModulesPath}"`,
      description: 'Fix node_modules with standard permissions',
      condition: () => fs.existsSync(nodeModulesPath)
    },
    {
      name: 'Fix .bin executables',
      cmd: `chmod -R 755 "${binPath}" && find "${binPath}" -type f -exec chmod +x {} \\;`,
      description: 'Make all binaries executable',
      condition: () => fs.existsSync(binPath)
    },
    {
      name: 'Take ownership',
      cmd: `chown -R $(whoami) "${projectPath}"`,
      description: 'Take ownership of project files'
    }
  ];
  
  // Add aggressive strategies if requested
  if (aggressive) {
    strategies.push({
      name: 'Fix npm cache permissions',
      cmd: `chmod -R u+rwX ~/.npm 2>/dev/null || true`,
      description: 'Fix npm cache directory'
    });
  }
  
  const results = [];
  
  for (const strategy of strategies) {
    // Skip if condition function exists and returns false
    if (strategy.condition && !strategy.condition()) {
      continue;
    }
    
    try {
      console.log(`🔧 Trying: ${strategy.name}`);
      await execAsync(strategy.cmd, { timeout: 30000 }); // 30 second timeout
      console.log(`✅ ${strategy.name} succeeded`);
      results.push({ strategy: strategy.name, success: true });
    } catch (err) {
      console.warn(`⚠️ ${strategy.name} failed:`, err.message);
      results.push({ strategy: strategy.name, success: false, error: err.message });
    }
  }
  
  // Check if most strategies succeeded
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  if (successCount > 0) {
    console.log(`✅ Permission fix completed for: ${projectPath} (${successCount}/${totalCount} strategies succeeded)`);
    return { success: true, results, partial: successCount < totalCount };
  } else {
    console.error('All permission fix strategies failed:', results);
    return { 
      success: false, 
      results,
      message: 'Could not fix permissions automatically.',
      manual: `Please run these commands in Terminal:\n\nsudo chmod -R 755 "${projectPath}"\nsudo chown -R $(whoami) "${projectPath}"\n\nOr try deleting node_modules:\nrm -rf "${nodeModulesPath}"\nnpm install`
    };
  }
}

// Aggressive permission fix - deletes node_modules and reinstalls
async function aggressivePermissionFix(projectPath) {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  
  console.log(`🔧 Starting aggressive fix for: ${projectPath}`);
  
  try {
    // Step 1: Try to fix permissions first
    await fixProjectPermissions(projectPath, true);
    
    // Step 2: If node_modules exists, remove it
    if (fs.existsSync(nodeModulesPath)) {
      console.log(`🗑️ Removing node_modules...`);
      
      if (isWindows) {
        await execAsync(`rmdir /s /q "${nodeModulesPath}"`, { timeout: 120000 });
      } else {
        // First try without sudo
        try {
          await execAsync(`rm -rf "${nodeModulesPath}"`, { timeout: 120000 });
        } catch (rmErr) {
          // If that fails, try with sudo (will require user's password)
          console.log(`⚠️ Regular rm failed, trying with elevated permissions...`);
          await execAsync(`sudo rm -rf "${nodeModulesPath}"`, { timeout: 120000 });
        }
      }
      
      console.log(`✅ node_modules removed`);
    }
    
    // Step 3: Reinstall dependencies
    console.log(`📦 Reinstalling dependencies...`);
    
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    await execAsync(`${npmCmd} install`, { 
      cwd: projectPath, 
      timeout: 300000,  // 5 minute timeout for npm install
      env: { ...process.env, CI: 'true' }
    });
    
    console.log(`✅ Dependencies reinstalled successfully`);
    
    return { 
      success: true, 
      message: 'node_modules deleted and reinstalled successfully!' 
    };
  } catch (err) {
    console.error('Aggressive fix failed:', err);
    return { 
      success: false, 
      error: err.message,
      manual: `Please run manually in Terminal:\n\ncd "${projectPath}"\nsudo rm -rf node_modules\nnpm install`
    };
  }
}

// Helper to validate npm script exists
async function validateNpmScript(projectPath, scriptName) {
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJsonContent = await fsPromises.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    return packageJson.scripts && packageJson.scripts[scriptName];
  } catch (err) {
    console.error('Error validating npm script:', err);
    return false;
  }
}

/**
 * Detect project type and default port from package.json
 */
async function detectProjectType(projectPath) {
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Detect framework and default port
    if (deps.vite) {
      return { type: 'Vite', defaultPort: 5173, framework: 'vite' };
    } else if (deps.next) {
      return { type: 'Next.js', defaultPort: 3000, framework: 'nextjs' };
    } else if (deps['react-scripts']) {
      return { type: 'Create React App', defaultPort: 3000, framework: 'cra' };
    } else if (deps.nuxt || deps.nuxt3) {
      return { type: 'Nuxt', defaultPort: 3000, framework: 'nuxt' };
    } else if (deps['@angular/core']) {
      return { type: 'Angular', defaultPort: 4200, framework: 'angular' };
    } else if (deps['vue-cli-service'] || deps['@vue/cli-service']) {
      return { type: 'Vue CLI', defaultPort: 8080, framework: 'vue' };
    } else if (deps.express) {
      return { type: 'Express', defaultPort: 3000, framework: 'express' };
    } else if (deps.gatsby) {
      return { type: 'Gatsby', defaultPort: 8000, framework: 'gatsby' };
    } else if (deps['@remix-run/dev']) {
      return { type: 'Remix', defaultPort: 3000, framework: 'remix' };
    } else if (deps.astro) {
      return { type: 'Astro', defaultPort: 3000, framework: 'astro' };
    }
    
    // Default fallback
    return { type: 'Node.js', defaultPort: 3000, framework: 'node' };
  } catch (err) {
    console.error('Error detecting project type:', err);
    return { type: 'Node.js', defaultPort: 3000, framework: 'node' };
  }
}

/**
 * Check if a port is available
 * More robust check with retry to avoid race conditions
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    
    server.once('error', (err) => {
      // Port is in use or other error
      resolve(false);
    });
    
    server.once('listening', () => {
      // Port is available - close and wait a bit before returning
      server.close(() => {
        // Give a small delay to ensure port is fully released
        setTimeout(() => resolve(true), 50);
      });
    });
    
    server.listen(port, '0.0.0.0');
  });
}

/**
 * Check if a port is being used by a Tafil-managed process
 * Returns {isTafil: boolean, projectPath: string | null}
 */
function checkPortOwnership(port) {
  // Check if any running process in Tafil is using this port
  for (const [projPath, info] of runningProcesses.entries()) {
    if (info.port === port) {
      return { isTafil: true, projectPath: projPath };
    }
  }
  return { isTafil: false, projectPath: null };
}

/**
 * Find next available port starting from a base port
 */
async function findAvailablePort(startPort, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  return null;
}

// 4) Start (play) a project - INTELLIGENT VERSION with custom port support
ipcMain.handle('play-project', async (_event, projectPath, customPort = null) => {
  try {
    // Debug logging
    console.log('play-project called with:', { projectPath, customPort, type: typeof projectPath });
    
    // Validate project path
    if (!isValidProjectPath(projectPath)) {
      console.error('Invalid project path:', projectPath);
      return { 
        success: false, 
        error: 'Invalid project path provided.' 
      };
    }
    
    // Check if already running
    if (runningProcesses.has(projectPath)) {
      return {
        success: false,
        error: 'Project is already running.'
      };
    }
    
    // Check if we have necessary permissions
    let permCheck = await checkExecutePermissions(projectPath);
    if (!permCheck.success) {
      console.log(`⚠️ Permission issues detected for ${projectPath}`);
      console.log(`   Issues:`, permCheck.diagnostics.issues);
      
      // Build a helpful error message based on the specific issues
      const issues = permCheck.diagnostics.issues;
      let issueDescription = issues.length > 0 ? issues.join('\n• ') : 'Unknown permission issue';
      
      console.log(`🔧 Attempting to fix permissions automatically...`);
      
      // Try to fix permissions automatically
      const fixResult = await fixProjectPermissions(projectPath);
      
      if (fixResult.success) {
        // Check again after fixing
        permCheck = await checkExecutePermissions(projectPath);
        if (!permCheck.success) {
          // Still failing after fix attempt - give detailed instructions
          const manualCmd = isWindows 
            ? `icacls "${projectPath}" /grant "%USERNAME%:F" /T`
            : `sudo chmod -R u+rwX "${projectPath}" && sudo chown -R $(whoami) "${projectPath}"`;
          
          return {
            success: false,
            error: `Permission denied. Auto-fix was attempted but some issues remain.\n\n` +
                   `Issues detected:\n• ${permCheck.diagnostics.issues.join('\n• ')}\n\n` +
                   `Please run this command in ${isWindows ? 'Command Prompt (as Admin)' : 'Terminal'}:\n\n${manualCmd}`
          };
        }
        console.log(`✅ Permissions fixed for ${projectPath}`);
      } else {
        // Fix failed entirely
        const manualInstructions = fixResult.manual || 
          (isWindows 
            ? `icacls "${projectPath}" /grant "%USERNAME%:F" /T`
            : `sudo chmod -R u+rwX "${projectPath}"`);
        
        return {
          success: false,
          error: `Permission denied. Could not fix permissions automatically.\n\n` +
                 `Issues detected:\n• ${issueDescription}\n\n` +
                 `Please run this command in ${isWindows ? 'Command Prompt (as Admin)' : 'Terminal'}:\n\n${manualInstructions}`
        };
      }
    }

    // Detect project type and framework
    const projectInfo = await detectProjectType(projectPath);
    console.log(`Detected project type: ${projectInfo.type} (default port: ${projectInfo.defaultPort})`);

    // Read package.json for scripts
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    const projectNameForBrain = packageJson.name || path.basename(projectPath);

    // Determine the appropriate start script
    let startScript;
    if (await validateNpmScript(projectPath, 'dev')) {
      startScript = 'npm run dev';
    } else if (await validateNpmScript(projectPath, 'serve')) {
      startScript = 'npm run serve';
    } else if (await validateNpmScript(projectPath, 'start')) {
      startScript = 'npm start';
    } else if (scripts.build && !scripts.start) {
      startScript = 'npm run build && npm start';
    } else {
      throw new Error('No suitable start script found in package.json');
    }

    // Intelligent port selection with custom port override
    let suggestedPort;
    
    if (customPort) {
      // User specified custom port
      const customPortNum = parseInt(customPort, 10);
      if (isNaN(customPortNum) || customPortNum < 1000 || customPortNum > 65535) {
        return {
          success: false,
          error: 'Invalid custom port. Please use a port between 1000-65535.'
        };
      }
      
      console.log(`Checking if custom port ${customPortNum} is available...`);
      const isCustomAvailable = await isPortAvailable(customPortNum);
      console.log(`Custom port ${customPortNum} available: ${isCustomAvailable}`);
      
      if (!isCustomAvailable) {
        return {
          success: false,
          error: `Port ${customPortNum} is already in use. Please choose a different port.`
        };
      }
      
      suggestedPort = customPortNum;
      console.log(`✅ Using custom port: ${suggestedPort}`);
    } else {
      // Auto-detect port based on framework
      suggestedPort = projectInfo.defaultPort;
      console.log(`Default port for ${projectInfo.type}: ${projectInfo.defaultPort}`);
      
      console.log(`Checking if default port ${projectInfo.defaultPort} is available...`);
      const isDefaultAvailable = await isPortAvailable(projectInfo.defaultPort);
      console.log(`Default port ${projectInfo.defaultPort} available: ${isDefaultAvailable}`);
      
      if (!isDefaultAvailable) {
        // Port is occupied - AUTO-FIND an available port instead of erroring
        console.log(`⚠️ Port ${projectInfo.defaultPort} is not available. Auto-finding an alternative...`);
        
        // Check what's using it (for logging)
        const ownership = checkPortOwnership(projectInfo.defaultPort);
        if (ownership.isTafil) {
          console.log(`  → Used by Tafil project: ${path.basename(ownership.projectPath)}`);
        } else {
          const externalProcess = await getProcessOnPort(projectInfo.defaultPort);
          if (externalProcess) {
            console.log(`  → Used by external process: ${externalProcess.command} (PID: ${externalProcess.pid})`);
          }
        }
        
        // Find next available port
        const alternativePort = await findAvailablePort(projectInfo.defaultPort + 1);
        
        if (alternativePort) {
          console.log(`✅ Auto-selected alternative port: ${alternativePort}`);
          suggestedPort = alternativePort;
          
          // Send notification to renderer about port change
          if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('project-status', {
              projectPath,
              status: 'info',
              message: `Port ${projectInfo.defaultPort} was busy, using port ${alternativePort} instead`
            });
          }
        } else {
          console.error(`❌ No available ports found starting from ${projectInfo.defaultPort}`);
          return {
            success: false,
            error: `No available ports found. Please free up some ports and try again.`
          };
        }
      } else {
        // Double-check to avoid race conditions (especially for CRA)
        console.log(`🔄 Double-checking port ${projectInfo.defaultPort} availability...`);
        const doubleCheck = await isPortAvailable(projectInfo.defaultPort);
        
        if (!doubleCheck) {
          console.log(`⚠️ Port ${projectInfo.defaultPort} became occupied during check! Finding fallback...`);
          const fallbackPort = await findAvailablePort(projectInfo.defaultPort + 1);
          
          if (fallbackPort) {
            console.log(`✅ Found fallback port: ${fallbackPort}`);
            suggestedPort = fallbackPort;
          } else {
            console.error(`❌ No fallback ports available`);
            return {
              success: false,
              error: `Port ${projectInfo.defaultPort} became occupied. Please try again.`
            };
          }
        } else {
          console.log(`✅ Default port ${projectInfo.defaultPort} is confirmed available`);
        }
      }
    }

    console.log(`🚀 Starting ${projectInfo.type} project with "${startScript}" (suggested port: ${suggestedPort})`);
    // Project Brain: record run attempt start (best-effort)
    try {
      await projectBrain.recordRunStart({
        projectPath,
        projectName: projectNameForBrain,
        framework: projectInfo.framework || projectInfo.type,
        command: startScript,
        suggestedPort,
      });
    } catch (e) {
      console.warn('Project Brain: recordRunStart failed:', e?.message || e);
    }

    // Prepare environment variables based on framework
    const env = {
        ...process.env,
      FORCE_COLOR: '1',
      // Ensure HOME is set (needed for npm config)
      HOME: process.env.HOME || process.env.USERPROFILE || '',
      // Ensure npm can find its config
      npm_config_prefix: process.env.npm_config_prefix || '',
    };
    
    // On macOS/Linux, ensure we have proper shell environment
    if (!isWindows) {
      // Add common paths that might be in .bashrc/.zshrc but not inherited
      const additionalPaths = [
        '/usr/local/bin',
        '/opt/homebrew/bin',
        `${env.HOME}/.nvm/versions/node`,
        `${env.HOME}/.volta/bin`,
      ].filter(p => {
        try { return fs.existsSync(p); } catch { return false; }
      });
      
      if (additionalPaths.length > 0) {
        env.PATH = [...additionalPaths, env.PATH || ''].join(':');
      }
    }

    // Set PORT for all frameworks (even if some ignore it)
    // This ensures CRA and other frameworks that respect PORT work correctly
    env.PORT = suggestedPort.toString();
    
    // Additional environment variables for specific frameworks
    if (projectInfo.framework === 'cra') {
      // Create React App specific settings
      env.PORT = suggestedPort.toString();
      env.BROWSER = 'none'; // Don't auto-open browser
      env.SKIP_PREFLIGHT_CHECK = 'true'; // Skip some checks
      console.log(`Setting CRA environment: PORT=${suggestedPort}, BROWSER=none`);
    } else if (projectInfo.framework === 'nextjs') {
      env.PORT = suggestedPort.toString();
      console.log(`Setting Next.js PORT=${suggestedPort}`);
    } else if (projectInfo.framework === 'vite') {
      // Vite doesn't respect PORT, but we can try
      env.PORT = suggestedPort.toString();
      env.VITE_PORT = suggestedPort.toString();
      console.log(`Vite will use its default port (will detect from output)`);
    } else {
      console.log(`Setting PORT=${suggestedPort} for ${projectInfo.framework}`);
    }

    // Spawn the process - Cross-platform compatible
    const npmCmd = getNpmCommand();
    const scriptParts = startScript.split(' ');
    const command = scriptParts[0];  // 'npm'
    let args = scriptParts.slice(1); // ['run', 'dev']
    
    // Add port argument for frameworks that need CLI flags (when port differs from default)
    let portArgs = [];
    if (suggestedPort !== projectInfo.defaultPort) {
      console.log(`📌 Port changed from ${projectInfo.defaultPort} to ${suggestedPort}, adding CLI port args`);
      
      if (projectInfo.framework === 'vite') {
        // Vite: npm run dev -- --port 3001
        portArgs = ['--', '--port', suggestedPort.toString()];
      } else if (projectInfo.framework === 'nextjs') {
        // Next.js: npm run dev -- -p 3001
        portArgs = ['--', '-p', suggestedPort.toString()];
      } else if (projectInfo.framework === 'nuxt') {
        // Nuxt: npm run dev -- --port 3001
        portArgs = ['--', '--port', suggestedPort.toString()];
      } else if (projectInfo.framework === 'angular') {
        // Angular: npm run start -- --port 3001
        portArgs = ['--', '--port', suggestedPort.toString()];
      } else if (projectInfo.framework === 'express' || projectInfo.framework === 'node') {
        // Express/Node usually read from PORT env var, but we set it anyway
      }
      
      if (portArgs.length > 0) {
        args = [...args, ...portArgs];
        console.log(`📌 Command args updated: ${args.join(' ')}`);
      }
    }
    
    // Build spawn options - Cross-platform compatible
    const spawnOptions = {
      cwd: projectPath,
      env,
      stdio: ['pipe', 'pipe', 'pipe'], // Enable stdin, stdout, stderr pipes for interaction
    };
    
    // Build the command
    let spawnCmd, spawnArgs;
    const fullCommand = `${npmCmd} ${args.join(' ')}`;
    
    // Check if this is a UNC path (Windows network/VM shared folder)
    // UNC paths start with \\ (which is \\\\ in JS string literal, or just check first 2 chars)
    const normalizedProjectPath = path.normalize(projectPath);
    const isUNCPath = isWindows && (
      normalizedProjectPath.startsWith('\\\\') || 
      projectPath.startsWith('\\\\') ||
      /^\\\\[^\\]+\\/.test(projectPath)  // Matches \\server\share pattern
    );
    
    console.log(`🔍 Path analysis: "${projectPath}"`);
    console.log(`🔍 Normalized: "${normalizedProjectPath}"`);
    console.log(`🔍 Is UNC path: ${isUNCPath}`);
    console.log(`🔍 First 4 chars: "${projectPath.substring(0, 4)}"`);
    console.log(`🔍 Char codes: ${projectPath.charCodeAt(0)}, ${projectPath.charCodeAt(1)}`);
    
    if (isWindows) {
      // On Windows, use cmd /c
      spawnCmd = process.env.COMSPEC || 'cmd.exe';
      
      if (isUNCPath) {
        // UNC paths (like \\Mac\Home\...) require special handling
        // Node.js spawn() doesn't support UNC paths in cwd option
        console.log(`🔧 Detected UNC path: ${projectPath}`);
        console.log(`🔧 Using exec() approach for Parallels/VM shared folders`);
        
        // Ensure the path uses proper Windows backslashes
        let winPath = normalizedProjectPath.replace(/\//g, '\\');
        
        // Remove trailing backslash if present (can cause issues)
        if (winPath.endsWith('\\') && !winPath.endsWith(':\\')) {
          winPath = winPath.slice(0, -1);
        }
        
        console.log(`🔧 Windows UNC path: "${winPath}"`);
        
        // For UNC paths, use exec() instead of spawn() as it handles paths better
        // Use pushd which maps UNC path to a temp drive letter (e.g., Z:)
        const uncCommand = `pushd "${winPath}" && ${fullCommand}`;
        console.log(`Executing (Windows UNC): ${uncCommand}`);
        
        // Use exec for UNC paths - it's more reliable
        const { execSync } = require('child_process');
        
        // First, verify the path is accessible
        try {
          execSync(`dir "${winPath}"`, { encoding: 'utf8', windowsHide: true });
          console.log(`✅ UNC path is accessible`);
        } catch (dirErr) {
          console.error(`❌ Cannot access UNC path: ${dirErr.message}`);
          return {
            success: false,
            error: `Cannot access the shared folder.\n\nPath: ${winPath}\n\nPlease check:\n1. Parallels shared folders are enabled\n2. The folder exists on your Mac\n3. Try navigating to the path in Windows Explorer first`
          };
        }
        
        // Now use exec with a different approach - child_process.exec handles UNC better
        const child = exec(uncCommand, {
          env,
          maxBuffer: 10 * 1024 * 1024, // 10MB buffer for output
          windowsHide: true,
        });
        
        runningProcesses.set(projectPath, { 
          process: child, 
          port: suggestedPort,
          framework: projectInfo.framework,
          isExec: true  // Mark as exec for proper cleanup
        });
        updateTrayMenu(runningProcesses);
        
        let actualPort = suggestedPort;
        let hasDetectedPort = false;
        let stdoutBuffer = '';
        let stderrBuffer = '';

    // Handle stdout
    child.stdout.on('data', (data) => {
      const output = data.toString();
          stdoutBuffer += output;
          console.log(`[UNC:stdout] ${output}`);
          
          mainWindow?.webContents.send('project-logs', {
            projectPath,
            type: 'stdout',
            log: output,
          });
          
          // Port detection
          if (!hasDetectedPort) {
      const portPatterns = [
              /Local:\s*http:\/\/localhost:(\d+)/i,
              /http:\/\/localhost:(\d+)/i,
              /port[:\s]+(\d+)/i,
            ];
      for (const pattern of portPatterns) {
        const match = output.match(pattern);
        if (match) {
                const detectedPort = parseInt(match[1], 10);
                if (detectedPort >= 1000 && detectedPort <= 65535) {
                  actualPort = detectedPort;
                  hasDetectedPort = true;
                  
                  if (runningProcesses.has(projectPath)) {
                    const processInfo = runningProcesses.get(projectPath);
                    processInfo.port = actualPort;
                    runningProcesses.set(projectPath, processInfo);
                  }
                  
                  console.log(`✅ Detected port: ${actualPort}`);
          mainWindow?.webContents.send('project-status', {
            projectPath,
            status: 'running',
            port: actualPort,
            pid: child.pid,
                    framework: projectInfo.framework,
          });
                  // Project Brain: record running + actual port (best-effort)
                  projectBrain.recordRunRunning({ projectPath, pid: child.pid, actualPort }).catch(() => {});
          break;
                }
              }
        }
      }
    });

    // Handle stderr
    child.stderr.on('data', (data) => {
      const error = data.toString();
          stderrBuffer += error;
          console.log(`[UNC:stderr] ${error}`);
          
      mainWindow?.webContents.send('project-logs', {
        projectPath,
        type: 'stderr',
        log: error,
          });
        });
        
        // Handle exit
        child.on('exit', (code, signal) => {
          console.log(`[UNC] Process exited. Code: ${code}, Signal: ${signal}`);
          console.log(`[UNC] STDERR: ${stderrBuffer.substring(0, 500)}`);
          console.log(`[UNC] STDOUT: ${stdoutBuffer.substring(0, 500)}`);
          
          runningProcesses.delete(projectPath);
          updateTrayMenu(runningProcesses);
          
          let errorMsg = undefined;
          if (code !== 0) {
            errorMsg = `Process exited with code ${code}`;
            
            // Provide helpful error messages based on stderr content
            if (stderrBuffer.includes('ENOENT') || stderrBuffer.includes('not found') || stderrBuffer.includes("'npm' is not recognized")) {
              errorMsg = 'npm/Node.js not found.\n\nPlease install Node.js in your Windows VM:\n1. Download from https://nodejs.org\n2. Install Node.js\n3. Restart the app';
            } else if (stderrBuffer.includes('EACCES') || stderrBuffer.includes('permission denied') || stderrBuffer.includes('Permission denied')) {
              errorMsg = `Permission denied.\n\nTry in Command Prompt (Admin):\nicacls "${winPath}" /grant "%USERNAME%:F" /T\n\nOr delete node_modules and reinstall.`;
            } else if (stderrBuffer.includes('npm ERR!')) {
              const npmErrMatch = stderrBuffer.match(/npm ERR! ([^\n]+)/);
              errorMsg = npmErrMatch ? `npm error: ${npmErrMatch[1]}` : 'npm encountered an error. Check logs for details.';
            } else if (stderrBuffer.includes('Cannot find module')) {
              errorMsg = 'Missing module. Try running "npm install" first.';
            } else if (stderrBuffer.includes('ENOTEMPTY') || stderrBuffer.includes('Directory not empty')) {
              errorMsg = 'Directory conflict. Try deleting node_modules manually and reinstall.';
            } else if (stderrBuffer.includes('network') || stderrBuffer.includes('ETIMEDOUT') || stderrBuffer.includes('ECONNREFUSED')) {
              errorMsg = 'Network error. Check your internet connection.';
            } else if (stderrBuffer.length > 0) {
              // Show first meaningful line from stderr
              const lines = stderrBuffer.split('\n').filter(l => l.trim().length > 0);
              const firstError = lines.find(l => l.toLowerCase().includes('error') || l.toLowerCase().includes('failed')) || lines[0];
              if (firstError && firstError.length < 200) {
                errorMsg = firstError.trim();
              }
            }
          }
          const diagnostic = (code !== 0)
            ? buildFailureDiagnostic({
                projectPath,
                framework: projectInfo.framework,
                suggestedPort,
                stdout: stdoutBuffer,
                stderr: stderrBuffer,
                code,
                errorMessage: errorMsg,
              })
            : null;
          if (diagnostic) {
            projectBrain.recordDiagnostic({ projectPath, diagnostic }).catch(() => {});
          }
          
          mainWindow?.webContents.send('project-status', {
            projectPath,
            status: code === 0 ? 'stopped' : 'error',
            code,
            signal,
            error: errorMsg,
            diagnostic,
          });
          // Project Brain: record exit summary (best-effort)
          projectBrain.recordRunExit({
            projectPath,
            code,
            signal,
            stdout: stdoutBuffer,
            stderr: stderrBuffer,
            errorMessage: errorMsg,
          }).catch(() => {});
        });
        
        // Handle error
        child.on('error', (err) => {
          console.error(`[UNC] Error:`, err);
          runningProcesses.delete(projectPath);
          
        mainWindow?.webContents.send('project-status', {
          projectPath,
          status: 'error',
            error: err.message,
          });
        });
        
        // Fallback status after timeout
        setTimeout(() => {
          if (!hasDetectedPort && runningProcesses.has(projectPath)) {
            console.log(`⚠️ Port not detected, using suggested: ${suggestedPort}`);
            mainWindow?.webContents.send('project-status', {
              projectPath,
              status: 'running',
              port: suggestedPort,
              pid: child.pid,
              framework: projectInfo.framework,
            });
          }
        }, 5000);
        
        return {
          pid: child.pid,
          port: suggestedPort,
          framework: projectInfo.framework,
          success: true,
          message: `Starting project on UNC path (port ${suggestedPort})...`
        };
      } else {
        // Standard Windows path - use normal approach
        spawnArgs = ['/c', fullCommand];
        console.log(`Spawning (Windows): ${spawnCmd} ${spawnArgs.join(' ')}`);
      }
      
      spawnOptions.windowsHide = true;
    } else {
      // On macOS/Linux, use login shell to get proper environment
      // This sources .bashrc/.zshrc to get NVM, Volta, etc.
      const userShell = process.env.SHELL || '/bin/sh';
      const shellName = path.basename(userShell);
      
      // Build a command that sources the user's profile first
      let shellCommand;
      if (shellName === 'zsh') {
        // For zsh, source .zshrc
        shellCommand = `source ~/.zshrc 2>/dev/null || true; ${fullCommand}`;
      } else if (shellName === 'bash') {
        // For bash, source .bashrc
        shellCommand = `source ~/.bashrc 2>/dev/null || true; ${fullCommand}`;
      } else {
        // For other shells, just run the command
        shellCommand = fullCommand;
      }
      
      spawnCmd = '/bin/sh';
      spawnArgs = ['-c', shellCommand];
      console.log(`Spawning (Unix): ${spawnCmd} -c "${shellCommand.substring(0, 100)}..."`);
    }
    
    console.log(`Working directory: ${projectPath}`);
    console.log(`Environment PATH (first 300 chars): ${env.PATH?.substring(0, 300)}...`);
    
    const child = spawn(spawnCmd, spawnArgs, spawnOptions);

    runningProcesses.set(projectPath, { 
      process: child, 
      port: suggestedPort,  // Store the intended port
      framework: projectInfo.framework 
    });
    updateTrayMenu(runningProcesses);
    
    let actualPort = suggestedPort; // Initialize with suggested port
    let hasDetectedPort = false;
    let stdoutBuffer = ''; // Buffer to accumulate stdout for better CRA prompt detection
    const startTime = Date.now();
    
    // Note: We handle CRA port prompts in the stdout handler when we actually detect them
    // NOT with a blind timeout - that was causing premature "y" sends

    // Handle stdout - Enhanced port detection
    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdoutBuffer += output; // Accumulate for multi-line prompt detection
      console.log(`[${projectPath}] STDOUT: ${output}`);
      
      // Send logs to renderer
      mainWindow?.webContents.send('project-logs', {
        projectPath,
        type: 'stdout',
        log: output,
      });
      
      // CRA Port prompt detection and auto-response
      // Only respond when we see BOTH the conflict message AND the prompt
      if (projectInfo.framework === 'cra' && !hasDetectedPort) {
        const hasConflict = stdoutBuffer.includes('Something is already running on port');
        const hasPrompt = stdoutBuffer.includes('Would you like to run the app on another port instead?');
        const hasQuestion = stdoutBuffer.includes('(Y/n)') || stdoutBuffer.includes('? (Y/n)');
        
        if (hasConflict && (hasPrompt || hasQuestion)) {
          console.log('🔧 Detected CRA port conflict with prompt. Sending "Y" response...');
          try {
            // Send uppercase Y followed by newline
            child.stdin?.write('Y\n');
            console.log('✅ Sent "Y" to CRA port prompt. Waiting for CRA to start on alternate port...');
            // Clear buffer after responding
            stdoutBuffer = '';
          } catch (err) {
            console.error('❌ Error writing to stdin:', err);
          }
        } else if (hasConflict && !hasPrompt) {
          // CRA detected conflict but isn't prompting (non-interactive mode)
          console.log('⚠️ CRA detected port conflict but no prompt shown. Process may exit.');
        }
      }
      
      // Enhanced port detection patterns
      if (!hasDetectedPort) {
        // Don't detect port from error messages about occupied ports
        const isErrorMessage = 
          output.includes('Something is already running on port') ||
          output.includes('Port') && output.includes('is already in use') ||
          output.includes('EADDRINUSE') ||
          output.includes('address already in use');
        
        if (!isErrorMessage) {
      const portPatterns = [
            /(?:Local|local):\s*http:\/\/localhost:(\d+)/i,  // Vite style: Local: http://localhost:5173
            /(?:ready|running|listening).*?(?:on|at|:)\s*(?:http:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(\d+)/i,
            /http:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(\d+)/i,
            /(?:server|app).*?(?:on|at).*?port[:\s]+(\d+)/i, // More specific: "server on port 3001"
            /On Your Network.*?http:\/\/.*?:(\d+)/i, // CRA style: "On Your Network:  http://192.168.1.1:3001"
            /Local:\s+http:\/\/localhost:(\d+)/i,  // CRA Local
            /Compiled successfully!/i, // If we see this for CRA, we can try to find port in previous lines
            /started.*?(\d{4,5})/i
      ];

      for (const pattern of portPatterns) {
        const match = output.match(pattern);
        if (match) {
              const detectedPort = parseInt(match[1], 10);
              // Validate port number
              if (detectedPort >= 1000 && detectedPort <= 65535) {
                actualPort = detectedPort;
                hasDetectedPort = true;
                
                // Update the stored port information
                if (runningProcesses.has(projectPath)) {
                  const processInfo = runningProcesses.get(projectPath);
                  processInfo.port = actualPort;
                  runningProcesses.set(projectPath, processInfo);
                }
                
                console.log(`✅ Detected actual running port: ${actualPort} for ${projectInfo.type}`);
                
          mainWindow?.webContents.send('project-status', {
            projectPath,
            status: 'running',
            port: actualPort,
            pid: child.pid,
                  framework: projectInfo.type,
          });
                // Project Brain: record running + actual port (best-effort)
                projectBrain.recordRunRunning({ projectPath, pid: child.pid, actualPort }).catch(() => {});
          break;
              }
            }
          }
        } else {
          console.log('⚠️ Ignoring port number from error message, waiting for actual start confirmation...');
        }
      }
    });

    // Handle stderr
    let stderrBuffer = ''; // Capture stderr for error reporting
    
    child.stderr.on('data', (data) => {
      const error = data.toString();
      stderrBuffer += error;
      console.log(`[${projectPath}] STDERR: ${error}`);
      
      // Send to renderer for logs only - don't change project status based on stderr
      // Most stderr output is just warnings, not actual fatal errors
      mainWindow?.webContents.send('project-logs', {
        projectPath,
        type: 'stderr',
        log: error,
      });

      // IMPORTANT: Don't mark project as error based on stderr content!
      // Many frameworks output warnings to stderr that are NOT fatal errors.
      // Examples that should NOT stop the project:
      // - "fetch failed" (API call failed, not process crash)
      // - "Warning:" messages
      // - Deprecation notices
      // - React/Next.js compilation warnings
      // 
      // Only the 'exit' event should determine if the project actually stopped.
      // The process is still running even if it logs errors to stderr.
      
      // Just log it for debugging
      const lowerError = error.toLowerCase();
      if (lowerError.includes('eacces') || lowerError.includes('permission denied')) {
        console.warn(`⚠️ Permission warning in ${projectPath}: ${error.substring(0, 100)}`);
      }
    });

    // Handle errors
    child.on('error', (err) => {
      console.error(`Error running project at ${projectPath}:`, err);
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        command: spawnCmd,
        args: spawnArgs,
        cwd: projectPath,
        PATH: process.env.PATH,
      });
      
      let errorMessage = err.message;
      if (err.code === 'ENOENT') {
        errorMessage = 'npm command not found. Please ensure Node.js is installed and in your PATH.';
      }
      
      mainWindow?.webContents.send('project-status', {
        projectPath,
        status: 'error',
        error: errorMessage,
      });
      runningProcesses.delete(projectPath);
      // Project Brain: record exit as error (best-effort)
      projectBrain.recordRunExit({
        projectPath,
        code: err?.code || null,
        signal: null,
        stdout: stdoutBuffer,
        stderr: stderrBuffer,
        errorMessage,
      }).catch(() => {});
    });

    // Handle exit
    child.on('exit', (code, signal) => {
      console.log(`❌ Process exited for ${projectPath}. Code: ${code}, Signal: ${signal}`);
      console.log(`STDERR buffer: ${stderrBuffer.substring(0, 500)}`);
      console.log(`STDOUT buffer: ${stdoutBuffer.substring(0, 500)}`);
      
      // Special handling for exit code 127 (command not found)
      if (code === 127) {
        console.error('❌ Exit code 127: Command not found. npm or node may not be in PATH.');
        console.error('Current PATH:', process.env.PATH);
        console.error('Attempted command:', spawnCmd, spawnArgs);
        
        mainWindow?.webContents.send('project-status', {
          projectPath,
          status: 'error',
          error: 'Command not found (exit code 127). Please ensure Node.js and npm are installed and accessible.',
        });
      runningProcesses.delete(projectPath);
        updateTrayMenu(runningProcesses);
        return;
      }
      
      // Special handling for exit code 1 (general error)
      if (code === 1) {
        console.error('❌ Exit code 1: Process failed.');
        console.error('STDERR:', stderrBuffer);
        
        // Try to extract a meaningful error message
        let errorMsg = 'Process failed. ';
        
        // Check for common errors
        if (stderrBuffer.includes('ENOENT') || stderrBuffer.includes('not found')) {
          errorMsg += 'A required command or file was not found.';
        } else if (stderrBuffer.includes('EACCES') || stderrBuffer.includes('permission denied') || stderrBuffer.includes('Permission denied')) {
          const fixCmd = isWindows 
            ? `icacls "${projectPath}" /grant "%USERNAME%:F" /T`
            : `sudo chmod -R u+rwX "${projectPath}"`;
          errorMsg = `Permission denied during execution.\n\nThis can happen when:\n• node_modules has restricted permissions\n• .bin executables aren't executable\n• npm cache has permission issues\n\nTry running in ${isWindows ? 'Command Prompt (Admin)' : 'Terminal'}:\n${fixCmd}\n\nOr try deleting node_modules and reinstalling.`;
        } else if (stderrBuffer.includes('npm ERR!')) {
          // Extract npm error
          const npmErrMatch = stderrBuffer.match(/npm ERR! ([^\n]+)/);
          if (npmErrMatch) {
            errorMsg += npmErrMatch[1];
          } else {
            errorMsg += 'npm encountered an error.';
          }
        } else if (stderrBuffer.includes('Cannot find module')) {
          errorMsg += 'Missing module. Try running npm install first.';
        } else if (stderrBuffer.length > 0) {
          // Use first line of stderr
          const firstLine = stderrBuffer.split('\n')[0].trim();
          if (firstLine.length > 0 && firstLine.length < 100) {
            errorMsg += firstLine;
          } else {
            errorMsg += 'Check logs for details.';
          }
        } else {
          errorMsg += 'Check logs for details.';
        }
        
        mainWindow?.webContents.send('project-status', {
          projectPath,
          status: 'error',
          error: errorMsg,
        });
        runningProcesses.delete(projectPath);
        updateTrayMenu(runningProcesses);
        return;
      }
      
      // Check if this was a CRA port conflict exit
      const wasCRAPortConflict = projectInfo.framework === 'cra' && 
                                 code === 0 && 
                                 stdoutBuffer.includes('Something is already running on port');
      
      if (wasCRAPortConflict) {
        console.log('🔄 CRA exited due to port conflict without prompting. This suggests non-interactive mode.');
        console.log('💡 Recommendation: Try running the project again - it should use a fallback port.');
      }
      
      runningProcesses.delete(projectPath);
      updateTrayMenu(runningProcesses);
      
      const status = signal ? 'stopped' : (code === 0 ? 'stopped' : 'error');
      const errorMessage = wasCRAPortConflict
        ? 'Port conflict detected. Please try running again.'
        : (code !== 0 && code !== null 
          ? `Process exited with code ${code}. Check logs for details.` 
          : undefined);
      const diagnostic = (status === 'error' || wasCRAPortConflict)
        ? buildFailureDiagnostic({
            projectPath,
            framework: projectInfo.framework || projectInfo.type,
            suggestedPort,
            stdout: stdoutBuffer,
            stderr: stderrBuffer,
            code,
            errorMessage,
          })
        : null;
      if (diagnostic) {
        projectBrain.recordDiagnostic({ projectPath, diagnostic }).catch(() => {});
      }
      
      mainWindow?.webContents.send('project-status', {
        projectPath,
        status,
        code,
        signal,
        error: errorMessage,
        diagnostic,
      });
      // Project Brain: record exit summary (best-effort)
      projectBrain.recordRunExit({
        projectPath,
        code,
        signal,
        stdout: stdoutBuffer,
        stderr: stderrBuffer,
        errorMessage,
      }).catch(() => {});
    });

    // Fallback: Send initial status after timeout if port not detected
    // CRA takes longer to start, so use longer timeout
    const timeoutDuration = projectInfo.framework === 'cra' ? 10000 : 3000;
    
    setTimeout(() => {
      if (!hasDetectedPort) {
        // Check if process is still running before marking as running
        const isStillRunning = runningProcesses.has(projectPath);
        
        if (!isStillRunning) {
          console.log(`⚠️ Process for ${projectPath} has already exited. Not marking as running.`);
          return;
        }
        
        // Use suggested port as fallback if we couldn't detect actual port
        actualPort = suggestedPort;
        console.log(`⚠️ Port not detected from output after ${timeoutDuration/1000}s, using suggested port: ${actualPort}`);
        console.log(`⚠️ WARNING: Port may be incorrect. Process might not be running properly.`);
        
        mainWindow?.webContents.send('project-status', {
          projectPath,
          status: 'running',
          port: actualPort,
          pid: child.pid,
          framework: projectInfo.type,
          warning: 'Port detected from configuration, may not be accurate'
        });
        // Project Brain: record running with fallback port (best-effort)
        projectBrain.recordRunRunning({ projectPath, pid: child.pid, actualPort }).catch(() => {});
      }
    }, timeoutDuration);

    return {
      pid: child.pid,
      port: suggestedPort,
      framework: projectInfo.type,
      success: true,
      message: `Starting ${projectInfo.type} project on port ${suggestedPort}...`
    };

  } catch (err) {
    console.error('Error in play-project handler:', err);
    return { 
      success: false, 
      error: err.message 
    };
  }
});

// 5) Stop a running project - Cross-platform
ipcMain.handle('stop-project', async (_event, projectPath) => {
  try {
    // Validate project path
    if (!isValidProjectPath(projectPath)) {
      return { 
        success: false, 
        message: 'Invalid project path provided.' 
      };
    }
    
    const processInfo = runningProcesses.get(projectPath);
    if (!processInfo) {
      console.log(`No running process found for ${projectPath}`);
      return { success: false, message: 'Project not running' };
    }
    
    // Project Brain: mark that a stop was requested (best-effort)
    projectBrain.recordStopRequested({ projectPath }).catch(() => {});
    
    const childProcess = processInfo.process || processInfo; // Support old format too

    return new Promise((resolve) => {
      // Cross-platform process termination
      const killProcess = (pid, signal = 'SIGTERM') => {
        try {
          if (isWindows) {
            // Windows: Use taskkill
            exec(`taskkill /F /T /PID ${pid}`, (error) => {
              if (error) console.warn(`Windows taskkill error: ${error.message}`);
            });
          } else {
            // Unix-like: Use kill command
            process.kill(parseInt(pid), signal);
          }
        } catch (e) {
          console.warn(`Failed to kill process ${pid}:`, e);
        }
      };

      psTree(childProcess.pid, (err, children) => {
        if (err) {
          console.error('Error getting process tree:', err);
          // Fallback: try to kill main process anyway
          killProcess(childProcess.pid);
          runningProcesses.delete(projectPath);
          updateTrayMenu(runningProcesses);
          return resolve({
            success: true,
            message: 'Stopped project (fallback method)',
          });
        }

        // Kill child processes first
        children.forEach((child) => {
          killProcess(child.PID);
        });

        // Kill the main process
        killProcess(childProcess.pid);

        runningProcesses.delete(projectPath);
        updateTrayMenu(runningProcesses);
        resolve({
          success: true,
          message: `Stopped project at ${projectPath}`,
        });
      });
    });
  } catch (err) {
    console.error('Stop-project error:', err);
    return {
      success: false,
      message: 'Failed to stop project',
      error: err.message,
    };
  }
});

// Project Brain: read-only access for renderer
ipcMain.handle('get-project-brain', async (_event, projectPath) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return null;
    }
    return await projectBrain.getProjectBrain(projectPath);
  } catch (err) {
    console.warn('get-project-brain failed:', err?.message || err);
    return null;
  }
});

// Project Brain: update project notes
ipcMain.handle('update-project-notes', async (_event, projectPath, notes) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }
    await projectBrain.updateProjectNotes(projectPath, notes);
    return { success: true };
  } catch (err) {
    console.warn('update-project-notes failed:', err?.message || err);
    return { success: false, error: err?.message || 'Failed to update notes' };
  }
});

// Project Architecture: save/load canvas data
ipcMain.handle('save-project-architecture', async (_event, projectPath, architectureData) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }
    await projectBrain.saveProjectArchitecture(projectPath, architectureData);
    return { success: true };
  } catch (err) {
    console.warn('save-project-architecture failed:', err?.message || err);
    return { success: false, error: err?.message || 'Failed to save architecture' };
  }
});

ipcMain.handle('get-project-architecture', async (_event, projectPath) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return null;
    }
    return await projectBrain.getProjectArchitecture(projectPath);
  } catch (err) {
    console.warn('get-project-architecture failed:', err?.message || err);
    return null;
  }
});

// ========================================
// Pro Feature: Environment Snapshot + Restore
// ========================================

const environmentSnapshot = require('./utils/environmentSnapshot');
const restoreEverything = require('./utils/restoreEverything');

// Create environment snapshot for a project
ipcMain.handle('create-environment-snapshot', async (_event, projectPath, options = {}) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }

    const snapshot = await environmentSnapshot.createSnapshot(projectPath, options);
    
    // Save to Project Brain
    await projectBrain.saveEnvironmentSnapshot(projectPath, snapshot);
    
    return { success: true, snapshot };
  } catch (err) {
    console.error('create-environment-snapshot failed:', err);
    return { success: false, error: err.message || 'Failed to create snapshot' };
  }
});

// Get environment snapshot for a project
ipcMain.handle('get-environment-snapshot', async (_event, projectPath) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return null;
    }
    return await projectBrain.getEnvironmentSnapshot(projectPath);
  } catch (err) {
    console.warn('get-environment-snapshot failed:', err?.message || err);
    return null;
  }
});

// Restore project from snapshot
ipcMain.handle('restore-project', async (_event, projectPath, options = {}) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }

    // Get snapshot from Project Brain
    const snapshot = await projectBrain.getEnvironmentSnapshot(projectPath);
    
    if (!snapshot) {
      return { 
        success: false, 
        error: 'No snapshot found for this project. Create a snapshot first.' 
      };
    }

    // Restore project
    const result = await restoreEverything.restoreProject(snapshot, options);
    
    return result;
  } catch (err) {
    console.error('restore-project failed:', err);
    return { 
      success: false, 
      error: err.message || 'Failed to restore project',
      steps: [],
      errors: [{ error: err.message }],
    };
  }
});

// Get restore instructions (manual steps)
ipcMain.handle('get-restore-instructions', async (_event, projectPath) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }

    const snapshot = await projectBrain.getEnvironmentSnapshot(projectPath);
    
    if (!snapshot) {
      return { success: false, error: 'No snapshot found' };
    }

    const instructions = restoreEverything.getRestoreInstructions(snapshot);
    
    return { success: true, instructions };
  } catch (err) {
    console.error('get-restore-instructions failed:', err);
    return { success: false, error: err.message || 'Failed to get instructions' };
  }
});

// Validate prerequisites for a snapshot
ipcMain.handle('validate-snapshot-prerequisites', async (_event, projectPath) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }

    const snapshot = await projectBrain.getEnvironmentSnapshot(projectPath);
    
    if (!snapshot) {
      return { success: false, error: 'No snapshot found' };
    }

    const validation = await environmentSnapshot.validatePrerequisites(snapshot);
    
    return validation;
  } catch (err) {
    console.error('validate-snapshot-prerequisites failed:', err);
    return { 
      valid: false, 
      issues: [{ type: 'error', message: err.message || 'Validation failed' }],
      warnings: [],
    };
  }
});

// ========================================
// Error Context Notes (Memory Feature)
// ========================================

// Save error context note
ipcMain.handle('save-error-note', async (_event, projectPath, note, runId = null, errorKind = null) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }

    await projectBrain.saveErrorNote(projectPath, note, runId, errorKind);
    
    return { success: true };
  } catch (err) {
    console.error('save-error-note failed:', err);
    return { success: false, error: err.message || 'Failed to save note' };
  }
});

// Get error notes for a project
ipcMain.handle('get-error-notes', async (_event, projectPath, runId = null, errorKind = null) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return [];
    }

    return await projectBrain.getErrorNotes(projectPath, runId, errorKind);
  } catch (err) {
    console.warn('get-error-notes failed:', err?.message || err);
    return [];
  }
});

// 6) Install dependencies
ipcMain.handle('install-dependencies', async (_event, projectPath) => {
  try {
    // Validate project path
    if (!isValidProjectPath(projectPath)) {
      throw new Error('Invalid project path provided.');
    }
    
    await installDependencies(projectPath);
    return { success: true };
  } catch (err) {
    console.error('Error installing dependencies:', err);
    throw err;
  }
});

// 7) Check file existence
ipcMain.handle('file-exists', async (_event, filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(`Error checking file existence: ${err.message}`);
    return false;
  }
});

// 8) Open in browser
ipcMain.handle('open-in-browser', async (_event, port) => {
  try {
    // Validate port
    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return { 
        success: false, 
        error: 'Invalid port number provided.' 
      };
    }
    
    await shell.openExternal(`http://localhost:${portNum}`);
    return { success: true };
  } catch (err) {
    console.error('Error opening in browser:', err);
    return { success: false, error: err.message };
  }
});

// 9) Open in editor - Cross-platform with IDE selection
ipcMain.handle('open-in-editor', async (_event, projectPath, ideCommand = null) => {
  try {
    // Validate project path
    if (!isValidProjectPath(projectPath)) {
      return { 
        success: false, 
        error: 'Invalid project path provided.' 
      };
    }
    
    const normalizedPath = path.normalize(projectPath);
    console.log(`Opening editor for: ${normalizedPath}`);
    console.log(`IDE command: ${ideCommand || 'default'}`);
    
    if (ideCommand) {
      // User selected specific IDE
      console.log(`Opening ${normalizedPath} in ${ideCommand}`);
      
      // Check if it's a macOS app bundle
      const isMacApp = isMac && ideCommand.endsWith('.app');
      // Check if it's a Windows full path (contains .exe or is quoted)
      const isWinPath = isWindows && (ideCommand.includes('.exe') || ideCommand.startsWith('"'));
      
      if (isMacApp) {
        // Use 'open -a' for macOS app bundles
        const appName = path.basename(ideCommand, '.app');
        exec(`open -a "${ideCommand}" "${normalizedPath}"`, (error) => {
      if (error) {
            console.error(`Error opening with ${ideCommand}:`, error);
            exec(`open -a "${appName}" "${normalizedPath}"`, (fallbackError) => {
              if (fallbackError) {
                console.error(`Fallback also failed:`, fallbackError);
              }
            });
          }
        });
      } else if (isWinPath) {
        // Windows: Use full path with start command for proper window handling
        const cmd = `start "" ${ideCommand} "${normalizedPath}"`;
        console.log(`Windows IDE command: ${cmd}`);
        
        let explorerOpened = false; // Prevent multiple explorer windows
        
        exec(cmd, { shell: true, windowsHide: false }, (error) => {
          if (error) {
            console.error(`Error opening with Windows path:`, error);
            // Fallback: try direct execution
            exec(`${ideCommand} "${normalizedPath}"`, { shell: true }, (fallbackError) => {
              if (fallbackError && !explorerOpened) {
                console.error(`Fallback also failed:`, fallbackError);
                // Last resort: open in explorer ONCE
                explorerOpened = true;
                exec(`explorer "${normalizedPath}"`);
              }
            });
          }
        });
      } else if (isWindows) {
        // Windows with CLI command (like 'code')
        const cmd = `${ideCommand} "${normalizedPath}"`;
        console.log(`Windows CLI command: ${cmd}`);
        
        let explorerOpened = false; // Prevent multiple explorer windows
        
        exec(cmd, { shell: true }, (error) => {
          if (error) {
            console.error(`Error opening with ${ideCommand}:`, error);
            // Try with start command
            exec(`start "" ${ideCommand} "${normalizedPath}"`, { shell: true }, (startError) => {
              if (startError && !explorerOpened) {
                console.error(`Start command also failed:`, startError);
                explorerOpened = true;
                exec(`explorer "${normalizedPath}"`);
              }
            });
          }
        });
      } else {
        // Unix/Linux: Use command directly
        exec(`${ideCommand} "${normalizedPath}"`, (error) => {
          if (error) {
            console.error(`Error opening with ${ideCommand}:`, error);
            if (isMac) {
              const appName = ideCommand.split('/').pop() || ideCommand;
              exec(`open -a "${appName}" "${normalizedPath}"`, (fallbackError) => {
                if (fallbackError) {
                  console.error(`Fallback also failed:`, fallbackError);
                }
              });
            }
          }
        });
      }
    } else {
      // Default: try VS Code first, fallback to file manager
      if (isWindows) {
        let explorerOpened = false; // Prevent multiple explorer windows
        
        // Try code command first
        exec(`code "${normalizedPath}"`, { shell: true }, (error) => {
          if (error) {
            console.log('VS Code CLI not found, trying VS Code path...');
            const vscodePath = `${process.env['LOCALAPPDATA']}\\Programs\\Microsoft VS Code\\Code.exe`;
            if (fs.existsSync(vscodePath)) {
              exec(`start "" "${vscodePath}" "${normalizedPath}"`, { shell: true }, (pathError) => {
                if (pathError && !explorerOpened) {
                  console.log('VS Code not found, opening in Explorer...');
                  explorerOpened = true;
                  exec(`explorer "${normalizedPath}"`);
                }
              });
            } else if (!explorerOpened) {
              console.log('VS Code not found, opening in Explorer...');
              explorerOpened = true;
              exec(`explorer "${normalizedPath}"`);
            }
          }
        });
      } else if (isMac) {
        // Try VS Code app bundle first
        const vscodeApp = '/Applications/Visual Studio Code.app';
        if (fs.existsSync(vscodeApp)) {
          exec(`open -a "Visual Studio Code" "${normalizedPath}"`, (error) => {
            if (error) {
              console.log('VS Code app failed, trying code command...');
              exec(`code "${normalizedPath}"`, (cmdError) => {
                if (cmdError) {
                  console.log('VS Code not found, opening in Finder...');
                  exec(`open "${normalizedPath}"`);
                }
              });
            }
          });
        } else {
          exec(`code "${normalizedPath}"`, (error) => {
            if (error) {
              console.log('VS Code not found, opening in Finder...');
              exec(`open "${normalizedPath}"`);
            }
          });
        }
      } else if (isLinux) {
        exec(`code "${normalizedPath}"`, (error) => {
          if (error) {
            console.log('VS Code not found, using default file manager...');
            exec(`xdg-open "${normalizedPath}"`);
          }
        });
      }
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error opening in editor:', err);
    return { success: false, error: err.message };
  }
});

// 10) Open in terminal - Cross-platform
ipcMain.handle('open-in-terminal', async (_event, projectPath, terminalPreference = null) => {
  try {
    // Validate project path
    if (!isValidProjectPath(projectPath)) {
      return { 
        success: false, 
        error: 'Invalid project path provided.' 
      };
    }
    
    const normalizedPath = path.normalize(projectPath);
    console.log(`Opening terminal for: ${normalizedPath}`);
    console.log(`Terminal preference: ${terminalPreference}`);
    
    if (isWindows) {
      // Windows: Use preference or default
      // Use 'start' command to open in a new window
      console.log('🚀 Opening Windows terminal...');
      
      // Check if this is a UNC path (Parallels/VM shared folder)
      const isUNCPath = normalizedPath.startsWith('\\\\');
      if (isUNCPath) {
        console.log('🔧 Detected UNC path - will use pushd for directory change');
      }
      
      // Helper function to open Windows Terminal (new modern terminal)
      const openWindowsTerminal = () => {
        console.log('Trying Windows Terminal...');
        exec(`wt -d "${normalizedPath}"`, { windowsHide: false }, (error) => {
          if (error) {
            console.log('Windows Terminal not found, trying PowerShell...');
            openPowerShell();
          } else {
            console.log('✅ Windows Terminal opened successfully');
          }
        });
      };
      
      // Helper function to open PowerShell
      const openPowerShell = () => {
        console.log('Opening PowerShell...');
        // Use 'start' to open in a new window
        // For UNC paths, use Push-Location which handles them properly
        const cdCommand = isUNCPath 
          ? `Push-Location -Path '${normalizedPath.replace(/'/g, "''")}'`
          : `Set-Location -Path '${normalizedPath.replace(/'/g, "''")}'`;
        const psCommand = `start powershell -NoExit -Command "${cdCommand}"`; 
        exec(psCommand, { windowsHide: false, shell: true }, (error) => {
          if (error) {
            console.error(`PowerShell error: ${error.message}`);
            openCmd();
          } else {
            console.log('✅ PowerShell opened successfully');
          }
        });
      };
      
      // Helper function to open CMD
      const openCmd = () => {
        console.log('Opening CMD...');
        // Use 'start' to open in a new window
        // For UNC paths, use pushd which auto-maps to a drive letter
        const cdCommand = isUNCPath 
          ? `pushd "${normalizedPath}"`
          : `cd /d "${normalizedPath}"`;
        const cmdCommand = `start cmd /k "${cdCommand}"`;
        exec(cmdCommand, { windowsHide: false, shell: true }, (error) => {
          if (error) {
            console.error(`CMD error: ${error.message}`);
            // Last resort: try to open folder in Explorer
            exec(`explorer "${normalizedPath}"`);
          } else {
            console.log('✅ CMD opened successfully');
          }
        });
      };
      
      if (terminalPreference === 'powershell' || terminalPreference === 'PowerShell') {
        openPowerShell();
      } else if (terminalPreference === 'cmd' || terminalPreference === 'CMD') {
        openCmd();
      } else if (terminalPreference === 'wt' || terminalPreference === 'Windows Terminal') {
        openWindowsTerminal();
      } else {
        // Default: Try Windows Terminal first, then PowerShell, then CMD
        openWindowsTerminal();
      }
    } else if (isMac) {
      // macOS: Use preference or default
      console.log(`macOS terminal preference: ${terminalPreference || 'auto-detect'}`);
      
      // Helper function to open iTerm
      const openITerm = () => {
        console.log('🚀 Opening iTerm...');
        const script = `
osascript <<EOF
tell application "iTerm"
  activate
  try
    tell current window
      create tab with default profile
      tell current session
        write text "cd '${normalizedPath}'"
      end tell
    end tell
  on error
    create window with default profile
    tell current window
      tell current session
        write text "cd '${normalizedPath}'"
      end tell
    end tell
  end try
end tell
EOF`;
        
        exec(script, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error opening iTerm: ${error.message}`);
            if (stderr) console.error(`stderr: ${stderr}`);
          } else {
            console.log('✅ iTerm opened successfully');
          }
        });
      };
      
      // Helper function to open Terminal
      const openTerminal = () => {
        console.log('🚀 Opening Terminal.app...');
        exec(`osascript -e 'tell application "Terminal" to activate' -e 'tell application "Terminal" to do script "cd \\"${normalizedPath}\\""'`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error opening Terminal: ${error.message}`);
            if (stderr) console.error(`stderr: ${stderr}`);
          } else {
            console.log('✅ Terminal opened successfully');
          }
        });
      };
      
      // Helper function to open Kitty
      const openKitty = () => {
        console.log('🚀 Opening Kitty...');
        exec(`open -a kitty --args --directory="${normalizedPath}"`, (error) => {
          if (error) {
            console.error(`Error opening Kitty: ${error.message}`);
            // Try alternative approach
            exec(`kitty --directory="${normalizedPath}"`, (err2) => {
              if (err2) console.error(`Kitty alternative failed: ${err2.message}`);
            });
          } else {
            console.log('✅ Kitty opened successfully');
          }
        });
      };
      
      // Helper function to open Alacritty
      const openAlacritty = () => {
        console.log('🚀 Opening Alacritty...');
        exec(`open -a Alacritty --args --working-directory "${normalizedPath}"`, (error) => {
          if (error) {
            console.error(`Error opening Alacritty: ${error.message}`);
          } else {
            console.log('✅ Alacritty opened successfully');
          }
        });
      };
      
      // Helper function to open Warp
      const openWarp = () => {
        console.log('🚀 Opening Warp...');
        exec(`open -a Warp "${normalizedPath}"`, (error) => {
          if (error) {
            console.error(`Error opening Warp: ${error.message}`);
          } else {
            console.log('✅ Warp opened successfully');
          }
        });
      };
      
      // Helper function to open Hyper
      const openHyper = () => {
        console.log('🚀 Opening Hyper...');
        exec(`open -a Hyper "${normalizedPath}"`, (error) => {
          if (error) {
            console.error(`Error opening Hyper: ${error.message}`);
          } else {
            console.log('✅ Hyper opened successfully');
          }
        });
      };
      
      // Route based on preference
      if (terminalPreference === 'iTerm') {
        openITerm();
      } else if (terminalPreference === 'Terminal') {
        openTerminal();
      } else if (terminalPreference === 'kitty') {
        openKitty();
      } else if (terminalPreference === 'alacritty') {
        openAlacritty();
      } else if (terminalPreference === 'warp') {
        openWarp();
      } else if (terminalPreference === 'hyper') {
        openHyper();
      } else {
        // Default: Auto-detect - Try iTerm first (if installed), then Terminal
        console.log('🔍 Auto-detecting terminal...');
        if (fs.existsSync('/Applications/iTerm.app')) {
          console.log('✅ iTerm found, using iTerm');
          openITerm();
        } else if (fs.existsSync('/Applications/Warp.app')) {
          console.log('✅ Warp found, using Warp');
          openWarp();
        } else if (fs.existsSync('/Applications/kitty.app')) {
          console.log('✅ Kitty found, using Kitty');
          openKitty();
        } else if (fs.existsSync('/Applications/Alacritty.app')) {
          console.log('✅ Alacritty found, using Alacritty');
          openAlacritty();
        } else if (fs.existsSync('/Applications/Hyper.app')) {
          console.log('✅ Hyper found, using Hyper');
          openHyper();
        } else {
          console.log('Using default Terminal.app');
          openTerminal();
        }
      }
    } else if (isLinux) {
      // Linux: Use preference or default
      console.log(`Linux terminal preference: ${terminalPreference || 'auto-detect'}`);
      
      const terminals = [
        { cmd: 'gnome-terminal', args: ['--working-directory', normalizedPath], name: 'gnome-terminal' },
        { cmd: 'konsole', args: ['--workdir', normalizedPath], name: 'konsole' },
        { cmd: 'xterm', args: ['-e', `cd "${normalizedPath}" && exec $SHELL`], name: 'xterm' },
        { cmd: 'x-terminal-emulator', args: ['-e', `cd "${normalizedPath}" && exec $SHELL`], name: 'x-terminal-emulator' }
      ];
      
      // Helper function to try terminals
      const tryTerminalFallback = () => {
        let terminalFound = false;
        const tryTerminal = (index) => {
          if (index >= terminals.length) {
            // No terminal found, try xdg-open as fallback
            exec(`xdg-open "${normalizedPath}"`, (xdgError) => {
              if (xdgError) {
                console.error(`Error opening terminal: ${xdgError}`);
              }
            });
            return;
          }
          
          const terminal = terminals[index];
          exec(`which ${terminal.cmd}`, (error) => {
            if (!error && !terminalFound) {
              terminalFound = true;
              console.log(`✅ Using ${terminal.name}`);
              spawn(terminal.cmd, terminal.args, { detached: true });
            } else {
              tryTerminal(index + 1);
            }
          });
        };
        
        tryTerminal(0);
      };
      
      if (terminalPreference && terminalPreference !== 'system-default') {
        // Use preferred terminal
        const preferredTerminal = terminals.find(t => t.name === terminalPreference);
        if (preferredTerminal) {
          exec(`which ${preferredTerminal.cmd}`, (error) => {
            if (!error) {
              console.log(`✅ Opening ${terminalPreference}`);
              spawn(preferredTerminal.cmd, preferredTerminal.args, { detached: true });
            } else {
              console.error(`Preferred terminal ${terminalPreference} not found, using default`);
              // Fallback to default behavior
              tryTerminalFallback();
            }
          });
        } else {
          tryTerminalFallback();
        }
      } else {
        // Default: Try to detect and use available terminal
        tryTerminalFallback();
      }
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error opening in terminal:', err);
    return { success: false, error: err.message };
  }
});

// ========================================
// Permission Fixing
// ========================================

// Fix permissions for a project
ipcMain.handle('fix-project-permissions', async (_event, projectPath) => {
  try {
    console.log(`🔧 Manual permission fix requested for: ${projectPath}`);
    
    if (!isValidProjectPath(projectPath)) {
      return { 
        success: false, 
        error: 'Invalid project path provided.' 
      };
    }
    
    // Check current permissions
    const beforeCheck = await checkExecutePermissions(projectPath);
    console.log('Permissions before fix:', beforeCheck);
    
    // Attempt to fix
    const fixResult = await fixProjectPermissions(projectPath);
    
    if (!fixResult.success) {
      return {
        success: false,
        error: 'Could not fix permissions automatically.',
        manual: fixResult.manual,
        diagnostics: {
          before: beforeCheck.diagnostics,
          fixAttempts: fixResult.results
        }
      };
    }
    
    // Verify fix worked
    const afterCheck = await checkExecutePermissions(projectPath);
    console.log('Permissions after fix:', afterCheck);
    
    if (afterCheck.success) {
      return {
        success: true,
        message: 'Permissions fixed successfully!',
        diagnostics: {
          before: beforeCheck.diagnostics,
          after: afterCheck.diagnostics
        }
      };
    } else {
      const manualCmd = isWindows 
        ? `icacls "${projectPath}" /grant "%USERNAME%:F" /T`
        : `sudo chmod -R u+rwX "${projectPath}" && sudo chown -R $(whoami) "${projectPath}"`;
      
      return {
        success: false,
        error: 'Permission fix was attempted but some issues remain.',
        manual: manualCmd,
        diagnostics: {
          before: beforeCheck.diagnostics,
          after: afterCheck.diagnostics,
          remainingIssues: afterCheck.diagnostics.issues
        }
      };
    }
  } catch (err) {
    console.error('Error fixing permissions:', err);
    return { 
      success: false, 
      error: err.message 
    };
  }
});

// Aggressive fix - delete node_modules and reinstall
ipcMain.handle('aggressive-permission-fix', async (_event, projectPath) => {
  try {
    console.log(`🔧 Aggressive permission fix requested for: ${projectPath}`);
    
    if (!isValidProjectPath(projectPath)) {
      return { 
        success: false, 
        error: 'Invalid project path provided.' 
      };
    }
    
    const result = await aggressivePermissionFix(projectPath);
    return result;
  } catch (err) {
    console.error('Error in aggressive fix:', err);
    return { 
      success: false, 
      error: err.message 
    };
  }
});

// Check permissions for a project (diagnostic)
ipcMain.handle('check-project-permissions', async (_event, projectPath) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { 
        success: false, 
        error: 'Invalid project path provided.' 
      };
    }
    
    const check = await checkExecutePermissions(projectPath);
    return {
      success: true,
      hasPermissions: check.success,
      diagnostics: check.diagnostics
    };
  } catch (err) {
    console.error('Error checking permissions:', err);
    return { 
      success: false, 
      error: err.message 
    };
  }
});

// ========================================
// External Process Detection
// ========================================

// Detect all Node.js dev servers running on the machine
ipcMain.handle('detect-external-processes', async () => {
  try {
    const externalProcesses = await detectExternalNodeProcesses();
    // Only log if processes found to reduce console spam
    if (externalProcesses.length > 0) {
      console.log(`Found ${externalProcesses.length} external Node.js processes`);
    }
    return { success: true, processes: externalProcesses };
  } catch (err) {
    console.error('Error detecting external processes:', err);
    return { success: false, error: err.message, processes: [] };
  }
});

// Check what's running on a specific port
ipcMain.handle('check-port-process', async (_event, port) => {
  try {
    const process = await getProcessOnPort(port);
    return { success: true, process };
  } catch (err) {
    console.error(`Error checking port ${port}:`, err);
    return { success: false, error: err.message };
  }
});

// Kill an external process by PID
ipcMain.handle('kill-external-process', async (_event, pid) => {
  try {
    console.log(`Attempting to kill external process with PID: ${pid}`);
    
    if (isWindows) {
      // Windows: Use taskkill
      exec(`taskkill /F /T /PID ${pid}`, (error) => {
        if (error) {
          console.warn(`Windows taskkill error: ${error.message}`);
        }
      });
    } else {
      // Unix-like: Use kill command
      try {
        process.kill(parseInt(pid), 'SIGTERM');
        
        // Give it a moment, then force kill if still running
        setTimeout(() => {
          try {
            process.kill(parseInt(pid), 'SIGKILL');
          } catch (e) {
            // Process already dead, ignore
          }
        }, 2000);
      } catch (e) {
        if (e.code !== 'ESRCH') { // ESRCH means process doesn't exist
          throw e;
        }
      }
    }
    
    console.log(`✅ Killed external process ${pid}`);
    return { success: true };
  } catch (err) {
    console.error(`Error killing external process ${pid}:`, err);
    return { success: false, error: err.message };
  }
});

// ========================================
// Blueprints / Modules System
// ========================================

const blueprintManager = require('./utils/blueprintManager');

// Initialize blueprints for a project
ipcMain.handle('init-blueprints', async (_event, projectPath) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }
    const blueprints = await blueprintManager.initTafilFolder(projectPath);
    return { success: true, blueprints };
  } catch (err) {
    console.error('Error initializing blueprints:', err);
    return { success: false, error: err.message };
  }
});

// Check if .tafil folder exists
ipcMain.handle('check-tafil-exists', async (_event, projectPath) => {
  try {
    const exists = await blueprintManager.checkTafilExists(projectPath);
    return { success: true, exists };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Load blueprints for a project
ipcMain.handle('load-blueprints', async (_event, projectPath) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }
    const blueprints = await blueprintManager.loadBlueprints(projectPath);
    return { success: true, blueprints };
  } catch (err) {
    console.error('Error loading blueprints:', err);
    return { success: false, error: err.message };
  }
});

// Create a new module
ipcMain.handle('create-module', async (_event, projectPath, moduleData) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }
    const module = await blueprintManager.createModule(projectPath, moduleData);
    return { success: true, module };
  } catch (err) {
    console.error('Error creating module:', err);
    return { success: false, error: err.message };
  }
});

// Update a module
ipcMain.handle('update-module', async (_event, projectPath, moduleId, updates) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }
    const module = await blueprintManager.updateModule(projectPath, moduleId, updates);
    return { success: true, module };
  } catch (err) {
    console.error('Error updating module:', err);
    return { success: false, error: err.message };
  }
});

// Delete a module
ipcMain.handle('delete-module', async (_event, projectPath, moduleId) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }
    await blueprintManager.deleteModule(projectPath, moduleId);
    return { success: true };
  } catch (err) {
    console.error('Error deleting module:', err);
    return { success: false, error: err.message };
  }
});

// Reorder modules
ipcMain.handle('reorder-modules', async (_event, projectPath, moduleIds) => {
  try {
    if (!isValidProjectPath(projectPath)) {
      return { success: false, error: 'Invalid project path' };
    }
    const modules = await blueprintManager.reorderModules(projectPath, moduleIds);
    return { success: true, modules };
  } catch (err) {
    console.error('Error reordering modules:', err);
    return { success: false, error: err.message };
  }
});

// Get module goal/description
ipcMain.handle('get-module-goal', async (_event, projectPath, moduleId) => {
  try {
    const goal = await blueprintManager.getModuleGoal(projectPath, moduleId);
    return { success: true, goal };
  } catch (err) {
    console.error('Error getting module goal:', err);
    return { success: false, error: err.message };
  }
});

// Save module goal/description
ipcMain.handle('save-module-goal', async (_event, projectPath, moduleId, content) => {
  try {
    await blueprintManager.saveModuleGoal(projectPath, moduleId, content);
    return { success: true };
  } catch (err) {
    console.error('Error saving module goal:', err);
    return { success: false, error: err.message };
  }
});

// Get module editor (code scratchpad)
ipcMain.handle('get-module-editor', async (_event, projectPath, moduleId) => {
  try {
    const content = await blueprintManager.getModuleEditor(projectPath, moduleId);
    return { success: true, content };
  } catch (err) {
    console.error('Error getting module editor:', err);
    return { success: false, error: err.message };
  }
});

// Save module editor (code scratchpad)
ipcMain.handle('save-module-editor', async (_event, projectPath, moduleId, content) => {
  try {
    await blueprintManager.saveModuleEditor(projectPath, moduleId, content);
    return { success: true };
  } catch (err) {
    console.error('Error saving module editor:', err);
    return { success: false, error: err.message };
  }
});

// Get module tasks (Kanban)
ipcMain.handle('get-module-tasks', async (_event, projectPath, moduleId) => {
  try {
    const tasks = await blueprintManager.getModuleTasks(projectPath, moduleId);
    return { success: true, tasks };
  } catch (err) {
    console.error('Error getting module tasks:', err);
    return { success: false, error: err.message };
  }
});

// Save module tasks
ipcMain.handle('save-module-tasks', async (_event, projectPath, moduleId, tasksData) => {
  try {
    await blueprintManager.saveModuleTasks(projectPath, moduleId, tasksData);
    return { success: true };
  } catch (err) {
    console.error('Error saving module tasks:', err);
    return { success: false, error: err.message };
  }
});

// Add a task
ipcMain.handle('add-task', async (_event, projectPath, moduleId, columnId, taskData) => {
  try {
    const task = await blueprintManager.addTask(projectPath, moduleId, columnId, taskData);
    return { success: true, task };
  } catch (err) {
    console.error('Error adding task:', err);
    return { success: false, error: err.message };
  }
});

// Update a task
ipcMain.handle('update-task', async (_event, projectPath, moduleId, taskId, updates) => {
  try {
    const task = await blueprintManager.updateTask(projectPath, moduleId, taskId, updates);
    return { success: true, task };
  } catch (err) {
    console.error('Error updating task:', err);
    return { success: false, error: err.message };
  }
});

// Move a task
ipcMain.handle('move-task', async (_event, projectPath, moduleId, taskId, toColumnId, toIndex) => {
  try {
    const task = await blueprintManager.moveTask(projectPath, moduleId, taskId, toColumnId, toIndex);
    return { success: true, task };
  } catch (err) {
    console.error('Error moving task:', err);
    return { success: false, error: err.message };
  }
});

// Delete a task
ipcMain.handle('delete-task', async (_event, projectPath, moduleId, taskId) => {
  try {
    await blueprintManager.deleteTask(projectPath, moduleId, taskId);
    return { success: true };
  } catch (err) {
    console.error('Error deleting task:', err);
    return { success: false, error: err.message };
  }
});

// Get module canvas (Excalidraw)
ipcMain.handle('get-module-canvas', async (_event, projectPath, moduleId) => {
  try {
    const canvas = await blueprintManager.getModuleCanvas(projectPath, moduleId);
    return { success: true, canvas };
  } catch (err) {
    console.error('Error getting module canvas:', err);
    return { success: false, error: err.message };
  }
});

// Save module canvas
ipcMain.handle('save-module-canvas', async (_event, projectPath, moduleId, canvasData) => {
  try {
    await blueprintManager.saveModuleCanvas(projectPath, moduleId, canvasData, false);
    return { success: true };
  } catch (err) {
    console.error('Error saving module canvas:', err);
    return { success: false, error: err.message };
  }
});

// Get module resources
ipcMain.handle('get-module-resources', async (_event, projectPath, moduleId) => {
  try {
    const resources = await blueprintManager.getModuleResources(projectPath, moduleId);
    return { success: true, resources };
  } catch (err) {
    console.error('Error getting module resources:', err);
    return { success: false, error: err.message };
  }
});

// Add a link resource
ipcMain.handle('add-module-link', async (_event, projectPath, moduleId, linkData) => {
  try {
    const link = await blueprintManager.addLink(projectPath, moduleId, linkData);
    return { success: true, link };
  } catch (err) {
    console.error('Error adding link:', err);
    return { success: false, error: err.message };
  }
});

// Add a file reference
ipcMain.handle('add-module-file', async (_event, projectPath, moduleId, fileData) => {
  try {
    const file = await blueprintManager.addFileReference(projectPath, moduleId, fileData);
    return { success: true, file };
  } catch (err) {
    console.error('Error adding file reference:', err);
    return { success: false, error: err.message };
  }
});

// Remove a resource
ipcMain.handle('remove-module-resource', async (_event, projectPath, moduleId, resourceId, type) => {
  try {
    await blueprintManager.removeResource(projectPath, moduleId, resourceId, type);
    return { success: true };
  } catch (err) {
    console.error('Error removing resource:', err);
    return { success: false, error: err.message };
  }
});

// Search modules
ipcMain.handle('search-modules', async (_event, projectPath, query) => {
  try {
    const results = await blueprintManager.searchModules(projectPath, query);
    return { success: true, results };
  } catch (err) {
    console.error('Error searching modules:', err);
    return { success: false, error: err.message };
  }
});

// Get module history
ipcMain.handle('get-module-history', async (_event, projectPath, moduleId, type) => {
  try {
    const history = await blueprintManager.getModuleHistory(projectPath, moduleId, type);
    return { success: true, history };
  } catch (err) {
    console.error('Error getting module history:', err);
    return { success: false, error: err.message };
  }
});

// Restore from history
ipcMain.handle('restore-from-history', async (_event, projectPath, moduleId, filename) => {
  try {
    const result = await blueprintManager.restoreFromHistory(projectPath, moduleId, filename);
    return { success: true, result };
  } catch (err) {
    console.error('Error restoring from history:', err);
    return { success: false, error: err.message };
  }
});

// Export module data
ipcMain.handle('export-module', async (_event, projectPath, moduleId) => {
  try {
    const data = await blueprintManager.exportModule(projectPath, moduleId);
    return { success: true, data };
  } catch (err) {
    console.error('Error exporting module:', err);
    return { success: false, error: err.message };
  }
});

// Open file in IDE (deep link support)
ipcMain.handle('open-file-in-ide', async (_event, projectPath, filePath, ideCommand) => {
  try {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(projectPath, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return { success: false, error: 'File not found' };
    }
    
    const ide = ideCommand || 'code'; // Default to VS Code
    
    return new Promise((resolve) => {
      exec(`${ide} "${fullPath}"`, (error) => {
        if (error) {
          console.error('Error opening file in IDE:', error);
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true });
        }
      });
    });
  } catch (err) {
    console.error('Error opening file in IDE:', err);
    return { success: false, error: err.message };
  }
});

// Browse for file (for deep linking)
ipcMain.handle('browse-for-file', async (_event, projectPath) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      defaultPath: projectPath,
      properties: ['openFile'],
      title: 'Select File to Link'
    });
    
    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }
    
    const selectedPath = result.filePaths[0];
    // Make path relative if it's inside the project
    let relativePath = selectedPath;
    if (selectedPath.startsWith(projectPath)) {
      relativePath = selectedPath.substring(projectPath.length + 1);
    }
    
    return { 
      success: true, 
      path: selectedPath,
      relativePath,
      name: path.basename(selectedPath)
    };
  } catch (err) {
    console.error('Error browsing for file:', err);
    return { success: false, error: err.message };
  }
});

// Cleanup on quit
app.on('before-quit', () => {
  runningProcesses.forEach((info, projectPath) => {
    try {
      const child = info?.process || info;
      const pid = child?.pid;
      if (!pid) return;

      console.log(`Cleaning up process for ${projectPath} (PID ${pid})`);

      if (isWindows) {
        exec(`taskkill /F /T /PID ${pid}`, (error) => {
          if (error) console.warn(`Windows taskkill error (quit cleanup): ${error.message}`);
        });
        return;
      }

      // Try to kill the entire process tree
      psTree(pid, (err, children) => {
        if (!err && Array.isArray(children)) {
          children.forEach((c) => {
            try {
              process.kill(parseInt(c.PID, 10), 'SIGTERM');
            } catch (e) {
              console.warn(`Failed to kill child process ${c.PID}:`, e);
            }
          });
        }

        // Kill the main process
        try {
          process.kill(parseInt(pid, 10), 'SIGTERM');
        } catch (e) {
          console.warn(`Failed to kill main process ${pid}:`, e);
        }
      });
    } catch (err) {
      console.error('Failed to kill process on quit:', err);
    }
  });
  runningProcesses.clear();
});
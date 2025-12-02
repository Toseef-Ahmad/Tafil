// main.js
const { app, BrowserWindow, ipcMain, dialog, shell, MenuItem, Menu, nativeImage, Tray } = require('electron');
const os = require("os");
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const psTree = require('ps-tree');
const { exec, spawn } = require('child_process');
const portfinder = require('portfinder');
const { scanNodeProjects } = require('./utils/gitScanner');

const {
  installDependencies,
  removeNodeModules,
} = require('./utils/projectActions');

// Platform detection
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

console.log(`Running on: ${process.platform} (${os.type()} ${os.release()})`);

const isDev = !app.isPackaged;
if (process.env.NODE_ENV !== 'development') {
  process.env.NODE_ENV = 'production';
}

let mainWindow;
let runningProcesses = new Map();

// path to your tray icon .png or .ico
let tray = null;

/**
 * Validate that a project path is legitimate and safe (CROSS-PLATFORM)
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
  
  // Ensure it's an absolute path
  if (!path.isAbsolute(normalizedPath)) {
    console.log('Validation failed: path is not absolute');
    return false;
  }
  
  // Check if the path exists
  try {
    const exists = fs.existsSync(normalizedPath);
    console.log('Path exists:', exists);
    return exists;
  } catch (err) {
    console.error(`Error checking project path: ${err.message}`);
    return false;
  }
}

/**
 * Get the appropriate npm command for the platform
 */
function getNpmCommand() {
  return isWindows ? 'npm.cmd' : 'npm';
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

// ensureAdminPrivileges();
// Once app is ready, create the tray
app.whenReady().then(() => {
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

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy':
          "default-src 'self'; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "script-src 'self' https://kit.fontawesome.com; " +
          "img-src 'self' data:; " +
          "font-src 'self' data: https://fonts.gstatic.com; " +
          "connect-src 'self' https://ka-f.fontawesome.com;",
      },
    });
  });

  mainWindow.on('closed', () => {
    // Kill all child processes on window close
    for (const [projectPath, childProcess] of runningProcesses.entries()) {
      if (childProcess && !childProcess.killed) {
        try {
          // Try graceful shutdown first
          childProcess.kill('SIGTERM');
          
          // Force kill after 5 seconds if still running
          setTimeout(() => {
            if (!childProcess.killed) {
              console.log(`Force killing process for ${projectPath}`);
              childProcess.kill('SIGKILL');
            }
          }, 5000);
        } catch (err) {
          console.error(`Error killing process for ${projectPath}:`, err);
        }
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
// IPC Handlers
// -------------------------------------------------

// 1) Scan all Node.js projects in the home dir
ipcMain.handle('scan-all-projects', async () => {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const projects = await scanNodeProjects(homeDir);
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
    return projects;
  } catch (err) {
    console.error('Error scanning custom folder:', err);
    throw err;
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

// 2) Check process status by pid
ipcMain.handle('check-process-status', async (_event, pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
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


// Helper to check if we have execution permissions
async function checkExecutePermissions(projectPath) {
  try {
    const stats = await fsPromises.stat(projectPath);
    const mode = stats.mode;
    // Check if we have read & execute permissions
    return !!(mode & fs.constants.S_IRUSR && mode & fs.constants.S_IXUSR);
  } catch (err) {
    console.error('Error checking permissions:', err);
    return false;
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
 */
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
    const hasPermissions = await checkExecutePermissions(projectPath);
    if (!hasPermissions) {
      throw new Error('Insufficient permissions to execute project. Please check folder permissions.');
    }

    // Detect project type and framework
    const projectInfo = await detectProjectType(projectPath);
    console.log(`Detected project type: ${projectInfo.type} (default port: ${projectInfo.defaultPort})`);

    // Read package.json for scripts
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};

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
        console.log(`⚠️ Default port ${projectInfo.defaultPort} is occupied. Finding fallback port...`);
        const fallbackPort = await findAvailablePort(projectInfo.defaultPort + 1);
        
        if (fallbackPort) {
          console.log(`✅ Found fallback port: ${fallbackPort}`);
          suggestedPort = fallbackPort;
        } else {
          console.error(`❌ No fallback ports available`);
          return {
            success: false,
            error: `Port ${projectInfo.defaultPort} is occupied and no fallback ports available. Please close other services or specify a custom port.`
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

    // Prepare environment variables based on framework
    const env = {
      ...process.env,
      FORCE_COLOR: '1',
    };

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
    const args = scriptParts.slice(1); // ['run', 'dev']
    
    // Build spawn options - Cross-platform compatible
    const spawnOptions = {
      cwd: projectPath,
      shell: isWindows ? true : getShell(), // Use proper shell on each platform
      env,
      stdio: ['pipe', 'pipe', 'pipe'], // Enable stdin, stdout, stderr pipes for interaction
    };
    
    // Add Windows-specific options
    if (isWindows) {
      spawnOptions.windowsHide = true; // Hide the console window
      spawnOptions.windowsVerbatimArguments = false;
      // Don't detach on Windows - we need to capture output
    }
    
    // Build the command properly for each platform
    let spawnCmd, spawnArgs;
    
    if (isWindows) {
      // On Windows, use cmd /c to run npm commands
      spawnCmd = process.env.COMSPEC || 'cmd.exe';
      spawnArgs = ['/c', `${npmCmd} ${args.join(' ')}`];
      console.log(`Spawning (Windows): ${spawnCmd} ${spawnArgs.join(' ')}`);
    } else {
      // On Unix-like systems
      spawnCmd = npmCmd;
      spawnArgs = args;
      console.log(`Spawning: ${spawnCmd} ${spawnArgs.join(' ')}`);
    }
    
    const child = spawn(spawnCmd, spawnArgs, spawnOptions);

    runningProcesses.set(projectPath, child);
    updateTrayMenu(runningProcesses);
    
    let actualPort = null;
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
                console.log(`✅ Detected actual running port: ${actualPort} for ${projectInfo.type}`);
                
                mainWindow?.webContents.send('project-status', {
                  projectPath,
                  status: 'running',
                  port: actualPort,
                  pid: child.pid,
                  framework: projectInfo.type,
                });
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
    child.stderr.on('data', (data) => {
      const error = data.toString();
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
      console.error(`Error running project at ${projectPath}:`, err.message);
      mainWindow?.webContents.send('project-status', {
        projectPath,
        status: 'error',
        error: err.message,
      });
      runningProcesses.delete(projectPath);
    });

    // Handle exit
    child.on('exit', (code, signal) => {
      console.log(`❌ Process exited for ${projectPath}. Code: ${code}, Signal: ${signal}`);
      
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
      
      mainWindow?.webContents.send('project-status', {
        projectPath,
        status,
        code,
        signal,
        error: errorMessage,
      });
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
    
    const childProcess = runningProcesses.get(projectPath);
    if (!childProcess) {
      console.log(`No running process found for ${projectPath}`);
      return { success: false, message: 'Project not running' };
    }

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
        exec(cmd, { shell: true, windowsHide: false }, (error) => {
          if (error) {
            console.error(`Error opening with Windows path:`, error);
            // Fallback: try direct execution
            exec(`${ideCommand} "${normalizedPath}"`, { shell: true }, (fallbackError) => {
              if (fallbackError) {
                console.error(`Fallback also failed:`, fallbackError);
                // Last resort: open in explorer
                exec(`explorer "${normalizedPath}"`);
              }
            });
          }
        });
      } else if (isWindows) {
        // Windows with CLI command (like 'code')
        const cmd = `${ideCommand} "${normalizedPath}"`;
        console.log(`Windows CLI command: ${cmd}`);
        exec(cmd, { shell: true }, (error) => {
          if (error) {
            console.error(`Error opening with ${ideCommand}:`, error);
            // Try with start command
            exec(`start "" ${ideCommand} "${normalizedPath}"`, { shell: true }, (startError) => {
              if (startError) {
                console.error(`Start command also failed:`, startError);
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
        // Try code command first
        exec(`code "${normalizedPath}"`, { shell: true }, (error) => {
          if (error) {
            console.log('VS Code CLI not found, trying VS Code path...');
            const vscodePath = `${process.env['LOCALAPPDATA']}\\Programs\\Microsoft VS Code\\Code.exe`;
            if (fs.existsSync(vscodePath)) {
              exec(`start "" "${vscodePath}" "${normalizedPath}"`, { shell: true }, (pathError) => {
                if (pathError) {
                  console.log('VS Code not found, opening in Explorer...');
                  exec(`explorer "${normalizedPath}"`);
                }
              });
            } else {
              console.log('VS Code not found, opening in Explorer...');
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
        const psCommand = `start powershell -NoExit -Command "Set-Location -Path '${normalizedPath.replace(/'/g, "''")}'"`; 
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
        const cmdCommand = `start cmd /k "cd /d "${normalizedPath}""`;
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

// Cleanup on quit
app.on('before-quit', () => {
  runningProcesses.forEach((childProcess, projectPath) => {
    try {
      if (childProcess && !childProcess.killed) {
        console.log(`Cleaning up process for ${projectPath}`);
        
        // Try to kill the entire process tree
        psTree(childProcess.pid, (err, children) => {
          if (!err) {
            children.forEach((child) => {
              try {
                process.kill(parseInt(child.PID), 'SIGTERM');
              } catch (e) {
                console.warn(`Failed to kill child process ${child.PID}:`, e);
              }
            });
          }
          
          // Kill the main process
          try {
            process.kill(childProcess.pid, 'SIGTERM');
          } catch (e) {
            console.warn(`Failed to kill main process ${childProcess.pid}:`, e);
          }
        });
      }
    } catch (err) {
      console.error('Failed to kill process on quit:', err);
    }
  });
  runningProcesses.clear();
});
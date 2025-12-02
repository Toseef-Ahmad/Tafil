// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ~~~~~~~~~~~~~~ Project scanning ~~~~~~~~~~~~~~
  scanAllProjects: () => ipcRenderer.invoke('scan-all-projects'),
  scanCustomFolder: () => ipcRenderer.invoke('scan-custom-folder'),
  getInstalledIDEs: () => ipcRenderer.invoke('get-installed-ides'),
  getInstalledTerminals: () => ipcRenderer.invoke('get-installed-terminals'),

  // ~~~~~~~~~~~~~~ Running/Stopping ~~~~~~~~~~~~~~
  playProject: (projectPath, customPort) => ipcRenderer.invoke('play-project', projectPath, customPort),
  stopProject: (projectPath) => ipcRenderer.invoke('stop-project', projectPath),
  checkProcessStatus: (pid) => ipcRenderer.invoke('check-process-status', pid),

  // ~~~~~~~~~~~~~~ Dependencies ~~~~~~~~~~~~~~
  installDependencies: (projectPath) =>
    ipcRenderer.invoke('install-dependencies', projectPath),
  removeNodeModules: (projectPath) =>
    ipcRenderer.invoke('remove-node-modules', projectPath),
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),

  // ~~~~~~~~~~~~~~ Opening ~~~~~~~~~~~~~~
  openInBrowser: (port) => ipcRenderer.invoke('open-in-browser', port),
  openInEditor: (projectPath, ideCommand) => ipcRenderer.invoke('open-in-editor', projectPath, ideCommand),
  openInTerminal: (projectPath, terminalPreference) => ipcRenderer.invoke('open-in-terminal', projectPath, terminalPreference),

  // ~~~~~~~~~~~~~~ External Process Detection ~~~~~~~~~~~~~~
  detectExternalProcesses: () => ipcRenderer.invoke('detect-external-processes'),
  checkPortProcess: (port) => ipcRenderer.invoke('check-port-process', port),
  killExternalProcess: (pid) => ipcRenderer.invoke('kill-external-process', pid),

  // ~~~~~~~~~~~~~~ From main to renderer ~~~~~~~~~~~~~~
  onProjectStatus: (callback) => ipcRenderer.on('project-status', callback),

  // Forward logs from main (stderr warnings, etc.)
  onProjectLogs: (callback) => ipcRenderer.on('project-logs', callback),

  onTrayOpenBrowser: (callback) => ipcRenderer.on('tray-open-browser', callback),
  onTrayOpenEditor: (callback) => ipcRenderer.on('tray-open-editor', callback),
  onTrayStopProject: (callback) => ipcRenderer.on('tray-stop-project', callback),
});
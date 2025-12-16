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
  getProjectBrain: (projectPath) => ipcRenderer.invoke('get-project-brain', projectPath),
  saveProjectArchitecture: (projectPath, architectureData) => ipcRenderer.invoke('save-project-architecture', projectPath, architectureData),
  getProjectArchitecture: (projectPath) => ipcRenderer.invoke('get-project-architecture', projectPath),
  updateProjectNotes: (projectPath, notes) => ipcRenderer.invoke('update-project-notes', projectPath, notes),

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

  // ~~~~~~~~~~~~~~ JavaScript Playground ~~~~~~~~~~~~~~
  executeJS: (code) => ipcRenderer.invoke('execute-js', code),

  // ~~~~~~~~~~~~~~ SSH Module ~~~~~~~~~~~~~~
  selectSSHKeyFile: () => ipcRenderer.invoke('select-ssh-key-file'),
  saveSSHHost: (host) => ipcRenderer.invoke('save-ssh-host', host),
  connectSSHHost: (host) => ipcRenderer.invoke('connect-ssh-host', host),
  disconnectSSH: (sessionId) => ipcRenderer.invoke('disconnect-ssh', sessionId),
  sendSSHInput: (sessionId, data) => ipcRenderer.invoke('send-ssh-input', sessionId, data),
  onSSHData: (callback) => ipcRenderer.on('ssh-data', callback),

  // ~~~~~~~~~~~~~~ Permission Management ~~~~~~~~~~~~~~
  fixProjectPermissions: (projectPath) => ipcRenderer.invoke('fix-project-permissions', projectPath),
  checkProjectPermissions: (projectPath) => ipcRenderer.invoke('check-project-permissions', projectPath),
  aggressivePermissionFix: (projectPath) => ipcRenderer.invoke('aggressive-permission-fix', projectPath),

  // ~~~~~~~~~~~~~~ Environment Snapshot & Restore (Pro Feature) ~~~~~~~~~~~~~~
  createEnvironmentSnapshot: (projectPath, options) => ipcRenderer.invoke('create-environment-snapshot', projectPath, options),
  getEnvironmentSnapshot: (projectPath) => ipcRenderer.invoke('get-environment-snapshot', projectPath),
  restoreProject: (projectPath, options) => ipcRenderer.invoke('restore-project', projectPath, options),
  getRestoreInstructions: (projectPath) => ipcRenderer.invoke('get-restore-instructions', projectPath),
  validateSnapshotPrerequisites: (projectPath) => ipcRenderer.invoke('validate-snapshot-prerequisites', projectPath),

  // ~~~~~~~~~~~~~~ Error Context Notes (Memory Feature) ~~~~~~~~~~~~~~
  saveErrorNote: (projectPath, note, runId, errorKind) => ipcRenderer.invoke('save-error-note', projectPath, note, runId, errorKind),
  getErrorNotes: (projectPath, runId, errorKind) => ipcRenderer.invoke('get-error-notes', projectPath, runId, errorKind),

  // ~~~~~~~~~~~~~~ Blueprints / Modules System ~~~~~~~~~~~~~~
  initBlueprints: (projectPath) => ipcRenderer.invoke('init-blueprints', projectPath),
  checkTafilExists: (projectPath) => ipcRenderer.invoke('check-tafil-exists', projectPath),
  loadBlueprints: (projectPath) => ipcRenderer.invoke('load-blueprints', projectPath),
  
  // Module CRUD
  createModule: (projectPath, moduleData) => ipcRenderer.invoke('create-module', projectPath, moduleData),
  updateModule: (projectPath, moduleId, updates) => ipcRenderer.invoke('update-module', projectPath, moduleId, updates),
  deleteModule: (projectPath, moduleId) => ipcRenderer.invoke('delete-module', projectPath, moduleId),
  reorderModules: (projectPath, moduleIds) => ipcRenderer.invoke('reorder-modules', projectPath, moduleIds),
  
  // Module Goal/Description
  getModuleGoal: (projectPath, moduleId) => ipcRenderer.invoke('get-module-goal', projectPath, moduleId),
  saveModuleGoal: (projectPath, moduleId, content) => ipcRenderer.invoke('save-module-goal', projectPath, moduleId, content),
  
  // Module Tasks (Kanban)
  getModuleTasks: (projectPath, moduleId) => ipcRenderer.invoke('get-module-tasks', projectPath, moduleId),
  saveModuleTasks: (projectPath, moduleId, tasksData) => ipcRenderer.invoke('save-module-tasks', projectPath, moduleId, tasksData),
  addTask: (projectPath, moduleId, columnId, taskData) => ipcRenderer.invoke('add-task', projectPath, moduleId, columnId, taskData),
  updateTask: (projectPath, moduleId, taskId, updates) => ipcRenderer.invoke('update-task', projectPath, moduleId, taskId, updates),
  moveTask: (projectPath, moduleId, taskId, toColumnId, toIndex) => ipcRenderer.invoke('move-task', projectPath, moduleId, taskId, toColumnId, toIndex),
  deleteTask: (projectPath, moduleId, taskId) => ipcRenderer.invoke('delete-task', projectPath, moduleId, taskId),
  
  // Module Canvas (Excalidraw)
  getModuleCanvas: (projectPath, moduleId) => ipcRenderer.invoke('get-module-canvas', projectPath, moduleId),
  saveModuleCanvas: (projectPath, moduleId, canvasData) => ipcRenderer.invoke('save-module-canvas', projectPath, moduleId, canvasData),
  
  // Module Resources (Links & Files)
  getModuleResources: (projectPath, moduleId) => ipcRenderer.invoke('get-module-resources', projectPath, moduleId),
  addModuleLink: (projectPath, moduleId, linkData) => ipcRenderer.invoke('add-module-link', projectPath, moduleId, linkData),
  addModuleFile: (projectPath, moduleId, fileData) => ipcRenderer.invoke('add-module-file', projectPath, moduleId, fileData),
  removeModuleResource: (projectPath, moduleId, resourceId, type) => ipcRenderer.invoke('remove-module-resource', projectPath, moduleId, resourceId, type),
  
  // Search & History
  searchModules: (projectPath, query) => ipcRenderer.invoke('search-modules', projectPath, query),
  getModuleHistory: (projectPath, moduleId, type) => ipcRenderer.invoke('get-module-history', projectPath, moduleId, type),
  restoreFromHistory: (projectPath, moduleId, filename) => ipcRenderer.invoke('restore-from-history', projectPath, moduleId, filename),
  
  // Export & File Operations
  exportModule: (projectPath, moduleId) => ipcRenderer.invoke('export-module', projectPath, moduleId),
  openFileInIDE: (projectPath, filePath, ideCommand) => ipcRenderer.invoke('open-file-in-ide', projectPath, filePath, ideCommand),
  browseForFile: (projectPath) => ipcRenderer.invoke('browse-for-file', projectPath),

  // ~~~~~~~~~~~~~~ From main to renderer ~~~~~~~~~~~~~~
  onProjectStatus: (callback) => ipcRenderer.on('project-status', callback),

  // Forward logs from main (stderr warnings, etc.)
  onProjectLogs: (callback) => ipcRenderer.on('project-logs', callback),

  onTrayOpenBrowser: (callback) => ipcRenderer.on('tray-open-browser', callback),
  onTrayOpenEditor: (callback) => ipcRenderer.on('tray-open-editor', callback),
  onTrayStopProject: (callback) => ipcRenderer.on('tray-stop-project', callback),
});
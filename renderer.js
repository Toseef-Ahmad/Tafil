// renderer.js - Tafil Premium UI with Collections, Command Palette, Insights

// Helper for path operations
const path = {
  basename: (pathStr) => {
    return pathStr.split('/').pop() || pathStr.split('\\').pop() || pathStr;
  }
};

// =====================================================
// DOM Elements
// =====================================================
const projectListEl = document.getElementById("projectList");
const viewTitleEl = document.getElementById("viewTitle");
const viewSubtitleEl = document.getElementById("viewSubtitle");
const emptyStateEl = document.getElementById("emptyState");
const insightsPanelEl = document.getElementById("insightsPanel");
const insightsListEl = document.getElementById("insightsList");

// Sidebar elements
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const navAllProjects = document.getElementById("navAllProjects");
const navRunning = document.getElementById("navRunning");
const navInsights = document.getElementById("navInsights");
const allProjectsCountEl = document.getElementById("allProjectsCount");
const runningCountEl = document.getElementById("runningCount");
const runningNumEl = document.getElementById("runningNum");
const collectionsList = document.getElementById("collectionsList");
const addCollectionBtn = document.getElementById("addCollectionBtn");
const scanHomeBtn = document.getElementById("scanHomeBtn");
const scanFolderBtn = document.getElementById("scanFolderBtn");

// Header elements
const commandTrigger = document.getElementById("commandTrigger");
const refreshBtn = document.getElementById("refreshBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const moonIcon = document.getElementById("moonIcon");
const sunIcon = document.getElementById("sunIcon");
const ideCountEl = document.getElementById("ideCount");
const ideCountNum = document.getElementById("ideCountNum");

// Command Palette
const commandPalette = document.getElementById("commandPalette");
const commandInput = document.getElementById("commandInput");
const commandResults = document.getElementById("commandResults");

// Notifications
const notificationsContainer = document.getElementById("notificationsContainer");

// Modal elements
const dependencyModal = document.getElementById("dependencyModal");
const modalInstallBtn = document.getElementById("modalInstallBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const confirmDialog = document.getElementById("confirmDialog");
const confirmYesBtn = document.getElementById("confirmYesBtn");
const confirmNoBtn = document.getElementById("confirmNoBtn");
const logsModal = document.getElementById("logsModal");
const closeLogsBtn = document.getElementById("closeLogsBtn");
const logsContent = document.getElementById("logsContent");
const logsProjectName = document.getElementById("logsProjectName");

// Settings Modal
const settingsModal = document.getElementById("settingsModal");
const settingsBtn = document.getElementById("settingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const cancelSettingsBtn = document.getElementById("cancelSettingsBtn");
const defaultIdeList = document.getElementById("defaultIdeList");
const defaultTerminalList = document.getElementById("defaultTerminalList");
const noIdeMessage = document.getElementById("noIdeMessage");

// New Collection Modal
const newCollectionModal = document.getElementById("newCollectionModal");
const closeNewCollectionBtn = document.getElementById("closeNewCollectionBtn");
const newCollectionInput = document.getElementById("newCollectionInput");
const createCollectionBtn = document.getElementById("createCollectionBtn");

// Project Insights Modal
const projectInsightsModal = document.getElementById("projectInsightsModal");
const closeInsightsBtn = document.getElementById("closeInsightsBtn");
const insightsProjectName = document.getElementById("insightsProjectName");
const projectInsightsContent = document.getElementById("projectInsightsContent");

// Empty state buttons
const emptyStateScanHome = document.getElementById("emptyStateScanHome");
const emptyStateScanFolder = document.getElementById("emptyStateScanFolder");

// =====================================================
// State
// =====================================================
let currentProjects = [];
let filteredProjects = [];
let runningProjects = new Map();
let externalProjects = new Map(); // NEW: Track external running projects
let projectProcesses = new Map();
let activeConnections = new Map();
let projectLogs = new Map();
let projectStats = new Map();
let projectStatuses = new Map();
let lastRefreshTime = Date.now();
let pendingActionProject = null;
let pendingRemoveProject = null;
let installedIDEs = [];
let installedTerminals = [];
let isDarkMode = true;
let currentView = 'all';
let commandSelectedIndex = 0;
let commandItems = [];

// Collections
let collections = [
  { id: 'all', name: 'All Projects', icon: 'folder', isSystem: true },
  { id: 'running', name: 'Running', icon: 'play', isSystem: true },
  { id: 'uncategorized', name: 'Uncategorized', icon: 'inbox', isSystem: true }
];
let projectCollections = {}; // { projectPath: [collectionIds] }
let activeCollection = 'all';

// Settings
let defaultIDE = null;
let defaultTerminal = null;

const REFRESH_INTERVAL = 60000;
const REFRESH_THROTTLE = 5000;

// =====================================================
// SVG Icons
// =====================================================
const Icons = {
  play: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  stop: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect width="14" height="14" x="5" y="5" rx="1"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  terminal: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
  folder: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  gitBranch: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
  server: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
  chart: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  inbox: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  package: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
};

// =====================================================
// Initialize
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  console.log('🚀 Tafil initializing...');
  
  // Load saved data
  try {
    loadCollections();
    loadDarkModePreference();
    loadSettings();
  } catch (err) {
    console.error('Error loading saved data:', err);
  }
  
  // Load installed IDEs and Terminals
  try {
    installedIDEs = await window.electronAPI.getInstalledIDEs();
    console.log(`✅ Loaded ${installedIDEs.length} IDEs`);
    if (installedIDEs.length > 0 && ideCountNum && ideCountEl) {
      ideCountNum.textContent = installedIDEs.length;
      ideCountEl.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error loading IDEs:', err);
  }
  
  try {
    installedTerminals = await window.electronAPI.getInstalledTerminals();
    console.log(`✅ Loaded ${installedTerminals.length} Terminals`);
  } catch (err) {
    console.error('Error loading Terminals:', err);
  }
  
  // Render collections
  try {
    renderCollections();
  } catch (err) {
    console.error('Error rendering collections:', err);
  }
  
  // Event listeners - Sidebar
  console.log('📌 Attaching event listeners...');
  console.log('  - toggleSidebarBtn:', !!toggleSidebarBtn);
  console.log('  - scanHomeBtn:', !!scanHomeBtn);
  console.log('  - scanFolderBtn:', !!scanFolderBtn);
  console.log('  - addCollectionBtn:', !!addCollectionBtn);
  
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener("click", () => {
      console.log('Toggle sidebar clicked');
      toggleSidebar();
    });
  }
  if (navAllProjects) navAllProjects.addEventListener("click", () => switchView('all'));
  if (navRunning) navRunning.addEventListener("click", () => switchView('running'));
  if (navInsights) navInsights.addEventListener("click", () => switchView('insights'));
  if (scanHomeBtn) {
    scanHomeBtn.addEventListener("click", () => {
      console.log('Scan Home clicked');
      renderProjects();
    });
  }
  if (scanFolderBtn) {
    scanFolderBtn.addEventListener("click", () => {
      console.log('Scan Folder clicked');
      renderCustomProjects();
    });
  }
  if (addCollectionBtn) {
    addCollectionBtn.addEventListener("click", () => {
      console.log('Add Collection clicked');
      showNewCollectionModal();
    });
  }
  
  // Event listeners - Header
  if (commandTrigger) commandTrigger.addEventListener("click", showCommandPalette);
  if (refreshBtn) refreshBtn.addEventListener("click", () => {
    renderProjectCards(currentProjects);
    showNotification('Projects refreshed', 'success');
  });
  if (darkModeToggle) darkModeToggle.addEventListener("click", toggleDarkMode);
  
  // Event listeners - Settings
  if (settingsBtn) settingsBtn.addEventListener("click", showSettingsModal);
  if (closeSettingsBtn) closeSettingsBtn.addEventListener("click", hideSettingsModal);
  if (cancelSettingsBtn) cancelSettingsBtn.addEventListener("click", hideSettingsModal);
  if (saveSettingsBtn) saveSettingsBtn.addEventListener("click", saveSettings);
  
  // Event listeners - Modals
  if (modalCancelBtn) modalCancelBtn.addEventListener("click", hideModals);
  if (modalInstallBtn) modalInstallBtn.addEventListener("click", handleModalInstall);
  if (confirmNoBtn) confirmNoBtn.addEventListener("click", hideModals);
  if (confirmYesBtn) confirmYesBtn.addEventListener("click", handleConfirmRemove);
  if (closeLogsBtn) closeLogsBtn.addEventListener("click", () => logsModal?.classList.add("hidden"));
  
  // New Collection Modal
  if (closeNewCollectionBtn) closeNewCollectionBtn.addEventListener("click", () => newCollectionModal?.classList.add("hidden"));
  if (createCollectionBtn) createCollectionBtn.addEventListener("click", handleCreateCollection);
  if (newCollectionInput) newCollectionInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') handleCreateCollection();
  });
  
  // Project Insights Modal
  if (closeInsightsBtn) closeInsightsBtn.addEventListener("click", () => projectInsightsModal?.classList.add("hidden"));
  
  // Empty state buttons
  if (emptyStateScanHome) emptyStateScanHome.addEventListener("click", renderProjects);
  if (emptyStateScanFolder) emptyStateScanFolder.addEventListener("click", renderCustomProjects);
  
  // Command Palette
  if (commandInput) {
    commandInput.addEventListener("input", handleCommandInput);
    commandInput.addEventListener("keydown", handleCommandKeydown);
  }
  if (commandPalette) commandPalette.addEventListener("click", (e) => {
    if (e.target === commandPalette) hideCommandPalette();
  });
  
  // Click outside modals to close
  [dependencyModal, confirmDialog, logsModal, settingsModal, newCollectionModal, projectInsightsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
        }
      });
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);
  
  console.log('✅ Tafil initialized successfully!');

  // Listen for project status updates
  window.electronAPI.onProjectStatus((_event, statusData) => {
    const { projectPath, status, port, error, pid, framework } = statusData;
    console.log("Project Status:", statusData);

    if (status === "running") {
      runningProjects.set(projectPath, { port, status: "running", pid, framework: framework || 'Unknown' });
      projectProcesses.set(projectPath, pid);
      activeConnections.set(port, projectPath);
      setCardStatus(projectPath, `Running on :${port}`, 'success');
      showNotification(`${path.basename(projectPath)} started on port ${port}`, 'success');
      updateRunningCount();
      setTimeout(() => clearCardStatus(projectPath), 3000);
    } else if (status === "stopped") {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      for (const [port, projPath] of activeConnections.entries()) {
        if (projPath === projectPath) activeConnections.delete(port);
      }
      setCardStatus(projectPath, 'Stopped', 'success');
      showNotification(`${path.basename(projectPath)} stopped`, 'info');
      updateRunningCount();
      setTimeout(() => clearCardStatus(projectPath), 2000);
    } else if (status === "error") {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      setCardStatus(projectPath, error || "Error occurred", 'error');
      showNotification(`Error: ${error || 'Unknown error'}`, 'error');
      updateRunningCount();
    }

    updateSingleCard(projectPath);
  });

  // Tray actions
  window.electronAPI.onTrayOpenBrowser((_event, projectPath) => {
    const project = runningProjects.get(projectPath);
    if (project?.port) openInBrowser(project.port);
  });

  window.electronAPI.onTrayOpenEditor((_event, projectPath) => {
    openInEditor(projectPath);
  });

  window.electronAPI.onTrayStopProject((_event, projectPath) => {
    stopProject(projectPath);
  });

  // Project logs
  window.electronAPI.onProjectLogs?.((_event, logData) => {
    const { projectPath, type, log } = logData;
    const existingLogs = projectLogs.get(projectPath) || [];
    existingLogs.push(`[${type}] ${log}`);
    projectLogs.set(projectPath, existingLogs);
  });

  // Auto refresh
  setInterval(() => {
    if (document.visibilityState === "visible" && Date.now() - lastRefreshTime >= REFRESH_THROTTLE) {
      lastRefreshTime = Date.now();
      softRefreshProjects();
    }
  }, REFRESH_INTERVAL);

  // Verify processes
  setInterval(async () => {
    for (const [projectPath] of runningProjects) {
      await verifyProcessStatus(projectPath);
    }
  }, 5000);
  
  // Scan for external processes periodically
  scanExternalProcesses();
  setInterval(scanExternalProcesses, 10000); // Every 10 seconds
  
  // Show empty state
  updateEmptyState();
});

// =====================================================
// External Process Detection
// =====================================================
async function scanExternalProcesses() {
  try {
    const result = await window.electronAPI.detectExternalProcesses();
    
    if (result.success && result.processes) {
      // Clear previous external projects
      externalProjects.clear();
      
      // Add new external projects
      result.processes.forEach(proc => {
        if (proc.projectPath) {
          // Only track external processes that have a detectable project path
          externalProjects.set(proc.projectPath, {
            port: proc.port,
            pid: proc.pid,
            command: proc.command,
            status: 'external',
            external: true
          });
        }
      });
      
      // Update running count to include external projects
      updateRunningCount();
      
      // Update any cards that match external projects
      externalProjects.forEach((info, projectPath) => {
        updateSingleCard(projectPath);
      });
    }
  } catch (err) {
    console.error('Error scanning external processes:', err);
  }
}

async function stopExternalProcess(projectPath) {
  const externalInfo = externalProjects.get(projectPath);
  if (!externalInfo || !externalInfo.pid) {
    showNotification('External process not found', 'error');
    return;
  }
  
  try {
    const result = await window.electronAPI.killExternalProcess(externalInfo.pid);
    
    if (result.success) {
      externalProjects.delete(projectPath);
      updateRunningCount();
      updateSingleCard(projectPath);
      showNotification(`Stopped external process on port ${externalInfo.port}`, 'success');
    } else {
      showNotification(result.error || 'Failed to stop external process', 'error');
    }
  } catch (err) {
    console.error('Error stopping external process:', err);
    showNotification('Failed to stop external process', 'error');
  }
}

// =====================================================
// Keyboard Shortcuts
// =====================================================
function handleKeyboardShortcuts(e) {
  // Command Palette: Cmd/Ctrl + K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    showCommandPalette();
  }
  
  // Refresh: Cmd/Ctrl + R
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    renderProjects();
  }
  
  // Escape: Close modals
  if (e.key === 'Escape') {
    hideModals();
    hideSettingsModal();
    hideCommandPalette();
    logsModal?.classList.add("hidden");
    newCollectionModal?.classList.add("hidden");
    projectInsightsModal?.classList.add("hidden");
  }
}

// =====================================================
// Command Palette
// =====================================================
function showCommandPalette() {
  commandPalette.classList.remove('hidden');
  commandInput.value = '';
  commandInput.focus();
  commandSelectedIndex = 0;
  renderCommandResults('');
}

function hideCommandPalette() {
  commandPalette.classList.add('hidden');
  commandInput.value = '';
}

function handleCommandInput(e) {
  const query = e.target.value.toLowerCase();
  commandSelectedIndex = 0;
  renderCommandResults(query);
}

function handleCommandKeydown(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    commandSelectedIndex = Math.min(commandSelectedIndex + 1, commandItems.length - 1);
    updateCommandSelection();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    commandSelectedIndex = Math.max(commandSelectedIndex - 1, 0);
    updateCommandSelection();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    executeCommand(commandItems[commandSelectedIndex]);
  }
}

function renderCommandResults(query) {
  // Build command list
  const commands = [
    { type: 'action', id: 'scan-home', title: 'Scan Home Directory', desc: 'Find Node.js projects in home folder', icon: Icons.home, action: renderProjects },
    { type: 'action', id: 'scan-folder', title: 'Scan Custom Folder', desc: 'Choose a folder to scan', icon: Icons.folder, action: renderCustomProjects },
    { type: 'action', id: 'refresh', title: 'Refresh Projects', desc: 'Reload project list', icon: Icons.check, action: () => renderProjectCards(currentProjects) },
    { type: 'view', id: 'view-all', title: 'View All Projects', desc: 'Show all projects', icon: Icons.folder, action: () => switchView('all') },
    { type: 'view', id: 'view-running', title: 'View Running Projects', desc: 'Show running projects only', icon: Icons.play, action: () => switchView('running') },
    { type: 'view', id: 'view-insights', title: 'View Insights', desc: 'Show project insights', icon: Icons.chart, action: () => switchView('insights') },
    { type: 'action', id: 'settings', title: 'Open Settings', desc: 'Configure preferences', icon: Icons.info, action: showSettingsModal },
    { type: 'action', id: 'new-collection', title: 'New Collection', desc: 'Create a new project collection', icon: Icons.plus, action: showNewCollectionModal },
  ];
  
  // Add projects to command list
  currentProjects.forEach(project => {
    const isRunning = runningProjects.has(project.path);
    commands.push({
      type: 'project',
      id: project.path,
      title: project.name || path.basename(project.path),
      desc: project.path,
      icon: isRunning ? Icons.play : Icons.folder,
      isRunning,
      action: () => {
        hideCommandPalette();
        if (isRunning) {
          const info = runningProjects.get(project.path);
          if (info?.port) openInBrowser(info.port);
        } else {
          attemptRunProject(project.path);
        }
      }
    });
  });
  
  // Filter commands
  commandItems = query 
    ? commands.filter(cmd => 
        cmd.title.toLowerCase().includes(query) || 
        cmd.desc.toLowerCase().includes(query)
      )
    : commands.slice(0, 10);
  
  // Render
  commandResults.innerHTML = commandItems.map((cmd, index) => `
    <div class="command-item ${index === commandSelectedIndex ? 'selected' : ''}" data-index="${index}">
      <div class="command-item-icon">${cmd.icon}</div>
      <div class="command-item-text">
        <div class="command-item-title">${escapeHtml(cmd.title)}</div>
        <div class="command-item-desc">${escapeHtml(cmd.desc)}</div>
      </div>
      ${cmd.isRunning ? '<span class="running-badge"><span class="dot"></span>Running</span>' : ''}
    </div>
  `).join('');
  
  // Add click handlers
  commandResults.querySelectorAll('.command-item').forEach((item, index) => {
    item.addEventListener('click', () => executeCommand(commandItems[index]));
    item.addEventListener('mouseenter', () => {
      commandSelectedIndex = index;
      updateCommandSelection();
    });
  });
}

function updateCommandSelection() {
  commandResults.querySelectorAll('.command-item').forEach((item, index) => {
    item.classList.toggle('selected', index === commandSelectedIndex);
  });
}

function executeCommand(cmd) {
  if (cmd && cmd.action) {
    hideCommandPalette();
    cmd.action();
  }
}

// =====================================================
// Notifications
// =====================================================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span style="color: ${type === 'success' ? '#10b981' : type === 'error' ? '#f43f5e' : type === 'warning' ? '#f59e0b' : '#0ea5e9'};">
      ${type === 'success' ? Icons.check : type === 'error' ? Icons.alertCircle : type === 'warning' ? Icons.warning : Icons.info}
    </span>
    <span style="flex: 1; font-size: 13px; color: #fafafa;">${escapeHtml(message)}</span>
    <button onclick="this.parentElement.remove()" class="action-btn" style="width: 20px; height: 20px;">×</button>
  `;
  
  notificationsContainer.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 200);
  }, 4000);
}

// =====================================================
// Collections
// =====================================================
function loadCollections() {
  try {
    const savedCollections = localStorage.getItem('collections');
    const savedProjectCollections = localStorage.getItem('projectCollections');
    
    if (savedCollections) {
      const parsed = JSON.parse(savedCollections);
      // Merge with system collections
      collections = [
        { id: 'all', name: 'All Projects', icon: 'folder', isSystem: true },
        { id: 'running', name: 'Running', icon: 'play', isSystem: true },
        ...parsed.filter(c => !c.isSystem),
        { id: 'uncategorized', name: 'Uncategorized', icon: 'inbox', isSystem: true }
      ];
    }
    
    if (savedProjectCollections) {
      projectCollections = JSON.parse(savedProjectCollections);
    }
  } catch (err) {
    console.error('Error loading collections:', err);
  }
}

function saveCollections() {
  try {
    localStorage.setItem('collections', JSON.stringify(collections.filter(c => !c.isSystem)));
    localStorage.setItem('projectCollections', JSON.stringify(projectCollections));
  } catch (err) {
    console.error('Error saving collections:', err);
  }
}

function renderCollections() {
  const userCollections = collections.filter(c => !c.isSystem || c.id === 'uncategorized');
  
  collectionsList.innerHTML = userCollections.map(col => {
    const count = col.id === 'uncategorized' 
      ? currentProjects.filter(p => !projectCollections[p.path] || projectCollections[p.path].length === 0).length
      : currentProjects.filter(p => projectCollections[p.path]?.includes(col.id)).length;
    
    return `
      <div class="collection-item ${activeCollection === col.id ? 'active' : ''}" 
           data-collection="${col.id}"
           draggable="false"
           ondragover="handleCollectionDragOver(event)"
           ondragleave="handleCollectionDragLeave(event)"
           ondrop="handleCollectionDrop(event, '${col.id}')">
        <div class="flex items-center gap-2">
          <span style="color: #71717a;">${col.id === 'uncategorized' ? Icons.inbox : Icons.folder}</span>
          <span class="sidebar-text">${escapeHtml(col.name)}</span>
        </div>
        <span class="collection-count">${count}</span>
      </div>
    `;
  }).join('');
  
  // Add click handlers
  collectionsList.querySelectorAll('.collection-item').forEach(item => {
    item.addEventListener('click', () => {
      const colId = item.dataset.collection;
      switchToCollection(colId);
    });
  });
}

function showNewCollectionModal() {
  console.log('showNewCollectionModal called');
  if (newCollectionModal) {
    newCollectionModal.classList.remove('hidden');
    if (newCollectionInput) {
      newCollectionInput.value = '';
      newCollectionInput.focus();
    }
  } else {
    console.error('newCollectionModal not found!');
  }
}

// Collection Picker - shows when clicking folder icon on project card
let pendingCollectionProject = null;

function showCollectionPicker(projectPath) {
  pendingCollectionProject = projectPath;
  
  // Get user collections (not system ones except uncategorized)
  const userCollections = collections.filter(c => !c.isSystem || c.id === 'uncategorized');
  const projectCols = projectCollections[projectPath] || [];
  
  // Use command palette as picker
  commandPalette.classList.remove('hidden');
  commandInput.value = '';
  commandInput.placeholder = 'Select a collection...';
  commandInput.focus();
  
  commandItems = userCollections.map(col => ({
    type: 'collection',
    id: col.id,
    title: col.name,
    desc: projectCols.includes(col.id) ? '✓ Already in this collection' : 'Click to add',
    icon: Icons.folder,
    isInCollection: projectCols.includes(col.id),
    action: () => {
      toggleProjectInCollection(projectPath, col.id);
      hideCommandPalette();
    }
  }));
  
  // Add "Create new collection" option
  commandItems.push({
    type: 'action',
    id: 'new',
    title: '+ Create New Collection',
    desc: 'Create a new collection for this project',
    icon: Icons.plus,
    action: () => {
      hideCommandPalette();
      showNewCollectionModal();
    }
  });
  
  renderCollectionPicker();
}

function renderCollectionPicker() {
  commandResults.innerHTML = commandItems.map((cmd, index) => `
    <div class="command-item ${index === commandSelectedIndex ? 'selected' : ''}" data-index="${index}">
      <div class="command-item-icon" style="${cmd.isInCollection ? 'color: #10b981;' : ''}">${cmd.icon}</div>
      <div class="command-item-text">
        <div class="command-item-title">${escapeHtml(cmd.title)}</div>
        <div class="command-item-desc" style="${cmd.isInCollection ? 'color: #10b981;' : ''}">${escapeHtml(cmd.desc)}</div>
      </div>
      ${cmd.isInCollection ? `<span style="color: #10b981;">${Icons.check}</span>` : ''}
    </div>
  `).join('');
  
  // Add click handlers
  commandResults.querySelectorAll('.command-item').forEach((item, index) => {
    item.addEventListener('click', () => executeCommand(commandItems[index]));
    item.addEventListener('mouseenter', () => {
      commandSelectedIndex = index;
      updateCommandSelection();
    });
  });
}

function toggleProjectInCollection(projectPath, collectionId) {
  if (!projectCollections[projectPath]) {
    projectCollections[projectPath] = [];
  }
  
  const index = projectCollections[projectPath].indexOf(collectionId);
  const collection = collections.find(c => c.id === collectionId);
  
  if (index === -1) {
    // Add to collection
    projectCollections[projectPath].push(collectionId);
    showNotification(`Added to "${collection?.name || 'collection'}"`, 'success');
  } else {
    // Remove from collection
    projectCollections[projectPath].splice(index, 1);
    showNotification(`Removed from "${collection?.name || 'collection'}"`, 'info');
  }
  
  saveCollections();
  renderCollections();
}

function handleCreateCollection() {
  const name = newCollectionInput.value.trim();
  if (!name) return;
  
  const id = 'col_' + Date.now();
  collections.splice(collections.length - 1, 0, { id, name, icon: 'folder' });
  saveCollections();
  renderCollections();
  newCollectionModal.classList.add('hidden');
  showNotification(`Collection "${name}" created`, 'success');
}

function switchToCollection(colId) {
  activeCollection = colId;
  
  // Update active state
  collectionsList.querySelectorAll('.collection-item').forEach(item => {
    item.classList.toggle('active', item.dataset.collection === colId);
  });
  navAllProjects.classList.remove('active');
  navRunning.classList.remove('active');
  navInsights.classList.remove('active');
  
  // Filter projects
  let filtered;
  if (colId === 'uncategorized') {
    filtered = currentProjects.filter(p => !projectCollections[p.path] || projectCollections[p.path].length === 0);
  } else {
    filtered = currentProjects.filter(p => projectCollections[p.path]?.includes(colId));
  }
  
  const collection = collections.find(c => c.id === colId);
  viewTitleEl.textContent = collection?.name || 'Collection';
  viewSubtitleEl.textContent = `${filtered.length} projects`;
  
  currentView = 'collection';
  insightsPanelEl.classList.add('hidden');
  renderProjectCards(filtered);
}

// Drag and drop handlers
function handleCollectionDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleCollectionDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleCollectionDrop(e, collectionId) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  const projectPath = e.dataTransfer.getData('text/plain');
  if (!projectPath) return;
  
  // Add to collection
  if (!projectCollections[projectPath]) {
    projectCollections[projectPath] = [];
  }
  if (!projectCollections[projectPath].includes(collectionId)) {
    projectCollections[projectPath].push(collectionId);
    saveCollections();
    renderCollections();
    showNotification(`Project added to collection`, 'success');
  }
}

// =====================================================
// Views
// =====================================================
function switchView(view) {
  currentView = view;
  activeCollection = view === 'all' ? 'all' : null;
  
  // Update sidebar active states
  navAllProjects.classList.toggle('active', view === 'all');
  navRunning.classList.toggle('active', view === 'running');
  navInsights.classList.toggle('active', view === 'insights');
  collectionsList.querySelectorAll('.collection-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Update view content
  insightsPanelEl.classList.toggle('hidden', view !== 'insights');
  
  if (view === 'all') {
    viewTitleEl.textContent = 'All Projects';
    viewSubtitleEl.textContent = `${currentProjects.length} projects`;
    renderProjectCards(currentProjects);
  } else if (view === 'running') {
    viewTitleEl.textContent = 'Running Projects';
    const runningList = currentProjects.filter(p => runningProjects.has(p.path));
    viewSubtitleEl.textContent = `${runningList.length} running`;
    renderProjectCards(runningList);
  } else if (view === 'insights') {
    viewTitleEl.textContent = 'Project Insights';
    viewSubtitleEl.textContent = 'Health overview of your projects';
    renderInsights();
    renderProjectCards(currentProjects);
  }
  
  updateEmptyState();
}

function updateRunningCount() {
  const count = runningProjects.size + externalProjects.size;
  runningNumEl.textContent = count;
  runningCountEl.classList.toggle('hidden', count === 0);
  allProjectsCountEl.textContent = currentProjects.length;
}

function updateEmptyState() {
  const hasProjects = currentProjects.length > 0;
  emptyStateEl.classList.toggle('hidden', hasProjects);
  projectListEl.classList.toggle('hidden', !hasProjects);
}

// =====================================================
// Insights
// =====================================================
function renderInsights() {
  const insights = [];
  
  // Check for projects without node_modules
  const missingDeps = currentProjects.filter(p => !projectStats.get(p.path)?.hasDeps);
  if (missingDeps.length > 0) {
    insights.push({
      type: 'warning',
      title: `${missingDeps.length} projects missing dependencies`,
      desc: 'Run npm install to set them up'
    });
  }
  
  // Running projects
  if (runningProjects.size > 0) {
    insights.push({
      type: 'success',
      title: `${runningProjects.size} projects running`,
      desc: 'Active development servers'
    });
  }
  
  // Total projects
  insights.push({
    type: 'info',
    title: `${currentProjects.length} total projects`,
    desc: 'Across all collections'
  });
  
  insightsListEl.innerHTML = insights.map(insight => `
    <div class="insight-item">
      <div class="insight-icon ${insight.type}">
        ${insight.type === 'warning' ? Icons.warning : insight.type === 'success' ? Icons.check : Icons.info}
      </div>
      <div>
        <div class="text-sm font-medium" style="color: #fafafa;">${escapeHtml(insight.title)}</div>
        <div class="text-xs" style="color: #71717a;">${escapeHtml(insight.desc)}</div>
      </div>
    </div>
  `).join('');
}

async function showProjectInsights(projectPath) {
  const project = currentProjects.find(p => p.path === projectPath);
  if (!project) return;
  
  insightsProjectName.textContent = project.name || path.basename(projectPath);
  
  // Build insights content
  let content = `
    <div class="space-y-4">
      <div class="insight-item">
        <div class="insight-icon info">${Icons.folder}</div>
        <div>
          <div class="text-sm font-medium" style="color: #fafafa;">Location</div>
          <div class="text-xs" style="color: #71717a;">${escapeHtml(projectPath)}</div>
        </div>
      </div>
  `;
  
  // Check dependencies
  const hasDeps = await areDependenciesInstalled(projectPath);
  content += `
    <div class="insight-item">
      <div class="insight-icon ${hasDeps ? 'success' : 'warning'}">${hasDeps ? Icons.check : Icons.warning}</div>
      <div>
        <div class="text-sm font-medium" style="color: #fafafa;">Dependencies</div>
        <div class="text-xs" style="color: #71717a;">${hasDeps ? 'Installed' : 'Not installed'}</div>
      </div>
    </div>
  `;
  
  // Running status
  const isRunning = runningProjects.has(projectPath);
  const runningInfo = isRunning ? runningProjects.get(projectPath) : null;
  content += `
    <div class="insight-item">
      <div class="insight-icon ${isRunning ? 'success' : 'info'}">${isRunning ? Icons.play : Icons.info}</div>
      <div>
        <div class="text-sm font-medium" style="color: #fafafa;">Status</div>
        <div class="text-xs" style="color: #71717a;">${isRunning ? `Running on port ${runningInfo?.port}` : 'Not running'}</div>
      </div>
    </div>
  `;
  
  // Git info
  if (project.message && !['No commits yet', 'No Git history', 'Git Error'].includes(project.message)) {
    content += `
      <div class="insight-item">
        <div class="insight-icon info">${Icons.gitBranch}</div>
        <div>
          <div class="text-sm font-medium" style="color: #fafafa;">Last Commit</div>
          <div class="text-xs" style="color: #71717a;">${escapeHtml(project.message)}</div>
        </div>
      </div>
    `;
  }
  
  content += '</div>';
  
  projectInsightsContent.innerHTML = content;
  projectInsightsModal.classList.remove('hidden');
}

// =====================================================
// Sidebar
// =====================================================
function toggleSidebar() {
  console.log('toggleSidebar called');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
  } else {
    console.error('sidebar not found!');
  }
}

// =====================================================
// Modals
// =====================================================
function hideModals() {
  dependencyModal?.classList.add("hidden");
  confirmDialog?.classList.add("hidden");
  pendingActionProject = null;
  pendingRemoveProject = null;
}

function hideSettingsModal() {
  settingsModal?.classList.add("hidden");
}

function showDependencyModal(projectPath) {
  pendingActionProject = projectPath;
  dependencyModal.classList.remove("hidden");
}

async function handleModalInstall() {
  const projectPath = pendingActionProject;
  hideModals();
  if (!projectPath) return;
  
  setCardStatus(projectPath, 'Installing dependencies...', 'info');
  updateSingleCard(projectPath);
  
  try {
    await window.electronAPI.installDependencies(projectPath);
    setCardStatus(projectPath, 'Dependencies installed', 'success');
    showNotification('Dependencies installed successfully', 'success');
    setTimeout(() => {
      clearCardStatus(projectPath);
      updateSingleCard(projectPath);
    }, 2000);
  } catch (err) {
    setCardStatus(projectPath, 'Installation failed', 'error');
    showNotification('Failed to install dependencies', 'error');
  }
}

function handleConfirmRemove() {
  const projectPath = pendingRemoveProject;
  hideModals();
  if (!projectPath) return;
  removeModules(projectPath);
}

// =====================================================
// Settings
// =====================================================
function loadSettings() {
  try {
    const savedIDE = localStorage.getItem('defaultIDE');
    const savedTerminal = localStorage.getItem('defaultTerminal');
    if (savedIDE) defaultIDE = JSON.parse(savedIDE);
    if (savedTerminal) defaultTerminal = JSON.parse(savedTerminal);
    
    // Load sidebar state
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsed === 'true') {
      sidebar?.classList.add('collapsed');
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

function saveSettings() {
  try {
    const selectedIdeRadio = document.querySelector('input[name="defaultIDE"]:checked');
    if (selectedIdeRadio) {
      const ideIndex = parseInt(selectedIdeRadio.value);
      if (ideIndex >= 0 && ideIndex < installedIDEs.length) {
        defaultIDE = installedIDEs[ideIndex];
        localStorage.setItem('defaultIDE', JSON.stringify(defaultIDE));
      } else {
        defaultIDE = null;
        localStorage.removeItem('defaultIDE');
      }
    }
    
    const selectedTerminalRadio = document.querySelector('input[name="defaultTerminal"]:checked');
    if (selectedTerminalRadio) {
      const terminalCommand = selectedTerminalRadio.value;
      if (terminalCommand === 'system-default') {
        defaultTerminal = null;
        localStorage.removeItem('defaultTerminal');
      } else {
        const terminal = installedTerminals.find(t => t.command === terminalCommand);
        if (terminal) {
          defaultTerminal = { name: terminal.name, command: terminal.command };
          localStorage.setItem('defaultTerminal', JSON.stringify(defaultTerminal));
        }
      }
    }
    
    hideSettingsModal();
    showNotification('Settings saved', 'success');
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

async function showSettingsModal() {
  // Refresh lists
  try {
    installedIDEs = await window.electronAPI.getInstalledIDEs();
    installedTerminals = await window.electronAPI.getInstalledTerminals();
  } catch (err) {
    console.error('Error refreshing:', err);
  }
  
  // Populate IDE list
  defaultIdeList.innerHTML = '';
  if (installedIDEs.length === 0) {
    noIdeMessage?.classList.remove('hidden');
  } else {
    noIdeMessage?.classList.add('hidden');
    
    // None option
    const noneOption = createSettingsOption(-1, 'defaultIDE', '❓', 'None (Always ask)', !defaultIDE);
    defaultIdeList.appendChild(noneOption);
    
    installedIDEs.forEach((ide, index) => {
      const isSelected = defaultIDE && defaultIDE.command === ide.command;
      const option = createSettingsOption(index, 'defaultIDE', ide.icon, ide.name, isSelected);
      defaultIdeList.appendChild(option);
    });
  }
  
  // Populate Terminal list
  defaultTerminalList.innerHTML = '';
  const isSystemDefault = !defaultTerminal;
  const systemOption = createSettingsOption('system-default', 'defaultTerminal', '🖥️', 'System Default', isSystemDefault);
  defaultTerminalList.appendChild(systemOption);
  
  installedTerminals.forEach((terminal) => {
    const isSelected = defaultTerminal && defaultTerminal.command === terminal.command;
    const option = createSettingsOption(terminal.command, 'defaultTerminal', terminal.icon, terminal.name, isSelected);
    defaultTerminalList.appendChild(option);
  });
  
  settingsModal.classList.remove("hidden");
}

function createSettingsOption(value, name, icon, label, isSelected) {
  const option = document.createElement('label');
  option.style.cssText = `
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: ${isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)'};
    border: 1px solid ${isSelected ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.06)'};
    border-radius: 8px; cursor: pointer; transition: all 0.15s ease;
  `;
  option.innerHTML = `
    <input type="radio" name="${name}" value="${value}" ${isSelected ? 'checked' : ''} style="display: none;" />
    <span style="font-size: 16px;">${icon}</span>
    <span style="flex: 1; font-size: 13px; color: #fafafa;">${escapeHtml(label)}</span>
    ${isSelected ? `<span style="color: #a78bfa;">${Icons.check}</span>` : ''}
  `;
  
  option.addEventListener('click', () => {
    // Update all options in this group
    const allOptions = option.parentElement.querySelectorAll('label');
    allOptions.forEach(opt => {
      opt.style.background = 'rgba(255,255,255,0.03)';
      opt.style.borderColor = 'rgba(255,255,255,0.06)';
      const checkIcon = opt.querySelector('span:last-child');
      if (checkIcon && checkIcon.innerHTML.includes('svg')) {
        checkIcon.remove();
      }
    });
    
    option.style.background = 'rgba(139, 92, 246, 0.15)';
    option.style.borderColor = 'rgba(139, 92, 246, 0.3)';
    const checkSpan = document.createElement('span');
    checkSpan.style.color = '#a78bfa';
    checkSpan.innerHTML = Icons.check;
    option.appendChild(checkSpan);
  });
  
  return option;
}

// =====================================================
// Dark Mode
// =====================================================
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  applyTheme();
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  showNotification(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`, 'info');
}

function applyTheme() {
  // Apply theme class
  document.body.classList.toggle('light-mode', !isDarkMode);
  
  // Update icons
  if (moonIcon) moonIcon.classList.toggle('hidden', !isDarkMode);
  if (sunIcon) sunIcon.classList.toggle('hidden', isDarkMode);
  
  // Update inline styles for elements that need them
  const sidebar = document.getElementById('sidebar');
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  
  if (isDarkMode) {
    // Dark mode colors
    if (sidebar) {
      sidebar.style.backgroundColor = '#111113';
      sidebar.style.borderColor = 'rgba(255, 255, 255, 0.06)';
    }
    if (header) {
      header.style.backgroundColor = '#0a0a0b';
      header.style.borderColor = 'rgba(255, 255, 255, 0.06)';
    }
    if (main) {
      main.style.backgroundColor = '#0a0a0b';
    }
    document.body.style.backgroundColor = '#0a0a0b';
    document.body.style.color = '#fafafa';
  } else {
    // Light mode colors
    if (sidebar) {
      sidebar.style.backgroundColor = '#f8fafc';
      sidebar.style.borderColor = 'rgba(0, 0, 0, 0.08)';
    }
    if (header) {
      header.style.backgroundColor = '#ffffff';
      header.style.borderColor = 'rgba(0, 0, 0, 0.08)';
    }
    if (main) {
      main.style.backgroundColor = '#ffffff';
    }
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#0f172a';
  }
  
  // Re-render cards to update their styles
  if (currentProjects.length > 0) {
    renderProjectCards(filteredProjects.length > 0 ? filteredProjects : currentProjects);
  }
}

function loadDarkModePreference() {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    isDarkMode = saved === 'true';
  } else {
    // Default to dark mode, or check system preference
    isDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  }
  applyTheme();
}

// =====================================================
// Projects
// =====================================================
async function softRefreshProjects() {
  try {
    const projects = await window.electronAPI.scanAllProjects();
    if (!projects) return;
    currentProjects = mergeProjectLists(currentProjects, projects);
    updateProjectCards(currentProjects);
    updateRunningCount();
    renderCollections();
  } catch (err) {
    console.error("Error in soft refresh:", err);
  }
}

function mergeProjectLists(oldList, newList) {
  const merged = [...oldList];
  const oldPaths = new Set(oldList.map((p) => p.path));
  for (const project of newList) {
    if (!oldPaths.has(project.path)) merged.push(project);
  }
  return merged;
}

async function renderProjects() {
  console.log('renderProjects called');
  
  if (projectListEl) {
    projectListEl.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-12">
        <div class="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-sm" style="color: #71717a;">Scanning for projects...</p>
      </div>
    `;
  }
  if (emptyStateEl) emptyStateEl.classList.add('hidden');
  if (projectListEl) projectListEl.classList.remove('hidden');
  
  try {
    console.log('Calling scanAllProjects...');
    const projects = await window.electronAPI.scanAllProjects();
    console.log('scanAllProjects returned:', projects?.length, 'projects');
    
    if (!projects || projects.length === 0) {
      currentProjects = [];
      updateEmptyState();
      viewSubtitleEl.textContent = 'No projects found';
      return;
    }

    currentProjects = projects;
    filteredProjects = [];
    allProjectsCountEl.textContent = projects.length;
    viewSubtitleEl.textContent = `${projects.length} projects`;
    renderProjectCards(projects);
    renderCollections();
    updateEmptyState();
    showNotification(`Found ${projects.length} projects`, 'success');
  } catch (err) {
    console.error("Error scanning:", err);
    showNotification('Failed to scan projects', 'error');
  }
}

async function renderCustomProjects() {
  try {
    const projects = await window.electronAPI.scanCustomFolder();
    
    if (!projects) {
      showNotification('Scan cancelled', 'info');
      return;
    }

    if (projects.length === 0) {
      showNotification('No projects found in folder', 'warning');
      return;
    }

    currentProjects = projects;
    filteredProjects = [];
    allProjectsCountEl.textContent = projects.length;
    viewSubtitleEl.textContent = `${projects.length} projects`;
    renderProjectCards(projects);
    renderCollections();
    updateEmptyState();
    showNotification(`Found ${projects.length} projects`, 'success');
  } catch (err) {
    console.error("Error scanning folder:", err);
    showNotification('Failed to scan folder', 'error');
  }
}

async function renderProjectCards(projects) {
  projectListEl.innerHTML = "";
  for (const project of projects) {
    const card = await createProjectCard(project);
    projectListEl.appendChild(card);
  }
  updateEmptyState();
}

async function updateProjectCards(projects) {
  for (const project of projects) {
    const existingCard = document.querySelector(`[data-project-path="${CSS.escape(project.path)}"]`);
    if (existingCard) {
      await populateCardContent(existingCard, project);
    } else {
      const newCard = await createProjectCard(project);
      projectListEl.appendChild(newCard);
    }
  }
}

async function updateSingleCard(projectPath) {
  const project = currentProjects.find(p => p.path === projectPath);
  if (!project) return;
  
  const card = document.querySelector(`[data-project-path="${CSS.escape(projectPath)}"]`);
  if (card) await populateCardContent(card, project);
}

async function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.dataset.projectPath = project.path;
  card.draggable = true;
  
  // Drag events for collections
  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', project.path);
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });
  
  await populateCardContent(card, project);
  return card;
}

async function populateCardContent(card, project) {
  const isRunning = runningProjects.has(project.path);
  const isExternal = externalProjects.has(project.path);
  const runningInfo = isRunning ? runningProjects.get(project.path) : (isExternal ? externalProjects.get(project.path) : null);
  const dependenciesInstalled = await areDependenciesInstalled(project.path);
  const projectName = project.name || path.basename(project.path);
  const cardStatus = projectStatuses.get(project.path);
  
  // Store deps status
  projectStats.set(project.path, { hasDeps: dependenciesInstalled });
  
  // Get project collections
  const projectCols = projectCollections[project.path] || [];
  const collectionNames = projectCols
    .map(colId => collections.find(c => c.id === colId)?.name)
    .filter(Boolean);
  
  // Truncate path
  const shortPath = project.path.length > 40 
    ? '...' + project.path.slice(-37) 
    : project.path;
  
  // Format timestamp
  const timeStr = project.timestamp 
    ? formatRelativeTime(project.timestamp * 1000)
    : 'No commits';

  card.className = `project-card ${isRunning ? 'running' : ''}`;
  
  // Theme-aware colors
  const textPrimary = isDarkMode ? '#fafafa' : '#0f172a';
  const textSecondary = isDarkMode ? '#71717a' : '#64748b';
  const textMuted = isDarkMode ? '#52525b' : '#94a3b8';
  const bgCard = isDarkMode ? '#111113' : '#f8fafc';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.08)';
  const btnBg = isDarkMode ? '#27272a' : 'rgba(0, 0, 0, 0.05)';
  const btnColor = isDarkMode ? '#a1a1aa' : '#64748b';
  
  // Apply card styles
  card.style.backgroundColor = bgCard;
  card.style.borderColor = borderColor;
  card.style.color = textPrimary;
  
  card.innerHTML = `
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="min-w-0 flex-1">
        <h4 class="truncate text-sm font-semibold" style="color: ${textPrimary};">${escapeHtml(projectName)}</h4>
        ${project.message && !['No commits yet', 'No Git history', 'Git Error'].includes(project.message) 
          ? `<p class="truncate text-xs mt-0.5" style="color: ${textSecondary};">${Icons.gitBranch} ${escapeHtml(project.message)}</p>` 
          : ''
        }
      </div>
      <div class="flex flex-col items-end gap-1 flex-shrink-0">
        ${isRunning || isExternal
          ? `<span class="running-badge ${isExternal ? 'external' : ''}">
               <span class="dot"></span>${isExternal ? 'External' : 'Running'}
             </span>` 
          : ''
        }
        ${(isRunning || isExternal) && runningInfo?.framework 
          ? `<span class="framework-badge ${runningInfo.framework.toLowerCase()}">${escapeHtml(runningInfo.framework)}</span>` 
          : ''
        }
      </div>
    </div>
    
    ${cardStatus ? `
      <div class="flex items-center gap-2 py-2 px-3 rounded-md mb-2" style="background: ${cardStatus.type === 'success' ? 'rgba(16,185,129,0.1)' : cardStatus.type === 'error' ? 'rgba(244,63,94,0.1)' : 'rgba(14,165,233,0.1)'}; color: ${cardStatus.type === 'success' ? '#10b981' : cardStatus.type === 'error' ? '#f43f5e' : '#0ea5e9'};">
        ${getStatusIcon(cardStatus.type)}
        <span class="text-xs">${escapeHtml(cardStatus.message)}</span>
      </div>
    ` : ''}
    
    <div class="flex items-center gap-2 text-xs mb-2 flex-wrap" style="color: ${textMuted};">
      <span class="flex items-center gap-1">${Icons.clock} ${timeStr}</span>
      ${(isRunning || isExternal) && runningInfo?.port 
        ? `<span class="flex items-center gap-1 px-2 py-0.5 rounded" style="background: ${isExternal ? 'rgba(59,130,246,0.15)' : 'rgba(14,165,233,0.15)'}; color: ${isExternal ? '#3b82f6' : '#0ea5e9'};">${Icons.server} :${runningInfo.port}</span>` 
        : ''
      }
      ${collectionNames.length > 0 
        ? collectionNames.map(name => `<span class="flex items-center gap-1 px-2 py-0.5 rounded" style="background: rgba(139,92,246,0.15); color: #a78bfa; font-size: 10px;">${Icons.folder} ${escapeHtml(name)}</span>`).join('')
        : ''
      }
    </div>
    
    <p class="text-xs truncate mb-3" style="color: ${textMuted};" title="${escapeHtml(project.path)}">${escapeHtml(shortPath)}</p>
    
    <div class="flex items-center gap-1.5 flex-wrap">
      ${dependenciesInstalled 
        ? `<button class="action-btn play play-button" style="display: ${(isRunning || isExternal) ? 'none' : 'flex'};" title="Run project">
            ${Icons.play}
          </button>`
        : `<button class="action-btn install-button" title="Install dependencies">
            ${Icons.download}
          </button>`
      }
      <button class="action-btn stop stop-button" style="display: ${!isRunning ? 'none' : 'flex'};" title="Stop project">
        ${Icons.stop}
      </button>
      <button class="action-btn stop stop-external-button" style="display: ${!isExternal ? 'none' : 'flex'}; background: rgba(59, 130, 246, 0.15); color: #3b82f6;" title="Stop external process">
        ${Icons.stop}
      </button>
      ${(isRunning || isExternal)
        ? `<button class="action-btn browser-button" title="Open in browser">
            ${Icons.globe}
          </button>`
        : ''
      }
      <button class="action-btn editor-button" style="background: ${btnBg}; color: ${btnColor};" title="Open in editor">
        ${Icons.code}
      </button>
      <button class="action-btn terminal-button" style="background: ${btnBg}; color: ${btnColor};" title="Open in terminal">
        ${Icons.terminal}
      </button>
      <button class="action-btn collection-button" style="background: ${btnBg}; color: ${btnColor};" title="Add to collection">
        ${Icons.folder}
      </button>
      <button class="action-btn insights-button" style="background: ${btnBg}; color: ${btnColor};" title="View insights">
        ${Icons.chart}
      </button>
      ${dependenciesInstalled 
        ? `<button class="action-btn remove-modules-button" style="background: ${btnBg}; color: ${btnColor};" title="Remove node_modules">
            ${Icons.trash}
          </button>`
        : ''
      }
    </div>
  `;

  // Event listeners
  const playButton = card.querySelector(".play-button");
  const stopButton = card.querySelector(".stop-button");
  const stopExternalButton = card.querySelector(".stop-external-button");
  const installButton = card.querySelector(".install-button");
  const browserButton = card.querySelector(".browser-button");
  const editorButton = card.querySelector(".editor-button");
  const terminalButton = card.querySelector(".terminal-button");
  const collectionButton = card.querySelector(".collection-button");
  const insightsButton = card.querySelector(".insights-button");
  const removeButton = card.querySelector(".remove-modules-button");

  removeButton?.addEventListener("click", (e) => { e.stopPropagation(); removeModulesFromProject(project.path); });
  playButton?.addEventListener("click", (e) => { e.stopPropagation(); attemptRunProject(project.path); });
  stopButton?.addEventListener("click", (e) => { e.stopPropagation(); stopProject(project.path); });
  stopExternalButton?.addEventListener("click", (e) => { e.stopPropagation(); stopExternalProcess(project.path); });
  installButton?.addEventListener("click", (e) => { e.stopPropagation(); installProjectDependencies(project.path); });
  browserButton?.addEventListener("click", (e) => { e.stopPropagation(); if (runningInfo) openInBrowser(runningInfo.port); });
  editorButton?.addEventListener("click", (e) => { e.stopPropagation(); openInEditor(project.path); });
  terminalButton?.addEventListener("click", (e) => { e.stopPropagation(); openInTerminal(project.path); });
  collectionButton?.addEventListener("click", (e) => { e.stopPropagation(); showCollectionPicker(project.path); });
  insightsButton?.addEventListener("click", (e) => { e.stopPropagation(); showProjectInsights(project.path); });
}

function getStatusIcon(type) {
  switch(type) {
    case 'success': return Icons.check;
    case 'error': return Icons.alertCircle;
    case 'warning': return Icons.warning;
    default: return Icons.info;
  }
}

function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// =====================================================
// Actions
// =====================================================
async function attemptRunProject(projectPath) {
  const depsInstalled = await areDependenciesInstalled(projectPath);
  if (!depsInstalled) {
    showDependencyModal(projectPath);
    return;
  }
  await runProjectWithPort(projectPath, null);
}

async function runProjectWithPort(projectPath, customPort = null) {
  setCardStatus(projectPath, customPort ? `Starting on :${customPort}...` : 'Starting...', 'info');
  updateSingleCard(projectPath);
  
  try {
    const result = await window.electronAPI.playProject(projectPath, customPort);
    if (result.error) {
      setCardStatus(projectPath, result.error, 'error');
      
      // Check if it's a permission error - offer to fix
      const isPermissionError = result.error.toLowerCase().includes('permission') || 
                                result.error.toLowerCase().includes('eacces');
      if (isPermissionError) {
        showPermissionErrorModal(projectPath, result.error);
      }
    } else if (result.message) {
      setCardStatus(projectPath, result.message, 'success');
    }
  } catch (err) {
    console.error("Error running project:", err);
    setCardStatus(projectPath, 'Failed to start', 'error');
  }
}

// Show permission error modal with options to fix
function showPermissionErrorModal(projectPath, errorMessage) {
  const modal = document.getElementById('confirm-modal');
  const title = modal?.querySelector('h2');
  const message = modal?.querySelector('p');
  const confirmBtn = modal?.querySelector('.confirm-yes');
  const cancelBtn = modal?.querySelector('.confirm-no');
  
  if (!modal || !title || !message || !confirmBtn || !cancelBtn) return;
  
  title.textContent = '🔒 Permission Error';
  message.innerHTML = `
    <div style="text-align: left; max-height: 350px; overflow-y: auto;">
      <p style="margin-bottom: 12px;">The project couldn't start due to permission issues.</p>
      <details style="margin-bottom: 12px;">
        <summary style="cursor: pointer; color: var(--text-muted);">Show error details</summary>
        <pre style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; font-size: 11px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin-top: 8px;">${escapeHtml(errorMessage)}</pre>
      </details>
      <p style="margin-bottom: 12px;"><strong>Choose a fix option:</strong></p>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button id="fix-quick" class="modal-fix-btn" style="padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); cursor: pointer; text-align: left;">
          <strong>🔧 Quick Fix</strong><br>
          <span style="font-size: 12px; color: var(--text-muted);">Try to fix file permissions (fast)</span>
        </button>
        <button id="fix-reinstall" class="modal-fix-btn" style="padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); cursor: pointer; text-align: left;">
          <strong>🔄 Delete & Reinstall</strong><br>
          <span style="font-size: 12px; color: var(--text-muted);">Delete node_modules and reinstall (slower but thorough)</span>
        </button>
      </div>
    </div>
  `;
  
  // Hide default buttons, we'll use custom ones
  confirmBtn.style.display = 'none';
  cancelBtn.textContent = 'Cancel';
  
  modal.classList.remove('hidden');
  
  // Clone cancel button to remove old event listeners
  const newCancelBtn = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  
  // Add event listeners to custom buttons
  const quickFixBtn = document.getElementById('fix-quick');
  const reinstallBtn = document.getElementById('fix-reinstall');
  
  quickFixBtn?.addEventListener('click', async () => {
    modal.classList.add('hidden');
    confirmBtn.style.display = ''; // Restore for future modals
    await fixProjectPermissions(projectPath);
  });
  
  reinstallBtn?.addEventListener('click', async () => {
    modal.classList.add('hidden');
    confirmBtn.style.display = ''; // Restore for future modals
    await aggressiveFixProject(projectPath);
  });
  
  newCancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    confirmBtn.style.display = ''; // Restore for future modals
  });
}

// Fix project permissions
async function fixProjectPermissions(projectPath) {
  setCardStatus(projectPath, 'Fixing permissions...', 'info');
  showNotification('Attempting to fix permissions...', 'info');
  
  try {
    const result = await window.electronAPI.fixProjectPermissions(projectPath);
    
    if (result.success) {
      setCardStatus(projectPath, 'Permissions fixed!', 'success');
      showNotification('Permissions fixed! Try running the project again.', 'success');
      setTimeout(() => clearCardStatus(projectPath), 3000);
    } else {
      setCardStatus(projectPath, 'Could not fix permissions', 'error');
      
      // Show the manual command they need to run
      if (result.manual) {
        showManualFixModal(result.manual);
      } else {
        showNotification('Could not fix permissions automatically. Please check folder access.', 'error');
      }
    }
  } catch (err) {
    console.error('Error fixing permissions:', err);
    setCardStatus(projectPath, 'Fix failed', 'error');
    showNotification('Failed to fix permissions', 'error');
  }
}

// Aggressive fix - delete node_modules and reinstall
async function aggressiveFixProject(projectPath) {
  setCardStatus(projectPath, 'Deleting node_modules...', 'info');
  showNotification('This may take a few minutes. Please wait...', 'info');
  
  try {
    const result = await window.electronAPI.aggressivePermissionFix(projectPath);
    
    if (result.success) {
      setCardStatus(projectPath, 'Fixed & reinstalled!', 'success');
      showNotification(result.message || 'Dependencies reinstalled! Try running now.', 'success');
      updateSingleCard(projectPath);
      setTimeout(() => clearCardStatus(projectPath), 5000);
    } else {
      setCardStatus(projectPath, 'Fix failed', 'error');
      
      if (result.manual) {
        showManualFixModal(result.manual);
      } else {
        showNotification(result.error || 'Failed to fix. Please try manually.', 'error');
      }
    }
  } catch (err) {
    console.error('Error in aggressive fix:', err);
    setCardStatus(projectPath, 'Fix failed', 'error');
    showNotification('Failed to reinstall. Please try manually.', 'error');
  }
}

// Show modal with manual fix command
function showManualFixModal(command) {
  const modal = document.getElementById('confirm-modal');
  const title = modal?.querySelector('h2');
  const message = modal?.querySelector('p');
  const confirmBtn = modal?.querySelector('.confirm-yes');
  const cancelBtn = modal?.querySelector('.confirm-no');
  
  if (!modal || !title || !message || !confirmBtn || !cancelBtn) return;
  
  title.textContent = '📋 Manual Fix Required';
  message.innerHTML = `
    <div style="text-align: left;">
      <p style="margin-bottom: 12px;">Automatic fix failed. Please run this command in Terminal:</p>
      <pre id="fix-command" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; font-size: 12px; overflow-x: auto; user-select: all; cursor: text;">${escapeHtml(command)}</pre>
      <p style="margin-top: 12px; font-size: 12px; color: var(--text-muted);">Click the command to select it, then copy and paste into Terminal.</p>
    </div>
  `;
  
  confirmBtn.textContent = 'Copy Command';
  cancelBtn.textContent = 'Close';
  
  modal.classList.remove('hidden');
  
  // Clone buttons to remove old event listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  
  newConfirmBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(command);
      showNotification('Command copied to clipboard!', 'success');
    } catch (err) {
      // Fallback: select the text
      const pre = document.getElementById('fix-command');
      if (pre) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(pre);
        selection.removeAllRanges();
        selection.addRange(range);
        showNotification('Command selected - press Cmd+C to copy', 'info');
      }
    }
  });
  
  newCancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}

// Helper to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function stopProject(projectPath) {
  setCardStatus(projectPath, 'Stopping...', 'info');
  updateSingleCard(projectPath);
  
  try {
    await window.electronAPI.stopProject(projectPath);
  } catch (err) {
    console.error("Error stopping project:", err);
    setCardStatus(projectPath, 'Failed to stop', 'error');
  }
}

async function installProjectDependencies(projectPath) {
  setCardStatus(projectPath, 'Installing...', 'info');
  updateSingleCard(projectPath);
  
  try {
    await window.electronAPI.installDependencies(projectPath);
    setCardStatus(projectPath, 'Installed', 'success');
    showNotification('Dependencies installed', 'success');
    setTimeout(() => {
      clearCardStatus(projectPath);
      updateSingleCard(projectPath);
    }, 2000);
  } catch (err) {
    console.error("Error installing:", err);
    setCardStatus(projectPath, 'Install failed', 'error');
    showNotification('Installation failed', 'error');
  }
}

function removeModulesFromProject(projectPath) {
  pendingRemoveProject = projectPath;
  document.getElementById('confirmMessage').textContent = 
    'This will delete the node_modules folder. You will need to run npm install again.';
  confirmDialog.classList.remove("hidden");
}

async function removeModules(projectPath) {
  setCardStatus(projectPath, 'Removing...', 'info');
  updateSingleCard(projectPath);
  
  try {
    await window.electronAPI.removeNodeModules(projectPath);
    setCardStatus(projectPath, 'Removed', 'success');
    showNotification('node_modules removed', 'success');
    setTimeout(() => {
      clearCardStatus(projectPath);
      updateSingleCard(projectPath);
    }, 2000);
  } catch (err) {
    console.error("Error removing:", err);
    setCardStatus(projectPath, 'Remove failed', 'error');
    showNotification('Failed to remove node_modules', 'error');
  }
}

async function openInBrowser(port) {
  try {
    await window.electronAPI.openInBrowser(port);
  } catch (err) {
    console.error("Error opening browser:", err);
    showNotification('Failed to open browser', 'error');
  }
}

async function openInEditor(projectPath) {
  try {
    if (defaultIDE) {
      await window.electronAPI.openInEditor(projectPath, defaultIDE.command);
    } else if (installedIDEs.length === 1) {
      await window.electronAPI.openInEditor(projectPath, installedIDEs[0].command);
    } else if (installedIDEs.length > 1) {
      // Show quick picker in command palette style
      showIDEPicker(projectPath);
    } else {
      await window.electronAPI.openInEditor(projectPath, null);
    }
  } catch (err) {
    console.error("Error opening editor:", err);
    showNotification('Failed to open editor', 'error');
  }
}

function showIDEPicker(projectPath) {
  commandPalette.classList.remove('hidden');
  commandInput.value = '';
  commandInput.placeholder = 'Select an editor...';
  commandInput.focus();
  
  commandItems = installedIDEs.map(ide => ({
    type: 'ide',
    id: ide.command,
    title: ide.name,
    desc: ide.command,
    icon: `<span style="font-size: 16px;">${ide.icon}</span>`,
    action: async () => {
      hideCommandPalette();
      await window.electronAPI.openInEditor(projectPath, ide.command);
    }
  }));
  
  commandResults.innerHTML = commandItems.map((cmd, index) => `
    <div class="command-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
      <div class="command-item-icon">${cmd.icon}</div>
      <div class="command-item-text">
        <div class="command-item-title">${escapeHtml(cmd.title)}</div>
        <div class="command-item-desc">${escapeHtml(cmd.desc)}</div>
      </div>
    </div>
  `).join('');
  
  commandResults.querySelectorAll('.command-item').forEach((item, index) => {
    item.addEventListener('click', () => executeCommand(commandItems[index]));
  });
  
  commandSelectedIndex = 0;
}

async function openInTerminal(projectPath) {
  try {
    await window.electronAPI.openInTerminal(projectPath, defaultTerminal?.command || null);
  } catch (err) {
    console.error("Error opening terminal:", err);
    showNotification('Failed to open terminal', 'error');
  }
}

async function verifyProcessStatus(projectPath) {
  const runningInfo = runningProjects.get(projectPath);
  if (!runningInfo?.pid) return;
  
  try {
    const isRunning = await window.electronAPI.checkProcessStatus(runningInfo.pid);
    if (!isRunning) {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      updateSingleCard(projectPath);
      updateRunningCount();
    }
  } catch (err) {
    console.error("Error verifying process:", err);
  }
}

// =====================================================
// Helpers
// =====================================================
async function areDependenciesInstalled(projectPath) {
  try {
    const nodeModulesPath = projectPath + '/node_modules';
    return await window.electronAPI.fileExists(nodeModulesPath);
  } catch {
    return false;
  }
}

function setCardStatus(projectPath, message, type) {
  projectStatuses.set(projectPath, { message, type });
}

function clearCardStatus(projectPath) {
  projectStatuses.delete(projectPath);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

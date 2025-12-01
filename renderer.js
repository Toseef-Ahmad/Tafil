// renderer.js

// Helper for path operations
const path = {
  basename: (pathStr) => {
    return pathStr.split('/').pop() || pathStr.split('\\').pop() || pathStr;
  }
};

const infoEl = document.getElementById("info");
const projectListEl = document.getElementById("projectList");
const scanProjectsBtn = document.getElementById("scanProjectsBtn");
const scanCustomBtn = document.getElementById("scanCustomBtn");
const searchInput = document.getElementById("searchInput");
const darkModeToggle = document.getElementById("darkModeToggle");
const refreshBtn = document.getElementById("refreshBtn");
const ideCountEl = document.getElementById("ideCount");
const ideCountNum = document.getElementById("ideCountNum");

// Modal elements
const dependencyModal = document.getElementById("dependencyModal");
const modalInstallBtn = document.getElementById("modalInstallBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const confirmDialog = document.getElementById("confirmDialog");
const confirmYesBtn = document.getElementById("confirmYesBtn");
const confirmNoBtn = document.getElementById("confirmNoBtn");
const logsModal = document.getElementById("logsModal");
const closeLogsBtn = document.getElementById("closeLogsBtn");

// Custom Port Modal elements
const customPortModal = document.getElementById("customPortModal");
const customPortInput = document.getElementById("customPortInput");
const useDefaultPortBtn = document.getElementById("useDefaultPortBtn");
const useCustomPortBtn = document.getElementById("useCustomPortBtn");
const cancelPortBtn = document.getElementById("cancelPortBtn");
const defaultPortDisplay = document.getElementById("defaultPortDisplay");

// IDE Modal elements
const ideModal = document.getElementById("ideModal");
const ideList = document.getElementById("ideList");
const cancelIdeBtn = document.getElementById("cancelIdeBtn");

// Settings Modal elements
const settingsModal = document.getElementById("settingsModal");
const settingsBtn = document.getElementById("settingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const cancelSettingsBtn = document.getElementById("cancelSettingsBtn");
const defaultIdeList = document.getElementById("defaultIdeList");
const defaultTerminalList = document.getElementById("defaultTerminalList");
const noIdeMessage = document.getElementById("noIdeMessage");
const currentIdeDisplay = document.getElementById("currentIdeDisplay");
const currentTerminalDisplay = document.getElementById("currentTerminalDisplay");

let currentProjects = [];
let filteredProjects = [];
let runningProjects = new Map(); // projectPath -> { port, status, pid, startTime? }
let projectProcesses = new Map(); // projectPath -> pid
let activeConnections = new Map(); // port -> projectPath
let projectLogs = new Map(); // projectPath -> [log lines]
let projectStats = new Map(); // projectPath -> { memory, cpu, etc. }
let projectStatuses = new Map(); // projectPath -> { message, type: 'info'|'success'|'error'|'warning' }
let lastRefreshTime = Date.now();
let pendingActionProject = null; // For modal dialogs
let pendingRemoveProject = null; // For confirmation dialog
let pendingPortProject = null; // For custom port modal
let pendingIdeProject = null; // For IDE selector modal
let installedIDEs = []; // Cache of detected IDEs
let installedTerminals = []; // Cache of detected Terminals
let isDarkMode = true; // Default is dark mode

// Settings
let defaultIDE = null; // { name, command }
let defaultTerminal = null; // { name, command }

const REFRESH_INTERVAL = 60000; // 60 seconds
const REFRESH_THROTTLE = 5000; // Minimum time between refreshes

document.addEventListener("DOMContentLoaded", async () => {
  infoEl.textContent = 'Click "Scan Home" to find Node.js projects, or "Scan Folder" to choose a custom directory.';
  
  // Load installed IDEs and Terminals on startup
  try {
    installedIDEs = await window.electronAPI.getInstalledIDEs();
    console.log(`Detected ${installedIDEs.length} installed IDEs:`, installedIDEs);
    
    // Update IDE count display
    if (installedIDEs.length > 0) {
      ideCountNum.textContent = installedIDEs.length;
      ideCountEl.style.display = 'block';
    }
  } catch (err) {
    console.error('Error loading installed IDEs:', err);
  }
  
  try {
    installedTerminals = await window.electronAPI.getInstalledTerminals();
    console.log(`Detected ${installedTerminals.length} installed Terminals:`, installedTerminals);
  } catch (err) {
    console.error('Error loading installed Terminals:', err);
  }
  
  // Button event listeners
  scanProjectsBtn.addEventListener("click", renderProjects);
  scanCustomBtn.addEventListener("click", renderCustomProjects);
  darkModeToggle.addEventListener("click", toggleDarkMode);
  refreshBtn.addEventListener("click", () => {
    const projectsToRefresh = filteredProjects.length > 0 ? currentProjects : currentProjects;
    renderProjectCards(projectsToRefresh);
    infoEl.textContent = 'Projects refreshed!';
  });
  
  // Search input listener
  searchInput.addEventListener("input", handleSearch);
  
  // Modal listeners
  modalCancelBtn.addEventListener("click", hideModals);
  modalInstallBtn.addEventListener("click", handleModalInstall);
  confirmNoBtn.addEventListener("click", hideModals);
  confirmYesBtn.addEventListener("click", handleConfirmRemove);
  closeLogsBtn.addEventListener("click", () => logsModal.classList.add("hidden"));
  
  // Custom Port Modal listeners
  cancelPortBtn.addEventListener("click", hideModals);
  useDefaultPortBtn.addEventListener("click", handleUseDefaultPort);
  useCustomPortBtn.addEventListener("click", handleUseCustomPort);
  customPortInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') handleUseCustomPort();
  });
  
  // IDE Modal listeners
  cancelIdeBtn.addEventListener("click", hideModals);
  
  // Settings Modal listeners
  settingsBtn.addEventListener("click", showSettingsModal);
  closeSettingsBtn.addEventListener("click", hideSettingsModal);
  cancelSettingsBtn.addEventListener("click", hideSettingsModal);
  saveSettingsBtn.addEventListener("click", saveSettings);
  
  // Load settings from localStorage
  loadSettings();
  
  // Update UI to show current settings
  updateSettingsDisplay();
  
  // Click outside modals to close
  dependencyModal.addEventListener("click", (e) => {
    if (e.target === dependencyModal) hideModals();
  });
  confirmDialog.addEventListener("click", (e) => {
    if (e.target === confirmDialog) hideModals();
  });
  logsModal.addEventListener("click", (e) => {
    if (e.target === logsModal) logsModal.classList.add("hidden");
  });
  customPortModal.addEventListener("click", (e) => {
    if (e.target === customPortModal) hideModals();
  });
  ideModal.addEventListener("click", (e) => {
    if (e.target === ideModal) hideModals();
  });
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) hideSettingsModal();
  });
  
  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);

  // Listen for project status from main
  window.electronAPI.onProjectStatus((_event, statusData) => {
    const { projectPath, status, port, error, code, signal, pid, framework } = statusData;
    console.log("Project Status Update:", statusData);

    if (status === "running") {
      runningProjects.set(projectPath, { 
        port, 
        status: "running", 
        pid,
        framework: framework || 'Unknown'
      });
      projectProcesses.set(projectPath, pid);
      activeConnections.set(port, projectPath);
      
      const frameworkText = framework ? ` (${framework})` : '';
      setCardStatus(projectPath, `Running${frameworkText} on port ${port}`, 'success');
      setTimeout(() => clearCardStatus(projectPath), 3000);
    } else if (status === "stopped") {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      // remove from activeConnections
      for (const [p, path] of activeConnections.entries()) {
        if (path === projectPath) {
          activeConnections.delete(p);
        }
      }
      setCardStatus(projectPath, 'Project stopped successfully', 'success');
      setTimeout(() => clearCardStatus(projectPath), 2000);
    } else if (status === "error") {
      // It's truly an error if main says so
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      setCardStatus(projectPath, `Error: ${error || "Unknown error"}`, 'error');
      console.error(`Project ${projectPath} error:`, error, code, signal);
    }

    // Update only the affected card instead of re-rendering everything
    updateSingleCard(projectPath);
  });

  // Listen for tray actions
  window.electronAPI.onTrayOpenBrowser((_event, projectPath) => {
    const project = runningProjects.get(projectPath);
    if (project?.port) {
      openInBrowser(project.port);
    }
  });

  window.electronAPI.onTrayOpenEditor((_event, projectPath) => {
    openInEditor(projectPath);
  });

  window.electronAPI.onTrayStopProject((_event, projectPath) => {
    stopProject(projectPath);
  });

  // Listen for project logs (stderr, etc.)
  window.electronAPI.onProjectLogs?.((_event, logData) => {
    const { projectPath, type, log } = logData;
    // e.g., store the logs in a Map and render them in the UI
    const existingLogs = projectLogs.get(projectPath) || [];
    existingLogs.push(`[${type}] ${log}`);
    projectLogs.set(projectPath, existingLogs);

    // Update the card display for logs
    const card = document.querySelector(`[data-project-path="${projectPath}"]`);
    if (card) {
      const project = currentProjects.find(p => p.path === projectPath);
      if (project) {
        populateCardContent(card, project);
      }
    }
  });

  // Optional: auto refresh
  setInterval(() => {
    const now = Date.now();
    if (
      document.visibilityState === "visible" &&
      now - lastRefreshTime >= REFRESH_THROTTLE
    ) {
      lastRefreshTime = now;
      softRefreshProjects();
    }
  }, REFRESH_INTERVAL);

  // Periodically verify processes
  setInterval(async () => {
    for (const [projectPath] of runningProjects) {
      await verifyProcessStatus(projectPath);
    }
  }, 5000);
  
  // Load dark mode preference
  loadDarkModePreference();
});

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(e) {
  // Ctrl/Cmd + K: Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  
  // Ctrl/Cmd + R: Refresh projects
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    renderProjects();
  }
  
  // Escape: Close modals
  if (e.key === 'Escape') {
    hideModals();
    logsModal.classList.add("hidden");
  }
  
  // Ctrl/Cmd + O: Open selected project in editor
  if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
    e.preventDefault();
    const firstProject = currentProjects[0];
    if (firstProject) {
      openInEditor(firstProject.path);
    }
  }
}

/**
 * Hide all modals
 */
function hideModals() {
  dependencyModal.classList.add("hidden");
  confirmDialog.classList.add("hidden");
  customPortModal.classList.add("hidden");
  ideModal.classList.add("hidden");
  pendingActionProject = null;
  pendingRemoveProject = null;
  pendingPortProject = null;
  pendingIdeProject = null;
}

/**
 * Hide settings modal
 */
function hideSettingsModal() {
  settingsModal.classList.add("hidden");
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
  try {
    const savedDefaultIDE = localStorage.getItem('defaultIDE');
    const savedDefaultTerminal = localStorage.getItem('defaultTerminal');
    
    if (savedDefaultIDE) {
      defaultIDE = JSON.parse(savedDefaultIDE);
    }
    
    if (savedDefaultTerminal) {
      defaultTerminal = JSON.parse(savedDefaultTerminal);
    }
    
    console.log('✅ Settings loaded:', { defaultIDE, defaultTerminal });
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

/**
 * Update UI to show current settings
 */
function updateSettingsDisplay() {
  if (defaultIDE) {
    console.log(`Default IDE set to: ${defaultIDE.name}`);
  }
  if (defaultTerminal) {
    console.log(`Default Terminal set to: ${defaultTerminal.name}`);
  }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
  try {
    // Get selected IDE
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
    } else {
      defaultIDE = null;
      localStorage.removeItem('defaultIDE');
    }
    
    // Get selected Terminal
    const selectedTerminalRadio = document.querySelector('input[name="defaultTerminal"]:checked');
    if (selectedTerminalRadio) {
      const terminalCommand = selectedTerminalRadio.value;
      if (terminalCommand === 'system-default') {
        defaultTerminal = null; // Use system default
        localStorage.removeItem('defaultTerminal');
      } else {
        // Find the terminal in the installed list to get full info
        const terminal = installedTerminals.find(t => t.command === terminalCommand);
        if (terminal) {
          defaultTerminal = { name: terminal.name, command: terminal.command };
          localStorage.setItem('defaultTerminal', JSON.stringify(defaultTerminal));
        } else {
          defaultTerminal = null;
          localStorage.removeItem('defaultTerminal');
        }
      }
    } else {
      defaultTerminal = null;
      localStorage.removeItem('defaultTerminal');
    }
    
    console.log('✅ Settings saved:', { defaultIDE, defaultTerminal });
    
    // Log what will be used
    if (defaultIDE) {
      console.log(`📌 Default IDE: ${defaultIDE.name} (${defaultIDE.command})`);
    } else {
      console.log('📌 No default IDE set - will ask each time');
    }
    
    if (defaultTerminal) {
      console.log(`📌 Default Terminal: ${defaultTerminal.name}`);
    } else {
      console.log('📌 Using system default terminal');
    }
    
    hideSettingsModal();
    
    // Show success message
    infoEl.textContent = 'Settings saved successfully!';
    setTimeout(() => {
      if (currentProjects.length > 0) {
        infoEl.textContent = `Found ${currentProjects.length} Node.js project(s).`;
      }
    }, 2000);
  } catch (err) {
    console.error('Error saving settings:', err);
    infoEl.textContent = 'Error saving settings. Please try again.';
  }
}

/**
 * Show settings modal
 */
async function showSettingsModal() {
  // Show current settings
  if (defaultIDE) {
    currentIdeDisplay.textContent = `Current: ${defaultIDE.name}`;
    currentIdeDisplay.classList.remove('hidden');
  } else {
    currentIdeDisplay.classList.add('hidden');
  }
  
  if (defaultTerminal) {
    currentTerminalDisplay.textContent = `Current: ${defaultTerminal.name}`;
    currentTerminalDisplay.classList.remove('hidden');
  } else {
    currentTerminalDisplay.textContent = 'Current: System Default';
    currentTerminalDisplay.classList.remove('hidden');
  }
  
  // Refresh IDE list
  try {
    installedIDEs = await window.electronAPI.getInstalledIDEs();
  } catch (err) {
    console.error('Error refreshing IDEs:', err);
  }
  
  // Populate IDE list
  defaultIdeList.innerHTML = '';
  if (installedIDEs.length === 0) {
    noIdeMessage.classList.remove('hidden');
  } else {
    noIdeMessage.classList.add('hidden');
    
    // Add "None" option
    const noneIdeOption = document.createElement('label');
    noneIdeOption.className = 'flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-purple-600/20 hover:to-purple-700/20 rounded-xl cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-purple-500/30 group';
    noneIdeOption.innerHTML = `
      <input type="radio" name="defaultIDE" value="-1" ${!defaultIDE ? 'checked' : ''} class="w-5 h-5 text-purple-500 focus:ring-2 focus:ring-purple-500">
      <i class="fas fa-question-circle text-2xl text-gray-400 group-hover:text-purple-400 transition-colors"></i>
      <span class="flex-1 text-white font-medium group-hover:text-purple-300 transition-colors">None (Always ask)</span>
      ${!defaultIDE ? '<i class="fas fa-check-circle text-purple-500"></i>' : ''}
    `;
    defaultIdeList.appendChild(noneIdeOption);
    
    // Add IDE options
    installedIDEs.forEach((ide, index) => {
      const ideOption = document.createElement('label');
      const isSelected = defaultIDE && defaultIDE.command === ide.command;
      ideOption.className = `flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-purple-600/20 hover:to-purple-700/20 rounded-xl cursor-pointer transition-all duration-200 border-2 ${isSelected ? 'border-purple-500/50 bg-purple-500/10' : 'border-transparent hover:border-purple-500/30'} group`;
      ideOption.innerHTML = `
        <input type="radio" name="defaultIDE" value="${index}" ${isSelected ? 'checked' : ''} class="w-5 h-5 text-purple-500 focus:ring-2 focus:ring-purple-500">
        <span class="text-3xl">${ide.icon}</span>
        <span class="flex-1 text-white font-medium group-hover:text-purple-300 transition-colors">${escapeHtml(ide.name)}</span>
        ${isSelected ? '<i class="fas fa-check-circle text-purple-500"></i>' : ''}
      `;
      defaultIdeList.appendChild(ideOption);
    });
  }
  
  // Populate Terminal list - Refresh from backend
  defaultTerminalList.innerHTML = '';
  
  try {
    installedTerminals = await window.electronAPI.getInstalledTerminals();
    console.log(`Refreshed terminal list: ${installedTerminals.length} terminals detected`);
  } catch (err) {
    console.error('Error refreshing terminals:', err);
  }
  
  // Add "System Default" option first
  const systemDefaultOption = document.createElement('label');
  const isSystemDefault = !defaultTerminal || defaultTerminal.command === 'system-default';
  systemDefaultOption.className = `flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-green-600/20 hover:to-green-700/20 rounded-xl cursor-pointer transition-all duration-200 border-2 ${isSystemDefault ? 'border-green-500/50 bg-green-500/10' : 'border-transparent hover:border-green-500/30'} group`;
  systemDefaultOption.innerHTML = `
    <input type="radio" name="defaultTerminal" value="system-default" ${isSystemDefault ? 'checked' : ''} class="w-5 h-5 text-green-500 focus:ring-2 focus:ring-green-500">
    <span class="text-3xl">🖥️</span>
    <span class="flex-1 text-white font-medium group-hover:text-green-300 transition-colors">System Default (Auto-detect)</span>
    ${isSystemDefault ? '<i class="fas fa-check-circle text-green-500"></i>' : ''}
  `;
  defaultTerminalList.appendChild(systemDefaultOption);
  
  // Add detected terminals
  if (installedTerminals.length > 0) {
    installedTerminals.forEach((terminal) => {
      const terminalOption = document.createElement('label');
      const isSelected = defaultTerminal && defaultTerminal.command === terminal.command;
      terminalOption.className = `flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-green-600/20 hover:to-green-700/20 rounded-xl cursor-pointer transition-all duration-200 border-2 ${isSelected ? 'border-green-500/50 bg-green-500/10' : 'border-transparent hover:border-green-500/30'} group`;
      terminalOption.innerHTML = `
        <input type="radio" name="defaultTerminal" value="${terminal.command}" ${isSelected ? 'checked' : ''} class="w-5 h-5 text-green-500 focus:ring-2 focus:ring-green-500">
        <span class="text-3xl">${terminal.icon}</span>
        <span class="flex-1 text-white font-medium group-hover:text-green-300 transition-colors">${escapeHtml(terminal.name)}</span>
        ${isSelected ? '<i class="fas fa-check-circle text-green-500"></i>' : ''}
      `;
      defaultTerminalList.appendChild(terminalOption);
    });
  } else {
    const noTerminalsMsg = document.createElement('p');
    noTerminalsMsg.className = 'text-sm text-gray-500 mt-2';
    noTerminalsMsg.textContent = 'No additional terminals detected. Using system default.';
    defaultTerminalList.appendChild(noTerminalsMsg);
  }
  
  settingsModal.classList.remove("hidden");
}

/**
 * Show dependency modal
 */
function showDependencyModal(projectPath) {
  pendingActionProject = projectPath;
  dependencyModal.classList.remove("hidden");
}

/**
 * Show custom port modal
 */
async function showCustomPortModal(projectPath) {
  pendingPortProject = projectPath;
  
  // Get project info to show default port
  const projectInfo = currentProjects.find(p => p.path === projectPath);
  const defaultPort = projectInfo?.defaultPort || 3000;
  
  defaultPortDisplay.textContent = defaultPort;
  customPortInput.value = '';
  customPortInput.placeholder = `Default: ${defaultPort}`;
  
  customPortModal.classList.remove("hidden");
  setTimeout(() => customPortInput.focus(), 100);
}

/**
 * Show IDE selector modal
 */
async function showIDEModal(projectPath) {
  pendingIdeProject = projectPath;
  
  // Show loading state
  ideList.innerHTML = '<p class="text-gray-400 text-center">Detecting IDEs...</p>';
  ideModal.classList.remove("hidden");
  
  // Refresh IDE list to ensure we have the latest
  try {
    installedIDEs = await window.electronAPI.getInstalledIDEs();
    console.log(`Refreshed IDE list: ${installedIDEs.length} IDEs detected`);
    
    // Update IDE count display
    if (installedIDEs.length > 0) {
      ideCountNum.textContent = installedIDEs.length;
      ideCountEl.style.display = 'block';
    }
  } catch (err) {
    console.error('Error refreshing installed IDEs:', err);
  }
  
  // Populate IDE list
  ideList.innerHTML = '';
  
  if (installedIDEs.length === 0) {
    ideList.innerHTML = '<p class="text-gray-400 text-center">No IDEs detected. Opening in file manager...</p>';
    setTimeout(() => {
      hideModals();
      window.electronAPI.openInEditor(projectPath);
    }, 1500);
    return;
  }
  
  installedIDEs.forEach(ide => {
    const button = document.createElement('button');
    button.className = 'w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition flex items-center gap-3';
    button.innerHTML = `
      <span class="text-2xl">${ide.icon}</span>
      <span class="flex-1 text-left">${escapeHtml(ide.name)}</span>
      <i class="fas fa-arrow-right text-gray-400"></i>
    `;
    button.addEventListener('click', () => handleIDESelection(ide.command));
    ideList.appendChild(button);
  });
}

/**
 * Handle IDE selection
 */
async function handleIDESelection(ideCommand) {
  if (pendingIdeProject) {
    // Save project path before hiding modal (which clears pendingIdeProject)
    const projectPath = pendingIdeProject;
    
    // Find IDE name for better user feedback
    const ide = installedIDEs.find(i => i.command === ideCommand);
    const ideName = ide ? ide.name : ideCommand;
    
    hideModals();
    setCardStatus(projectPath, `Opening in ${ideName}...`, 'info');
    updateSingleCard(projectPath); // Show status immediately
    await window.electronAPI.openInEditor(projectPath, ideCommand);
    setTimeout(() => {
      clearCardStatus(projectPath);
      updateSingleCard(projectPath);
    }, 2000);
  }
}

/**
 * Handle use default port
 */
async function handleUseDefaultPort() {
  if (pendingPortProject) {
    const projectPath = pendingPortProject; // Save before hiding modal
    hideModals();
    await runProjectWithPort(projectPath, null);
  }
}

/**
 * Handle use custom port
 */
async function handleUseCustomPort() {
  const customPort = parseInt(customPortInput.value, 10);
  
  if (!customPortInput.value || isNaN(customPort)) {
    customPortInput.classList.add('border-red-500');
    setTimeout(() => customPortInput.classList.remove('border-red-500'), 500);
    return;
  }
  
  if (customPort < 1000 || customPort > 65535) {
    if (pendingPortProject) {
      setCardStatus(pendingPortProject, 'Port must be between 1000 and 65535', 'error');
    }
    customPortInput.classList.add('border-red-500');
    setTimeout(() => customPortInput.classList.remove('border-red-500'), 500);
    return;
  }
  
  if (pendingPortProject) {
    const projectPath = pendingPortProject; // Save before hiding modal
    hideModals();
    await runProjectWithPort(projectPath, customPort);
  }
}

/**
 * Run project with specified port (or auto)
 */
async function runProjectWithPort(projectPath, customPort = null) {
  setCardStatus(projectPath, customPort 
    ? `Starting on custom port ${customPort}...`
    : `Starting project...`, 'info');
  updateSingleCard(projectPath); // Show loading status immediately
  
  try {
    const result = await window.electronAPI.playProject(projectPath, customPort);
    if (result.error) {
      setCardStatus(projectPath, `Error: ${result.error}`, 'error');
      updateSingleCard(projectPath);
    } else if (result.message) {
      setCardStatus(projectPath, result.message, 'success');
      updateSingleCard(projectPath);
      setTimeout(() => clearCardStatus(projectPath), 3000);
    }
  } catch (err) {
    console.error("Error running project:", err);
    setCardStatus(projectPath, `Error: ${err.message}`, 'error');
    updateSingleCard(projectPath);
  }
}

/**
 * Show confirmation dialog
 */
function showConfirmDialog(title, message, projectPath) {
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").textContent = message;
  pendingRemoveProject = projectPath;
  confirmDialog.classList.remove("hidden");
}

/**
 * Handle modal install button
 */
async function handleModalInstall() {
  if (pendingActionProject) {
    hideModals();
    await installProjectDependencies(pendingActionProject);
  }
}

/**
 * Handle confirm remove button
 */
async function handleConfirmRemove() {
  if (pendingRemoveProject) {
    const projectPath = pendingRemoveProject;
    hideModals();
    await actuallyRemoveModules(projectPath);
  }
}

/**
 * Handle search input - Instant search with debouncing
 */
let searchTimeout = null;
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Instant search (no debounce for better UX)
  if (!searchTerm) {
    filteredProjects = [];
    renderProjectCards(currentProjects);
    infoEl.textContent = `Showing ${currentProjects.length} project(s).`;
    return;
  }
  
  // Enhanced search - search in name, path, and git branch
  filteredProjects = currentProjects.filter(project => {
    const nameMatch = project.name.toLowerCase().includes(searchTerm);
    const pathMatch = project.path.toLowerCase().includes(searchTerm);
    const branchMatch = project.message && 
      project.message.toLowerCase().includes(searchTerm) &&
      !['no commits yet', 'no git history', 'git error'].includes(project.message.toLowerCase());
    
    return nameMatch || pathMatch || branchMatch;
  });
  
  renderProjectCards(filteredProjects);
  infoEl.textContent = filteredProjects.length > 0 
    ? `Found ${filteredProjects.length} project(s) matching "${e.target.value}"`
    : `No projects found matching "${e.target.value}"`;
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('light-mode', !isDarkMode);
  
  // Save preference
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  
  // Update icon
  const icon = darkModeToggle.querySelector('i');
  icon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
}

/**
 * Load dark mode preference
 */
function loadDarkModePreference() {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    isDarkMode = saved === 'true';
    document.body.classList.toggle('light-mode', !isDarkMode);
    const icon = darkModeToggle.querySelector('i');
    icon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
  }
}

/**
 * Soft refresh - calls scanAllProjects, merges new results in, updates UI.
 */
async function softRefreshProjects() {
  try {
    const projects = await window.electronAPI.scanAllProjects();
    if (!projects) return;

    currentProjects = mergeProjectLists(currentProjects, projects);
    updateProjectCards(currentProjects);
  } catch (err) {
    console.error("Error in soft refresh:", err);
  }
}

/**
 * Merges new project list with the old list, preserving existing order
 */
function mergeProjectLists(oldList, newList) {
  const merged = [...oldList];
  const oldPaths = new Set(oldList.map((p) => p.path));

  for (const project of newList) {
    if (!oldPaths.has(project.path)) {
      merged.push(project);
    }
  }
  return merged;
}

/**
 * Render the full list of projects (after the user clicks "Scan Projects").
 */
async function renderProjects() {
  projectListEl.innerHTML =
    '<p class="text-gray-300">Scanning for projects...</p>';
  try {
    const projects = await window.electronAPI.scanAllProjects();
    console.log("Scanned Projects:", projects);

    if (!projects || projects.length === 0) {
      projectListEl.innerHTML =
        '<p class="text-gray-400">No Node.js projects found. Try scanning again.</p>';
      infoEl.textContent = 'No projects found. Try scanning a different location.';
      return;
    }

    currentProjects = projects;
    filteredProjects = [];
    searchInput.value = '';
    infoEl.textContent = `Found ${projects.length} Node.js project(s).`;
    renderProjectCards(projects);
  } catch (err) {
    console.error("Error scanning projects:", err);
    projectListEl.innerHTML =
      '<p class="text-red-500">Failed to scan projects. Check console for details.</p>';
    infoEl.textContent = `Error: ${err.message || 'Failed to scan projects'}`;
  }
}

/**
 * Scan custom folder
 */
async function renderCustomProjects() {
  projectListEl.innerHTML =
    '<p class="text-gray-300">Select a folder to scan...</p>';
  try {
    const projects = await window.electronAPI.scanCustomFolder();
    
    if (!projects) {
      // User cancelled
      projectListEl.innerHTML = currentProjects.length > 0
        ? ''
        : '<p class="text-gray-400">No projects scanned yet.</p>';
      infoEl.textContent = 'Scan cancelled.';
      if (currentProjects.length > 0) {
        renderProjectCards(currentProjects);
      }
      return;
    }

    console.log("Scanned Custom Projects:", projects);

    if (projects.length === 0) {
      projectListEl.innerHTML =
        '<p class="text-gray-400">No Node.js projects found in selected folder.</p>';
      infoEl.textContent = 'No projects found in selected folder.';
      return;
    }

    currentProjects = projects;
    filteredProjects = [];
    searchInput.value = '';
    infoEl.textContent = `Found ${projects.length} Node.js project(s) in selected folder.`;
    renderProjectCards(projects);
  } catch (err) {
    console.error("Error scanning custom folder:", err);
    projectListEl.innerHTML =
      '<p class="text-red-500">Failed to scan folder. Check console for details.</p>';
    infoEl.textContent = `Error: ${err.message || 'Failed to scan folder'}`;
  }
}

/**
 * Render the project cards from scratch
 */
async function renderProjectCards(projects) {
  projectListEl.innerHTML = "";

  for (const project of projects) {
    const card = await createOrUpdateCard(project);
    projectListEl.appendChild(card);
  }
}

/**
 * Update only cards that are missing or changed
 */
async function updateProjectCards(projects) {
  for (const project of projects) {
    const existingCard = document.querySelector(
      `[data-project-path="${project.path}"]`
    );
    if (existingCard) {
      // We'll just re-build the inner HTML to ensure up-to-date data
      await populateCardContent(existingCard, project);
    } else {
      // Card not found, create a new one
      const newCard = await createOrUpdateCard(project);
      projectListEl.appendChild(newCard);
    }
  }
}

/**
 * Update a single card without re-rendering the entire list
 */
async function updateSingleCard(projectPath) {
  const project = currentProjects.find(p => p.path === projectPath);
  if (!project) return;
  
  const card = document.querySelector(`[data-project-path="${projectPath}"]`);
  if (card) {
    await populateCardContent(card, project);
  }
}

/**
 * Creates a new project card (or updates an existing DOM element)
 */
async function createOrUpdateCard(project) {
  let card = document.querySelector(`[data-project-path="${project.path}"]`);
  if (!card) {
    card = document.createElement("div");
    card.className =
      "bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition relative";
    card.dataset.projectPath = project.path;
  }
  await populateCardContent(card, project);
  return card;
}

/**
 * Remove node_modules - Show confirmation first
 */
async function removeModulesFromProject(projectPath) {
  const projectName = projectPath.split('/').pop() || projectPath;
  showConfirmDialog(
    "Remove node_modules",
    `Are you sure you want to remove node_modules from "${projectName}"? This will free up disk space but you'll need to reinstall dependencies.`,
    projectPath
  );
}

/**
 * Actually remove node_modules after confirmation
 */
async function actuallyRemoveModules(projectPath) {
  setCardStatus(projectPath, 'Removing node_modules...', 'info');
  try {
    const result = await window.electronAPI.removeNodeModules(projectPath);
    if (result.success) {
      setCardStatus(projectPath, 'node_modules removed successfully', 'success');
      // Update only this card
      updateSingleCard(projectPath);
      setTimeout(() => clearCardStatus(projectPath), 3000);
    } else {
      setCardStatus(projectPath, `Failed to remove node_modules: ${result.message}`, 'error');
      updateSingleCard(projectPath);
    }
  } catch (err) {
    console.error("Error removing node_modules:", err);
    setCardStatus(projectPath, `Error removing node_modules: ${err.message}`, 'error');
    updateSingleCard(projectPath);
  }
}

/**
 * View logs for a project
 */
function viewProjectLogs(projectPath) {
  const logs = projectLogs.get(projectPath) || [];
  const projectName = projectPath.split('/').pop() || projectPath;
  
  document.getElementById("logsProjectName").textContent = `${projectName} - Logs`;
  
  const logsContent = document.getElementById("logsContent");
  if (logs.length === 0) {
    logsContent.innerHTML = '<p class="text-gray-400">No logs available yet. Logs will appear here when the project is running.</p>';
  } else {
    logsContent.innerHTML = `<pre class="text-xs whitespace-pre-wrap">${logs.map(log => escapeHtml(log)).join('\n')}</pre>`;
    // Scroll to bottom
    logsContent.scrollTop = logsContent.scrollHeight;
  }
  
  logsModal.classList.remove("hidden");
}

/**
 * Set status message for a project card
 */
function setCardStatus(projectPath, message, type = 'info') {
  if (!message) {
    projectStatuses.delete(projectPath);
  } else {
    projectStatuses.set(projectPath, { message, type });
  }
  updateCardStatusDisplay(projectPath);
}

/**
 * Clear status message for a project card
 */
function clearCardStatus(projectPath) {
  projectStatuses.delete(projectPath);
  updateCardStatusDisplay(projectPath);
}

/**
 * Update the status display on a specific card
 */
function updateCardStatusDisplay(projectPath) {
  const card = document.querySelector(`[data-project-path="${projectPath}"]`);
  if (!card) return;
  
  const statusEl = card.querySelector('.card-status');
  if (!statusEl) return;
  
  const status = projectStatuses.get(projectPath);
  if (status) {
    const typeClasses = {
      info: 'bg-blue-500/20 text-blue-400',
      success: 'bg-green-500/20 text-green-400',
      error: 'bg-red-500/20 text-red-400',
      warning: 'bg-yellow-500/20 text-yellow-400'
    };
    const icons = {
      info: 'fa-info-circle',
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle'
    };
    
    statusEl.className = `card-status px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${typeClasses[status.type] || typeClasses.info}`;
    statusEl.innerHTML = `<i class="fas ${icons[status.type] || icons.info}"></i><span>${escapeHtml(status.message)}</span>`;
    statusEl.style.display = 'flex';
  } else {
    statusEl.style.display = 'none';
  }
}

/**
 * Populates a card's inner HTML and attaches event listeners
 */
async function populateCardContent(card, project) {
  const isRunning = runningProjects.has(project.path);
  const runningInfo = isRunning ? runningProjects.get(project.path) : null;
  const dependenciesInstalled = await areDependenciesInstalled(project.path);
  const projLog = projectLogs.get(project.path) || [];
  const stats = projectStats.get(project.path);
  const projectName = project.name || project.path.split('/').pop();
  const cardStatus = projectStatuses.get(project.path);

  card.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-white">${escapeHtml(projectName)}</h4>
        ${project.message && project.message !== 'No commits yet' && project.message !== 'No Git history' && project.message !== 'Git Error'
          ? `<p class="text-xs text-gray-500 mt-1"><i class="fas fa-code-branch mr-1"></i>${escapeHtml(project.message)}</p>`
          : ''
        }
      </div>
      <div class="flex flex-col items-end gap-1">
      ${
        isRunning
            ? '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 flex items-center gap-1"><span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Running</span>'
            : ""
        }
        ${
          isRunning && runningInfo?.framework
            ? `<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">${escapeHtml(runningInfo.framework)}</span>`
            : ''
        }
      </div>
    </div>
    <div class="card-status mb-2" style="display: ${cardStatus ? 'flex' : 'none'}"></div>
    <p class="text-sm text-gray-400">
      <i class="far fa-clock mr-1"></i>Last Commit: ${
        project.timestamp
          ? new Date(project.timestamp * 1000).toLocaleString()
          : "No commits yet"
      }
    </p>
    <p class="text-sm text-gray-400 truncate" title="${escapeHtml(project.path)}">
      <i class="far fa-folder mr-1"></i>${escapeHtml(project.path)}
    </p>
    ${
      isRunning && runningInfo?.port
        ? `<p class="text-sm text-green-400 mt-1"><i class="fas fa-server mr-1"></i>Port: ${runningInfo.port}</p>`
        : '<p class="text-sm text-gray-400 mt-1"><i class="fas fa-stop-circle mr-1"></i>Stopped</p>'
    }

    ${
      stats
        ? `<div class="mt-2 text-sm flex gap-4">
            <p class="text-blue-400"><i class="fas fa-memory mr-1"></i>${formatBytes(
              stats.memory || 0
            )}</p>
            <p class="text-blue-400"><i class="fas fa-microchip mr-1"></i>${(stats.cpu || 0).toFixed(1)}%</p>
          </div>`
        : ""
    }

    ${projLog.length > 0 ? `
    <div class="mt-2 bg-gray-900 rounded p-2 max-h-20 overflow-hidden relative">
      <pre class="text-xs text-gray-400">${projLog
        .slice(-2)
        .map(log => escapeHtml(log))
        .join("\n")}</pre>
      <div class="absolute bottom-0 right-0 p-1">
        <button class="view-logs-button text-xs text-blue-400 hover:text-blue-300 underline">
          <i class="fas fa-external-link-alt mr-1"></i>View All
        </button>
      </div>
    </div>
    ` : ''}

    <div class="flex items-center gap-2 mt-4 flex-wrap">
      ${
        dependenciesInstalled
          ? `<button
               class="play-button px-3 py-2 bg-green-500 rounded-lg hover:bg-green-600 text-white font-medium ${
                 isRunning ? "hidden" : ""
               } transition flex items-center gap-1"
             >
               <i class="fas fa-play"></i>
               <span>Run</span>
             </button>`
          : `<button
               class="install-button px-3 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 text-white font-medium transition flex items-center gap-1"
             >
               <i class="fas fa-download"></i>
               <span>Install</span>
             </button>`
      }
      <button
        class="stop-button px-3 py-2 bg-red-500 rounded-lg hover:bg-red-600 text-white font-medium ${
          !isRunning ? "hidden" : ""
        } transition flex items-center gap-1"
      >
        <i class="fas fa-stop"></i>
        <span>Stop</span>
      </button>
      ${
        isRunning
          ? `<button
               class="browser-button px-3 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white font-medium transition flex items-center gap-1"
             >
               <i class="fas fa-globe"></i>
               <span>Browser</span>
             </button>`
          : ""
      }
      <button
        class="editor-button px-3 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 text-white font-medium transition flex items-center gap-1"
        title="${installedIDEs.length > 0 ? `${installedIDEs.length} editors available` : 'Open in editor'}"
      >
        <i class="fas fa-code"></i>
        <span>Editor</span>
        ${installedIDEs.length > 1 ? `<span class="text-xs bg-purple-700 px-1 rounded">${installedIDEs.length}</span>` : ''}
      </button>
      <button
        class="terminal-button px-3 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-white font-medium transition flex items-center gap-1"
        title="Open terminal here"
      >
        <i class="fas fa-terminal"></i>
        <span>Terminal</span>
      </button>
      ${
        dependenciesInstalled
          ? `<button
               class="remove-modules-button px-3 py-2 bg-red-400 rounded-lg hover:bg-red-500 text-white font-medium transition flex items-center gap-1"
             >
               <i class="fas fa-trash"></i>
               <span>Clean</span>
             </button>`
          : ""
      }
    </div>
  `;

  // Attach event listeners
  const playButton = card.querySelector(".play-button");
  const stopButton = card.querySelector(".stop-button");
  const installButton = card.querySelector(".install-button");
  const browserButton = card.querySelector(".browser-button");
  const editorButton = card.querySelector(".editor-button");
  const terminalButton = card.querySelector(".terminal-button");
  const removeButtonEl = card.querySelector(".remove-modules-button");
  const viewLogsButton = card.querySelector(".view-logs-button");

  // Bind actions
  removeButtonEl?.addEventListener("click", () =>
    removeModulesFromProject(project.path)
  );
  playButton?.addEventListener("click", () => attemptRunProject(project.path));
  stopButton?.addEventListener("click", () => stopProject(project.path));
  installButton?.addEventListener("click", () =>
    installProjectDependencies(project.path)
  );
  browserButton?.addEventListener("click", () => {
    if (runningInfo) openInBrowser(runningInfo.port);
  });
  editorButton?.addEventListener("click", () => openInEditor(project.path));
  terminalButton?.addEventListener("click", () => openInTerminal(project.path));
  viewLogsButton?.addEventListener("click", () => viewProjectLogs(project.path));
  
  // Initialize status display
  updateCardStatusDisplay(project.path);
}

/**
 * Attempt to run/play a project - with automatic port selection
 */
async function attemptRunProject(projectPath, customPort = null) {
  // Check if dependencies are installed first
  const depsInstalled = await areDependenciesInstalled(projectPath);
  if (!depsInstalled) {
    showDependencyModal(projectPath);
    return;
  }
  
  // Run directly with automatic port selection (no modal)
  // The backend will handle finding an available port
  await runProjectWithPort(projectPath, customPort);
}

/**
 * Stop a running project
 */
async function stopProject(projectPath) {
  if (!runningProjects.has(projectPath)) return;

  try {
    const stillAlive = await verifyProcessStatus(projectPath);
    if (!stillAlive) {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      updateSingleCard(projectPath);
      return;
    }
    setCardStatus(projectPath, 'Stopping project...', 'info');
    const result = await window.electronAPI.stopProject(projectPath);
    if (!result.success) {
      console.error("Stop project failed:", result.message);
      setCardStatus(projectPath, `Error stopping project: ${result.message}`, 'error');
    } else {
      setCardStatus(projectPath, 'Project stopped successfully', 'success');
      setTimeout(() => clearCardStatus(projectPath), 2000);
    }
    updateSingleCard(projectPath);
  } catch (err) {
    console.error("Error stopping project:", err);
    setCardStatus(projectPath, `Error stopping project: ${err.message}`, 'error');
    updateSingleCard(projectPath);
  }
}

/**
 * Verify if the process for a given project is alive
 */
async function verifyProcessStatus(projectPath) {
  try {
    const pid = projectProcesses.get(projectPath);
    if (!pid) return false;
    const isRunning = await window.electronAPI.checkProcessStatus(pid);
    if (!isRunning) {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      // Also remove from activeConnections if needed
      for (const [p, path] of activeConnections.entries()) {
        if (path === projectPath) {
          activeConnections.delete(p);
        }
      }
      updateSingleCard(projectPath);
    }
    return isRunning;
  } catch (err) {
    console.error("Error checking process status:", err);
    return false;
  }
}

/**
 * Open running project in browser
 */
async function openInBrowser(port) {
  try {
    const projectPath = activeConnections.get(port);
    if (projectPath) {
      const stillAlive = await verifyProcessStatus(projectPath);
      if (!stillAlive) {
        setCardStatus(projectPath, "Project is no longer running. Please start again.", 'warning');
        return;
      }
    }
    await window.electronAPI.openInBrowser(port);
  } catch (err) {
    console.error("Error opening in browser:", err);
    const projectPath = activeConnections.get(port);
    if (projectPath) {
      setCardStatus(projectPath, `Error: ${err.message}`, 'error');
    }
  }
}

/**
 * Open project in Editor - with IDE selection
 */
async function openInEditor(projectPath) {
  // Check if default IDE is set
  if (defaultIDE) {
    // Use default IDE
    setCardStatus(projectPath, `Opening in ${defaultIDE.name}...`, 'info');
    updateSingleCard(projectPath);
    await window.electronAPI.openInEditor(projectPath, defaultIDE.command);
    setTimeout(() => {
      clearCardStatus(projectPath);
      updateSingleCard(projectPath);
    }, 2000);
    return;
  }
  
  // No default IDE, show selector
  if (installedIDEs.length > 1) {
    // Show IDE selector modal
    showIDEModal(projectPath);
  } else if (installedIDEs.length === 1) {
    // Only one IDE, use it directly
    await window.electronAPI.openInEditor(projectPath, installedIDEs[0].command);
  } else {
    // No IDEs detected, use default
    await window.electronAPI.openInEditor(projectPath);
  }
}

/**
 * Open project in Terminal
 */
async function openInTerminal(projectPath) {
  try {
    setCardStatus(projectPath, 'Opening terminal...', 'info');
    updateSingleCard(projectPath);
    
    // Use default terminal preference if set (use command, not name)
    const terminalPreference = defaultTerminal ? defaultTerminal.command : null;
    console.log(`Opening terminal with preference: ${terminalPreference}`);
    const result = await window.electronAPI.openInTerminal(projectPath, terminalPreference);
    
    if (result.success) {
      const termName = defaultTerminal ? defaultTerminal.name : 'default terminal';
      setCardStatus(projectPath, `Opened in ${termName}`, 'success');
      setTimeout(() => {
        clearCardStatus(projectPath);
        updateSingleCard(projectPath);
      }, 2000);
    } else {
      setCardStatus(projectPath, `Error: ${result.error || 'Failed to open terminal'}`, 'error');
      updateSingleCard(projectPath);
    }
  } catch (err) {
    console.error("Error opening terminal:", err);
    setCardStatus(projectPath, `Error: ${err.message}`, 'error');
    updateSingleCard(projectPath);
  }
}

/**
 * Check if node_modules is present => dependencies installed
 */
async function areDependenciesInstalled(projectPath) {
  try {
    const packageJsonPath = `${projectPath}/package.json`;
    const nodeModulesPath = `${projectPath}/node_modules`;

    const hasPackageJson = await window.electronAPI.fileExists(packageJsonPath);
    const hasNodeModules = await window.electronAPI.fileExists(nodeModulesPath);

    return hasPackageJson && hasNodeModules;
  } catch (err) {
    console.error(`Error checking dependencies: ${projectPath}`, err);
    return false;
  }
}

/**
 * Install dependencies
 */
async function installProjectDependencies(projectPath) {
  setCardStatus(projectPath, 'Installing dependencies...', 'info');
  updateSingleCard(projectPath); // Show loading status immediately
  try {
    const result = await window.electronAPI.installDependencies(projectPath);
    if (result.success) {
      setCardStatus(projectPath, 'Dependencies installed successfully', 'success');
      // Update only this card to reflect new dependency status
      updateSingleCard(projectPath);
      setTimeout(() => clearCardStatus(projectPath), 3000);
    } else {
      setCardStatus(projectPath, `Failed to install dependencies`, 'error');
      updateSingleCard(projectPath);
    }
  } catch (err) {
    console.error("Error installing dependencies:", err);
    setCardStatus(projectPath, `Error installing: ${err.message}`, 'error');
    updateSingleCard(projectPath);
  }
}

/**
 * Simple utility to format bytes
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Escape HTML to prevent XSS attacks in logs
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

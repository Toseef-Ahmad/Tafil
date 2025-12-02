// renderer.js - Premium UI Version

// Helper for path operations
const path = {
  basename: (pathStr) => {
    return pathStr.split('/').pop() || pathStr.split('\\').pop() || pathStr;
  }
};

// DOM Elements
const infoEl = document.getElementById("info");
const projectListEl = document.getElementById("projectList");
const scanProjectsBtn = document.getElementById("scanProjectsBtn");
const scanCustomBtn = document.getElementById("scanCustomBtn");
const searchInput = document.getElementById("searchInput");
const darkModeToggle = document.getElementById("darkModeToggle");
const refreshBtn = document.getElementById("refreshBtn");
const ideCountEl = document.getElementById("ideCount");
const ideCountNum = document.getElementById("ideCountNum");
const moonIcon = document.getElementById("moonIcon");
const sunIcon = document.getElementById("sunIcon");

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

// State
let currentProjects = [];
let filteredProjects = [];
let runningProjects = new Map();
let projectProcesses = new Map();
let activeConnections = new Map();
let projectLogs = new Map();
let projectStats = new Map();
let projectStatuses = new Map();
let lastRefreshTime = Date.now();
let pendingActionProject = null;
let pendingRemoveProject = null;
let pendingPortProject = null;
let pendingIdeProject = null;
let installedIDEs = [];
let installedTerminals = [];
let isDarkMode = true;

// Settings
let defaultIDE = null;
let defaultTerminal = null;

const REFRESH_INTERVAL = 60000;
const REFRESH_THROTTLE = 5000;

// Lucide-style SVG Icons
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
  externalLink: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>',
  server: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
};

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  infoEl.textContent = 'Click "Scan Home" to find Node.js projects';
  
  // Load installed IDEs and Terminals
  try {
    installedIDEs = await window.electronAPI.getInstalledIDEs();
    if (installedIDEs.length > 0) {
      ideCountNum.textContent = installedIDEs.length;
      ideCountEl.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error loading IDEs:', err);
  }
  
  try {
    installedTerminals = await window.electronAPI.getInstalledTerminals();
  } catch (err) {
    console.error('Error loading Terminals:', err);
  }
  
  // Event listeners
  scanProjectsBtn.addEventListener("click", renderProjects);
  scanCustomBtn.addEventListener("click", renderCustomProjects);
  darkModeToggle.addEventListener("click", toggleDarkMode);
  refreshBtn.addEventListener("click", () => {
    renderProjectCards(currentProjects);
    infoEl.textContent = 'Projects refreshed';
  });
  
  searchInput.addEventListener("input", handleSearch);
  
  // Modal listeners
  modalCancelBtn.addEventListener("click", hideModals);
  modalInstallBtn.addEventListener("click", handleModalInstall);
  confirmNoBtn.addEventListener("click", hideModals);
  confirmYesBtn.addEventListener("click", handleConfirmRemove);
  closeLogsBtn.addEventListener("click", () => logsModal.classList.add("hidden"));
  
  cancelPortBtn.addEventListener("click", hideModals);
  useDefaultPortBtn.addEventListener("click", handleUseDefaultPort);
  useCustomPortBtn.addEventListener("click", handleUseCustomPort);
  customPortInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') handleUseCustomPort();
  });
  
  cancelIdeBtn.addEventListener("click", hideModals);
  
  settingsBtn.addEventListener("click", showSettingsModal);
  closeSettingsBtn.addEventListener("click", hideSettingsModal);
  cancelSettingsBtn.addEventListener("click", hideSettingsModal);
  saveSettingsBtn.addEventListener("click", saveSettings);
  
  // Click outside modals to close
  [dependencyModal, confirmDialog, logsModal, customPortModal, ideModal, settingsModal].forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        if (modal === settingsModal) hideSettingsModal();
        else if (modal === logsModal) logsModal.classList.add("hidden");
        else hideModals();
      }
    });
  });
  
  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);

  // Listen for project status updates
  window.electronAPI.onProjectStatus((_event, statusData) => {
    const { projectPath, status, port, error, pid, framework } = statusData;
    console.log("Project Status:", statusData);

    if (status === "running") {
      runningProjects.set(projectPath, { port, status: "running", pid, framework: framework || 'Unknown' });
      projectProcesses.set(projectPath, pid);
      activeConnections.set(port, projectPath);
      setCardStatus(projectPath, `Running on :${port}`, 'success');
      setTimeout(() => clearCardStatus(projectPath), 3000);
    } else if (status === "stopped") {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      for (const [p, path] of activeConnections.entries()) {
        if (path === projectPath) activeConnections.delete(p);
      }
      setCardStatus(projectPath, 'Stopped', 'success');
      setTimeout(() => clearCardStatus(projectPath), 2000);
    } else if (status === "error") {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      setCardStatus(projectPath, error || "Error occurred", 'error');
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
  
  loadDarkModePreference();
  loadSettings();
});

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    renderProjects();
  }
  
  if (e.key === 'Escape') {
    hideModals();
    hideSettingsModal();
    logsModal.classList.add("hidden");
  }
}

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

function hideSettingsModal() {
  settingsModal.classList.add("hidden");
}

// Settings
function loadSettings() {
  try {
    const savedIDE = localStorage.getItem('defaultIDE');
    const savedTerminal = localStorage.getItem('defaultTerminal');
    if (savedIDE) defaultIDE = JSON.parse(savedIDE);
    if (savedTerminal) defaultTerminal = JSON.parse(savedTerminal);
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
    infoEl.textContent = 'Settings saved';
    setTimeout(() => {
      if (currentProjects.length > 0) {
        infoEl.textContent = `${currentProjects.length} projects`;
      }
    }, 2000);
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

async function showSettingsModal() {
  // Update current displays
  if (defaultIDE) {
    currentIdeDisplay.textContent = defaultIDE.name;
    currentIdeDisplay.classList.remove('hidden');
  } else {
    currentIdeDisplay.classList.add('hidden');
  }
  
  if (defaultTerminal) {
    currentTerminalDisplay.textContent = defaultTerminal.name;
    currentTerminalDisplay.classList.remove('hidden');
  } else {
    currentTerminalDisplay.textContent = 'System Default';
    currentTerminalDisplay.classList.remove('hidden');
  }
  
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
    noIdeMessage.classList.remove('hidden');
  } else {
    noIdeMessage.classList.add('hidden');
    
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
  option.className = `settings-option ${isSelected ? 'selected' : ''}`;
  option.innerHTML = `
    <input type="radio" name="${name}" value="${value}" ${isSelected ? 'checked' : ''} />
    <span class="settings-option-icon">${icon}</span>
    <span class="settings-option-name">${escapeHtml(label)}</span>
    ${isSelected ? Icons.check : ''}
  `;
  return option;
}

// Search
let searchTimeout = null;
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  
  if (!searchTerm) {
    filteredProjects = [];
    renderProjectCards(currentProjects);
    infoEl.textContent = `${currentProjects.length} projects`;
    return;
  }
  
  filteredProjects = currentProjects.filter(project => {
    const nameMatch = project.name.toLowerCase().includes(searchTerm);
    const pathMatch = project.path.toLowerCase().includes(searchTerm);
    const branchMatch = project.message?.toLowerCase().includes(searchTerm);
    return nameMatch || pathMatch || branchMatch;
  });
  
  renderProjectCards(filteredProjects);
  infoEl.textContent = filteredProjects.length > 0 
    ? `${filteredProjects.length} results for "${e.target.value}"`
    : `No results for "${e.target.value}"`;
}

// Dark mode
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('light-mode', !isDarkMode);
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  
  moonIcon.classList.toggle('hidden', !isDarkMode);
  sunIcon.classList.toggle('hidden', isDarkMode);
}

function loadDarkModePreference() {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    isDarkMode = saved === 'true';
    document.body.classList.toggle('light-mode', !isDarkMode);
    moonIcon.classList.toggle('hidden', !isDarkMode);
    sunIcon.classList.toggle('hidden', isDarkMode);
  }
}

// Projects
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

function mergeProjectLists(oldList, newList) {
  const merged = [...oldList];
  const oldPaths = new Set(oldList.map((p) => p.path));
  for (const project of newList) {
    if (!oldPaths.has(project.path)) merged.push(project);
  }
  return merged;
}

async function renderProjects() {
  projectListEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⏳</div><p class="empty-state-title">Scanning...</p></div>';
  
  try {
    const projects = await window.electronAPI.scanAllProjects();
    
    if (!projects || projects.length === 0) {
      projectListEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📁</div><p class="empty-state-title">No projects found</p><p class="empty-state-desc">Try scanning a different location</p></div>';
      infoEl.textContent = 'No projects found';
      return;
    }

    currentProjects = projects;
    filteredProjects = [];
    searchInput.value = '';
    infoEl.textContent = `${projects.length} projects`;
    renderProjectCards(projects);
  } catch (err) {
    console.error("Error scanning:", err);
    projectListEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">❌</div><p class="empty-state-title">Scan failed</p></div>';
  }
}

async function renderCustomProjects() {
  try {
    const projects = await window.electronAPI.scanCustomFolder();
    
    if (!projects) {
      infoEl.textContent = 'Scan cancelled';
      return;
    }

    if (projects.length === 0) {
      projectListEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📁</div><p class="empty-state-title">No projects in folder</p></div>';
      infoEl.textContent = 'No projects found';
      return;
    }

    currentProjects = projects;
    filteredProjects = [];
    searchInput.value = '';
    infoEl.textContent = `${projects.length} projects`;
    renderProjectCards(projects);
  } catch (err) {
    console.error("Error scanning folder:", err);
  }
}

async function renderProjectCards(projects) {
  projectListEl.innerHTML = "";
  for (const project of projects) {
    const card = await createProjectCard(project);
    projectListEl.appendChild(card);
  }
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
  await populateCardContent(card, project);
  return card;
}

async function populateCardContent(card, project) {
  const isRunning = runningProjects.has(project.path);
  const runningInfo = isRunning ? runningProjects.get(project.path) : null;
  const dependenciesInstalled = await areDependenciesInstalled(project.path);
  const projectName = project.name || path.basename(project.path);
  const cardStatus = projectStatuses.get(project.path);
  
  // Truncate path
  const shortPath = project.path.length > 45 
    ? '...' + project.path.slice(-42) 
    : project.path;
  
  // Format timestamp
  const timeStr = project.timestamp 
    ? formatRelativeTime(project.timestamp * 1000)
    : 'No commits';

  card.className = `project-card ${isRunning ? 'is-running' : ''}`;
  card.style.backgroundColor = '#111113';
  card.style.color = '#fafafa';
  card.style.border = '1px solid rgba(255, 255, 255, 0.06)';
  card.style.borderRadius = '12px';
  card.style.padding = '14px 16px';
  
  card.innerHTML = `
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="min-w-0 flex-1">
        <h4 class="card-title truncate" style="color: #fafafa; font-weight: 600; font-size: 0.875rem;">${escapeHtml(projectName)}</h4>
        ${project.message && !['No commits yet', 'No Git history', 'Git Error'].includes(project.message) 
          ? `<p class="card-subtitle truncate" style="color: #71717a; font-size: 0.75rem;">${Icons.gitBranch} ${escapeHtml(project.message)}</p>` 
          : ''
        }
      </div>
      <div class="flex flex-col items-end gap-1 flex-shrink-0">
        ${isRunning 
          ? `<span class="status-badge running" style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 2px 8px; border-radius: 9999px; font-size: 0.6875rem;"><span class="status-dot pulse"></span>Running</span>` 
          : ''
        }
        ${isRunning && runningInfo?.framework 
          ? `<span class="framework-badge" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6; padding: 2px 6px; border-radius: 4px; font-size: 0.625rem; text-transform: uppercase;">${escapeHtml(runningInfo.framework)}</span>` 
          : ''
        }
      </div>
    </div>
    
    <div class="card-status-message ${cardStatus ? cardStatus.type : ''}" style="display: ${cardStatus ? 'flex' : 'none'}; color: #fafafa;">
      ${cardStatus ? `${getStatusIcon(cardStatus.type)}<span>${escapeHtml(cardStatus.message)}</span>` : ''}
    </div>
    
    <div class="card-meta" style="color: #52525b; font-size: 0.6875rem; margin-top: 8px;">
      <span class="card-meta-item">${Icons.clock} ${timeStr}</span>
      ${isRunning && runningInfo?.port 
        ? `<span class="port-badge" style="background: rgba(14, 165, 233, 0.15); color: #0ea5e9; padding: 2px 6px; border-radius: 4px; font-size: 0.6875rem;">${Icons.server} :${runningInfo.port}</span>` 
        : ''
      }
    </div>
    
    <p class="card-path" style="color: #52525b; font-size: 0.6875rem; margin-top: 4px;" title="${escapeHtml(project.path)}">${escapeHtml(shortPath)}</p>
    
    <div class="card-actions" style="margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
      ${dependenciesInstalled 
        ? `<button class="action-btn action-btn-run play-button" style="background: #10b981; color: white; padding: 5px 8px; border-radius: 6px; font-size: 0.6875rem; border: none; cursor: pointer; display: ${isRunning ? 'none' : 'inline-flex'}; align-items: center; gap: 4px;">
            ${Icons.play} Run
          </button>`
        : `<button class="action-btn action-btn-default install-button" style="background: #27272a; color: #a1a1aa; padding: 5px 8px; border-radius: 6px; font-size: 0.6875rem; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            ${Icons.download} Install
          </button>`
      }
      <button class="action-btn action-btn-stop stop-button" style="background: #f43f5e; color: white; padding: 5px 8px; border-radius: 6px; font-size: 0.6875rem; border: none; cursor: pointer; display: ${!isRunning ? 'none' : 'inline-flex'}; align-items: center; gap: 4px;">
        ${Icons.stop} Stop
      </button>
      ${isRunning 
        ? `<button class="action-btn action-btn-default browser-button" style="background: #27272a; color: #a1a1aa; padding: 5px 8px; border-radius: 6px; font-size: 0.6875rem; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            ${Icons.globe} Open
          </button>`
        : ''
      }
      <button class="action-btn action-btn-default editor-button" style="background: #27272a; color: #a1a1aa; padding: 5px 8px; border-radius: 6px; font-size: 0.6875rem; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="${installedIDEs.length} editors">
        ${Icons.code} Editor
      </button>
      <button class="action-btn action-btn-default terminal-button" style="background: #27272a; color: #a1a1aa; padding: 5px 8px; border-radius: 6px; font-size: 0.6875rem; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
        ${Icons.terminal}
      </button>
      ${dependenciesInstalled 
        ? `<button class="action-btn action-btn-default remove-modules-button" style="background: #27272a; color: #a1a1aa; padding: 5px 8px; border-radius: 6px; font-size: 0.6875rem; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Remove node_modules">
            ${Icons.trash}
          </button>`
        : ''
      }
    </div>
  `;

  // Event listeners
  const playButton = card.querySelector(".play-button");
  const stopButton = card.querySelector(".stop-button");
  const installButton = card.querySelector(".install-button");
  const browserButton = card.querySelector(".browser-button");
  const editorButton = card.querySelector(".editor-button");
  const terminalButton = card.querySelector(".terminal-button");
  const removeButton = card.querySelector(".remove-modules-button");

  removeButton?.addEventListener("click", () => removeModulesFromProject(project.path));
  playButton?.addEventListener("click", () => attemptRunProject(project.path));
  stopButton?.addEventListener("click", () => stopProject(project.path));
  installButton?.addEventListener("click", () => installProjectDependencies(project.path));
  browserButton?.addEventListener("click", () => { if (runningInfo) openInBrowser(runningInfo.port); });
  editorButton?.addEventListener("click", () => openInEditor(project.path));
  terminalButton?.addEventListener("click", () => openInTerminal(project.path));
}

function getStatusIcon(type) {
  switch(type) {
    case 'success': return Icons.check;
    case 'error': return Icons.alertCircle;
    case 'warning': return Icons.alertCircle;
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

// Actions
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
    } else if (result.message) {
      setCardStatus(projectPath, result.message, 'success');
      setTimeout(() => clearCardStatus(projectPath), 3000);
    }
    updateSingleCard(projectPath);
  } catch (err) {
    setCardStatus(projectPath, err.message, 'error');
    updateSingleCard(projectPath);
  }
}

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
    setCardStatus(projectPath, 'Stopping...', 'info');
    const result = await window.electronAPI.stopProject(projectPath);
    if (!result.success) {
      setCardStatus(projectPath, result.message || 'Failed to stop', 'error');
    } else {
      setCardStatus(projectPath, 'Stopped', 'success');
      setTimeout(() => clearCardStatus(projectPath), 2000);
    }
    updateSingleCard(projectPath);
  } catch (err) {
    setCardStatus(projectPath, err.message, 'error');
    updateSingleCard(projectPath);
  }
}

async function verifyProcessStatus(projectPath) {
  try {
    const pid = projectProcesses.get(projectPath);
    if (!pid) return false;
    const isRunning = await window.electronAPI.checkProcessStatus(pid);
    if (!isRunning) {
      runningProjects.delete(projectPath);
      projectProcesses.delete(projectPath);
      for (const [p, path] of activeConnections.entries()) {
        if (path === projectPath) activeConnections.delete(p);
      }
      updateSingleCard(projectPath);
    }
    return isRunning;
  } catch (err) {
    return false;
  }
}

async function openInBrowser(port) {
  try {
    await window.electronAPI.openInBrowser(port);
  } catch (err) {
    console.error("Error opening browser:", err);
  }
}

async function openInEditor(projectPath) {
  if (defaultIDE) {
    setCardStatus(projectPath, `Opening in ${defaultIDE.name}...`, 'info');
    updateSingleCard(projectPath);
    await window.electronAPI.openInEditor(projectPath, defaultIDE.command);
    setTimeout(() => { clearCardStatus(projectPath); updateSingleCard(projectPath); }, 2000);
    return;
  }
  
  if (installedIDEs.length > 1) {
    showIDEModal(projectPath);
  } else if (installedIDEs.length === 1) {
    await window.electronAPI.openInEditor(projectPath, installedIDEs[0].command);
  } else {
    await window.electronAPI.openInEditor(projectPath);
  }
}

async function openInTerminal(projectPath) {
  try {
    setCardStatus(projectPath, 'Opening terminal...', 'info');
    updateSingleCard(projectPath);
    
    const terminalPreference = defaultTerminal ? defaultTerminal.command : null;
    const result = await window.electronAPI.openInTerminal(projectPath, terminalPreference);
    
    if (result.success) {
      setCardStatus(projectPath, 'Terminal opened', 'success');
      setTimeout(() => { clearCardStatus(projectPath); updateSingleCard(projectPath); }, 2000);
    } else {
      setCardStatus(projectPath, result.error || 'Failed', 'error');
      updateSingleCard(projectPath);
    }
  } catch (err) {
    setCardStatus(projectPath, err.message, 'error');
    updateSingleCard(projectPath);
  }
}

async function areDependenciesInstalled(projectPath) {
  try {
    const hasPackageJson = await window.electronAPI.fileExists(`${projectPath}/package.json`);
    const hasNodeModules = await window.electronAPI.fileExists(`${projectPath}/node_modules`);
    return hasPackageJson && hasNodeModules;
  } catch (err) {
    return false;
  }
}

async function installProjectDependencies(projectPath) {
  setCardStatus(projectPath, 'Installing...', 'info');
  updateSingleCard(projectPath);
  
  try {
    const result = await window.electronAPI.installDependencies(projectPath);
    if (result.success) {
      setCardStatus(projectPath, 'Installed', 'success');
      updateSingleCard(projectPath);
      setTimeout(() => clearCardStatus(projectPath), 3000);
    } else {
      setCardStatus(projectPath, 'Install failed', 'error');
      updateSingleCard(projectPath);
    }
  } catch (err) {
    setCardStatus(projectPath, err.message, 'error');
    updateSingleCard(projectPath);
  }
}

async function removeModulesFromProject(projectPath) {
  const projectName = path.basename(projectPath);
  showConfirmDialog("Remove node_modules", `Remove node_modules from "${projectName}"?`, projectPath);
}

async function actuallyRemoveModules(projectPath) {
  setCardStatus(projectPath, 'Removing...', 'info');
  try {
    const result = await window.electronAPI.removeNodeModules(projectPath);
    if (result.success) {
      setCardStatus(projectPath, 'Removed', 'success');
      updateSingleCard(projectPath);
      setTimeout(() => clearCardStatus(projectPath), 3000);
    } else {
      setCardStatus(projectPath, result.message || 'Failed', 'error');
      updateSingleCard(projectPath);
    }
  } catch (err) {
    setCardStatus(projectPath, err.message, 'error');
    updateSingleCard(projectPath);
  }
}

// Modals
function showDependencyModal(projectPath) {
  pendingActionProject = projectPath;
  dependencyModal.classList.remove("hidden");
}

async function showIDEModal(projectPath) {
  pendingIdeProject = projectPath;
  ideList.innerHTML = '<p class="text-xs text-muted text-center py-4">Loading...</p>';
  ideModal.classList.remove("hidden");
  
  try {
    installedIDEs = await window.electronAPI.getInstalledIDEs();
  } catch (err) {
    console.error('Error:', err);
  }
  
  ideList.innerHTML = '';
  
  if (installedIDEs.length === 0) {
    ideList.innerHTML = '<p class="text-xs text-muted text-center py-4">No IDEs detected</p>';
    return;
  }
  
  installedIDEs.forEach(ide => {
    const button = document.createElement('button');
    button.className = 'settings-option w-full';
    button.innerHTML = `
      <span class="settings-option-icon">${ide.icon}</span>
      <span class="settings-option-name">${escapeHtml(ide.name)}</span>
      ${Icons.arrowRight}
    `;
    button.addEventListener('click', () => handleIDESelection(ide.command));
    ideList.appendChild(button);
  });
}

async function handleIDESelection(ideCommand) {
  if (pendingIdeProject) {
    const projectPath = pendingIdeProject;
    const ide = installedIDEs.find(i => i.command === ideCommand);
    hideModals();
    setCardStatus(projectPath, `Opening in ${ide?.name || 'editor'}...`, 'info');
    updateSingleCard(projectPath);
    await window.electronAPI.openInEditor(projectPath, ideCommand);
    setTimeout(() => { clearCardStatus(projectPath); updateSingleCard(projectPath); }, 2000);
  }
}

function showConfirmDialog(title, message, projectPath) {
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").textContent = message;
  pendingRemoveProject = projectPath;
  confirmDialog.classList.remove("hidden");
}

async function handleModalInstall() {
  if (pendingActionProject) {
    const projectPath = pendingActionProject;
    hideModals();
    await installProjectDependencies(projectPath);
  }
}

async function handleConfirmRemove() {
  if (pendingRemoveProject) {
    const projectPath = pendingRemoveProject;
    hideModals();
    await actuallyRemoveModules(projectPath);
  }
}

async function handleUseDefaultPort() {
  if (pendingPortProject) {
    const projectPath = pendingPortProject;
    hideModals();
    await runProjectWithPort(projectPath, null);
  }
}

async function handleUseCustomPort() {
  const customPort = parseInt(customPortInput.value, 10);
  
  if (!customPortInput.value || isNaN(customPort) || customPort < 1000 || customPort > 65535) {
    customPortInput.style.borderColor = '#f43f5e';
    setTimeout(() => customPortInput.style.borderColor = '', 500);
    return;
  }
  
  if (pendingPortProject) {
    const projectPath = pendingPortProject;
    hideModals();
    await runProjectWithPort(projectPath, customPort);
  }
}

// Status
function setCardStatus(projectPath, message, type = 'info') {
  projectStatuses.set(projectPath, { message, type });
}

function clearCardStatus(projectPath) {
  projectStatuses.delete(projectPath);
  updateSingleCard(projectPath);
}

// Utils
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

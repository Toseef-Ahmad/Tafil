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

// Module elements
const moduleProjects = document.getElementById("moduleProjects");
const modulePlayground = document.getElementById("modulePlayground");
const moduleSSH = document.getElementById("moduleSSH");
const projectsPanel = document.getElementById("projectsPanel");
const playgroundPanel = document.getElementById("playgroundPanel");
const sshPanel = document.getElementById("sshPanel");
const projectsNav = document.getElementById("projectsNav");
const playgroundNav = document.getElementById("playgroundNav");
const sshNav = document.getElementById("sshNav");

// Playground elements
const codeEditor = document.getElementById("codeEditor");
const codeOutput = document.getElementById("codeOutput");
const runCodeBtn = document.getElementById("runCodeBtn");
const clearOutputBtn = document.getElementById("clearOutputBtn");
const saveSnippetBtn = document.getElementById("saveSnippetBtn");
const toggleAutoRunBtn = document.getElementById("toggleAutoRunBtn");
const autoRunStatus = document.getElementById("autoRunStatus");
const executionTimeEl = document.getElementById("executionTime");

// SSH elements
const sshHostModal = document.getElementById("sshHostModal");
const closeSSHHostBtn = document.getElementById("closeSSHHostBtn");
const cancelSSHHostBtn = document.getElementById("cancelSSHHostBtn");
const saveSSHHostBtn = document.getElementById("saveSSHHostBtn");
const sshHostName = document.getElementById("sshHostName");
const sshHostname = document.getElementById("sshHostname");
const sshUsername = document.getElementById("sshUsername");
const sshPort = document.getElementById("sshPort");
const sshKeyPath = document.getElementById("sshKeyPath");
const sshPassword = document.getElementById("sshPassword");
const browseSSHKeyBtn = document.getElementById("browseSSHKeyBtn");
const sshKeyFileSection = document.getElementById("sshKeyFileSection");
const sshPasswordSection = document.getElementById("sshPasswordSection");
const sshHostList = document.getElementById("sshHostList");
const sshEmptyState = document.getElementById("sshEmptyState");
const sshEmptyAddBtn = document.getElementById("sshEmptyAddBtn");
const navAddHost = document.getElementById("navAddHost");
const addHostBtn = document.getElementById("addHostBtn");
const sshTerminalPanel = document.getElementById("sshTerminalPanel");
const sshHostsView = document.getElementById("sshHostsView");
const closeTerminalBtn = document.getElementById("closeTerminalBtn");
const disconnectSSHBtn = document.getElementById("disconnectSSHBtn");
const terminalHostName = document.getElementById("terminalHostName");
const activeSessionsList = document.getElementById("activeSessionsList");
const activeSessionsCount = document.getElementById("activeSessionsCount");
const terminalStatus = document.getElementById("terminalStatus");

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

// Fix It Modal
const fixItModal = document.getElementById("fixItModal");
const closeFixItBtn = document.getElementById("closeFixItBtn");
const fixItTitle = document.getElementById("fixItTitle");
const fixItMessage = document.getElementById("fixItMessage");
const fixItDetails = document.getElementById("fixItDetails");
const fixItExtra = document.getElementById("fixItExtra");
const fixItActions = document.getElementById("fixItActions");
const fixItNoteSection = document.getElementById("fixItNoteSection");
const fixItNoteInput = document.getElementById("fixItNoteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const skipNoteBtn = document.getElementById("skipNoteBtn");

// Empty state buttons
const emptyStateScanHome = document.getElementById("emptyStateScanHome");
const emptyStateScanFolder = document.getElementById("emptyStateScanFolder");

// Create Project Modal
const createProjectModal = document.getElementById("createProjectModal");
const closeCreateProjectBtn = document.getElementById("closeCreateProjectBtn");
const wizardBackBtn = document.getElementById("wizardBackBtn");
const wizardNextBtn = document.getElementById("wizardNextBtn");
const wizardCancelBtn = document.getElementById("wizardCancelBtn");
const projectNameInput = document.getElementById("projectNameInput");
const projectLocationInput = document.getElementById("projectLocationInput");
const browseLocationBtn = document.getElementById("browseLocationBtn");
const useGitClone = document.getElementById("useGitClone");
const gitRepoUrl = document.getElementById("gitRepoUrl");
const gitCloneSection = document.getElementById("gitCloneSection");
const addEnvVars = document.getElementById("addEnvVars");
const envVarsInput = document.getElementById("envVarsInput");
const envVarsSection = document.getElementById("envVarsSection");
const stackGrid = document.getElementById("stackGrid");
const templateGrid = document.getElementById("templateGrid");
const creationLog = document.getElementById("creationLog");
const creationTitle = document.getElementById("creationTitle");
const creationMessage = document.getElementById("creationMessage");
const creationSuccess = document.getElementById("creationSuccess");
const creationError = document.getElementById("creationError");
const creationSpinner = document.getElementById("creationSpinner");
const successProjectPath = document.getElementById("successProjectPath");
const errorMessage = document.getElementById("errorMessage");
const openInEditorBtn = document.getElementById("openInEditorBtn");
const startDevServerBtn = document.getElementById("startDevServerBtn");
const retryCreationBtn = document.getElementById("retryCreationBtn");

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
let currentTheme = 'midnight';
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

// Module state
let activeModule = 'projects'; // 'projects' | 'playground' | 'ssh'

// Project Creation Wizard State
let wizardStep = 1;
let selectedStack = null;
let selectedTemplate = null;
let projectTemplates = {};
let templateLibrary = {};
let projectWizardData = {
  projectName: '',
  parentDirectory: '',
  stack: null,
  template: null,
  packageManager: 'npm',
  useTypeScript: false,
  gitRepoUrl: null,
  envVariables: {},
};
let createdProjectData = null;

// Playground state
let monacoEditor = null;
let isAutoRunEnabled = true; // RunJS-like: auto-run enabled by default
let autoRunTimeout = null;
let lastRunTime = 0;
let inlineDecorations = []; // Track Monaco inline decorations
let monacoInstance = null; // Store Monaco instance for decorations
let inlineWidgets = []; // Quokka-style inline widgets (content widgets)

// Snippets
const PLAYGROUND_SNIPPETS_KEY = 'playgroundSnippets';

function getSavedSnippets() {
  try {
    const raw = localStorage.getItem(PLAYGROUND_SNIPPETS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveSnippet(name, code) {
  const snippets = getSavedSnippets();
  snippets.unshift({
    id: Date.now(),
    name: name || 'Untitled',
    code: code || '',
    savedAt: new Date().toISOString(),
  });
  localStorage.setItem(PLAYGROUND_SNIPPETS_KEY, JSON.stringify(snippets.slice(0, 50)));
}

function renderSnippetHistory() {
  if (!codeOutput) return;
  const snippets = getSavedSnippets();
  if (snippets.length === 0) {
    codeOutput.innerHTML = '<p class="text-xs" style="color: #52525b;">No saved snippets yet.</p>';
    return;
  }

  codeOutput.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div style="font-size:12px;color:#a1a1aa;">Saved Snippets</div>
      <div style="font-size:11px;color:#52525b;">Click Load</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      ${snippets.map(s => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px;border:1px solid rgba(255,255,255,0.06);border-radius:8px;background:rgba(255,255,255,0.03);">
          <div style="min-width:0;">
            <div style="font-size:12px;color:#e4e4e7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(s.name)}</div>
            <div style="font-size:10px;color:#71717a;">${new Date(s.savedAt).toLocaleString()}</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button data-snippet-action="load" data-snippet-id="${s.id}" class="action-btn" title="Load Snippet">Load</button>
            <button data-snippet-action="delete" data-snippet-id="${s.id}" class="action-btn" title="Delete Snippet">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function clearInlineWidgets() {
  if (!monacoEditor) return;
  try {
    inlineWidgets.forEach(w => {
      try { monacoEditor.removeContentWidget(w); } catch {}
    });
  } finally {
    inlineWidgets = [];
  }
}

function applyInlineResults(inlineResults) {
  if (!monacoEditor || !monacoInstance) return 0;
  const model = monacoEditor.getModel();
  if (!model) return 0;

  clearInlineWidgets();

  const sorted = [...inlineResults].sort((a, b) => (Number(a.line) || 0) - (Number(b.line) || 0));

  for (let idx = 0; idx < sorted.length; idx++) {
    const item = sorted[idx];
    const line = Number(item.line);
    if (!Number.isFinite(line) || line < 1 || line > model.getLineCount()) continue;

    const col = model.getLineMaxColumn(line);
    const raw = String(item.value ?? '');
    const value = raw.length > 120 ? raw.slice(0, 117) + '…' : raw;

    const node = document.createElement('span');
    node.className = 'inline-result-widget';
    node.textContent = `⇒ ${value}`;

    const widget = {
      getId: () => `inline-result-${line}-${idx}`,
      getDomNode: () => node,
      getPosition: () => ({
        position: { lineNumber: line, column: col },
        preference: [monacoInstance.editor.ContentWidgetPositionPreference.EXACT],
      }),
    };

    monacoEditor.addContentWidget(widget);
    inlineWidgets.push(widget);
  }

  return inlineWidgets.length;
}

// SSH state
let sshHosts = [];
let currentSSHSession = null; // Currently active/visible session in terminal
let sshSessions = new Map(); // All active SSH sessions (hostId -> session)
let terminal = null;
let terminalFitAddon = null;
let terminalInputDisposable = null; // Disposable for terminal input handler
let lastShownSessionId = null; // Track which session info was last shown to avoid duplicates

// Settings
let defaultIDE = null;
let defaultTerminal = null;

// Search/Filter state
let lastSearchQuery = '';
let scanPaths = []; // Saved scan paths

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
    loadAppState();
    loadScanPaths();
    
    // Initialize modules
    initModuleTabs();
    initPlayground();
    initSSH();
    loadSSHHosts();
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
  
  // AUTO-LOAD PROJECTS: Load saved projects first, then background refresh
  const hasProjects = loadSavedProjects();
  if (hasProjects) {
    console.log('📂 Displaying saved projects...');
    allProjectsCountEl.textContent = currentProjects.length;
    renderProjectCards(currentProjects);
    
    // Apply saved search query if any
    if (lastSearchQuery && commandInput) {
      commandInput.value = lastSearchQuery;
    }
    
    // Background refresh to check for changes (silent)
    setTimeout(() => {
      silentRefreshProjects();
    }, 2000);
  } else {
    // No saved projects - auto scan home directory
    console.log('📂 No saved projects, auto-scanning...');
    setTimeout(() => {
      autoScanProjects();
    }, 500);
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
  
  // Create Project Button
  const createProjectBtn = document.getElementById("createProjectBtn");
  if (createProjectBtn) {
    createProjectBtn.addEventListener("click", () => {
      console.log('Create Project clicked');
      showCreateProjectModal();
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
  if (refreshBtn) refreshBtn.addEventListener("click", fullRefreshProjects);
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
  
  // Fix It Modal
  if (closeFixItBtn) closeFixItBtn.addEventListener("click", () => {
    fixItModal?.classList.add("hidden");
    fixItNoteSection?.classList.add("hidden");
    if (fixItNoteInput) fixItNoteInput.value = '';
  });
  
  // Error Note handlers
  let currentErrorContext = null; // Store { projectPath, runId, errorKind }
  
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener("click", async () => {
      if (!currentErrorContext || !fixItNoteInput) return;
      
      const note = fixItNoteInput.value.trim();
      if (!note) {
        showNotification('Note is empty', 'warning');
        return;
      }
      
      try {
        await window.electronAPI.saveErrorNote(
          currentErrorContext.projectPath,
          note,
          currentErrorContext.runId,
          currentErrorContext.errorKind
        );
        
        showNotification('✅ Error note saved', 'success');
        fixItModal?.classList.add("hidden");
        fixItNoteSection?.classList.add("hidden");
        fixItNoteInput.value = '';
        currentErrorContext = null;
      } catch (err) {
        console.error('Error saving note:', err);
        showNotification('Failed to save note', 'error');
      }
    });
  }
  
  if (skipNoteBtn) {
    skipNoteBtn.addEventListener("click", () => {
      fixItModal?.classList.add("hidden");
      fixItNoteSection?.classList.add("hidden");
      if (fixItNoteInput) fixItNoteInput.value = '';
      currentErrorContext = null;
    });
  }
  
  // Empty state buttons
  if (emptyStateScanHome) emptyStateScanHome.addEventListener("click", renderProjects);
  if (emptyStateScanFolder) emptyStateScanFolder.addEventListener("click", renderCustomProjects);
  
  const emptyStateCreateProject = document.getElementById("emptyStateCreateProject");
  if (emptyStateCreateProject) {
    emptyStateCreateProject.addEventListener("click", showCreateProjectModal);
  }
  
  // Project Creation Wizard - Initialize
  initProjectCreationWizard();
  
  // Command Palette
  if (commandInput) {
    commandInput.addEventListener("input", handleCommandInput);
    commandInput.addEventListener("keydown", handleCommandKeydown);
  }
  if (commandPalette) commandPalette.addEventListener("click", (e) => {
    if (e.target === commandPalette) hideCommandPalette();
  });
  
  // Click outside modals to close
  [dependencyModal, confirmDialog, logsModal, settingsModal, newCollectionModal, projectInsightsModal, fixItModal, createProjectModal].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          // Don't close create project modal during creation
          if (modal === createProjectModal && wizardStep === 3) return;
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
    const { projectPath, status, port, error, pid, framework, diagnostic } = statusData;
    console.log("Project Status:", statusData);

    if (status === "running") {
      // If this was previously detected as "external", promote it back to Tafil-managed.
      externalProjects.delete(projectPath);
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
      const errText = diagnostic?.title || error || "Error occurred";
      setCardStatus(projectPath, errText, 'error');
      const detail = diagnostic?.details ? `\n${diagnostic.details}` : '';
      showNotification(`Error: ${errText}${detail}`, 'error');
      
      // Show Fix It modal with note section if diagnostic exists
      if (diagnostic) {
        showFixItModalWithNote(projectPath, diagnostic, statusData.runId);
      }
      
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
  setInterval(scanExternalProcesses, 30000); // Every 30 seconds (reduced from 10s)
  
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
      
      // Add new external projects with path normalization
      result.processes.forEach(proc => {
        if (proc.projectPath) {
          // Normalize path for matching
          let normalizedPath = proc.projectPath.replace(/\/$/, '').replace(/\\$/, '');
          
          // Try to match with current projects
          const matchedProject = currentProjects.find(p => {
            const projectPathNorm = p.path.replace(/\/$/, '').replace(/\\$/, '');
            return projectPathNorm === normalizedPath || 
                   projectPathNorm.toLowerCase() === normalizedPath.toLowerCase();
          });
          
          const pathToUse = matchedProject ? matchedProject.path : normalizedPath;
          
          // Don't add if already tracked by Tafil
          if (!runningProjects.has(pathToUse)) {
            externalProjects.set(pathToUse, {
              port: proc.port,
              pid: proc.pid,
              command: proc.command,
              status: 'external',
              external: true
            });
          }
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
  // Don't hijack shortcuts while the user is typing (prevents data loss)
  const target = e.target;
  const tag = (target?.tagName || '').toLowerCase();
  const isTypingContext =
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target?.isContentEditable;

  if (isTypingContext) {
    return;
  }

  // Command Palette: Cmd/Ctrl + K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    showCommandPalette();
  }
  
  // Refresh: Cmd/Ctrl + R
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    refreshCurrentView();
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
    { type: 'action', id: 'create-project', title: 'Create New Project', desc: 'Bootstrap a new React, Next.js, Express, or NestJS project', icon: '🚀', action: showCreateProjectModal },
    { type: 'action', id: 'scan-home', title: 'Scan Home Directory', desc: 'Find Node.js projects in home folder', icon: Icons.home, action: renderProjects },
    { type: 'action', id: 'scan-folder', title: 'Scan Custom Folder', desc: 'Choose a folder to scan', icon: Icons.folder, action: renderCustomProjects },
    { type: 'action', id: 'refresh', title: 'Refresh Projects', desc: 'Reload project list', icon: Icons.check, action: () => refreshCurrentView() },
    { type: 'view', id: 'view-all', title: 'View All Projects', desc: 'Show all projects', icon: Icons.folder, action: () => switchView('all') },
    { type: 'view', id: 'view-running', title: 'View Running Projects', desc: 'Show running projects only', icon: Icons.play, action: () => switchView('running') },
    { type: 'view', id: 'view-insights', title: 'View Insights', desc: 'Show project insights', icon: Icons.chart, action: () => switchView('insights') },
    { type: 'action', id: 'settings', title: 'Open Settings', desc: 'Configure preferences', icon: Icons.info, action: showSettingsModal },
    { type: 'action', id: 'new-collection', title: 'New Collection', desc: 'Create a new project collection', icon: Icons.plus, action: showNewCollectionModal },
    // Theme commands
    { type: 'theme', id: 'theme-midnight', title: 'Theme: Midnight', desc: 'Deep obsidian elegance', icon: '🌑', action: () => setTheme('midnight') },
    { type: 'theme', id: 'theme-dracula', title: 'Theme: Dracula', desc: 'Classic purple aesthetic', icon: '🧛', action: () => setTheme('dracula') },
    { type: 'theme', id: 'theme-tokyo', title: 'Theme: Tokyo Night', desc: 'Neon city dreams', icon: '🗼', action: () => setTheme('tokyo-night') },
    { type: 'theme', id: 'theme-nord', title: 'Theme: Nord', desc: 'Arctic frost clarity', icon: '❄️', action: () => setTheme('nord') },
    { type: 'theme', id: 'theme-catppuccin', title: 'Theme: Catppuccin', desc: 'Cozy pastel warmth', icon: '☕', action: () => setTheme('catppuccin') },
    { type: 'theme', id: 'theme-one-dark', title: 'Theme: One Dark', desc: 'Atom inspired classic', icon: '⚛️', action: () => setTheme('one-dark') },
    { type: 'theme', id: 'theme-synthwave', title: 'Theme: Synthwave', desc: 'Retro neon vibes', icon: '🌆', action: () => setTheme('synthwave') },
    { type: 'theme', id: 'theme-ayu', title: 'Theme: Ayu Dark', desc: 'Clean modern dark', icon: '🌙', action: () => setTheme('ayu-dark') },
    { type: 'theme', id: 'theme-github-dark', title: 'Theme: GitHub Dark', desc: 'Developer standard', icon: '🐙', action: () => setTheme('github-dark') },
    { type: 'theme', id: 'theme-rose-pine', title: 'Theme: Rosé Pine', desc: 'Warm and elegant', icon: '🌹', action: () => setTheme('rose-pine') },
    { type: 'theme', id: 'theme-monokai', title: 'Theme: Monokai', desc: 'Colorful iconic', icon: '🎨', action: () => setTheme('monokai') },
    { type: 'theme', id: 'theme-vesper', title: 'Theme: Vesper', desc: 'Sunset warmth', icon: '🌅', action: () => setTheme('vesper') },
    { type: 'theme', id: 'theme-light', title: 'Theme: Airy Light', desc: 'Clean minimal', icon: '☀️', action: () => setTheme('light') },
    { type: 'theme', id: 'theme-github-light', title: 'Theme: GitHub Light', desc: 'Familiar bright', icon: '🐱', action: () => setTheme('github-light') },
    { type: 'theme', id: 'theme-latte', title: 'Theme: Latte', desc: 'Soft pastels', icon: '🥛', action: () => setTheme('catppuccin-latte') },
    { type: 'theme', id: 'theme-solarized', title: 'Theme: Solarized Light', desc: 'Classic light', icon: '🌤️', action: () => setTheme('solarized-light') },
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

// =====================================================
// Projects Persistence - Auto-save/load
// =====================================================
function saveProjects() {
  try {
    localStorage.setItem('savedProjects', JSON.stringify(currentProjects));
    localStorage.setItem('lastScanTime', Date.now().toString());
    console.log(`💾 Saved ${currentProjects.length} projects to storage`);
  } catch (err) {
    console.error('Error saving projects:', err);
  }
}

function loadSavedProjects() {
  try {
    const saved = localStorage.getItem('savedProjects');
    const lastScan = localStorage.getItem('lastScanTime');
    
    if (saved) {
      const projects = JSON.parse(saved);
      if (projects && projects.length > 0) {
        currentProjects = projects;
        console.log(`📂 Loaded ${projects.length} saved projects`);
        
        // Show last scan time
        if (lastScan) {
          const scanTime = new Date(parseInt(lastScan));
          const timeAgo = getTimeAgo(scanTime);
          viewSubtitleEl.textContent = `${projects.length} projects • Last scan: ${timeAgo}`;
        }
        
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('Error loading saved projects:', err);
    return false;
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function saveScanPaths(paths) {
  try {
    scanPaths = paths;
    localStorage.setItem('scanPaths', JSON.stringify(paths));
  } catch (err) {
    console.error('Error saving scan paths:', err);
  }
}

function loadScanPaths() {
  try {
    const saved = localStorage.getItem('scanPaths');
    if (saved) {
      scanPaths = JSON.parse(saved);
      return scanPaths;
    }
    return [];
  } catch (err) {
    console.error('Error loading scan paths:', err);
    return [];
  }
}

// Add a path to scan paths (for created projects)
function addCreatedProjectPath(parentDir) {
  if (!parentDir) return;
  
  try {
    // Load existing paths
    const existingPaths = loadScanPaths();
    
    // Check if path or a parent is already included
    const isAlreadyIncluded = existingPaths.some(p => 
      parentDir.startsWith(p) || p.startsWith(parentDir)
    );
    
    if (!isAlreadyIncluded) {
      existingPaths.push(parentDir);
      saveScanPaths(existingPaths);
      console.log('Added scan path:', parentDir, 'Total paths:', existingPaths.length);
    }
  } catch (err) {
    console.error('Error adding created project path:', err);
  }
}

function saveAppState() {
  try {
    const state = {
      activeCollection,
      currentView,
      lastSearchQuery,
    };
    localStorage.setItem('appState', JSON.stringify(state));
  } catch (err) {
    console.error('Error saving app state:', err);
  }
}

function loadAppState() {
  try {
    const saved = localStorage.getItem('appState');
    if (saved) {
      const state = JSON.parse(saved);
      activeCollection = state.activeCollection || 'all';
      currentView = state.currentView || 'all';
      lastSearchQuery = state.lastSearchQuery || '';
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error loading app state:', err);
    return false;
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
           data-tooltip="${escapeHtml(col.name)}"
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
  currentView = 'collection';
  saveAppState(); // Persist for next launch
  
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
  saveAppState(); // Persist for next launch
  
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
    // Include both Tafil-managed AND external running projects.
    // IMPORTANT: a project can be running even if it isn't in `currentProjects` (scan scope changed, project moved, etc.)
    const runningPaths = Array.from(new Set([
      ...runningProjects.keys(),
      ...externalProjects.keys(),
    ]));

    const runningList = [];

    // First include scanned projects that are running (preserves metadata)
    currentProjects.forEach(p => {
      if (runningProjects.has(p.path) || externalProjects.has(p.path)) runningList.push(p);
    });

    // Then include placeholders for any running paths not in scan results
    runningPaths.forEach(p => {
      if (!runningList.some(x => x.path === p)) {
        runningList.push({
          name: path.basename(p),
          path: p,
          timestamp: 0,
          message: 'Running (not in current scan results)'
        });
      }
    });

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

// Helper function to refresh the current view without resetting filters
function refreshCurrentView() {
  // If there's an active search filter, use that
  if (filteredProjects.length > 0) {
    renderProjectCards(filteredProjects);
    return;
  }
  
  // Otherwise, respect the current view/collection state
  if (currentView === 'running') {
    const runningPaths = Array.from(new Set([
      ...runningProjects.keys(),
      ...externalProjects.keys(),
    ]));

    const runningList = [];
    currentProjects.forEach(p => {
      if (runningProjects.has(p.path) || externalProjects.has(p.path)) runningList.push(p);
    });
    runningPaths.forEach(p => {
      if (!runningList.some(x => x.path === p)) {
        runningList.push({
          name: path.basename(p),
          path: p,
          timestamp: 0,
          message: 'Running (not in current scan results)'
        });
      }
    });

    viewSubtitleEl.textContent = `${runningList.length} running`;
    renderProjectCards(runningList);
  } else if (currentView === 'collection' && activeCollection) {
    let filtered;
    if (activeCollection === 'uncategorized') {
      filtered = currentProjects.filter(p => !projectCollections[p.path] || projectCollections[p.path].length === 0);
    } else {
      filtered = currentProjects.filter(p => projectCollections[p.path]?.includes(activeCollection));
    }
    viewSubtitleEl.textContent = `${filtered.length} projects`;
    renderProjectCards(filtered);
  } else if (currentView === 'insights') {
    renderProjectCards(currentProjects);
  } else {
    // Default: 'all' view
    viewSubtitleEl.textContent = `${currentProjects.length} projects`;
    renderProjectCards(currentProjects);
  }
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
  
  // Get Project Brain data
  const brainData = await window.electronAPI.getProjectBrain(projectPath);
  
  // Get environment snapshot if exists
  const snapshot = await window.electronAPI.getEnvironmentSnapshot(projectPath);
  
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
  
  // Environment Snapshot (Pro Feature)
  content += `
    <div class="insight-item" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 12px;">
      <div class="insight-icon info">💾</div>
      <div style="flex: 1;">
        <div class="text-sm font-medium" style="color: #fafafa; margin-bottom: 8px;">Environment Snapshot</div>
        ${snapshot 
          ? `<div class="text-xs mb-2" style="color: #71717a;">
              <div>Saved: ${new Date(snapshot.savedAt).toLocaleDateString()}</div>
              ${snapshot.node?.detected ? `<div>Node: ${snapshot.node.detected.version} (${snapshot.node.detected.source})</div>` : ''}
              ${snapshot.startup ? `<div>Startup: ${snapshot.startup.full || snapshot.startup.command}</div>` : ''}
              ${snapshot.environment?.detectedKeys?.length > 0 ? `<div>Env vars: ${snapshot.environment.detectedKeys.length} detected</div>` : ''}
            </div>
            <div class="flex gap-2">
              <button id="restoreProjectBtn" class="px-3 py-1.5 text-xs rounded-lg font-medium" style="background: linear-gradient(135deg, #10b981, #059669); color: white;">
                🔄 Restore Project
              </button>
              <button id="createSnapshotBtn" class="px-3 py-1.5 text-xs rounded-lg font-medium" style="background: rgba(255,255,255,0.1); color: #fafafa; border: 1px solid rgba(255,255,255,0.1);">
                📸 Update Snapshot
              </button>
            </div>`
          : `<div class="text-xs mb-2" style="color: #71717a;">No snapshot saved yet</div>
            <button id="createSnapshotBtn" class="px-3 py-1.5 text-xs rounded-lg font-medium" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white;">
              📸 Create Snapshot
            </button>`
        }
      </div>
    </div>
  `;
  
  // Project Brain (Memory)
  if (brainData) {
    content += `
      <div class="insight-item" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 12px;">
        <div class="insight-icon info">🧠</div>
        <div>
          <div class="text-sm font-medium" style="color: #fafafa;">Project Memory</div>
          <div class="text-xs" style="color: #71717a;">
            <div>Runs: ${brainData.runCount || 0} (${brainData.successCount || 0} success, ${brainData.errorCount || 0} errors)</div>
            ${brainData.last?.actualPort ? `<div>Last port: ${brainData.last.actualPort}</div>` : ''}
            ${brainData.last?.framework ? `<div>Framework: ${brainData.last.framework}</div>` : ''}
            ${brainData.last?.status ? `<div>Last status: ${brainData.last.status}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  // Error Notes (Error Context Memory)
  const errorNotes = await window.electronAPI.getErrorNotes(projectPath);
  if (errorNotes && errorNotes.length > 0) {
    content += `
      <div class="insight-item" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 12px;">
        <div class="insight-icon info">💡</div>
        <div style="flex: 1;">
          <div class="text-sm font-medium" style="color: #fafafa; margin-bottom: 8px;">Error Context Notes (${errorNotes.length})</div>
          <div class="space-y-2" style="max-height: 200px; overflow-y: auto;">
            ${errorNotes.slice(0, 5).map(note => `
              <div class="text-xs p-2 rounded" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #a1a1aa;">
                <div class="text-xs mb-1" style="color: #71717a;">${new Date(note.createdAt).toLocaleDateString()}</div>
                <div>${escapeHtml(note.note)}</div>
                ${note.errorKind ? `<div class="text-xs mt-1" style="color: #71717a;">Type: ${note.errorKind}</div>` : ''}
              </div>
            `).join('')}
            ${errorNotes.length > 5 ? `<div class="text-xs" style="color: #71717a;">...and ${errorNotes.length - 5} more</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  // Project Notes (Human Memory)
  const currentNotes = brainData?.notes || '';
  content += `
    <div class="insight-item" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 12px;">
      <div style="width: 100%;">
        <button id="notesToggleBtn" class="flex items-center justify-between w-full text-left" style="background: none; border: none; color: #fafafa; cursor: pointer; padding: 0;">
          <div class="flex items-center gap-2">
            <span style="font-size: 16px;">📝</span>
            <div class="text-sm font-medium" style="color: #fafafa;">Notes</div>
          </div>
          <svg id="notesToggleIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div id="notesContent" class="hidden" style="margin-top: 12px;">
          <textarea 
            id="projectNotesTextarea" 
            placeholder="Add notes for future reference..."
            rows="4"
            style="width: 100%; padding: 8px; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fafafa; font-size: 13px; font-family: inherit; resize: vertical; min-height: 80px;"
          >${escapeHtml(currentNotes)}</textarea>
          <div class="text-xs mt-1" style="color: #71717a;">Autosaves as you type</div>
        </div>
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
  
  // Add event listeners for snapshot/restore buttons
  const createSnapshotBtn = document.getElementById('createSnapshotBtn');
  const restoreProjectBtn = document.getElementById('restoreProjectBtn');
  const openArchitectureBtn = document.getElementById('openArchitectureBtn');
  
  createSnapshotBtn?.addEventListener('click', async () => {
    await createEnvironmentSnapshot(projectPath);
  });
  
  restoreProjectBtn?.addEventListener('click', async () => {
    await restoreProjectFromSnapshot(projectPath);
  });
  
  openArchitectureBtn?.addEventListener('click', () => {
    showArchitectureCanvas(projectPath);
  });
  
  // Notes toggle and autosave
  const notesToggleBtn = document.getElementById('notesToggleBtn');
  const notesContent = document.getElementById('notesContent');
  const notesToggleIcon = document.getElementById('notesToggleIcon');
  const projectNotesTextarea = document.getElementById('projectNotesTextarea');
  
  let notesAutosaveTimeout = null;
  
  notesToggleBtn?.addEventListener('click', () => {
    const isHidden = notesContent.classList.contains('hidden');
    notesContent.classList.toggle('hidden');
    if (isHidden) {
      notesToggleIcon.style.transform = 'rotate(180deg)';
    } else {
      notesToggleIcon.style.transform = 'rotate(0deg)';
    }
  });
  
  // Autosave notes with debounce
  projectNotesTextarea?.addEventListener('input', () => {
    clearTimeout(notesAutosaveTimeout);
    notesAutosaveTimeout = setTimeout(async () => {
      const notes = projectNotesTextarea.value || '';
      try {
        await window.electronAPI.updateProjectNotes(projectPath, notes);
      } catch (err) {
        console.error('Failed to save notes:', err);
      }
    }, 500); // 500ms debounce
  });
}

// Architecture Canvas - Simple drawing canvas for project memory
let currentArchitectureProjectPath = null;
let architectureSaveTimeout = null;
let canvasCtx = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

async function showArchitectureCanvas(projectPath) {
  const project = currentProjects.find(p => p.path === projectPath);
  if (!project) return;
  
  const architectureModal = document.getElementById('architectureCanvasModal');
  const architectureProjectName = document.getElementById('architectureProjectName');
  const closeArchitectureBtn = document.getElementById('closeArchitectureBtn');
  const canvasContainer = document.getElementById('architectureCanvasContainer');
  
  if (!architectureModal || !canvasContainer) {
    console.error('Architecture canvas modal elements not found');
    return;
  }
  
  currentArchitectureProjectPath = projectPath;
  architectureProjectName.textContent = `${project.name || path.basename(projectPath)} - Architecture`;
  
  // Show modal
  architectureModal.classList.remove('hidden');
  
  // Load saved architecture data
  let savedImageData = null;
  try {
    const saved = await window.electronAPI.getProjectArchitecture(projectPath);
    if (saved && saved.imageData) {
      savedImageData = saved.imageData;
    }
  } catch (err) {
    console.warn('Failed to load architecture data:', err);
  }
  
  // Clear container and create canvas
  canvasContainer.innerHTML = '';
  
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.cursor = 'crosshair';
  canvas.style.background = '#0a0a0b';
  
  // Set canvas size
  const resizeCanvas = () => {
    const rect = canvasContainer.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvasCtx = canvas.getContext('2d');
    
    // Set drawing style
    canvasCtx.strokeStyle = '#fafafa';
    canvasCtx.lineWidth = 2;
    canvasCtx.lineCap = 'round';
    canvasCtx.lineJoin = 'round';
    
    // Load saved image if exists
    if (savedImageData) {
      const img = new Image();
      img.onload = () => {
        canvasCtx.drawImage(img, 0, 0);
      };
      img.src = savedImageData;
    }
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Drawing handlers
  const startDrawing = (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  };
  
  const draw = (e) => {
    if (!isDrawing || !canvasCtx) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(lastX, lastY);
    canvasCtx.lineTo(currentX, currentY);
    canvasCtx.stroke();
    
    lastX = currentX;
    lastY = currentY;
    
    // Auto-save
    saveCanvasDebounced(projectPath);
  };
  
  const stopDrawing = () => {
    if (isDrawing) {
      isDrawing = false;
      saveCanvasDebounced(projectPath);
    }
  };
  
  // Mouse events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  
  // Touch events for mobile
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });
  
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });
  
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  });
  
  canvasContainer.appendChild(canvas);
  
  // Clear button (minimal UI)
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear';
  clearBtn.style.cssText = 'position: absolute; top: 12px; right: 50px; padding: 6px 12px; background: rgba(255,255,255,0.1); color: #fafafa; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; font-size: 12px; cursor: pointer; z-index: 10;';
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear canvas?')) {
      canvasCtx.fillStyle = '#0a0a0b';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      saveCanvasDebounced(projectPath);
    }
  });
  canvasContainer.appendChild(clearBtn);
  
  // Close button handler
  const closeHandler = () => {
    architectureModal.classList.add('hidden');
    window.removeEventListener('resize', resizeCanvas);
    currentArchitectureProjectPath = null;
    canvasCtx = null;
    canvasContainer.innerHTML = '';
  };
  
  // Remove old listeners by cloning and replacing
  const newCloseBtn = closeArchitectureBtn.cloneNode(true);
  closeArchitectureBtn.parentNode.replaceChild(newCloseBtn, closeArchitectureBtn);
  newCloseBtn.addEventListener('click', closeHandler);
  
  // Close on backdrop click (only if clicking backdrop, not canvas)
  const backdropClickHandler = (e) => {
    if (e.target === architectureModal) {
      closeHandler();
      architectureModal.removeEventListener('click', backdropClickHandler);
    }
  };
  architectureModal.addEventListener('click', backdropClickHandler);
}

// Debounced save function
function saveCanvasDebounced(projectPath) {
  if (!canvasCtx) return;
  
  if (architectureSaveTimeout) {
    clearTimeout(architectureSaveTimeout);
  }
  architectureSaveTimeout = setTimeout(async () => {
    try {
      const canvas = canvasCtx.canvas;
      const imageData = canvas.toDataURL('image/png');
      await window.electronAPI.saveProjectArchitecture(projectPath, {
        imageData,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to save architecture data:', err);
    }
  }, 1000); // Save after 1 second of inactivity
}

// Create environment snapshot (Pro Feature)
async function createEnvironmentSnapshot(projectPath) {
  try {
    showNotification('Creating environment snapshot...', 'info');
    
    const result = await window.electronAPI.createEnvironmentSnapshot(projectPath, {
      includeGlobals: false,
      includeEnvContent: false,
    });
    
    if (result.success) {
      showNotification('✅ Environment snapshot created successfully!', 'success');
      // Refresh insights to show updated snapshot
      await showProjectInsights(projectPath);
    } else {
      showNotification(`❌ Failed to create snapshot: ${result.error}`, 'error');
    }
  } catch (err) {
    console.error('Error creating snapshot:', err);
    showNotification(`❌ Error: ${err.message}`, 'error');
  }
}

// Show Fix It modal with error note section
function showFixItModalWithNote(projectPath, diagnostic, runId = null) {
  if (!fixItModal || !diagnostic) return;
  
  // Store error context for note saving
  currentErrorContext = {
    projectPath,
    runId,
    errorKind: diagnostic.kind || null,
  };
  
  // Set modal content
  if (fixItTitle) fixItTitle.textContent = diagnostic.title || 'Fix It';
  if (fixItMessage) fixItMessage.textContent = diagnostic.details || '';
  
  // Show details if available
  if (fixItDetails && diagnostic.details) {
    fixItDetails.textContent = diagnostic.details;
    fixItDetails.style.display = 'block';
  } else if (fixItDetails) {
    fixItDetails.style.display = 'none';
  }
  
  // Add action buttons
  if (fixItActions && diagnostic.suggestions && diagnostic.suggestions.length > 0) {
    fixItActions.innerHTML = diagnostic.suggestions.map((suggestion, idx) => {
      // Create action buttons based on suggestion text
      let action = '';
      if (suggestion.includes('Stop') || suggestion.includes('stop')) {
        action = `stop-conflicting`;
      } else if (suggestion.includes('Switch') || suggestion.includes('port')) {
        action = `switch-port`;
      } else if (suggestion.includes('Check') || suggestion.includes('inspect')) {
        action = `inspect-port`;
      }
      
      return `<button class="px-3 py-1.5 text-xs rounded-lg font-medium" style="background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3);" data-action="${action}">${escapeHtml(suggestion)}</button>`;
    }).join('');
    
    // Add click handlers for actions (existing Fix It logic - don't change)
    fixItActions.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        // Handle actions (existing logic - placeholder)
        console.log('Fix It action:', action, projectPath);
      });
    });
  } else if (fixItActions) {
    fixItActions.innerHTML = '';
  }
  
  // Show note section
  if (fixItNoteSection) {
    fixItNoteSection.classList.remove('hidden');
    if (fixItNoteInput) {
      fixItNoteInput.value = '';
      fixItNoteInput.placeholder = `e.g., ${diagnostic.kind === 'PORT_IN_USE' ? 'Port conflict resolved by stopping other project' : diagnostic.kind === 'MISSING_ENV' ? 'Added missing env vars to .env file' : 'How I fixed this error'}...`;
    }
  }
  
  // Show modal
  fixItModal.classList.remove('hidden');
}

// Restore project from snapshot (Pro Feature)
async function restoreProjectFromSnapshot(projectPath) {
  try {
    // Validate prerequisites first
    const validation = await window.electronAPI.validateSnapshotPrerequisites(projectPath);
    
    if (!validation.valid) {
      const issues = validation.issues.map(i => i.message).join('\n• ');
      const confirmRestore = confirm(
        `⚠️ Prerequisites validation failed:\n\n• ${issues}\n\n` +
        `Do you want to continue anyway?`
      );
      if (!confirmRestore) return;
    }
    
    if (validation.warnings.length > 0) {
      const warnings = validation.warnings.map(w => w.message).join('\n• ');
      const confirmRestore = confirm(
        `⚠️ Warnings detected:\n\n• ${warnings}\n\n` +
        `Do you want to continue with restore?`
      );
      if (!confirmRestore) return;
    }
    
    showNotification('Restoring project environment...', 'info');
    
    const result = await window.electronAPI.restoreProject(projectPath, {
      installDeps: true,
      createEnvFile: true,
      startProject: false,
    });
    
    if (result.success) {
      const steps = result.steps.map(s => `• ${s.message}`).join('\n');
      showNotification(`✅ Project restored successfully!\n\n${steps}`, 'success');
      
      // Optionally start the project
      const startProject = confirm('Restore completed! Do you want to start the project now?');
      if (startProject) {
        await attemptRunProject(projectPath);
      }
    } else {
      const errors = result.errors.map(e => e.error || e.message || 'Unknown error').join('\n• ');
      showNotification(`❌ Restore failed:\n\n• ${errors}`, 'error');
    }
    
    if (result.warnings && result.warnings.length > 0) {
      const warnings = result.warnings.map(w => w.message || w).join('\n• ');
      console.warn('Restore warnings:', warnings);
    }
  } catch (err) {
    console.error('Error restoring project:', err);
    showNotification(`❌ Error: ${err.message}`, 'error');
  }
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
  
  // Add theme selector at the top of settings
  const themeSelectorContainer = document.getElementById('themeSelectorContainer');
  if (themeSelectorContainer) {
    themeSelectorContainer.innerHTML = createThemeSelector();
    setupThemeSelectorListeners();
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
// Premium Themes System
// =====================================================

// Theme definitions with metadata
const THEMES = {
  // Dark themes
  midnight: { name: 'Midnight', type: 'dark', accent: '#8b5cf6', description: 'Deep obsidian elegance' },
  dracula: { name: 'Dracula', type: 'dark', accent: '#bd93f9', description: 'Classic purple aesthetic' },
  'tokyo-night': { name: 'Tokyo Night', type: 'dark', accent: '#bb9af7', description: 'Neon city dreams' },
  nord: { name: 'Nord', type: 'dark', accent: '#88c0d0', description: 'Arctic frost clarity' },
  catppuccin: { name: 'Catppuccin', type: 'dark', accent: '#cba6f7', description: 'Cozy pastel warmth' },
  'one-dark': { name: 'One Dark', type: 'dark', accent: '#c678dd', description: 'Atom inspired classic' },
  synthwave: { name: 'Synthwave', type: 'dark', accent: '#ff6ac1', description: 'Retro neon vibes' },
  'ayu-dark': { name: 'Ayu Dark', type: 'dark', accent: '#ffb454', description: 'Clean modern dark' },
  'github-dark': { name: 'GitHub Dark', type: 'dark', accent: '#58a6ff', description: 'Developer standard' },
  'rose-pine': { name: 'Rosé Pine', type: 'dark', accent: '#ebbcba', description: 'Warm and elegant' },
  monokai: { name: 'Monokai', type: 'dark', accent: '#ff6188', description: 'Colorful iconic' },
  vesper: { name: 'Vesper', type: 'dark', accent: '#ff874f', description: 'Sunset warmth' },
  // Light themes
  light: { name: 'Airy Light', type: 'light', accent: '#8b5cf6', description: 'Clean minimal' },
  'github-light': { name: 'GitHub Light', type: 'light', accent: '#0969da', description: 'Familiar bright' },
  'catppuccin-latte': { name: 'Latte', type: 'light', accent: '#8839ef', description: 'Soft pastels' },
  'solarized-light': { name: 'Solarized', type: 'light', accent: '#268bd2', description: 'Classic light' }
};

function toggleDarkMode() {
  // Toggle between current theme and a light theme
  const currentType = THEMES[currentTheme]?.type || 'dark';
  if (currentType === 'dark') {
    setTheme('light');
  } else {
    setTheme('midnight');
  }
}

function setTheme(themeName) {
  if (!THEMES[themeName]) {
    themeName = 'midnight';
  }
  
  currentTheme = themeName;
  isDarkMode = THEMES[themeName].type === 'dark';
  
  // Apply theme
  document.body.setAttribute('data-theme', themeName);
  
  // Remove old light-mode class (for backwards compatibility)
  document.body.classList.remove('light-mode');
  
  // Update icons for dark/light toggle
  if (moonIcon) moonIcon.classList.toggle('hidden', !isDarkMode);
  if (sunIcon) sunIcon.classList.toggle('hidden', isDarkMode);
  
  // Clear any inline styles that might interfere
  const sidebar = document.getElementById('sidebar');
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  
  if (sidebar) {
    sidebar.style.backgroundColor = '';
    sidebar.style.borderColor = '';
  }
  if (header) {
    header.style.backgroundColor = '';
    header.style.borderColor = '';
  }
  if (main) {
    main.style.backgroundColor = '';
  }
  document.body.style.backgroundColor = '';
  document.body.style.color = '';
  
  // Save preference
  localStorage.setItem('theme', themeName);
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  
  // Re-render cards to update their styles (respecting current view)
  if (currentProjects.length > 0) {
    refreshCurrentView();
  }
  
  // Update theme selector if open
  updateThemeSelector();
  
  // Show notification
  showNotification(`Theme changed to ${THEMES[themeName].name}`, 'success');
}

// Expose setTheme globally for onclick handlers
window.setTheme = setTheme;

function applyTheme() {
  setTheme(currentTheme);
}

function loadDarkModePreference() {
  // First check for new theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && THEMES[savedTheme]) {
    currentTheme = savedTheme;
    isDarkMode = THEMES[savedTheme].type === 'dark';
  } else {
    // Fall back to old dark mode preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      isDarkMode = saved === 'true';
      currentTheme = isDarkMode ? 'midnight' : 'light';
    } else {
      // Default to dark mode, or check system preference
      isDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
      currentTheme = isDarkMode ? 'midnight' : 'light';
    }
  }
  applyTheme();
}

function updateThemeSelector() {
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    const themeName = option.dataset.theme;
    option.classList.toggle('active', themeName === currentTheme);
  });
}

function createThemeSelector() {
  const darkThemes = Object.entries(THEMES).filter(([_, t]) => t.type === 'dark');
  const lightThemes = Object.entries(THEMES).filter(([_, t]) => t.type === 'light');
  
  // Theme icons for visual appeal
  const themeIcons = {
    midnight: '🌑', dracula: '🧛', 'tokyo-night': '🗼', nord: '❄️',
    catppuccin: '☕', 'one-dark': '⚛️', synthwave: '🌆', 'ayu-dark': '🌙',
    'github-dark': '🐙', 'rose-pine': '🌹', monokai: '🎨', vesper: '🌅',
    light: '☀️', 'github-light': '🐱', 'catppuccin-latte': '🥛', 'solarized-light': '🌤️'
  };
  
  return `
    <div class="theme-section-title">
      <span style="display: inline-flex; align-items: center; gap: 6px;">
        🌙 Dark Themes
      </span>
    </div>
    <div class="theme-grid-new">
      ${darkThemes.map(([id, theme]) => `
        <button class="theme-card ${currentTheme === id ? 'active' : ''}" data-theme="${id}" type="button">
          <div class="theme-card-preview theme-preview-${id}">
            <span class="theme-card-icon">${themeIcons[id] || '🎨'}</span>
          </div>
          <div class="theme-card-info">
            <div class="theme-card-name">${theme.name}</div>
            <div class="theme-card-desc">${theme.description}</div>
          </div>
          ${currentTheme === id ? '<div class="theme-card-check">✓</div>' : ''}
        </button>
      `).join('')}
    </div>
    <div class="theme-section-title" style="margin-top: 16px;">
      <span style="display: inline-flex; align-items: center; gap: 6px;">
        ☀️ Light Themes
      </span>
    </div>
    <div class="theme-grid-new">
      ${lightThemes.map(([id, theme]) => `
        <button class="theme-card ${currentTheme === id ? 'active' : ''}" data-theme="${id}" type="button">
          <div class="theme-card-preview theme-preview-${id}">
            <span class="theme-card-icon">${themeIcons[id] || '🎨'}</span>
          </div>
          <div class="theme-card-info">
            <div class="theme-card-name">${theme.name}</div>
            <div class="theme-card-desc">${theme.description}</div>
          </div>
          ${currentTheme === id ? '<div class="theme-card-check">✓</div>' : ''}
        </button>
      `).join('')}
    </div>
  `;
}

// Setup theme selector click handlers using event delegation
function setupThemeSelectorListeners() {
  const container = document.getElementById('themeSelectorContainer');
  if (!container) return;
  
  container.addEventListener('click', (e) => {
    const themeCard = e.target.closest('.theme-card');
    if (themeCard) {
      const themeName = themeCard.dataset.theme;
      if (themeName && THEMES[themeName]) {
        setTheme(themeName);
      }
    }
  });
}

// =====================================================
// Projects
// =====================================================

// Silent refresh - updates in background without notifications
async function silentRefreshProjects() {
  try {
    console.log('🔄 Silent background refresh...');
    const projects = await window.electronAPI.scanAllProjects(scanPaths);
    if (!projects || projects.length === 0) return;
    
    const oldCount = currentProjects.length;
    currentProjects = mergeProjectLists(currentProjects, projects);
    const newCount = currentProjects.length;
    
    // Save updated projects
    saveProjects();
    
    // Update UI - respect current view filter
    refreshCurrentView();
    updateRunningCount();
    renderCollections();
    
    // Show notification only if new projects found
    if (newCount > oldCount) {
      showNotification(`Found ${newCount - oldCount} new project(s)`, 'success');
    }
  } catch (err) {
    console.error("Error in silent refresh:", err);
  }
}

// Auto scan on first launch - no prompts
async function autoScanProjects() {
  try {
    console.log('🔍 Auto-scanning for projects...');
    viewSubtitleEl.textContent = 'Scanning for projects...';
    
    const projects = await window.electronAPI.scanAllProjects(scanPaths);
    
    if (!projects || projects.length === 0) {
      updateEmptyState();
      viewSubtitleEl.textContent = 'No projects found';
      return;
    }
    
    currentProjects = projects;
    saveProjects();
    
    allProjectsCountEl.textContent = projects.length;
    viewSubtitleEl.textContent = `${projects.length} projects`;
    
    renderProjectCards(projects);
    renderCollections();
    
    showNotification(`Found ${projects.length} projects`, 'success');
  } catch (err) {
    console.error("Error in auto scan:", err);
    viewSubtitleEl.textContent = 'Scan failed';
  }
}

// Manual full refresh - with loading state
async function fullRefreshProjects() {
  try {
    console.log('🔄 Full refresh...');
    viewSubtitleEl.textContent = 'Refreshing...';
    
    const projects = await window.electronAPI.scanAllProjects(scanPaths);
    
    if (!projects || projects.length === 0) {
      updateEmptyState();
      viewSubtitleEl.textContent = 'No projects found';
      return;
    }
    
    currentProjects = projects;
    saveProjects();
    
    allProjectsCountEl.textContent = projects.length;
    
    // Respect current view filter
    refreshCurrentView();
    renderCollections();
    
    showNotification(`Refreshed: ${projects.length} projects`, 'success');
  } catch (err) {
    console.error("Error in full refresh:", err);
    showNotification('Refresh failed', 'error');
  }
}

async function softRefreshProjects() {
  try {
    const projects = await window.electronAPI.scanAllProjects(scanPaths);
    if (!projects) return;
    currentProjects = mergeProjectLists(currentProjects, projects);
    saveProjects();
    // Respect current view filter
    refreshCurrentView();
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
    const projects = await window.electronAPI.scanAllProjects(scanPaths);
    console.log('scanAllProjects returned:', projects?.length, 'projects');
    
    if (!projects || projects.length === 0) {
      currentProjects = [];
      updateEmptyState();
      viewSubtitleEl.textContent = 'No projects found';
      return;
    }

    currentProjects = projects;
    saveProjects(); // Persist for next launch
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
    const result = await window.electronAPI.scanCustomFolder();
    
    if (!result) {
      showNotification('Scan cancelled', 'info');
      return;
    }

    const { scannedPath, projects } = result;

    if (!projects || projects.length === 0) {
      showNotification('No projects found in folder', 'warning');
      return;
    }

    // Save the scanned path for future scans
    if (scannedPath) {
      addCreatedProjectPath(scannedPath);
    }

    // Merge with existing projects instead of replacing
    const existingPaths = new Set(currentProjects.map(p => p.path));
    let newCount = 0;
    
    for (const project of projects) {
      if (!existingPaths.has(project.path)) {
        currentProjects.unshift(project);
        newCount++;
      }
    }
    
    saveProjects(); // Persist for next launch
    filteredProjects = [];
    allProjectsCountEl.textContent = currentProjects.length;
    viewSubtitleEl.textContent = `${currentProjects.length} projects`;
    renderProjectCards(currentProjects);
    renderCollections();
    updateEmptyState();
    
    if (newCount > 0) {
      showNotification(`Found ${newCount} new projects (${currentProjects.length} total)`, 'success');
    } else {
      showNotification(`${projects.length} projects already in list`, 'info');
    }
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
      <button class="blueprint-btn blueprints-button" title="Open Blueprints">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        Blueprints
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
  const blueprintsButton = card.querySelector(".blueprints-button");
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
  blueprintsButton?.addEventListener("click", (e) => { e.stopPropagation(); openBlueprints(project.path); });
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
      // Fallback: PID might exit while the actual server keeps running (detached scripts, pm2, etc.).
      // If we still have a port and something is listening, treat it as an external process so the UI stays honest.
      const port = runningInfo.port;
      if (port) {
        try {
          const portCheck = await window.electronAPI.checkPortProcess(port);
          const proc = portCheck?.success ? portCheck.process : null;
          if (proc && proc.pid) {
            runningProjects.delete(projectPath);
            projectProcesses.delete(projectPath);
            externalProjects.set(projectPath, {
              port,
              pid: proc.pid,
              command: proc.command,
              status: 'external',
              external: true
            });
            setCardStatus(projectPath, `Running externally on :${port}`, 'warning');
            updateSingleCard(projectPath);
            updateRunningCount();
            setTimeout(() => clearCardStatus(projectPath), 4000);
            return;
          }
        } catch (e) {
          // ignore port fallback errors and proceed to mark stopped
        }
      }

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
// =====================================================
// MODULE SWITCHING
// =====================================================
function initModuleTabs() {
  // Module tab switching
  [moduleProjects, modulePlayground, moduleSSH].forEach(tab => {
    if (!tab) return;
    tab.addEventListener('click', () => {
      const moduleName = tab.dataset.module;
      switchModule(moduleName);
    });
  });

  // Load saved module
  const savedModule = localStorage.getItem('activeModule');
  if (savedModule && ['projects', 'playground', 'ssh'].includes(savedModule)) {
    switchModule(savedModule);
  }
}

function switchModule(moduleName) {
  activeModule = moduleName;
  localStorage.setItem('activeModule', moduleName);

  // Update tab states
  [moduleProjects, modulePlayground, moduleSSH].forEach(tab => {
    if (!tab) return;
    if (tab.dataset.module === moduleName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update navigation visibility
  if (projectsNav) projectsNav.classList.toggle('hidden', moduleName !== 'projects');
  if (playgroundNav) playgroundNav.classList.toggle('hidden', moduleName !== 'playground');
  if (sshNav) sshNav.classList.toggle('hidden', moduleName !== 'ssh');

  // Update panel visibility
  if (projectsPanel) projectsPanel.classList.toggle('active', moduleName === 'projects');
  if (playgroundPanel) {
    playgroundPanel.classList.toggle('active', moduleName === 'playground');
    
    // Reset scroll position when switching to playground
    if (moduleName === 'playground') {
      playgroundPanel.scrollTop = 0;
      if (codeOutput) codeOutput.scrollTop = 0;
    }
  }
  if (sshPanel) sshPanel.classList.toggle('active', moduleName === 'ssh');

  // Resize Monaco editor when switching to playground
  if (moduleName === 'playground' && monacoEditor) {
    setTimeout(() => {
      monacoEditor.layout();
    }, 100);
  }
}

// =====================================================
// JAVASCRIPT PLAYGROUND
// =====================================================
async function initPlayground() {
  if (!codeEditor || !runCodeBtn) return;

  // Prevent scrolling - simple and effective
  if (playgroundPanel) {
    playgroundPanel.style.overflow = 'hidden';
    playgroundPanel.style.position = 'relative';
    playgroundPanel.style.height = '100%';
    playgroundPanel.scrollTop = 0;
    playgroundPanel.scrollLeft = 0;
  }

  // Prevent scroll on codeEditor
  if (codeEditor) {
    codeEditor.style.overflow = 'hidden';
    codeEditor.style.position = 'relative';
    codeEditor.style.height = '100%';
  }

  // Show loading message (fixed position to prevent scroll)
  codeEditor.innerHTML = '<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; color: #a78bfa; font-size: 14px; background: #111113;"><p>⏳ Loading...</p></div>';

  let monaco = null;
  let useFallback = false;

  // Initialize Monaco Editor with timeout
  try {
    console.log('🔄 Loading Monaco Editor...');
    const monacoPromise = loadMonacoEditor();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Monaco load timeout')), 5000)
    );
    
    monaco = await Promise.race([monacoPromise, timeoutPromise]);
    monacoInstance = monaco; // Store for later use
    console.log('✅ Monaco loaded successfully');
  } catch (err) {
    console.warn('⚠️ Monaco failed, using fallback:', err.message);
    useFallback = true;
  }

  if (!monaco) {
    console.warn('⚠️ Monaco unavailable, switching to fallback textarea');
    useFallback = true;
  }

  if (useFallback) {
    console.log('📝 Using fallback textarea editor');
    // Fallback plain textarea with run support (fixed position)
    codeEditor.innerHTML = '<textarea id="fallbackEditor" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background: #111113; color: #e4e4e7; border: none; padding: 16px; font-family: \'JetBrains Mono\', monospace; font-size: 13px; outline: none; resize: none; overflow-y: auto;" placeholder="// Write JavaScript here and press ⌘+Enter to run\nconsole.log(\'Hello, World!\');"></textarea>';
    
    // Wait for DOM to update
    setTimeout(() => {
      const fallbackEditor = document.getElementById('fallbackEditor');
      if (fallbackEditor) {
        const savedCode = localStorage.getItem('playgroundCode') || '';
        fallbackEditor.value = savedCode;
        
        fallbackEditor.addEventListener('input', () => {
          localStorage.setItem('playgroundCode', fallbackEditor.value);
        });
        
        runCodeBtn.onclick = () => runCodeFallback();
        if (toggleAutoRunBtn) {
          toggleAutoRunBtn.onclick = () => showNotification('Auto-run requires Monaco. Run manually with ⌘+Enter.', 'warning');
        }
        
        console.log('✅ Fallback editor ready');
      }
    }, 100);
    
    return;
  }

  try {
    // Load saved code
    const savedCode = localStorage.getItem('playgroundCode') || `// ✨ QUOKKA-STYLE INLINE EVALUATION! ✨
// Values appear right next to your code!

const name = 'Tafil'
const version = '1.0'

// Math operations
const x = 5
const y = 10
const sum = x + y

// Arrays & Objects
const numbers = [1, 2, 3, 4, 5]
const user = { name: 'John', age: 30 }

// Functions
const multiply = (a, b) => a * b
const result = multiply(7, 6)

console.log('✅ See values inline!')
`;

    // Define custom theme
    monaco.editor.defineTheme('tafil-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'a78bfa', fontStyle: 'bold' },
        { token: 'string', foreground: '10b981' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'operator', foreground: 'a78bfa' },
        { token: 'identifier', foreground: 'e4e4e7' },
      ],
      colors: {
        'editor.background': '#111113',
        'editor.foreground': '#e4e4e7',
        'editor.lineHighlightBackground': '#18181b',
        'editor.selectionBackground': 'rgba(139, 92, 246, 0.3)',
        'editorCursor.foreground': '#a78bfa',
        'editorWhitespace.foreground': '#3f3f46',
        'editorIndentGuide.activeBackground': '#3f3f46',
        'editor.lineNumberForeground': '#52525b',
        'editor.lineNumberActiveForeground': '#a1a1aa',
      }
    });

    // Configure TypeScript for better IntelliSense
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Create Monaco Editor instance
    monacoEditor = monaco.editor.create(codeEditor, {
      value: savedCode,
      language: 'javascript',
      theme: 'tafil-dark',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: false, // Disabled to prevent scroll issues
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        alwaysConsumeMouseWheel: false,
      },
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: false, // Disabled to prevent auto-scroll
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      },
      quickSuggestionsDelay: 50,
      parameterHints: { enabled: true, cycle: true },
      suggest: {
        showMethods: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showStructs: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showKeywords: true,
        showWords: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
        showSnippets: true,
        filterGraceful: true,
        localityBonus: true,
        shareSuggestSelections: true,
      },
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true
      },
      hover: {
        enabled: true,
        delay: 300,
        sticky: true
      },
      codeLens: false,
      folding: true,
      foldingStrategy: 'auto',
      showFoldingControls: 'always',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
      autoIndent: 'full',
    });

    // CRITICAL: Prevent Monaco from scrolling on init
    setTimeout(() => {
      if (monacoEditor) {
        monacoEditor.setScrollTop(0);
        monacoEditor.setScrollLeft(0);
        monacoEditor.revealLine(1);
      }
    }, 0);

    // Auto-save on change with auto-run
    monacoEditor.onDidChangeModelContent(() => {
      const code = monacoEditor.getValue();
      localStorage.setItem('playgroundCode', code);

      // Auto-run with debounce
      if (isAutoRunEnabled && code.trim()) {
        if (autoRunStatus) {
          autoRunStatus.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span> Running...';
          autoRunStatus.style.color = '#f59e0b';
          autoRunStatus.style.background = 'rgba(245, 158, 11, 0.15)';
        }

        // Clear any pending execution
        clearTimeout(autoRunTimeout);
        autoRunTimeout = setTimeout(() => {
          // Double-check auto-run is still enabled before running
          if (isAutoRunEnabled) {
            runCode().then(() => {
              if (isAutoRunEnabled) updateAutoRunStatus();
            }).catch(err => {
              console.error('Auto-run error:', err);
              updateAutoRunStatus();
            });
          }
        }, 800); // Increased debounce from 500ms to 800ms
      }
    });

    // Run button
    runCodeBtn.addEventListener('click', runCode);

    // Toggle auto-run button
    if (toggleAutoRunBtn) {
      toggleAutoRunBtn.addEventListener('click', () => {
        isAutoRunEnabled = !isAutoRunEnabled;
        updateAutoRunStatus();
        showNotification(isAutoRunEnabled ? 'Auto-run enabled' : 'Auto-run disabled', 'info');
      });
    }

    // Clear output
      if (clearOutputBtn) {
        clearOutputBtn.addEventListener('click', () => {
          if (codeOutput) codeOutput.innerHTML = '<p class="text-xs" style="color: #52525b;">Output cleared</p>';
          // Clear inline decorations
          if (monacoEditor && inlineDecorations.length > 0) {
            inlineDecorations = monacoEditor.deltaDecorations(inlineDecorations, []);
          }
        clearInlineWidgets();
        });
      }

      // Save snippet
      if (saveSnippetBtn) {
        saveSnippetBtn.addEventListener('click', () => {
          const code = monacoEditor ? monacoEditor.getValue() : '';
          const name = window.prompt('Snippet name?', `Snippet ${new Date().toLocaleString()}`) || '';
          saveSnippet(name.trim(), code);
          showNotification('Snippet saved', 'success');
        });
      }

      // Playground sidebar actions
      const navNewSnippet = document.getElementById('navNewSnippet');
      const navSnippetHistory = document.getElementById('navSnippetHistory');

      if (navNewSnippet) {
        navNewSnippet.addEventListener('click', () => {
          if (monacoEditor) monacoEditor.setValue('');
          if (codeOutput) codeOutput.innerHTML = '<p class="text-xs" style="color: #52525b;">New snippet</p>';
          clearInlineWidgets();
          showNotification('New snippet', 'info');
        });
      }
      if (navSnippetHistory) {
        navSnippetHistory.addEventListener('click', () => {
          renderSnippetHistory();
        });
      }

      // Snippet history event delegation
      if (codeOutput) {
        codeOutput.addEventListener('click', (e) => {
          const btn = e.target?.closest?.('button[data-snippet-action]');
          if (!btn) return;
          const action = btn.getAttribute('data-snippet-action');
          const id = Number(btn.getAttribute('data-snippet-id'));
          const snippets = getSavedSnippets();
          const idx = snippets.findIndex(s => s.id === id);
          if (idx === -1) return;

          if (action === 'load') {
            if (monacoEditor) monacoEditor.setValue(snippets[idx].code || '');
            showNotification(`Loaded: ${snippets[idx].name}`, 'success');
            clearInlineWidgets();
            return;
          }

          if (action === 'delete') {
            snippets.splice(idx, 1);
            localStorage.setItem(PLAYGROUND_SNIPPETS_KEY, JSON.stringify(snippets));
            renderSnippetHistory();
            showNotification('Snippet deleted', 'info');
          }
        });
      }

    // Keyboard shortcut: Cmd/Ctrl + Enter to run
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode();
    });

    // Toggle auto-run with Cmd/Ctrl + Shift + R
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR, () => {
      isAutoRunEnabled = !isAutoRunEnabled;
      updateAutoRunStatus();
      showNotification(isAutoRunEnabled ? 'Auto-run enabled' : 'Auto-run disabled', 'info');
    });

    updateAutoRunStatus();

    console.log('✅ Monaco Editor initialized');
  } catch (err) {
    console.error('Error initializing Monaco:', err);
    codeEditor.innerHTML = '<textarea style="width:100%;height:100%;background:#111113;color:#e4e4e7;border:none;padding:16px;font-family:monospace;font-size:13px;outline:none;">Monaco Editor failed to load. Please refresh.</textarea>';
  }
}

async function loadMonacoEditor() {
  return new Promise((resolve, reject) => {
    if (window.monaco) {
      resolve(window.monaco);
      return;
    }

    // Prefer local loader for offline reliability, fallback to CDN
    const tryPaths = [
      './node_modules/monaco-editor/min/vs/loader.js',
      'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js'
    ];

    const loadWithPath = (idx) => {
      if (idx >= tryPaths.length) {
        reject(new Error('Failed to load Monaco loader'));
        return;
      }

      const src = tryPaths[idx];
      const loaderScript = document.createElement('script');
      loaderScript.src = src;

      loaderScript.onload = () => {
        let attempts = 0;
        const maxAttempts = 100;

        const checkRequire = setInterval(() => {
          attempts++;

          if (window.require && window.require.config) {
            clearInterval(checkRequire);

            try {
              window.require.config({
                paths: {
                  // Use same base as loader (local or CDN)
                  vs: src.includes('node_modules')
                    ? './node_modules/monaco-editor/min/vs'
                    : 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
                }
              });

              window.require(['vs/editor/editor.main'], (monaco) => {
                window.monaco = monaco;
                resolve(monaco);
              }, (err) => {
                console.error('Error loading Monaco main:', err);
                reject(err);
              });
            } catch (err) {
              reject(err);
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(checkRequire);
            reject(new Error('Monaco load timeout'));
          }
        }, 50);
      };

      loaderScript.onerror = () => {
        console.warn('Monaco loader failed at', src, '- trying next');
        loadWithPath(idx + 1);
      };

      document.head.appendChild(loaderScript);
    };

    loadWithPath(0);
  });
}

function updateAutoRunStatus() {
  if (!autoRunStatus) return;

  if (isAutoRunEnabled) {
    autoRunStatus.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Auto-run ⚡';
    autoRunStatus.style.color = '#a78bfa';
    autoRunStatus.style.background = 'rgba(139, 92, 246, 0.15)';
  } else {
    autoRunStatus.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Manual';
    autoRunStatus.style.color = '#71717a';
    autoRunStatus.style.background = 'rgba(255,255,255,0.05)';
  }
}

async function runCode() {
  if (!monacoEditor || !codeOutput) return Promise.resolve();

  // Rate limiting: prevent execution more than once every 100ms
  const now = Date.now();
  if (now - lastRunTime < 100) {
    console.log('⚠️ Rate limited: execution too frequent');
    return Promise.resolve();
  }
  lastRunTime = now;

  const code = monacoEditor.getValue();
  if (!code.trim()) {
    codeOutput.innerHTML = '<p class="text-xs" style="color: #52525b;">No code to run</p>';
    return Promise.resolve();
  }

  const startTime = performance.now();

  codeOutput.innerHTML = '<p class="log" style="color: #a78bfa;">⚡ Running...</p>';

  try {
    const result = await window.electronAPI.executeJS(code);
    const duration = (performance.now() - startTime).toFixed(1);

    if (executionTimeEl) executionTimeEl.textContent = `${duration}ms`;

    if (result.success) {
      // Display inline results like Quokka (content widgets - reliable for Monaco 0.45)
      let inlineCount = 0;
      if (Array.isArray(result.inlineResults) && result.inlineResults.length > 0) {
        inlineCount = applyInlineResults(result.inlineResults);
      } else {
        clearInlineWidgets();
      }
      
      // Display console output
      let outputHtml = '';

      if (result.logs && result.logs.length > 0) {
        result.logs.forEach(log => {
          const typeClass = log.type === 'error' ? 'error' : log.type === 'warn' ? 'warn' : log.type === 'info' ? 'info' : 'log';
          const icon = log.type === 'error' ? '❌' : log.type === 'warn' ? '⚠️' : log.type === 'info' ? 'ℹ️' : '✓';
          outputHtml += `<p class="${typeClass}">${icon} ${escapeHtml(log.message)}</p>`;
        });
      }

      if (inlineCount > 0) {
        outputHtml += `<p class="info" style="opacity: 0.7; font-size: 11px; margin-top: 8px;">💡 Inline values shown in editor (${inlineCount})</p>`;
      }

      if (result.result !== undefined && result.result !== 'undefined') {
        outputHtml += `<p class="info" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);"><strong>→</strong> ${escapeHtml(String(result.result))}</p>`;
      }

      if (!outputHtml) {
        outputHtml = '<p class="log" style="color: #52525b;">No output</p>';
      }

      codeOutput.innerHTML = outputHtml;
    } else {
      // Clear inline decorations on error
      if (monacoEditor && inlineDecorations.length > 0) {
        inlineDecorations = monacoEditor.deltaDecorations(inlineDecorations, []);
      }
      clearInlineWidgets();
      codeOutput.innerHTML = `<p class="error">❌ ${escapeHtml(result.error || 'Execution failed')}</p>`;
    }
  } catch (err) {
    console.error('Error running code:', err);
    codeOutput.innerHTML = `<p class="error">❌ ${escapeHtml(err.message || 'Failed to execute')}</p>`;
  }
}

// Fallback runner when Monaco is unavailable
async function runCodeFallback() {
  const fallbackEditor = document.getElementById('fallbackEditor');
  if (!fallbackEditor || !codeOutput) return;
  const code = fallbackEditor.value;
  if (!code.trim()) {
    codeOutput.innerHTML = '<p class="text-xs" style="color: #52525b;">No code to run</p>';
    return;
  }
  const startTime = performance.now();
  codeOutput.innerHTML = '<p class="log" style="color: #a78bfa;">⚡ Running...</p>';
  try {
    const result = await window.electronAPI.executeJS(code);
    const duration = (performance.now() - startTime).toFixed(1);
    if (executionTimeEl) executionTimeEl.textContent = `${duration}ms`;
    if (result.success) {
      let outputHtml = '';
      if (result.logs && result.logs.length > 0) {
        result.logs.forEach(log => {
          const typeClass = log.type === 'error' ? 'error' : log.type === 'warn' ? 'warn' : log.type === 'info' ? 'info' : 'log';
          const icon = log.type === 'error' ? '❌' : log.type === 'warn' ? '⚠️' : log.type === 'info' ? 'ℹ️' : '✓';
          outputHtml += `<p class="${typeClass}">${icon} ${escapeHtml(log.message)}</p>`;
        });
      }
      if (result.result !== undefined && result.result !== 'undefined') {
        outputHtml += `<p class="info" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);"><strong>→</strong> ${escapeHtml(String(result.result))}</p>`;
      }
      if (!outputHtml) {
        outputHtml = '<p class="log" style="color: #52525b;">No output</p>';
      }
      codeOutput.innerHTML = outputHtml;
    } else {
      codeOutput.innerHTML = `<p class="error">❌ ${escapeHtml(result.error || 'Execution failed')}</p>`;
    }
  } catch (err) {
    codeOutput.innerHTML = `<p class="error">❌ ${escapeHtml(err.message || 'Failed to execute')}</p>`;
  }
}

// =====================================================
// SSH MODULE
// =====================================================
function initSSH() {
  if (typeof window.Terminal === 'undefined' || typeof window.FitAddon === 'undefined') {
    console.error('xterm.js not loaded');
    return;
  }

  terminal = new window.Terminal({
    cursorBlink: true,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: 13,
    theme: {
      background: '#0a0a0b',
      foreground: '#e4e4e7',
      cursor: '#a78bfa',
      black: '#000000',
      red: '#f43f5e',
      green: '#10b981',
      yellow: '#f59e0b',
      blue: '#0ea5e9',
      magenta: '#a78bfa',
      cyan: '#06b6d4',
      white: '#e4e4e7',
      brightBlack: '#52525b',
      brightRed: '#fb7185',
      brightGreen: '#34d399',
      brightYellow: '#fbbf24',
      brightBlue: '#38bdf8',
      brightMagenta: '#c4b5fd',
      brightCyan: '#22d3ee',
      brightWhite: '#fafafa'
    }
  });

  terminalFitAddon = new window.FitAddon.FitAddon();
  terminal.loadAddon(terminalFitAddon);

  if (window.WebLinksAddon) {
    terminal.loadAddon(new window.WebLinksAddon.WebLinksAddon());
  }

  terminal.open(document.getElementById('terminal'));
  terminalFitAddon.fit();

  terminal.writeln('\x1b[90m╭───────────────────────────────────────────────────────────╮\x1b[0m');
  terminal.writeln('\x1b[90m│\x1b[0m \x1b[1;36m🖥️  Tafil SSH Terminal\x1b[0m                                 \x1b[90m│\x1b[0m');
  terminal.writeln('\x1b[90m│\x1b[0m                                                           \x1b[90m│\x1b[0m');
  terminal.writeln('\x1b[90m│\x1b[0m \x1b[33mConnect to a host to begin an interactive session\x1b[0m      \x1b[90m│\x1b[0m');
  terminal.writeln('\x1b[90m│\x1b[0m \x1b[90mClick the "Connect" button on any SSH host card\x1b[0m        \x1b[90m│\x1b[0m');
  terminal.writeln('\x1b[90m╰───────────────────────────────────────────────────────────╯\x1b[0m');
  terminal.writeln('');

  // Event listeners
  if (addHostBtn) addHostBtn.addEventListener('click', showSSHHostModal);
  if (navAddHost) navAddHost.addEventListener('click', showSSHHostModal);
  if (sshEmptyAddBtn) sshEmptyAddBtn.addEventListener('click', showSSHHostModal);
  if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);
  if (disconnectSSHBtn) disconnectSSHBtn.addEventListener('click', disconnectSSH);
  if (closeSSHHostBtn) closeSSHHostBtn.addEventListener('click', hideSSHHostModal);
  if (cancelSSHHostBtn) cancelSSHHostBtn.addEventListener('click', hideSSHHostModal);
  if (saveSSHHostBtn) saveSSHHostBtn.addEventListener('click', saveSSHHost);
  if (browseSSHKeyBtn) browseSSHKeyBtn.addEventListener('click', browseSSHKey);

  // Auth radio buttons
  document.querySelectorAll('.ssh-auth-radio').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'key') {
        sshKeyFileSection.classList.remove('hidden');
        sshPasswordSection.classList.add('hidden');
      } else {
        sshKeyFileSection.classList.add('hidden');
        sshPasswordSection.classList.remove('hidden');
      }
    });
  });

  // Parse SSH command button
  const parseSSHCommandBtn = document.getElementById('parseSSHCommandBtn');
  if (parseSSHCommandBtn) {
    parseSSHCommandBtn.addEventListener('click', parseSSHCommandFromInput);
  }

  // Tunnel toggle
  const sshTunnelEnabled = document.getElementById('sshTunnelEnabled');
  const sshTunnelSection = document.getElementById('sshTunnelSection');
  if (sshTunnelEnabled && sshTunnelSection) {
    sshTunnelEnabled.addEventListener('change', (e) => {
      if (e.target.checked) {
        sshTunnelSection.classList.remove('hidden');
      } else {
        sshTunnelSection.classList.add('hidden');
      }
    });
  }

  // SSH data listener - handle data for all sessions, but only display for active one
  window.electronAPI.onSSHData((_event, data) => {
    // Find which session this data belongs to
    let sessionForData = null;
    for (const [hostId, session] of sshSessions.entries()) {
      if (session.id === data.sessionId) {
        sessionForData = session;
        break;
      }
    }
    
    // If session closed, remove it
    if (data.type === 'close' && sessionForData) {
      sshSessions.delete(sessionForData.hostId);
      // If it was the current session, clear it
      if (currentSSHSession && currentSSHSession.hostId === sessionForData.hostId) {
        if (terminal) {
          terminal.write(data.data);
        }
        currentSSHSession = null;
      }
      renderSSHHosts();
      renderActiveSessionsSidebar();
    } else if (currentSSHSession && data.sessionId === currentSSHSession.id && terminal) {
      // Only display data if this is the currently active session
      if (data.type === 'stdout') {
        terminal.write(data.data);
      } else if (data.type === 'stderr') {
        terminal.write(`\x1b[31m${data.data}\x1b[0m`);
      }
    }
  });

  // SSH tunnel established listener
  window.electronAPI.onSSHTunnelEstablished((_event, data) => {
    // Find which session this belongs to
    let sessionForData = null;
    for (const [hostId, session] of sshSessions.entries()) {
      if (session.id === data.sessionId) {
        sessionForData = session;
        break;
      }
    }
    
    if (sessionForData) {
      // Show notification for any tunnel
      showNotification(`Tunnel active: localhost:${data.localPort} → ${data.remoteHost}:${data.remotePort}`, 'success');
      // Only write to terminal if it's the active session
      if (currentSSHSession && data.sessionId === currentSSHSession.id && terminal) {
        terminal.write(`\r\n\x1b[32m✓ Tunnel established: localhost:${data.localPort} → ${data.remoteHost}:${data.remotePort}\x1b[0m\r\n`);
      }
    }
  });
}

function loadSSHHosts() {
  const saved = localStorage.getItem('sshHosts');
  if (saved) {
    try {
      sshHosts = JSON.parse(saved);
      renderSSHHosts();
    } catch (err) {
      console.error('Error loading SSH hosts:', err);
    }
  } else {
    renderSSHHosts();
  }
}

function saveSSHHostsToStorage() {
  localStorage.setItem('sshHosts', JSON.stringify(sshHosts));
}

function renderSSHHosts() {
  if (!sshHostList || !sshEmptyState) return;

  if (sshHosts.length === 0) {
    sshHostList.innerHTML = '';
    sshEmptyState.classList.remove('hidden');
  } else {
    sshEmptyState.classList.add('hidden');
    sshHostList.innerHTML = sshHosts.map(host => createSSHHostCard(host)).join('');

    // Add event listeners
    sshHosts.forEach(host => {
      const connectBtn = document.getElementById(`ssh-connect-${host.id}`);
      const deleteBtn = document.getElementById(`ssh-delete-${host.id}`);

      if (connectBtn) {
        connectBtn.addEventListener('click', () => connectSSHHost(host));
      }
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteSSHHost(host.id));
      }
    });
  }

  // Update count
  const sshHostCount = document.getElementById('sshHostCount');
  if (sshHostCount) sshHostCount.textContent = sshHosts.length;
  
  // Update active sessions sidebar
  renderActiveSessionsSidebar();
}

// Render active sessions in the sidebar
function renderActiveSessionsSidebar() {
  if (!activeSessionsList || !activeSessionsCount) return;

  const sessions = Array.from(sshSessions.values());
  
  // Update count
  if (activeSessionsCount) {
    activeSessionsCount.textContent = sessions.length;
  }

  if (sessions.length === 0) {
    activeSessionsList.innerHTML = `
      <div class="px-2 py-3 text-center">
        <p class="text-xs" style="color: #52525b;">No active sessions</p>
      </div>
    `;
    return;
  }

  // Render session list as sidebar items
  activeSessionsList.innerHTML = sessions.map(session => {
    const isActive = currentSSHSession && currentSSHSession.hostId === session.hostId;
    const host = session.host;
    const tunnelIcon = host.tunnel ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' : '';
    
    return `
      <div 
        id="sidebar-session-${session.hostId}" 
        class="sidebar-item ${isActive ? 'active' : ''}" 
        style="cursor: pointer; position: relative;"
        title="Click to switch to ${escapeHtml(host.name)}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${isActive ? '#10b981' : 'currentColor'};"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span class="sidebar-text" style="color: ${isActive ? '#10b981' : 'inherit'};">
          ${escapeHtml(host.name)}
          ${tunnelIcon}
        </span>
        ${isActive ? '<span class="w-1.5 h-1.5 rounded-full absolute right-2" style="background: #10b981;"></span>' : ''}
      </div>
    `;
  }).join('');

  // Add click handlers
  sessions.forEach(session => {
    const sessionItem = document.getElementById(`sidebar-session-${session.hostId}`);
    if (sessionItem) {
      sessionItem.addEventListener('click', () => {
        // Switch to this session
        currentSSHSession = session;
        // Reset last shown session so it will show the info when switching
        lastShownSessionId = null;
        showTerminal(session.host.name);
        renderActiveSessionsSidebar(); // Re-render to update active state
        showNotification(`Switched to ${session.host.name}`, 'info');
      });
    }
  });
}

function createSSHHostCard(host) {
  const hasSession = sshSessions.has(host.id);
  const isActive = currentSSHSession && currentSSHSession.hostId === host.id;
  const authIcon = host.authMethod === 'key' ? '🔑' : '🔒';
  const tunnelInfo = host.tunnel ? `<span class="text-xs px-2 py-0.5 rounded" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3);" title="Tunnel: localhost:${host.tunnel.localPort} → ${host.tunnel.remoteHost}:${host.tunnel.remotePort}">🔗 Tunnel</span>` : '';

  return `
    <div class="ssh-host-card ${hasSession ? 'connected' : ''}" data-host-id="${host.id}">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold text-sm truncate" style="color: #fafafa;">${escapeHtml(host.name)}</h3>
            ${hasSession ? `<span class="text-xs px-1.5 py-0.5 rounded" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">${isActive ? 'Active' : 'Connected'}</span>` : ''}
            ${tunnelInfo}
          </div>
          <p class="text-xs truncate" style="color: #71717a;">${escapeHtml(host.hostname)}:${host.port}</p>
        </div>
        <span class="text-base" title="${host.authMethod === 'key' ? 'SSH Key' : 'Password'}">${authIcon}</span>
      </div>

      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs px-2.5 py-1 rounded-full" style="background: rgba(255,255,255,0.05); color: #a1a1aa; border: 1px solid rgba(255,255,255,0.06);">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; vertical-align: middle; margin-right: 4px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${escapeHtml(host.username)}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button id="ssh-connect-${host.id}" class="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]" style="background: ${hasSession ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #10b981, #059669)'}; color: ${hasSession ? '#10b981' : 'white'}; border: ${hasSession ? '1px solid rgba(16, 185, 129, 0.3)' : 'none'};">
          ${hasSession ? (isActive ? 'Active' : 'Switch to Terminal') : 'Connect'}
        </button>
        <button id="ssh-delete-${host.id}" class="px-3 py-2.5 rounded-lg text-xs font-medium transition-all" style="background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.2);" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `;
}

async function connectSSHHost(host) {
  try {
    // If already connected, just switch to that terminal
    if (sshSessions.has(host.id)) {
      const existingSession = sshSessions.get(host.id);
      currentSSHSession = existingSession;
      showTerminal(host.name);
      renderActiveSessionsSidebar(); // Update sidebar to show active state
      showNotification(`Switched to ${host.name}`, 'info');
      return;
    }

    showNotification(`Connecting to ${host.name}...`, 'info');

    if (terminal) {
      terminal.clear();
      terminal.writeln(`\x1b[33mConnecting to ${host.name} (${host.hostname}:${host.port})...\x1b[0m`);
    }

    showTerminal(host.name);

    const result = await window.electronAPI.connectSSHHost(host);

    if (result.success) {
      const newSession = {
        id: result.sessionId,
        hostId: host.id,
        host: host
      };
      
      // Store session in map
      sshSessions.set(host.id, newSession);
      // Set as current active session
      currentSSHSession = newSession;
      lastShownSessionId = newSession.id; // Mark this session as shown
      
      // Update sidebar
      renderActiveSessionsSidebar();

      showNotification(`Connected to ${host.name}`, 'success');

      if (terminal) {
        terminal.clear();
        terminal.writeln(`\x1b[32m✓ Successfully connected to ${host.name}!\x1b[0m`);
        terminal.writeln(`\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`);
        terminal.writeln(`\x1b[90m  Host:\x1b[0m ${host.hostname}:${host.port}`);
        terminal.writeln(`\x1b[90m  User:\x1b[0m ${host.username}`);
        if (host.tunnel) {
          terminal.writeln(`\x1b[90m  Tunnel:\x1b[0m \x1b[36mlocalhost:${host.tunnel.localPort}\x1b[0m → \x1b[36m${host.tunnel.remoteHost}:${host.tunnel.remotePort}\x1b[0m`);
        }
        terminal.writeln(`\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`);
        terminal.writeln('');
        terminal.writeln('\x1b[1;32m🚀 Interactive SSH Terminal Ready!\x1b[0m');
        terminal.writeln('\x1b[90mYou can now type commands and interact with your server.\x1b[0m');
        if (host.tunnel) {
          terminal.writeln(`\x1b[90m🔗 Port forwarding active: \x1b[0m\x1b[33mlocalhost:${host.tunnel.localPort}\x1b[0m\x1b[90m → \x1b[0m\x1b[33m${host.tunnel.remoteHost}:${host.tunnel.remotePort}\x1b[0m`);
        }
        terminal.writeln('\x1b[90mTry: \x1b[0m\x1b[33mls\x1b[0m\x1b[90m, \x1b[0m\x1b[33mpwd\x1b[0m\x1b[90m, \x1b[0m\x1b[33mcd\x1b[0m\x1b[90m, etc.\x1b[0m');
        terminal.writeln('');
        terminal.focus();
        setTimeout(() => terminal.write('\x1b[1;36m▶ \x1b[0m'), 200);
      }

      // Handle terminal input - use single handler that checks current session
      if (terminal) {
        // Dispose previous handler if exists
        if (terminalInputDisposable) {
          terminalInputDisposable.dispose();
        }
        
        // Create single input handler that always checks current session
        terminalInputDisposable = terminal.onData((data) => {
          // Only send input to the currently active session
          if (currentSSHSession && currentSSHSession.id) {
            window.electronAPI.sendSSHInput(currentSSHSession.id, data);
          }
        });
      }

      renderSSHHosts();
    } else {
      showNotification(result.error || 'Connection failed', 'error');
      if (terminal) {
        terminal.writeln(`\x1b[31m✗ Connection failed: ${result.error || 'Unknown error'}\x1b[0m`);
      }
    }
  } catch (err) {
    console.error('Error connecting to SSH:', err);
    let errorMessage = 'Connection failed';
    if (err && err.message) {
      errorMessage = err.message;
    } else if (err && typeof err === 'string') {
      errorMessage = err;
    } else if (err && err.error) {
      errorMessage = err.error;
    } else if (err && err.toString) {
      errorMessage = err.toString();
    }
    showNotification(errorMessage, 'error');
    if (terminal) {
      terminal.writeln(`\x1b[31m✗ Error: ${errorMessage}\x1b[0m`);
    }
  }
}

function showTerminal(hostName) {
  if (!sshTerminalPanel || !sshHostsView) return;

  sshHostsView.style.display = 'none';
  sshTerminalPanel.classList.add('active');
  
  // Update sidebar when showing terminal
  renderActiveSessionsSidebar();

  // Use the host name from current session if available
  const displayName = hostName || (currentSSHSession && currentSSHSession.host ? currentSSHSession.host.name : 'Connected');
  if (terminalHostName) terminalHostName.textContent = displayName;

  // If there's an active session, ensure input handler is set up
  if (currentSSHSession && currentSSHSession.host && terminal) {
    const host = currentSSHSession.host;
    
    // Ensure input handler is set up (it should already be, but make sure)
    if (!terminalInputDisposable) {
      terminalInputDisposable = terminal.onData((data) => {
        // Only send input to the currently active session
        if (currentSSHSession && currentSSHSession.id) {
          window.electronAPI.sendSSHInput(currentSSHSession.id, data);
        }
      });
    }
    
    // Show session info only when switching to a different session
    // Don't show if this is the same session that was already shown
    if (lastShownSessionId !== currentSSHSession.id) {
      terminal.writeln('');
      terminal.writeln(`\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`);
      terminal.writeln(`\x1b[90m  Session active: \x1b[0m\x1b[36m${host.name}\x1b[0m`);
      terminal.writeln(`\x1b[90m  Host:\x1b[0m ${host.hostname}:${host.port}`);
      if (host.tunnel) {
        terminal.writeln(`\x1b[90m  Tunnel:\x1b[0m \x1b[36mlocalhost:${host.tunnel.localPort}\x1b[0m → \x1b[36m${host.tunnel.remoteHost}:${host.tunnel.remotePort}\x1b[0m`);
      }
      terminal.writeln(`\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`);
      terminal.writeln('');
      lastShownSessionId = currentSSHSession.id;
      
      // Send a newline to trigger the prompt to appear
      // This ensures the cursor is positioned correctly when switching sessions
      // The newline will either execute a pending command or just refresh the prompt
      setTimeout(() => {
        if (currentSSHSession && currentSSHSession.id && terminal) {
          // Send a newline to get the prompt
          window.electronAPI.sendSSHInput(currentSSHSession.id, '\n');
        }
      }, 150);
    }
  }

  setTimeout(() => {
    if (terminalFitAddon) {
      terminalFitAddon.fit();
      setTimeout(() => terminalFitAddon.fit(), 100);
    }
    if (terminal) {
      terminal.focus();
      terminal.scrollToBottom();
    }
  }, 100);

  setTimeout(() => {
    if (terminal) terminal.focus();
  }, 300);
}

function closeTerminal() {
  if (!sshTerminalPanel || !sshHostsView) return;

  // Just hide the terminal view, don't disconnect
  // The connection stays alive so user can switch back and forth
  sshTerminalPanel.classList.remove('active');
  sshHostsView.style.display = 'block';

  renderSSHHosts();
}

async function disconnectSSH() {
  if (currentSSHSession) {
    const hostId = currentSSHSession.hostId;
    try {
      await window.electronAPI.disconnectSSH(currentSSHSession.id);
      showNotification('SSH connection closed', 'info');
    } catch (err) {
      console.error('Error disconnecting SSH:', err);
    }
    
    // Remove from sessions map
    sshSessions.delete(hostId);
    currentSSHSession = null;
    
    // If there are other active sessions, switch to one of them
    if (sshSessions.size > 0) {
      const firstSession = sshSessions.values().next().value;
      currentSSHSession = firstSession;
      showTerminal(firstSession.host.name);
      renderActiveSessionsSidebar(); // Update sidebar
      showNotification(`Switched to ${firstSession.host.name}`, 'info');
    } else {
      // No more sessions, dispose input handler and clear terminal
      if (terminalInputDisposable) {
        terminalInputDisposable.dispose();
        terminalInputDisposable = null;
      }
      
      if (terminal) {
        terminal.writeln('\r\n\x1b[33mDisconnected.\x1b[0m');
        terminal.writeln('Terminal ready. Connect to an SSH host to begin.');
      }
      
      // Go back to hosts view
      if (sshTerminalPanel && sshHostsView) {
        sshTerminalPanel.classList.remove('active');
        sshHostsView.style.display = 'block';
      }
    }
  }

  renderSSHHosts();
}

// Parse SSH command and extract connection details
function parseSSHCommand(command) {
  const result = {
    hostname: null,
    username: null,
    port: 22,
    keyPath: null,
    password: null,
    tunnel: null
  };

  try {
    // Remove sudo if present
    command = command.replace(/^sudo\s+/, '');
    
    // Extract key file (-i "path" or -i path) - handle quoted strings with spaces
    const keyMatchQuoted = command.match(/-i\s+["']([^"']+)["']/);
    const keyMatchUnquoted = command.match(/-i\s+([^\s]+)/);
    if (keyMatchQuoted) {
      result.keyPath = keyMatchQuoted[1];
    } else if (keyMatchUnquoted) {
      result.keyPath = keyMatchUnquoted[1];
    }

    // Extract port (-p port)
    const portMatch = command.match(/-p\s+(\d+)/);
    if (portMatch) {
      result.port = parseInt(portMatch[1]);
    }

    // Extract tunnel (-L localPort:remoteHost:remotePort)
    const tunnelMatch = command.match(/-L\s+(\d+):([^:]+):(\d+)/);
    if (tunnelMatch) {
      result.tunnel = {
        localPort: parseInt(tunnelMatch[1]),
        remoteHost: tunnelMatch[2],
        remotePort: parseInt(tunnelMatch[3])
      };
    }

    // Extract username@hostname - find the pattern directly
    // Look for user@host pattern - capture everything after @ until space or end
    const userHostMatch = command.match(/([a-zA-Z0-9_-]+)@([^\s@]+)/);
    if (userHostMatch) {
      result.username = userHostMatch[1];
      result.hostname = userHostMatch[2];
    } else {
      // Fallback: remove all flags and get the last argument
      let cleaned = command
        .replace(/^sudo\s+/g, '')
        .replace(/^ssh\s+/g, '')
        .replace(/-L\s+\d+:[^:]+:\d+/g, '') // Remove -L tunnel
        .replace(/-i\s+["'][^"']+["']/g, '') // Remove -i with quoted value
        .replace(/-i\s+[^\s]+/g, '') // Remove -i with unquoted value
        .replace(/-p\s+\d+/g, '') // Remove -p flag
        .replace(/-[a-zA-Z]+\s+[^\s]+/g, '') // Remove flags with values
        .replace(/-[a-zA-Z]+/g, '') // Remove standalone flags
        .replace(/["'][^"']+["']/g, '') // Remove quoted strings
        .trim();
      
      // Get the last non-empty word
      const parts = cleaned.split(/\s+/).filter(p => p.trim() && !p.startsWith('-'));
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('@')) {
          const [username, hostname] = lastPart.split('@');
          result.username = username.trim();
          result.hostname = hostname.trim();
        } else {
          result.hostname = lastPart.trim();
        }
      }
    }
  } catch (err) {
    console.error('Error parsing SSH command:', err);
  }

  return result;
}

// Parse SSH command from input field and populate form
function parseSSHCommandFromInput() {
  const commandInput = document.getElementById('sshCommandInput');
  if (!commandInput || !commandInput.value.trim()) {
    showNotification('Please paste an SSH command', 'error');
    return;
  }

  const parsed = parseSSHCommand(commandInput.value.trim());
  console.log('Parsed SSH command:', parsed);

  // Populate form fields
  if (parsed.hostname && sshHostname) {
    sshHostname.value = parsed.hostname;
  }
  if (parsed.username && sshUsername) {
    sshUsername.value = parsed.username;
  }
  if (parsed.port && sshPort) {
    sshPort.value = parsed.port;
  }
  if (parsed.keyPath && sshKeyPath) {
    sshKeyPath.value = parsed.keyPath;
    // Set auth method to key
    const keyRadio = document.querySelector('input[name="sshAuth"][value="key"]');
    if (keyRadio) {
      keyRadio.checked = true;
      if (sshKeyFileSection) sshKeyFileSection.classList.remove('hidden');
      if (sshPasswordSection) sshPasswordSection.classList.add('hidden');
    }
  }

  // Handle tunnel configuration
  if (parsed.tunnel) {
    const sshTunnelEnabled = document.getElementById('sshTunnelEnabled');
    const sshTunnelSection = document.getElementById('sshTunnelSection');
    const sshTunnelLocalPort = document.getElementById('sshTunnelLocalPort');
    const sshTunnelRemoteHost = document.getElementById('sshTunnelRemoteHost');
    const sshTunnelRemotePort = document.getElementById('sshTunnelRemotePort');

    if (sshTunnelEnabled) {
      sshTunnelEnabled.checked = true;
      if (sshTunnelSection) sshTunnelSection.classList.remove('hidden');
    }
    if (sshTunnelLocalPort) sshTunnelLocalPort.value = parsed.tunnel.localPort;
    if (sshTunnelRemoteHost) sshTunnelRemoteHost.value = parsed.tunnel.remoteHost;
    if (sshTunnelRemotePort) sshTunnelRemotePort.value = parsed.tunnel.remotePort;
  }

  // Generate a default host name if not set
  if (!sshHostName || !sshHostName.value.trim()) {
    const defaultName = parsed.hostname || 'SSH Host';
    if (sshHostName) sshHostName.value = defaultName;
  }

  showNotification('SSH command parsed successfully!', 'success');
}

function showSSHHostModal() {
  if (!sshHostModal) return;

  // Reset form
  const sshCommandInput = document.getElementById('sshCommandInput');
  if (sshCommandInput) sshCommandInput.value = '';
  if (sshHostName) sshHostName.value = '';
  if (sshHostname) sshHostname.value = '';
  if (sshUsername) sshUsername.value = '';
  if (sshPort) sshPort.value = '22';
  if (sshKeyPath) sshKeyPath.value = '';
  if (sshPassword) sshPassword.value = '';

  const keyRadio = document.querySelector('input[name="sshAuth"][value="key"]');
  if (keyRadio) keyRadio.checked = true;
  if (sshKeyFileSection) sshKeyFileSection.classList.remove('hidden');
  if (sshPasswordSection) sshPasswordSection.classList.add('hidden');

  // Reset tunnel fields
  const sshTunnelEnabled = document.getElementById('sshTunnelEnabled');
  const sshTunnelSection = document.getElementById('sshTunnelSection');
  if (sshTunnelEnabled) sshTunnelEnabled.checked = false;
  if (sshTunnelSection) sshTunnelSection.classList.add('hidden');
  
  const sshTunnelLocalPort = document.getElementById('sshTunnelLocalPort');
  const sshTunnelRemoteHost = document.getElementById('sshTunnelRemoteHost');
  const sshTunnelRemotePort = document.getElementById('sshTunnelRemotePort');
  if (sshTunnelLocalPort) sshTunnelLocalPort.value = '';
  if (sshTunnelRemoteHost) sshTunnelRemoteHost.value = '';
  if (sshTunnelRemotePort) sshTunnelRemotePort.value = '';

  sshHostModal.classList.remove('hidden');
}

function hideSSHHostModal() {
  if (sshHostModal) sshHostModal.classList.add('hidden');
}

async function browseSSHKey() {
  try {
    const result = await window.electronAPI.selectSSHKeyFile();
    if (result && result.filePath && sshKeyPath) {
      sshKeyPath.value = result.filePath;
    }
  } catch (err) {
    console.error('Error selecting SSH key:', err);
    showNotification('Failed to select key file', 'error');
  }
}

async function saveSSHHost() {
  const name = sshHostName?.value.trim();
  const hostname = sshHostname?.value.trim();
  const username = sshUsername?.value.trim();
  const port = parseInt(sshPort?.value) || 22;
  const authMethod = document.querySelector('input[name="sshAuth"]:checked')?.value || 'key';
  const keyPath = sshKeyPath?.value.trim();
  const password = sshPassword?.value;

  // Get tunnel configuration
  const sshTunnelEnabled = document.getElementById('sshTunnelEnabled');
  const tunnelEnabled = sshTunnelEnabled?.checked || false;
  let tunnel = null;

  if (tunnelEnabled) {
    const sshTunnelLocalPort = document.getElementById('sshTunnelLocalPort');
    const sshTunnelRemoteHost = document.getElementById('sshTunnelRemoteHost');
    const sshTunnelRemotePort = document.getElementById('sshTunnelRemotePort');

    const localPort = parseInt(sshTunnelLocalPort?.value);
    const remoteHost = sshTunnelRemoteHost?.value.trim();
    const remotePort = parseInt(sshTunnelRemotePort?.value);

    if (!localPort || !remoteHost || !remotePort) {
      showNotification('Please fill in all tunnel configuration fields', 'error');
      return;
    }

    tunnel = {
      localPort,
      remoteHost,
      remotePort
    };
  }

  if (!name || !hostname || !username) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (authMethod === 'key' && !keyPath) {
    showNotification('Please select an SSH key file', 'error');
    return;
  }

  if (authMethod === 'password' && !password) {
    showNotification('Please enter a password', 'error');
    return;
  }

  const host = {
    id: Date.now().toString(),
    name,
    hostname,
    username,
    port,
    authMethod,
    keyPath: authMethod === 'key' ? keyPath : null,
    password: authMethod === 'password' ? password : null,
    tunnel: tunnel
  };

  try {
    const result = await window.electronAPI.saveSSHHost(host);
    if (result.success) {
      sshHosts.push(host);
      saveSSHHostsToStorage();
      renderSSHHosts();
      hideSSHHostModal();
      showNotification(`Host "${name}" saved successfully`, 'success');
    } else {
      showNotification(result.error || 'Failed to save host', 'error');
    }
  } catch (err) {
    console.error('Error saving SSH host:', err);
    showNotification('Failed to save host', 'error');
  }
}

async function deleteSSHHost(hostId) {
  const host = sshHosts.find(h => h.id === hostId);
  if (!host) return;

  if (!confirm(`Delete SSH host "${host.name}"?`)) return;

  sshHosts = sshHosts.filter(h => h.id !== hostId);
  saveSSHHostsToStorage();
  renderSSHHosts();
  showNotification(`Host "${host.name}" deleted`, 'info');
}

// =====================================================
// BLUEPRINTS / MODULES SYSTEM
// =====================================================

// Blueprint DOM Elements
const blueprintModal = document.getElementById('blueprintModal');
const closeBlueprintBtn = document.getElementById('closeBlueprintBtn');
const addModuleBtn = document.getElementById('addModuleBtn');
const blueprintProjectName = document.getElementById('blueprintProjectName');
const moduleSearchInput = document.getElementById('moduleSearchInput');
const moduleList = document.getElementById('moduleList');
const moduleCountLabel = document.getElementById('moduleCountLabel');

// Module Header
const moduleHeader = document.getElementById('moduleHeader');
const moduleIcon = document.getElementById('moduleIcon');
const moduleTitle = document.getElementById('moduleTitle');
const moduleUpdatedAt = document.getElementById('moduleUpdatedAt');
const moduleHistoryBtn = document.getElementById('moduleHistoryBtn');
const moduleSettingsBtn = document.getElementById('moduleSettingsBtn');
const deleteModuleBtn = document.getElementById('deleteModuleBtn');

// View Elements
const viewTabs = document.getElementById('viewTabs');
const moduleContent = document.getElementById('moduleContent');
const moduleEmptyState = document.getElementById('moduleEmptyState');
const createFirstModuleBtn = document.getElementById('createFirstModuleBtn');

// Content Views
const goalView = document.getElementById('goalView');
const kanbanView = document.getElementById('kanbanView');
const canvasView = document.getElementById('canvasView');
const editorView = document.getElementById('editorView');
const resourcesView = document.getElementById('resourcesView');

// Goal View
const goalEditor = document.getElementById('goalEditor');
const goalMonacoEditorEl = document.getElementById('goalMonacoEditor');
const goalLiveEditor = document.getElementById('goalLiveEditor');
const goalSaveStatus = document.getElementById('goalSaveStatus');
const goalPreviewContainer = document.getElementById('goalPreviewContainer');
const goalPreview = document.getElementById('goalPreview');
const goalLinkedSection = document.getElementById('goalLinkedSection');
const goalLinkedModules = document.getElementById('goalLinkedModules');
const goalLinkedByModules = document.getElementById('goalLinkedByModules');

// Live editor state
let goalMarkdownSource = ''; // Stores the markdown source
let goalMarkdownEngine = null; // ProseMirror-based live editor (when available)
let goalMarkdownEngineEl = null;
let goalLinkedUpdateTimeout = null;
let goalMarkdownEngineWarned = false;

function isGoalMarkdownEngineAvailable() {
  return !!(window.TafilGoalMarkdownEditor && typeof window.TafilGoalMarkdownEditor.mount === 'function');
}

function destroyGoalMarkdownEngine() {
  try { goalMarkdownEngine?.destroy?.(); } catch {}
  goalMarkdownEngine = null;
  if (goalMarkdownEngineEl) {
    try { goalMarkdownEngineEl.remove(); } catch {}
    goalMarkdownEngineEl = null;
  }
}

function ensureGoalMarkdownEngineMounted() {
  const goalEditorContainer = document.getElementById('goalEditorContainer');
  if (!goalEditorContainer) return false;
  if (!isGoalMarkdownEngineAvailable()) {
    // Make the failure mode obvious: if the bundle didn't load, users will see "plain" editing.
    if (!goalMarkdownEngineWarned) {
      goalMarkdownEngineWarned = true;
      try {
        showNotification('Live Markdown engine not loaded. Run: npm run build-goal-editor, then restart Tafil.', 'warning');
      } catch {}
    }
    return false;
  }

  if (goalMarkdownEngine && goalMarkdownEngine.isMounted?.()) return true;

  if (!goalMarkdownEngineEl) {
    goalMarkdownEngineEl = document.createElement('div');
    goalMarkdownEngineEl.id = 'goalRichEditor';
    goalMarkdownEngineEl.className = 'tafil-goal-md-editor';
    Object.assign(goalMarkdownEngineEl.style, {
      position: 'absolute',
      inset: '0',
      overflow: 'auto',
    });
    goalEditorContainer.appendChild(goalMarkdownEngineEl);
  }

  // Hide legacy layers; keep textarea as hidden storage for backward compatibility.
  if (goalMonacoEditorEl) goalMonacoEditorEl.style.display = 'none';
  if (goalEditor) goalEditor.style.display = 'none';
  if (goalLiveEditor) goalLiveEditor.style.display = 'none';

  try {
    goalMarkdownEngine = window.TafilGoalMarkdownEditor.mount({
      el: goalMarkdownEngineEl,
      markdown: (goalEditor?.value || goalMarkdownSource || ''),
      onDocChanged: () => {
        clearTimeout(goalSaveTimeout);
        if (goalSaveStatus) goalSaveStatus.textContent = 'Unsaved changes...';
        goalSaveTimeout = setTimeout(saveGoalContent, 1000);

        clearTimeout(goalLinkedUpdateTimeout);
        goalLinkedUpdateTimeout = setTimeout(() => {
          try { updateLinkedModules(); } catch {}
        }, 250);
      },
      onSave: () => saveGoalContent(),
    });

    setTimeout(() => {
      try { goalMarkdownEngine?.focus?.(); } catch {}
    }, 0);

    // Quick visual confirmation that the rich editor is active.
    if (goalSaveStatus) {
      goalSaveStatus.textContent = 'Live Markdown';
      setTimeout(() => {
        if (goalSaveStatus && goalSaveStatus.textContent === 'Live Markdown') {
          goalSaveStatus.textContent = 'Auto-saved';
        }
      }, 1200);
    }

    return true;
  } catch (err) {
    console.warn('⚠️ Goal Markdown engine failed, falling back to legacy textarea:', err?.message || err);
    destroyGoalMarkdownEngine();
    return false;
  }
}

// Editor View (Code Scratchpad)
const blueprintEditorContainer = document.getElementById('blueprintEditorContainer');
const blueprintMonacoEditorEl = document.getElementById('blueprintMonacoEditor');
const blueprintEditorTextarea = document.getElementById('blueprintEditorTextarea');
const editorSaveStatus = document.getElementById('editorSaveStatus');
const runEditorBtn = document.getElementById('runEditorBtn');
const clearEditorOutputBtn = document.getElementById('clearEditorOutputBtn');
const editorOutput = document.getElementById('editorOutput');

// Kanban View
const kanbanBoard = document.getElementById('kanbanBoard');
const addTaskBtn = document.getElementById('addTaskBtn');

// Canvas View
const excalidrawContainer = document.getElementById('excalidrawContainer');
const canvasSaveStatus = document.getElementById('canvasSaveStatus');

// Resources View
const resourcesList = document.getElementById('resourcesList');
const addLinkBtn = document.getElementById('addLinkBtn');
const addFileRefBtn = document.getElementById('addFileRefBtn');

// Add Module Modal
const addModuleModal = document.getElementById('addModuleModal');
const closeAddModuleBtn = document.getElementById('closeAddModuleBtn');
const newModuleTitle = document.getElementById('newModuleTitle');
const newModuleDesc = document.getElementById('newModuleDesc');
const cancelAddModuleBtn = document.getElementById('cancelAddModuleBtn');
const confirmAddModuleBtn = document.getElementById('confirmAddModuleBtn');

// Add Task Modal
const addTaskModal = document.getElementById('addTaskModal');
const closeAddTaskBtn = document.getElementById('closeAddTaskBtn');
const newTaskTitle = document.getElementById('newTaskTitle');
const newTaskDesc = document.getElementById('newTaskDesc');
const newTaskPriority = document.getElementById('newTaskPriority');
const newTaskColumn = document.getElementById('newTaskColumn');
const cancelAddTaskBtn = document.getElementById('cancelAddTaskBtn');
const confirmAddTaskBtn = document.getElementById('confirmAddTaskBtn');

// Add Link Modal
const addLinkModal = document.getElementById('addLinkModal');
const closeAddLinkBtn = document.getElementById('closeAddLinkBtn');
const newLinkUrl = document.getElementById('newLinkUrl');
const newLinkTitle = document.getElementById('newLinkTitle');
const newLinkType = document.getElementById('newLinkType');
const cancelAddLinkBtn = document.getElementById('cancelAddLinkBtn');
const confirmAddLinkBtn = document.getElementById('confirmAddLinkBtn');

// Search Modal
const moduleSearchModal = document.getElementById('moduleSearchModal');
const globalModuleSearch = document.getElementById('globalModuleSearch');
const moduleSearchResults = document.getElementById('moduleSearchResults');
const closeModuleSearchBtn = document.getElementById('closeModuleSearchBtn');

// Blueprint State
let blueprintProjectPath = null;
let blueprintData = null;
let selectedModule = null;
let currentBlueprintView = 'goal';
let goalSaveTimeout = null;
let editorSaveTimeout = null;
let canvasSaveTimeout = null;
let selectedModuleIcon = '📦';
let selectedModuleColor = '#8b5cf6';
let draggedTask = null;
let draggedModule = null;

// Blueprint Goal Live Editor (Monaco)
let blueprintGoalMonacoEditor = null;

// Blueprint Editor Live Editor (Monaco)
let blueprintCodeMonacoEditor = null;

function getBlueprintGoalValue() {
  // Prefer structured editor state when available (ProseMirror).
  try {
    if (goalMarkdownEngine && goalMarkdownEngine.isMounted?.()) {
      const md = goalMarkdownEngine.getMarkdown?.() || '';
      // Keep hidden textarea + legacy buffers in sync for backward compatibility.
      if (goalEditor) goalEditor.value = md;
      goalMarkdownSource = md;
      return md;
    }
  } catch {}

  // Fallback: textarea value (legacy/Monaco syncs to it).
  if (goalEditor) return goalEditor.value;
  try {
    if (blueprintGoalMonacoEditor) return blueprintGoalMonacoEditor.getValue();
  } catch {}
  return '';
}

function setBlueprintGoalValue(content) {
  const value = typeof content === 'string' ? content : '';
  if (goalEditor) {
    goalEditor.value = value;
    goalMarkdownSource = value;
    // Only render legacy preview when the legacy overlay is in use.
    try {
      if (!(goalMarkdownEngine && goalMarkdownEngine.isMounted?.())) {
        renderLivePreview();
      }
    } catch {
      renderLivePreview();
    }
  }
  try {
    if (goalMarkdownEngine && goalMarkdownEngine.isMounted?.()) {
      goalMarkdownEngine.setMarkdown?.(value);
    }
  } catch {}
  try {
    if (blueprintGoalMonacoEditor) blueprintGoalMonacoEditor.setValue(value);
  } catch {}
}

async function ensureBlueprintGoalMonacoEditor() {
  if (!goalMonacoEditorEl || !goalEditor) return false;

  // Already initialized
  if (blueprintGoalMonacoEditor) return true;

  // If Monaco isn't available, keep textarea fallback
  let monaco = null;
  try {
    monaco = monacoInstance || await loadMonacoEditor();
    monacoInstance = monacoInstance || monaco;
  } catch (err) {
    console.warn('⚠️ Blueprint Goal: Monaco failed, using textarea fallback:', err?.message || err);
    goalMonacoEditorEl.style.display = 'none';
    goalEditor.style.display = '';
    return false;
  }

  if (!monaco || !monaco.editor) {
    goalMonacoEditorEl.style.display = 'none';
    goalEditor.style.display = '';
    return false;
  }

  try {
    // Swap UI: show Monaco, hide textarea
    goalMonacoEditorEl.style.display = '';
    goalEditor.style.display = 'none';

    blueprintGoalMonacoEditor = monaco.editor.create(goalMonacoEditorEl, {
      value: goalEditor.value || '',
      language: 'markdown',
      theme: 'vs-dark',
      minimap: { enabled: false },
      wordWrap: 'on',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 14,
      lineHeight: 22,
      padding: { top: 16, bottom: 16 },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderLineHighlight: 'none',
      roundedSelection: true,
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
    });

    // Register wiki-link autocomplete provider
    monaco.languages.registerCompletionItemProvider('markdown', {
      triggerCharacters: ['[', '['],
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });
        
        // Check if we're inside [[...]]
        const lastBracketIndex = textUntilPosition.lastIndexOf('[[');
        if (lastBracketIndex === -1) return { suggestions: [] };
        
        // Check if we haven't closed the bracket yet
        const textAfterBracket = textUntilPosition.substring(lastBracketIndex + 2);
        if (textAfterBracket.includes(']]')) return { suggestions: [] };
        
        // Get current search term
        const searchTerm = textAfterBracket.toLowerCase();
        
        // Get all modules except current one
        if (!blueprintData || !blueprintData.modules) return { suggestions: [] };
        const availableModules = blueprintData.modules.filter(m => m.id !== selectedModule?.id);
        
        const suggestions = availableModules
          .filter(m => m.title.toLowerCase().includes(searchTerm))
          .map(m => ({
            label: m.title,
            kind: monaco.languages.CompletionItemKind.Reference,
            insertText: m.title,
            detail: `Module: ${m.title}`,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: lastBracketIndex + 3,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            }
          }));
        
        return { suggestions };
      }
    });

    // Cmd/Ctrl+S saves
    blueprintGoalMonacoEditor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => saveGoalContent()
    );

    // Auto-save debounce and update preview
    blueprintGoalMonacoEditor.onDidChangeModelContent(() => {
      clearTimeout(goalSaveTimeout);
      if (goalSaveStatus) goalSaveStatus.textContent = 'Unsaved changes...';
      goalSaveTimeout = setTimeout(saveGoalContent, 1000);
      
      // Update live preview and linked modules
      if (goalEditor) {
        goalEditor.value = blueprintGoalMonacoEditor.getValue();
        goalMarkdownSource = goalEditor.value;
        renderLivePreview();
      }
      updateLinkedModules();
    });

    // Ensure layout after paint (modal/tab switches)
    setTimeout(() => {
      try { blueprintGoalMonacoEditor?.layout(); } catch {}
    }, 50);

    return true;
  } catch (err) {
    console.error('Error initializing Blueprint Goal Monaco:', err);
    goalMonacoEditorEl.style.display = 'none';
    goalEditor.style.display = '';
    blueprintGoalMonacoEditor = null;
    return false;
  }
}

function appendEditorOutputLine(line) {
  if (!editorOutput) return;
  const text = typeof line === 'string' ? line : String(line);
  editorOutput.textContent = (editorOutput.textContent ? editorOutput.textContent + '\n' : '') + text;
  editorOutput.scrollTop = editorOutput.scrollHeight;
}

function clearEditorOutput() {
  if (editorOutput) editorOutput.textContent = '';
}

function getBlueprintEditorValue() {
  try {
    if (blueprintCodeMonacoEditor) return blueprintCodeMonacoEditor.getValue();
  } catch {}
  return blueprintEditorTextarea ? blueprintEditorTextarea.value : '';
}

function setBlueprintEditorValue(content) {
  const value = typeof content === 'string' ? content : '';
  if (blueprintEditorTextarea) blueprintEditorTextarea.value = value;
  try {
    if (blueprintCodeMonacoEditor) blueprintCodeMonacoEditor.setValue(value);
  } catch {}
}

async function ensureBlueprintCodeMonacoEditor() {
  if (!blueprintMonacoEditorEl || !blueprintEditorTextarea) return false;

  if (blueprintCodeMonacoEditor) return true;

  let monaco = null;
  try {
    monaco = monacoInstance || await loadMonacoEditor();
    monacoInstance = monacoInstance || monaco;
  } catch (err) {
    console.warn('⚠️ Blueprint Editor: Monaco failed, using textarea fallback:', err?.message || err);
    blueprintMonacoEditorEl.style.display = 'none';
    blueprintEditorTextarea.style.display = '';
    return false;
  }

  if (!monaco || !monaco.editor) {
    blueprintMonacoEditorEl.style.display = 'none';
    blueprintEditorTextarea.style.display = '';
    return false;
  }

  try {
    blueprintMonacoEditorEl.style.display = '';
    blueprintEditorTextarea.style.display = 'none';

    blueprintCodeMonacoEditor = monaco.editor.create(blueprintMonacoEditorEl, {
      value: blueprintEditorTextarea.value || '',
      language: 'javascript',
      theme: 'vs-dark',
      minimap: { enabled: false },
      wordWrap: 'off',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
      lineHeight: 20,
      padding: { top: 14, bottom: 14 },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderLineHighlight: 'none',
      roundedSelection: true,
    });

    // Cmd/Ctrl+S saves
    blueprintCodeMonacoEditor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => saveEditorContent()
    );

    // Cmd/Ctrl+Enter runs
    blueprintCodeMonacoEditor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => runEditorCode()
    );

    // Auto-save debounce
    blueprintCodeMonacoEditor.onDidChangeModelContent(() => {
      clearTimeout(editorSaveTimeout);
      if (editorSaveStatus) editorSaveStatus.textContent = 'Unsaved changes...';
      editorSaveTimeout = setTimeout(saveEditorContent, 1000);
    });

    setTimeout(() => {
      try { blueprintCodeMonacoEditor?.layout(); } catch {}
    }, 50);

    return true;
  } catch (err) {
    console.error('Error initializing Blueprint Editor Monaco:', err);
    blueprintMonacoEditorEl.style.display = 'none';
    blueprintEditorTextarea.style.display = '';
    blueprintCodeMonacoEditor = null;
    return false;
  }
}

// =====================================================
// Blueprint Core Functions
// =====================================================

async function openBlueprints(projectPath) {
  if (!projectPath) return;
  
  blueprintProjectPath = projectPath;
  
  try {
    // Initialize/load blueprints
    const result = await window.electronAPI.loadBlueprints(projectPath);
    if (!result.success) {
      // Try to initialize
      const initResult = await window.electronAPI.initBlueprints(projectPath);
      if (!initResult.success) {
        showNotification('Failed to load blueprints', 'error');
        return;
      }
      blueprintData = initResult.blueprints;
    } else {
      blueprintData = result.blueprints;
    }
    
    // Update UI
    const projectName = path.basename(projectPath);
    if (blueprintProjectName) {
      blueprintProjectName.textContent = projectName;
      blueprintProjectName.title = projectPath;
    }
    
    // Render modules
    renderModuleList();
    
    // Show modal
    if (blueprintModal) {
      blueprintModal.classList.remove('hidden');
    }

    // Prepare live editor (safe no-op if Monaco unavailable)
    if (currentBlueprintView === 'goal') {
      await ensureBlueprintGoalMonacoEditor();
    }
    if (currentBlueprintView === 'editor') {
      await ensureBlueprintCodeMonacoEditor();
    }
    
    // Reset selection
    selectedModule = null;
    showModuleEmptyState();
    
    console.log('📦 Blueprints opened for:', projectName);
    
  } catch (err) {
    console.error('Error opening blueprints:', err);
    showNotification('Failed to load blueprints', 'error');
  }
}

function closeBlueprints() {
  if (blueprintModal) {
    blueprintModal.classList.add('hidden');
  }

  // Tear down the rich Goal editor (it will be re-mounted when needed).
  destroyGoalMarkdownEngine();
  
  // Reset state
  blueprintProjectPath = null;
  blueprintData = null;
  selectedModule = null;
  currentBlueprintView = 'goal';
  excalidrawReady = false;
  
  console.log('📦 Blueprints closed');
}

function renderModuleList() {
  if (!moduleList || !blueprintData) return;
  
  const modules = blueprintData.modules || [];
  
  if (modules.length === 0) {
    moduleList.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #52525b;">
        <p style="font-size: 12px; margin-bottom: 8px;">No modules yet</p>
        <button id="createFirstModuleInList" style="font-size: 11px; color: #a78bfa; background: none; border: none; cursor: pointer;">
          + Create your first module
        </button>
      </div>
    `;
    const createBtn = document.getElementById('createFirstModuleInList');
    if (createBtn) {
      createBtn.addEventListener('click', showAddModuleModal);
    }
  } else {
    moduleList.innerHTML = modules.map(m => `
      <div class="module-list-item ${selectedModule?.id === m.id ? 'active' : ''}" 
           data-module-id="${m.id}"
           draggable="true">
        <div class="module-icon" style="background: ${m.color}20; color: ${m.color};">${m.icon}</div>
        <div class="module-info">
          <div class="module-info-title">${escapeHtml(m.title)}</div>
          <div class="module-info-meta">${formatRelativeTime(m.updatedAt)}</div>
        </div>
      </div>
    `).join('');
    
    // Add click event listeners to each module item
    moduleList.querySelectorAll('.module-list-item').forEach(item => {
      const moduleId = item.dataset.moduleId;
      
      item.addEventListener('click', () => {
        selectModule(moduleId);
      });
      
      item.addEventListener('dragstart', (e) => {
        draggedModule = moduleId;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      
      item.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        draggedModule = null;
      });
      
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
      });
      
      item.addEventListener('dragleave', (e) => {
        e.currentTarget.classList.remove('drag-over');
      });
      
      item.addEventListener('drop', async (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        if (draggedModule && draggedModule !== moduleId) {
          // Reorder modules
          try {
            const result = await window.electronAPI.reorderModules(blueprintProjectPath, draggedModule, moduleId);
            if (result.success) {
              blueprintData = result.blueprints;
              renderModuleList();
            }
          } catch (err) {
            console.error('Error reordering modules:', err);
          }
        }
        draggedModule = null;
      });
    });
  }
  
  // Update count
  if (moduleCountLabel) {
    moduleCountLabel.textContent = `${modules.length} module${modules.length !== 1 ? 's' : ''}`;
  }
}

async function selectModule(moduleId) {
  if (!blueprintData) return;
  
  const module = blueprintData.modules.find(m => m.id === moduleId);
  if (!module) return;
  
  selectedModule = module;
  
  // Update sidebar selection
  renderModuleList();
  
  // Update header
  if (moduleIcon) moduleIcon.textContent = module.icon;
  if (moduleTitle) {
    moduleTitle.textContent = module.title;
    // Make sure contenteditable is enabled when a module is selected
    moduleTitle.contentEditable = 'true';
  }
  if (moduleUpdatedAt) moduleUpdatedAt.textContent = `Updated ${formatRelativeTime(module.updatedAt)}`;
  
  // Show action buttons
  if (moduleHistoryBtn) moduleHistoryBtn.style.display = '';
  if (moduleSettingsBtn) moduleSettingsBtn.style.display = '';
  if (deleteModuleBtn) deleteModuleBtn.style.display = '';
  
  // Show view tabs
  if (viewTabs) viewTabs.style.display = '';
  
  // Hide empty state, show content
  if (moduleEmptyState) moduleEmptyState.style.display = 'none';
  
  // Load current view
  switchBlueprintView(currentBlueprintView);
}

function showModuleEmptyState() {
  if (moduleEmptyState) moduleEmptyState.style.display = '';
  if (viewTabs) viewTabs.style.display = 'none';
  if (goalView) goalView.style.display = 'none';
  if (kanbanView) kanbanView.style.display = 'none';
  if (canvasView) canvasView.style.display = 'none';
  if (editorView) editorView.style.display = 'none';
  if (resourcesView) resourcesView.style.display = 'none';
  
  // Reset header
  if (moduleIcon) moduleIcon.textContent = '📦';
  if (moduleTitle) {
    moduleTitle.textContent = 'Select a Module';
    // Disable editing when no module is selected
    moduleTitle.contentEditable = 'false';
  }
  if (moduleUpdatedAt) moduleUpdatedAt.textContent = 'Create or select a module to get started';
  
  // Hide action buttons
  if (moduleHistoryBtn) moduleHistoryBtn.style.display = 'none';
  if (moduleSettingsBtn) moduleSettingsBtn.style.display = 'none';
  if (deleteModuleBtn) deleteModuleBtn.style.display = 'none';
}

async function switchBlueprintView(view) {
  if (!selectedModule) return;
  
  currentBlueprintView = view;
  
  // Update tab states
  document.querySelectorAll('.view-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === view);
  });
  
  // Hide all views
  if (goalView) goalView.style.display = 'none';
  if (kanbanView) kanbanView.style.display = 'none';
  if (canvasView) canvasView.style.display = 'none';
  if (editorView) editorView.style.display = 'none';
  if (resourcesView) resourcesView.style.display = 'none';
  
  // Show and load selected view
  switch (view) {
    case 'goal':
      if (goalView) goalView.style.display = '';
      await loadGoalContent();
      // Prefer Obsidian-style editable rendered output (ProseMirror).
      if (!ensureGoalMarkdownEngineMounted()) {
        // Legacy fallback: textarea overlay + rendered preview behind it.
        if (goalMonacoEditorEl) goalMonacoEditorEl.style.display = 'none';
        if (goalEditor) {
          goalEditor.style.display = '';
          goalEditor.style.position = 'absolute';
          goalEditor.style.inset = '0';
          goalEditor.style.color = 'transparent'; // Make text transparent but cursor visible
          goalEditor.style.zIndex = '2';
          goalEditor.style.caretColor = '#a78bfa';
          goalEditor.style.setProperty('caret-color', '#a78bfa', 'important');
          setTimeout(() => {
            if (goalEditor && document.activeElement !== goalEditor) goalEditor.focus();
          }, 100);
        }
        if (goalLiveEditor) {
          goalLiveEditor.style.display = '';
          goalLiveEditor.style.position = 'absolute';
          goalLiveEditor.style.inset = '0';
          goalLiveEditor.style.pointerEvents = 'none';
          goalLiveEditor.style.zIndex = '1';
        }
      }
      break;
    case 'kanban':
      if (kanbanView) kanbanView.style.display = '';
      await loadKanbanContent();
      break;
    case 'canvas':
      if (canvasView) canvasView.style.display = '';
      await loadCanvasContent();
      break;
    case 'editor':
      if (editorView) editorView.style.display = '';
      await ensureBlueprintCodeMonacoEditor();
      await loadEditorContent();
      try { blueprintCodeMonacoEditor?.layout(); } catch {}
      break;
    case 'resources':
      if (resourcesView) resourcesView.style.display = '';
      await loadResourcesContent();
      break;
  }
}

// =====================================================
// Goal/Description View
// =====================================================

// Render markdown inline in live editor (Obsidian-style)
function renderLivePreview() {
  if (!goalLiveEditor || !goalEditor) return;
  
  const markdown = goalMarkdownSource || '';
  const lines = markdown.split('\n');
  const rendered = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const originalLine = line;
    
    // Store original markdown in data attribute for editing
    const lineElement = document.createElement('div');
    lineElement.setAttribute('data-markdown', originalLine);
    lineElement.style.minHeight = '1.8em';
    lineElement.style.marginBottom = '0';
    lineElement.style.padding = '0';
    lineElement.style.margin = '0';
    lineElement.style.lineHeight = '1.8';
    lineElement.style.fontSize = '14px';
    lineElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    
    // Headers - adjust margins to match line height
    if (line.match(/^### (.*)$/)) {
      const text = line.replace(/^### /, '');
      lineElement.innerHTML = `<h3 style="margin: 0; padding: 0; font-size: 18px; font-weight: 600; color: #fafafa; cursor: text; line-height: 1.8;">${escapeHtml(text)}</h3>`;
      lineElement.classList.add('live-heading', 'live-h3');
    } else if (line.match(/^## (.*)$/)) {
      const text = line.replace(/^## /, '');
      lineElement.innerHTML = `<h2 style="margin: 0; padding: 0; font-size: 20px; font-weight: 600; color: #fafafa; cursor: text; line-height: 1.8;">${escapeHtml(text)}</h2>`;
      lineElement.classList.add('live-heading', 'live-h2');
    } else if (line.match(/^# (.*)$/)) {
      const text = line.replace(/^# /, '');
      lineElement.innerHTML = `<h1 style="margin: 0; padding: 0; font-size: 24px; font-weight: 700; color: #fafafa; cursor: text; line-height: 1.8;">${escapeHtml(text)}</h1>`;
      lineElement.classList.add('live-heading', 'live-h1');
    } else {
      // Regular line - process inline formatting
      let html = escapeHtml(line);
      
      // Bold
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #fafafa;">$1</strong>');
      html = html.replace(/__(.*?)__/g, '<strong style="font-weight: 600; color: #fafafa;">$1</strong>');
      
      // Italic
      html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');
      html = html.replace(/_(.*?)_/g, '<em style="font-style: italic;">$1</em>');
      
      // Inline code
      html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: \'JetBrains Mono\', monospace; font-size: 13px;">$1</code>');
      
      // Wiki links [[Module Name]]
      html = html.replace(/\[\[([^\]]+)\]\]/g, (match, moduleName) => {
        const module = blueprintData?.modules?.find(m => m.title === moduleName.trim());
        if (module) {
          return `<a href="#" class="wiki-link-live" data-module-id="${module.id}" style="color: #a78bfa; text-decoration: none; border-bottom: 1px solid rgba(167,139,250,0.3); cursor: pointer; background: ${module.color}20; padding: 2px 4px; border-radius: 3px;">${escapeHtml(moduleName)}</a>`;
        } else {
          return `<span class="wiki-link-broken" style="color: #f43f5e; text-decoration: line-through; opacity: 0.6;" title="Module not found">${escapeHtml(moduleName)}</span>`;
        }
      });
      
      // Regular markdown links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #a78bfa; text-decoration: none; border-bottom: 1px solid rgba(167,139,250,0.3);" target="_blank">$1</a>');
      
      // Lists
      if (line.match(/^[\-\+\*] /)) {
        const text = line.replace(/^[\-\+\*] /, '');
        lineElement.innerHTML = `<span style="margin-left: 24px; display: block; line-height: 1.8; margin: 0; padding: 0;">• ${html.replace(/^[\-\+\*] /, '')}</span>`;
        lineElement.classList.add('live-list-item');
      } else if (line.match(/^\d+\. /)) {
        const text = line.replace(/^\d+\. /, '');
        const num = line.match(/^(\d+)\./)[1];
        lineElement.innerHTML = `<span style="margin-left: 24px; display: block; line-height: 1.8; margin: 0; padding: 0;">${num}. ${html.replace(/^\d+\. /, '')}</span>`;
        lineElement.classList.add('live-list-item');
      } else {
        lineElement.innerHTML = html || '<span style="line-height: 1.8; display: block; margin: 0; padding: 0;">&nbsp;</span>';
      }
    }
    
    // Add click handler - in live mode, clicking focuses the textarea at that position
    lineElement.addEventListener('click', (e) => {
      if (e.target.closest('.wiki-link-live')) {
        // Don't edit if clicking on a wiki link
        const moduleId = e.target.closest('.wiki-link-live')?.dataset.moduleId;
        if (moduleId) {
          e.preventDefault();
          selectModule(moduleId);
          return;
        }
      }
      
      // Focus textarea and position cursor at the clicked line
      if (goalEditor) {
        const lines = goalMarkdownSource.split('\n');
        const lineIndex = rendered.indexOf(lineElement);
        if (lineIndex >= 0 && lineIndex < lines.length) {
          goalEditor.focus();
          // Calculate cursor position
          let cursorPos = 0;
          for (let i = 0; i < lineIndex; i++) {
            cursorPos += lines[i].length + 1; // +1 for newline
          }
          goalEditor.setSelectionRange(cursorPos, cursorPos);
        }
      }
    });
    
    rendered.push(lineElement);
  }
  
  // Update content
  goalLiveEditor.innerHTML = '';
  rendered.forEach(el => goalLiveEditor.appendChild(el));
}

// Edit a specific element (switch to markdown source)
function editLiveElement(element, markdownSource) {
  if (isEditingElement) return;
  isEditingElement = true;
  
  const input = document.createElement('input');
  input.type = 'text';
  input.value = markdownSource;
  input.style.width = '100%';
  input.style.padding = '4px 8px';
  input.style.background = 'rgba(139, 92, 246, 0.15)';
  input.style.border = '1px solid rgba(139, 92, 246, 0.3)';
  input.style.borderRadius = '4px';
  input.style.color = '#fafafa';
  input.style.fontFamily = "'JetBrains Mono', monospace";
  input.style.fontSize = '13px';
  
  const originalHTML = element.innerHTML;
  element.innerHTML = '';
  element.appendChild(input);
  input.focus();
  input.select();
  
  const finishEdit = () => {
    const newValue = input.value;
    const lines = goalMarkdownSource.split('\n');
    const lineIndex = lines.findIndex(l => l === markdownSource);
    if (lineIndex !== -1) {
      lines[lineIndex] = newValue;
      goalMarkdownSource = lines.join('\n');
    }
    
    renderLivePreview();
    isEditingElement = false;
    
    // Trigger save
    clearTimeout(goalSaveTimeout);
    if (goalSaveStatus) goalSaveStatus.textContent = 'Unsaved changes...';
    goalSaveTimeout = setTimeout(saveGoalContent, 1000);
  };
  
  input.addEventListener('blur', finishEdit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEdit();
    } else if (e.key === 'Escape') {
      renderLivePreview();
      isEditingElement = false;
    }
  });
}

// Initialize goal editor with live preview
function initGoalEditor() {
  if (!goalEditor || !goalLiveEditor) return;
  // If we have a rich editor, don't attach legacy overlay listeners/styles.
  if (goalMarkdownEngine && goalMarkdownEngine.isMounted?.()) return;
  
  // Ensure both have identical styling for perfect alignment
  const commonStyles = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    lineHeight: '1.8',
    padding: '20px',
    letterSpacing: '0',
    wordSpacing: '0'
  };
  
  Object.assign(goalEditor.style, commonStyles, {
    color: 'transparent',
    caretColor: '#a78bfa',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  });
  
  Object.assign(goalLiveEditor.style, commonStyles, {
    pointerEvents: 'none',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  });
  
  // Set up live preview rendering
  const syncScroll = () => {
    if (goalLiveEditor && goalEditor) {
      goalLiveEditor.scrollTop = goalEditor.scrollTop;
      goalLiveEditor.scrollLeft = goalEditor.scrollLeft;
    }
  };
  
  const updateRender = () => {
    goalMarkdownSource = goalEditor.value;
    renderLivePreview();
    // Sync scroll after render
    requestAnimationFrame(() => {
      syncScroll();
    });
    
    // Trigger save
    clearTimeout(goalSaveTimeout);
    if (goalSaveStatus) goalSaveStatus.textContent = 'Unsaved changes...';
    goalSaveTimeout = setTimeout(saveGoalContent, 1000);
  };
  
  // Remove old listeners if any
  goalEditor.removeEventListener('scroll', syncScroll);
  goalEditor.removeEventListener('input', updateRender);
  goalEditor.removeEventListener('keyup', syncScroll);
  
  // Add new listeners
  goalEditor.addEventListener('scroll', syncScroll, { passive: true });
  goalEditor.addEventListener('input', updateRender);
  goalEditor.addEventListener('keyup', syncScroll);
  
  // Initial render
  goalMarkdownSource = goalEditor.value;
  renderLivePreview();
  
  // Sync scroll on initial load
  setTimeout(() => {
    syncScroll();
  }, 50);
}

async function loadGoalContent() {
  if (!selectedModule || !blueprintProjectPath) return;
  
  try {
    const result = await window.electronAPI.getModuleGoal(blueprintProjectPath, selectedModule.id);
    if (result.success) {
      const content = result.goal || '';
      goalMarkdownSource = content;
      setBlueprintGoalValue(content);
      updateLinkedModules();
      if (!ensureGoalMarkdownEngineMounted()) initGoalEditor();
    }
  } catch (err) {
    console.error('Error loading goal:', err);
  }
}

async function saveGoalContent() {
  if (!selectedModule || !blueprintProjectPath) return;
  
  if (goalSaveStatus) goalSaveStatus.textContent = 'Saving...';
  
  try {
    const result = await window.electronAPI.saveModuleGoal(
      blueprintProjectPath, 
      selectedModule.id, 
      getBlueprintGoalValue()
    );
    
    if (result.success) {
      if (goalSaveStatus) goalSaveStatus.textContent = 'Saved';
      setTimeout(() => {
        if (goalSaveStatus) goalSaveStatus.textContent = 'Auto-saved';
      }, 2000);
      // Update linked modules after save
      updateLinkedModules();
    }
  } catch (err) {
    console.error('Error saving goal:', err);
    if (goalSaveStatus) goalSaveStatus.textContent = 'Error saving';
  }
}

// Parse wiki links from markdown content
function parseWikiLinks(content) {
  if (!content) return [];
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  return [...new Set(links)]; // Remove duplicates
}

// Find modules that link to the current module
function findLinkedByModules(currentModuleTitle) {
  if (!blueprintData || !blueprintData.modules || !currentModuleTitle) return [];
  
  const linkedBy = [];
  for (const module of blueprintData.modules) {
    if (module.id === selectedModule?.id) continue;
    
    // We need to check the goal content of each module
    // For now, we'll check this when loading - but we need async access
    // So we'll do this in updateLinkedModules which is async
  }
  return linkedBy;
}

// Update markdown preview with rendered content
function updateGoalPreview() {
  if (!goalPreview || !selectedModule) return;
  
  const content = getBlueprintGoalValue();
  if (!content) {
    goalPreview.innerHTML = '<div style="color: #52525b; font-style: italic;">Start typing to see preview...</div>';
    return;
  }
  
  // Simple markdown to HTML converter (basic implementation)
  let html = escapeHtml(content);
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 18px; font-weight: 600; color: #fafafa;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="margin-top: 32px; margin-bottom: 16px; font-size: 20px; font-weight: 600; color: #fafafa;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="margin-top: 32px; margin-bottom: 16px; font-size: 24px; font-weight: 700; color: #fafafa;">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #fafafa;">$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong style="font-weight: 600; color: #fafafa;">$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');
  html = html.replace(/_(.*?)_/g, '<em style="font-style: italic;">$1</em>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; overflow-x: auto; margin: 16px 0;"><code style="font-family: \'JetBrains Mono\', monospace; font-size: 13px;">$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: \'JetBrains Mono\', monospace; font-size: 13px;">$1</code>');
  
  // Links (regular markdown links)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #a78bfa; text-decoration: none; border-bottom: 1px solid rgba(167,139,250,0.3);" target="_blank">$1</a>');
  
  // Wiki links [[Module Name]]
  html = html.replace(/\[\[([^\]]+)\]\]/g, (match, moduleName) => {
    // Find module by name
    const module = blueprintData?.modules?.find(m => m.title === moduleName.trim());
    if (module) {
      return `<a href="#" class="wiki-link" data-module-id="${module.id}" style="color: #a78bfa; text-decoration: none; border-bottom: 1px solid rgba(167,139,250,0.3); cursor: pointer; background: ${module.color}20; padding: 2px 4px; border-radius: 3px;">${escapeHtml(moduleName)}</a>`;
    } else {
      // Broken link (module not found)
      return `<span class="wiki-link-broken" style="color: #f43f5e; text-decoration: line-through; opacity: 0.6;" title="Module not found">${escapeHtml(moduleName)}</span>`;
    }
  });
  
  // Lists - process line by line to handle properly
  const lines = html.split('\n');
  let inList = false;
  let listType = null;
  let listItems = [];
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unorderedMatch = line.match(/^[\-\+\*] (.*)$/);
    const orderedMatch = line.match(/^\d+\. (.*)$/);
    
    if (unorderedMatch) {
      if (!inList || listType !== 'ul') {
        if (inList && listItems.length > 0) {
          processedLines.push(`<${listType} style="margin: 12px 0; padding-left: 24px;">${listItems.join('')}</${listType}>`);
          listItems = [];
        }
        inList = true;
        listType = 'ul';
      }
      listItems.push(`<li style="margin: 4px 0; padding-left: 8px;">${unorderedMatch[1]}</li>`);
    } else if (orderedMatch) {
      if (!inList || listType !== 'ol') {
        if (inList && listItems.length > 0) {
          processedLines.push(`<${listType} style="margin: 12px 0; padding-left: 24px;">${listItems.join('')}</${listType}>`);
          listItems = [];
        }
        inList = true;
        listType = 'ol';
      }
      listItems.push(`<li style="margin: 4px 0; padding-left: 8px;">${orderedMatch[1]}</li>`);
    } else {
      if (inList && listItems.length > 0) {
        processedLines.push(`<${listType} style="margin: 12px 0; padding-left: 24px;">${listItems.join('')}</${listType}>`);
        listItems = [];
        inList = false;
        listType = null;
      }
      processedLines.push(line);
    }
  }
  
  // Close any remaining list
  if (inList && listItems.length > 0) {
    processedLines.push(`<${listType} style="margin: 12px 0; padding-left: 24px;">${listItems.join('')}</${listType}>`);
  }
  
  html = processedLines.join('\n');
  
  // Paragraphs (wrap consecutive lines that aren't already wrapped)
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    // Don't wrap if already a tag or empty
    if (trimmed.match(/^<[h|u|o|l|p|d|s|b|e|i|a|c]/) || trimmed.match(/^<\/[h|u|o|l|p|d|s|b|e|i|a|c]/)) {
      return line;
    }
    return '<p style="margin: 12px 0;">' + line + '</p>';
  }).join('\n');
  
  // Clean up empty paragraphs and multiple newlines
  html = html.replace(/<p style="margin: 12px 0;"><\/p>/g, '');
  html = html.replace(/\n{3,}/g, '\n\n');
  
  goalPreview.innerHTML = html;
  
  // Add click handlers for wiki links
  goalPreview.querySelectorAll('.wiki-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const moduleId = link.dataset.moduleId;
      if (moduleId) {
        selectModule(moduleId);
      }
    });
  });
  
  // Update view based on current mode
  updateGoalViewMode();
}

// Update linked modules section (bidirectional links)
async function updateLinkedModules() {
  if (!goalLinkedSection || !goalLinkedModules || !goalLinkedByModules || !selectedModule || !blueprintData) return;
  
  const content = getBlueprintGoalValue();
  const linkedModuleNames = parseWikiLinks(content);
  
  // Find linked modules
  const linkedModules = [];
  for (const moduleName of linkedModuleNames) {
    const module = blueprintData.modules.find(m => m.title === moduleName);
    if (module) {
      linkedModules.push(module);
    }
  }
  
  // Render linked modules
  if (linkedModules.length > 0) {
    goalLinkedModules.innerHTML = linkedModules.map(m => `
      <a href="#" class="wiki-link-badge" data-module-id="${m.id}" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: ${m.color}20; color: ${m.color}; border: 1px solid ${m.color}40; border-radius: 4px; font-size: 11px; text-decoration: none; cursor: pointer;">
        <span>${m.icon}</span>
        <span>${escapeHtml(m.title)}</span>
      </a>
    `).join('');
    
    // Add click handlers
    goalLinkedModules.querySelectorAll('.wiki-link-badge').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const moduleId = link.dataset.moduleId;
        if (moduleId) {
          selectModule(moduleId);
        }
      });
    });
  } else {
    goalLinkedModules.innerHTML = '<span style="color: #52525b; font-size: 11px; font-style: italic;">No links</span>';
  }
  
  // Find modules that link to this module (linked by) - optimized with Promise.all
  const linkedByModules = [];
  const checkPromises = blueprintData.modules
    .filter(m => m.id !== selectedModule.id)
    .map(async (module) => {
      try {
        const result = await window.electronAPI.getModuleGoal(blueprintProjectPath, module.id);
        if (result.success && result.goal) {
          const moduleLinks = parseWikiLinks(result.goal);
          if (moduleLinks.includes(selectedModule.title)) {
            return module;
          }
        }
      } catch (err) {
        // Skip if error loading module goal
      }
      return null;
    });
  
  const results = await Promise.all(checkPromises);
  results.forEach(module => {
    if (module) linkedByModules.push(module);
  });
  
  // Render linked by modules
  if (linkedByModules.length > 0) {
    goalLinkedByModules.innerHTML = linkedByModules.map(m => `
      <a href="#" class="wiki-link-badge" data-module-id="${m.id}" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: ${m.color}20; color: ${m.color}; border: 1px solid ${m.color}40; border-radius: 4px; font-size: 11px; text-decoration: none; cursor: pointer;">
        <span>${m.icon}</span>
        <span>${escapeHtml(m.title)}</span>
      </a>
    `).join('');
    
    // Add click handlers
    goalLinkedByModules.querySelectorAll('.wiki-link-badge').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const moduleId = link.dataset.moduleId;
        if (moduleId) {
          selectModule(moduleId);
        }
      });
    });
  } else {
    goalLinkedByModules.innerHTML = '<span style="color: #52525b; font-size: 11px; font-style: italic;">No backlinks</span>';
  }
  
  // Show linked section if there are any links
  if (linkedModules.length > 0 || linkedByModules.length > 0) {
    goalLinkedSection.style.display = '';
  } else {
    goalLinkedSection.style.display = 'none';
  }
}

// =====================================================
// Editor View (Code Scratchpad)
// =====================================================

async function loadEditorContent() {
  if (!selectedModule || !blueprintProjectPath) return;

  try {
    const result = await window.electronAPI.getModuleEditor(blueprintProjectPath, selectedModule.id);
    if (result.success) setBlueprintEditorValue(result.content || '');
  } catch (err) {
    console.error('Error loading editor:', err);
  }
}

async function saveEditorContent() {
  if (!selectedModule || !blueprintProjectPath) return;

  if (editorSaveStatus) editorSaveStatus.textContent = 'Saving...';

  try {
    const result = await window.electronAPI.saveModuleEditor(
      blueprintProjectPath,
      selectedModule.id,
      getBlueprintEditorValue()
    );

    if (result.success) {
      if (editorSaveStatus) editorSaveStatus.textContent = 'Saved';
      setTimeout(() => {
        if (editorSaveStatus) editorSaveStatus.textContent = 'Auto-saved';
      }, 1500);
    } else {
      if (editorSaveStatus) editorSaveStatus.textContent = 'Error saving';
    }
  } catch (err) {
    console.error('Error saving editor:', err);
    if (editorSaveStatus) editorSaveStatus.textContent = 'Error saving';
  }
}

async function runEditorCode() {
  const code = getBlueprintEditorValue();
  if (!code || !code.trim()) return;

  appendEditorOutputLine('> Running...');

  try {
    const result = await window.electronAPI.executeJS(code);
    if (!result.success) {
      appendEditorOutputLine(`Error: ${result.error || 'Unknown error'}`);
      return;
    }

    if (Array.isArray(result.logs)) {
      for (const l of result.logs) {
        const prefix = l?.type ? `[${l.type}] ` : '';
        appendEditorOutputLine(prefix + (l?.message ?? ''));
      }
    }

    if (result.result !== undefined) {
      appendEditorOutputLine(`Result: ${result.result}`);
    }
  } catch (err) {
    appendEditorOutputLine(`Error: ${err?.message || err}`);
  }
}

// =====================================================
// Kanban View
// =====================================================

async function loadKanbanContent() {
  if (!selectedModule || !blueprintProjectPath || !kanbanBoard) return;
  
  try {
    const result = await window.electronAPI.getModuleTasks(blueprintProjectPath, selectedModule.id);
    if (result.success) {
      renderKanbanBoard(result.tasks);
    }
  } catch (err) {
    console.error('Error loading tasks:', err);
  }
}

function renderKanbanBoard(tasksData) {
  if (!kanbanBoard) return;
  
  const columns = tasksData?.columns || [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ];
  
  kanbanBoard.innerHTML = columns.map(column => `
    <div class="kanban-column" data-column-id="${column.id}">
      <div class="kanban-column-header">
        <span class="kanban-column-title">${escapeHtml(column.title)}</span>
        <span class="kanban-column-count">${column.tasks.length}</span>
      </div>
      <div class="kanban-column-body" data-column-id="${column.id}">
        ${column.tasks.map(task => renderKanbanTask(task)).join('')}
      </div>
    </div>
  `).join('');
  
  // Add event listeners for column drop zones
  kanbanBoard.querySelectorAll('.kanban-column-body').forEach(columnBody => {
    const columnId = columnBody.dataset.columnId;
    
    columnBody.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.currentTarget.classList.add('drag-over');
    });
    
    columnBody.addEventListener('dragleave', (e) => {
      e.currentTarget.classList.remove('drag-over');
    });
    
    columnBody.addEventListener('drop', async (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');
      
      if (!draggedTask || !selectedModule || !blueprintProjectPath) return;
      
      try {
        // Find the drop position
        const tasks = columnBody.querySelectorAll('.kanban-task');
        let dropIndex = tasks.length;
        
        for (let i = 0; i < tasks.length; i++) {
          const rect = tasks[i].getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            dropIndex = i;
            break;
          }
        }
        
        const result = await window.electronAPI.moveTask(
          blueprintProjectPath,
          selectedModule.id,
          draggedTask,
          columnId,
          dropIndex
        );
        
        if (result.success) {
          await loadKanbanContent();
        }
      } catch (err) {
        console.error('Error moving task:', err);
      }
      
      draggedTask = null;
    });
  });
  
  // Add event listeners for tasks
  kanbanBoard.querySelectorAll('.kanban-task').forEach(taskEl => {
    const taskId = taskEl.dataset.taskId;
    
    taskEl.addEventListener('dragstart', (e) => {
      draggedTask = taskId;
      e.target.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    
    taskEl.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging');
      draggedTask = null;
    });
    
    // Edit button
    const editBtn = taskEl.querySelector('.task-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editTask(taskId);
      });
    }
    
    // Delete button
    const deleteBtn = taskEl.querySelector('.task-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTaskItem(taskId);
      });
    }
  });
}

function renderKanbanTask(task) {
  return `
    <div class="kanban-task" 
         data-task-id="${task.id}"
         draggable="true">
      <div class="kanban-task-title">${escapeHtml(task.title)}</div>
      ${task.description ? `<div class="kanban-task-desc">${escapeHtml(task.description)}</div>` : ''}
      <div class="kanban-task-meta">
        <span class="kanban-task-priority ${task.priority}">${task.priority}</span>
        <div class="kanban-task-actions">
          <button class="action-btn task-edit-btn" title="Edit" style="width: 22px; height: 22px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button class="action-btn task-delete-btn" title="Delete" style="width: 22px; height: 22px; color: #f43f5e;">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Task Drag & Drop
function onTaskDragStart(event, taskId) {
  draggedTask = taskId;
  event.target.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
}

function onTaskDragEnd(event) {
  event.target.classList.remove('dragging');
  draggedTask = null;
}

function onTaskDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function onTaskDragLeave(event) {
  event.currentTarget.classList.remove('drag-over');
}

async function onTaskDrop(event, columnId) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  
  if (!draggedTask || !selectedModule || !blueprintProjectPath) return;
  
  try {
    // Find the drop position
    const columnBody = event.currentTarget;
    const tasks = columnBody.querySelectorAll('.kanban-task');
    let dropIndex = tasks.length;
    
    for (let i = 0; i < tasks.length; i++) {
      const rect = tasks[i].getBoundingClientRect();
      if (event.clientY < rect.top + rect.height / 2) {
        dropIndex = i;
        break;
      }
    }
    
    const result = await window.electronAPI.moveTask(
      blueprintProjectPath,
      selectedModule.id,
      draggedTask,
      columnId,
      dropIndex
    );
    
    if (result.success) {
      await loadKanbanContent();
    }
  } catch (err) {
    console.error('Error moving task:', err);
  }
  
  draggedTask = null;
}

async function deleteTaskItem(taskId) {
  if (!selectedModule || !blueprintProjectPath) return;
  
  try {
    const result = await window.electronAPI.deleteTask(blueprintProjectPath, selectedModule.id, taskId);
    if (result.success) {
      await loadKanbanContent();
      showNotification('Task deleted', 'info');
    }
  } catch (err) {
    console.error('Error deleting task:', err);
  }
}

function editTask(taskId) {
  // For now, show a simple prompt to edit the task title
  // TODO: Create a proper edit modal in the future
  if (!selectedModule || !blueprintProjectPath) return;
  
  const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!taskCard) return;
  
  const titleEl = taskCard.querySelector('.kanban-task-title');
  const currentTitle = titleEl?.textContent || '';
  
  const newTitle = prompt('Edit task title:', currentTitle);
  if (newTitle && newTitle.trim() && newTitle !== currentTitle) {
    updateTaskTitle(taskId, newTitle.trim());
  }
}

async function updateTaskTitle(taskId, newTitle) {
  try {
    const result = await window.electronAPI.updateTask(
      blueprintProjectPath,
      selectedModule.id,
      taskId,
      { title: newTitle }
    );
    
    if (result.success) {
      await loadKanbanContent();
      showNotification('Task updated', 'success');
    }
  } catch (err) {
    console.error('Error updating task:', err);
  }
}

// =====================================================
// Canvas View (Excalidraw)
// =====================================================

let excalidrawInstance = null;

// Excalidraw iframe state
let excalidrawFrame = null;
let excalidrawReady = false;
let pendingCanvasData = null;

async function loadCanvasContent() {
  if (!selectedModule || !blueprintProjectPath) return;
  
  excalidrawFrame = document.getElementById('excalidrawFrame');
  const loadingOverlay = document.getElementById('canvasLoadingOverlay');
  
  // Show loading overlay
  if (loadingOverlay) loadingOverlay.style.display = 'flex';
  
  try {
    const result = await window.electronAPI.getModuleCanvas(blueprintProjectPath, selectedModule.id);
    pendingCanvasData = result.success ? result.canvas : null;
    
    // If frame is already ready, send data immediately
    if (excalidrawReady && excalidrawFrame && excalidrawFrame.contentWindow) {
      sendCanvasData(pendingCanvasData);
    } else {
      // Frame not ready - reload it to get fresh state
      if (excalidrawFrame) {
        excalidrawReady = false;
        excalidrawFrame.src = excalidrawFrame.src;
      }
    }
    // Otherwise, data will be sent when frame signals ready
    
  } catch (err) {
    console.error('Error loading canvas:', err);
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }
}

function sendCanvasData(canvasData) {
  if (!excalidrawFrame || !excalidrawFrame.contentWindow) return;
  
  excalidrawFrame.contentWindow.postMessage({
    type: 'load',
    data: canvasData || { elements: [], appState: {} }
  }, '*');
  
  // Hide loading overlay
  const loadingOverlay = document.getElementById('canvasLoadingOverlay');
  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  }
}

// Listen for messages from Excalidraw iframe
window.addEventListener('message', async (event) => {
  const { type, data, format } = event.data || {};
  
  if (type === 'ready') {
    // Excalidraw iframe is ready
    excalidrawReady = true;
    if (pendingCanvasData !== null) {
      sendCanvasData(pendingCanvasData);
      pendingCanvasData = null;
    }
  } else if (type === 'save') {
    // Auto-save canvas data
    if (selectedModule && blueprintProjectPath && data) {
      try {
        await window.electronAPI.saveModuleCanvas(blueprintProjectPath, selectedModule.id, data);
        updateCanvasSaveStatus('Saved');
      } catch (err) {
        console.error('Error saving canvas:', err);
        updateCanvasSaveStatus('Error');
      }
    }
  } else if (type === 'exported') {
    // Handle exported image
    handleCanvasExport(format, data);
  }
});

function updateCanvasSaveStatus(status) {
  const statusEl = document.getElementById('canvasSaveStatus');
  if (!statusEl) return;
  
  if (status === 'Saved') {
    statusEl.innerHTML = `
      <span style="display: inline-block; width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 4px;"></span>
      Saved
    `;
    setTimeout(() => {
      statusEl.innerHTML = `
        <span style="display: inline-block; width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 4px;"></span>
        Auto-saved
      `;
    }, 2000);
  } else if (status === 'Error') {
    statusEl.innerHTML = `
      <span style="display: inline-block; width: 6px; height: 6px; background: #f43f5e; border-radius: 50%; margin-right: 4px;"></span>
      Error saving
    `;
  }
}

function handleCanvasExport(format, data) {
  if (!data) return;
  
  const projectName = blueprintProjectPath ? path.basename(blueprintProjectPath) : 'canvas';
  const moduleName = selectedModule ? selectedModule.title.replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'module';
  const filename = `${projectName}-${moduleName}-canvas.${format}`;
  
  if (format === 'png') {
    // Download PNG
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Exported as ${filename}`, 'success');
  } else if (format === 'svg') {
    // Download SVG
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Exported as ${filename}`, 'success');
  }
}

function exportCanvasAsPng() {
  if (excalidrawFrame && excalidrawFrame.contentWindow) {
    excalidrawFrame.contentWindow.postMessage({ type: 'export-png' }, '*');
  }
}

function exportCanvasAsSvg() {
  if (excalidrawFrame && excalidrawFrame.contentWindow) {
    excalidrawFrame.contentWindow.postMessage({ type: 'export-svg' }, '*');
  }
}

function clearCanvas() {
  if (!confirm('Clear the entire canvas? This cannot be undone.')) return;
  
  if (excalidrawFrame && excalidrawFrame.contentWindow) {
    excalidrawFrame.contentWindow.postMessage({ type: 'clear' }, '*');
    showNotification('Canvas cleared', 'info');
  }
}

let isCanvasFullscreen = false;

function toggleCanvasFullscreen() {
  const canvasViewEl = document.getElementById('canvasView');
  const blueprintModal = document.getElementById('blueprintModal');
  if (!canvasViewEl) return;
  
  isCanvasFullscreen = !isCanvasFullscreen;
  
  if (isCanvasFullscreen) {
    // Enter fullscreen mode
    canvasViewEl.style.position = 'fixed';
    canvasViewEl.style.top = '0';
    canvasViewEl.style.left = '0';
    canvasViewEl.style.right = '0';
    canvasViewEl.style.bottom = '0';
    canvasViewEl.style.width = '100vw';
    canvasViewEl.style.height = '100vh';
    canvasViewEl.style.zIndex = '9999';
    canvasViewEl.style.borderRadius = '0';
    document.body.style.overflow = 'hidden';
    // Ensure blueprint modal stays visible
    if (blueprintModal) {
      blueprintModal.style.zIndex = '10000';
    }
    showNotification('Press Esc to exit fullscreen', 'info');
  } else {
    // Exit fullscreen mode - restore to original container
    canvasViewEl.style.position = '';
    canvasViewEl.style.top = '';
    canvasViewEl.style.left = '';
    canvasViewEl.style.right = '';
    canvasViewEl.style.bottom = '';
    canvasViewEl.style.width = '';
    canvasViewEl.style.height = '';
    canvasViewEl.style.zIndex = '';
    canvasViewEl.style.borderRadius = '';
    document.body.style.overflow = '';
    // Restore blueprint modal z-index
    if (blueprintModal) {
      blueprintModal.style.zIndex = '200';
    }
    
    // Force layout recalculation to prevent UI collapse
    setTimeout(() => {
      if (canvasViewEl) {
        canvasViewEl.style.display = 'none';
        canvasViewEl.offsetHeight; // Force reflow
        canvasViewEl.style.display = '';
      }
      // Reinitialize canvas if needed
      if (currentBlueprintView === 'canvas') {
        loadCanvasContent();
      }
    }, 50);
  }
}

// Add Esc key handler for fullscreen
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isCanvasFullscreen) {
    toggleCanvasFullscreen();
  }
});

function exportCanvas(format) {
  if (format === 'png') {
    exportCanvasAsPng();
  } else if (format === 'svg') {
    exportCanvasAsSvg();
  }
}

async function saveCanvasNotes() {
  // Legacy function - kept for compatibility
  if (!selectedModule || !blueprintProjectPath) return;
  
  try {
    await window.electronAPI.saveModuleCanvas(blueprintProjectPath, selectedModule.id, {
      notes: notesEl.value,
      elements: [],
      appState: {}
    });
    if (canvasSaveStatus) canvasSaveStatus.textContent = 'Saved';
  } catch (err) {
    console.error('Error saving canvas:', err);
  }
}

// =====================================================
// Resources View
// =====================================================

async function loadResourcesContent() {
  if (!selectedModule || !blueprintProjectPath || !resourcesList) return;
  
  try {
    const result = await window.electronAPI.getModuleResources(blueprintProjectPath, selectedModule.id);
    if (result.success) {
      renderResources(result.resources);
    }
  } catch (err) {
    console.error('Error loading resources:', err);
  }
}

function renderResources(resourcesData) {
  if (!resourcesList) return;
  
  const links = resourcesData?.links || [];
  const files = resourcesData?.files || [];
  
  if (links.length === 0 && files.length === 0) {
    resourcesList.innerHTML = `
      <div class="resources-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        <h4 style="font-size: 14px; font-weight: 600; color: #a1a1aa; margin-bottom: 4px;">No resources yet</h4>
        <p style="font-size: 12px;">Add links to docs, Figma designs, or deep link to local files</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  
  // Links section
  if (links.length > 0) {
    html += `<div style="margin-bottom: 16px;">
      <h4 style="font-size: 11px; font-weight: 600; color: #52525b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">External Links</h4>
    `;
    links.forEach(link => {
      const iconClass = link.type === 'figma' ? 'figma' : link.type === 'api' ? 'api' : 'link';
      html += `
        <div class="resource-item link-item" data-resource-id="${link.id}" data-url="${escapeHtml(link.url)}" data-type="link">
          <div class="resource-icon ${iconClass}">
            ${getResourceIcon(link.type)}
          </div>
          <div class="resource-info">
            <div class="resource-title">${escapeHtml(link.title || 'Untitled')}</div>
            <div class="resource-url">${escapeHtml(link.url)}</div>
          </div>
          <div class="resource-actions">
            <button class="action-btn resource-open-btn" title="Open" style="width: 24px; height: 24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            </button>
            <button class="action-btn resource-remove-btn" title="Remove" style="width: 24px; height: 24px; color: #f43f5e;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
            </button>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  // Files section
  if (files.length > 0) {
    html += `<div>
      <h4 style="font-size: 11px; font-weight: 600; color: #52525b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Project Files</h4>
    `;
    files.forEach(file => {
      html += `
        <div class="resource-item file-link-item" data-resource-id="${file.id}" data-path="${escapeHtml(file.path)}" data-type="file">
          <div class="resource-icon file">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="resource-info">
            <div class="resource-title">${escapeHtml(file.name)}</div>
            <div class="resource-url">${escapeHtml(file.path)}</div>
          </div>
          <div class="resource-actions">
            <button class="action-btn resource-remove-btn" title="Remove" style="width: 24px; height: 24px; color: #f43f5e;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
            </button>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  resourcesList.innerHTML = html;
  
  // Add event listeners for resource items
  resourcesList.querySelectorAll('.resource-item').forEach(item => {
    const resourceId = item.dataset.resourceId;
    const resourceType = item.dataset.type;
    const url = item.dataset.url;
    const filePath = item.dataset.path;
    
    // Open button for links
    const openBtn = item.querySelector('.resource-open-btn');
    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (url) openExternalLink(url);
      });
    }
    
    // Remove button
    const removeBtn = item.querySelector('.resource-remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeResourceItem(resourceId, resourceType);
      });
    }
    
    // Click on file item opens in IDE
    if (resourceType === 'file' && filePath) {
      item.addEventListener('click', () => {
        openFileInIDE(filePath);
      });
    }
  });
}

function getResourceIcon(type) {
  switch (type) {
    case 'figma':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>';
    case 'api':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 11 2-2-2-2"/><path d="M11 13h4"/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>';
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  }
}

function openExternalLink(url) {
  window.open(url, '_blank');
}

async function openFileInIDE(filePath) {
  if (!blueprintProjectPath) return;
  
  try {
    const ide = defaultIDE || 'code';
    await window.electronAPI.openFileInIDE(blueprintProjectPath, filePath, ide);
    showNotification('Opening in editor...', 'info');
  } catch (err) {
    console.error('Error opening file:', err);
    showNotification('Failed to open file', 'error');
  }
}

async function removeResourceItem(resourceId, type) {
  if (!selectedModule || !blueprintProjectPath) return;
  
  try {
    const result = await window.electronAPI.removeModuleResource(
      blueprintProjectPath, 
      selectedModule.id, 
      resourceId, 
      type
    );
    
    if (result.success) {
      await loadResourcesContent();
      showNotification('Resource removed', 'info');
    }
  } catch (err) {
    console.error('Error removing resource:', err);
  }
}

// =====================================================
// Module CRUD
// =====================================================

function showAddModuleModal() {
  if (!addModuleModal) return;
  
  // Reset form
  if (newModuleTitle) newModuleTitle.value = '';
  if (newModuleDesc) newModuleDesc.value = '';
  selectedModuleIcon = '📦';
  selectedModuleColor = '#8b5cf6';
  
  // Reset icon/color selections
  document.querySelectorAll('.module-icon-btn').forEach(btn => {
    btn.style.borderColor = btn.dataset.icon === '📦' ? 'rgba(139, 92, 246, 0.5)' : 'transparent';
  });
  document.querySelectorAll('.module-color-btn').forEach(btn => {
    btn.style.borderColor = btn.dataset.color === '#8b5cf6' ? 'white' : 'transparent';
  });
  
  addModuleModal.classList.remove('hidden');
  if (newModuleTitle) newModuleTitle.focus();
}

function hideAddModuleModal() {
  if (addModuleModal) addModuleModal.classList.add('hidden');
}

async function createModule() {
  if (!blueprintProjectPath || !newModuleTitle) return;
  
  const title = newModuleTitle.value.trim();
  if (!title) {
    showNotification('Please enter a module title', 'error');
    return;
  }
  
  try {
    const result = await window.electronAPI.createModule(blueprintProjectPath, {
      title,
      description: newModuleDesc?.value.trim() || '',
      icon: selectedModuleIcon,
      color: selectedModuleColor
    });
    
    if (result.success) {
      // Reload blueprints
      const loadResult = await window.electronAPI.loadBlueprints(blueprintProjectPath);
      if (loadResult.success) {
        blueprintData = loadResult.blueprints;
        renderModuleList();
        
        // Select the new module
        selectModule(result.module.id);
      }
      
      hideAddModuleModal();
      showNotification(`Module "${title}" created`, 'success');
    } else {
      showNotification(result.error || 'Failed to create module', 'error');
    }
  } catch (err) {
    console.error('Error creating module:', err);
    showNotification('Failed to create module', 'error');
  }
}

async function saveModuleTitle() {
  if (!selectedModule || !blueprintProjectPath || !moduleTitle) return;
  
  const newTitle = moduleTitle.textContent.trim();
  if (!newTitle) {
    // Restore original title if empty
    moduleTitle.textContent = selectedModule.title;
    return;
  }
  
  // Don't save if title hasn't changed
  if (newTitle === selectedModule.title) return;
  
  try {
    const result = await window.electronAPI.updateModule(blueprintProjectPath, selectedModule.id, {
      title: newTitle
    });
    
    if (result.success) {
      // Update local data
      selectedModule.title = newTitle;
      const moduleIndex = blueprintData.modules.findIndex(m => m.id === selectedModule.id);
      if (moduleIndex !== -1) {
        blueprintData.modules[moduleIndex].title = newTitle;
        blueprintData.modules[moduleIndex].updatedAt = result.module.updatedAt;
      }
      
      // Update selectedModule reference
      selectedModule = blueprintData.modules.find(m => m.id === selectedModule.id);
      
      // Update updatedAt display
      if (moduleUpdatedAt && selectedModule) {
        moduleUpdatedAt.textContent = `Updated ${formatRelativeTime(selectedModule.updatedAt)}`;
      }
      
      // Update sidebar
      renderModuleList();
      
      showNotification('Module title updated', 'success');
    } else {
      // Restore original title on error
      moduleTitle.textContent = selectedModule.title;
      showNotification(result.error || 'Failed to update module title', 'error');
    }
  } catch (err) {
    console.error('Error updating module title:', err);
    // Restore original title on error
    moduleTitle.textContent = selectedModule.title;
    showNotification('Failed to update module title', 'error');
  }
}

async function deleteCurrentModule() {
  if (!selectedModule || !blueprintProjectPath) return;
  
  if (!confirm(`Delete module "${selectedModule.title}"? This cannot be undone.`)) return;
  
  try {
    const result = await window.electronAPI.deleteModule(blueprintProjectPath, selectedModule.id);
    
    if (result.success) {
      // Reload blueprints
      const loadResult = await window.electronAPI.loadBlueprints(blueprintProjectPath);
      if (loadResult.success) {
        blueprintData = loadResult.blueprints;
        renderModuleList();
      }
      
      selectedModule = null;
      showModuleEmptyState();
      showNotification('Module deleted', 'info');
    }
  } catch (err) {
    console.error('Error deleting module:', err);
    showNotification('Failed to delete module', 'error');
  }
}

// Module Drag & Drop (reordering)
function onModuleDragStart(event, moduleId) {
  draggedModule = moduleId;
  event.target.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
}

function onModuleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function onModuleDragLeave(event) {
  event.currentTarget.classList.remove('drag-over');
}

async function onModuleDrop(event, targetModuleId) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  
  if (!draggedModule || draggedModule === targetModuleId || !blueprintProjectPath) return;
  
  try {
    // Get current order
    const moduleIds = blueprintData.modules.map(m => m.id);
    const fromIndex = moduleIds.indexOf(draggedModule);
    const toIndex = moduleIds.indexOf(targetModuleId);
    
    // Reorder
    moduleIds.splice(fromIndex, 1);
    moduleIds.splice(toIndex, 0, draggedModule);
    
    const result = await window.electronAPI.reorderModules(blueprintProjectPath, moduleIds);
    
    if (result.success) {
      // Reload blueprints
      const loadResult = await window.electronAPI.loadBlueprints(blueprintProjectPath);
      if (loadResult.success) {
        blueprintData = loadResult.blueprints;
        renderModuleList();
      }
    }
  } catch (err) {
    console.error('Error reordering modules:', err);
  }
  
  draggedModule = null;
}

// =====================================================
// Task Modal
// =====================================================

function showAddTaskModal() {
  if (!addTaskModal) return;
  
  // Reset form
  if (newTaskTitle) newTaskTitle.value = '';
  if (newTaskDesc) newTaskDesc.value = '';
  if (newTaskPriority) newTaskPriority.value = 'medium';
  if (newTaskColumn) newTaskColumn.value = 'todo';
  
  addTaskModal.classList.remove('hidden');
  if (newTaskTitle) newTaskTitle.focus();
}

function hideAddTaskModal() {
  if (addTaskModal) addTaskModal.classList.add('hidden');
}

async function addNewTask() {
  if (!selectedModule || !blueprintProjectPath || !newTaskTitle) return;
  
  const title = newTaskTitle.value.trim();
  if (!title) {
    showNotification('Please enter a task title', 'error');
    return;
  }
  
  try {
    const result = await window.electronAPI.addTask(
      blueprintProjectPath,
      selectedModule.id,
      newTaskColumn?.value || 'todo',
      {
        title,
        description: newTaskDesc?.value.trim() || '',
        priority: newTaskPriority?.value || 'medium'
      }
    );
    
    if (result.success) {
      await loadKanbanContent();
      hideAddTaskModal();
      showNotification('Task added', 'success');
    }
  } catch (err) {
    console.error('Error adding task:', err);
    showNotification('Failed to add task', 'error');
  }
}

// =====================================================
// Link Modal
// =====================================================

function showAddLinkModal() {
  if (!addLinkModal) return;
  
  // Reset form
  if (newLinkUrl) newLinkUrl.value = '';
  if (newLinkTitle) newLinkTitle.value = '';
  if (newLinkType) newLinkType.value = 'external';
  
  addLinkModal.classList.remove('hidden');
  if (newLinkUrl) newLinkUrl.focus();
}

function hideAddLinkModal() {
  if (addLinkModal) addLinkModal.classList.add('hidden');
}

async function addNewLink() {
  if (!selectedModule || !blueprintProjectPath || !newLinkUrl) return;
  
  const url = newLinkUrl.value.trim();
  if (!url) {
    showNotification('Please enter a URL', 'error');
    return;
  }
  
  try {
    const result = await window.electronAPI.addModuleLink(
      blueprintProjectPath,
      selectedModule.id,
      {
        url,
        title: newLinkTitle?.value.trim() || '',
        type: newLinkType?.value || 'external'
      }
    );
    
    if (result.success) {
      await loadResourcesContent();
      hideAddLinkModal();
      showNotification('Link added', 'success');
    }
  } catch (err) {
    console.error('Error adding link:', err);
    showNotification('Failed to add link', 'error');
  }
}

async function browseAndAddFile() {
  if (!selectedModule || !blueprintProjectPath) return;
  
  try {
    const result = await window.electronAPI.browseForFile(blueprintProjectPath);
    
    if (result.success && !result.canceled) {
      const addResult = await window.electronAPI.addModuleFile(
        blueprintProjectPath,
        selectedModule.id,
        {
          path: result.relativePath || result.path,
          name: result.name
        }
      );
      
      if (addResult.success) {
        await loadResourcesContent();
        showNotification('File linked', 'success');
      }
    }
  } catch (err) {
    console.error('Error adding file:', err);
    showNotification('Failed to link file', 'error');
  }
}

// =====================================================
// Search
// =====================================================

async function searchInModules(query) {
  if (!blueprintProjectPath || !query.trim()) {
    if (moduleSearchResults) {
      moduleSearchResults.innerHTML = '<p style="padding: 16px; color: #52525b; font-size: 13px; text-align: center;">Start typing to search...</p>';
    }
    return;
  }
  
  try {
    const result = await window.electronAPI.searchModules(blueprintProjectPath, query);
    
    if (!result.success || result.results.length === 0) {
      if (moduleSearchResults) {
        moduleSearchResults.innerHTML = '<p style="padding: 16px; color: #52525b; font-size: 13px; text-align: center;">No results found</p>';
      }
      return;
    }
    
    renderSearchResults(result.results);
    
  } catch (err) {
    console.error('Error searching modules:', err);
  }
}

function renderSearchResults(results) {
  if (!moduleSearchResults) return;
  
  moduleSearchResults.innerHTML = results.map(result => `
    <div class="search-result-item" onclick="jumpToSearchResult('${result.module.id}')">
      <div class="search-result-module">
        <span>${result.module.icon}</span>
        <span>${escapeHtml(result.module.title)}</span>
      </div>
      <div class="search-result-matches">
        ${result.matches.slice(0, 3).map(match => `
          <div class="search-result-match">
            <span class="search-result-match-type ${match.type}">${match.type}</span>
            <span>${escapeHtml(match.text)}</span>
          </div>
        `).join('')}
        ${result.matches.length > 3 ? `<div class="search-result-match" style="color: #52525b;">+${result.matches.length - 3} more</div>` : ''}
      </div>
    </div>
  `).join('');
}

function jumpToSearchResult(moduleId) {
  if (moduleSearchModal) moduleSearchModal.classList.add('hidden');
  selectModule(moduleId);
}

function showModuleSearchModal() {
  if (!moduleSearchModal) return;
  moduleSearchModal.classList.remove('hidden');
  if (globalModuleSearch) {
    globalModuleSearch.value = '';
    globalModuleSearch.focus();
  }
  if (moduleSearchResults) {
    moduleSearchResults.innerHTML = '<p style="padding: 16px; color: #52525b; font-size: 13px; text-align: center;">Start typing to search...</p>';
  }
}

function hideModuleSearchModal() {
  if (moduleSearchModal) moduleSearchModal.classList.add('hidden');
}

// =====================================================
// Blueprint Event Listeners
// =====================================================

function initBlueprintListeners() {
  // Close button
  if (closeBlueprintBtn) {
    closeBlueprintBtn.addEventListener('click', closeBlueprints);
  }
  
  // Add module button
  if (addModuleBtn) {
    addModuleBtn.addEventListener('click', showAddModuleModal);
  }
  
  // Create first module button
  if (createFirstModuleBtn) {
    createFirstModuleBtn.addEventListener('click', showAddModuleModal);
  }
  
  // Delete module button
  if (deleteModuleBtn) {
    deleteModuleBtn.addEventListener('click', deleteCurrentModule);
  }
  
  // Module title editing
  if (moduleTitle) {
    // Add hover and focus styles
    moduleTitle.addEventListener('mouseenter', () => {
      if (!moduleTitle.matches(':focus')) {
        moduleTitle.style.backgroundColor = 'rgba(255,255,255,0.05)';
      }
    });
    
    moduleTitle.addEventListener('mouseleave', () => {
      if (!moduleTitle.matches(':focus')) {
        moduleTitle.style.backgroundColor = 'transparent';
      }
    });
    
    moduleTitle.addEventListener('focus', () => {
      moduleTitle.style.backgroundColor = 'rgba(255,255,255,0.08)';
    });
    
    moduleTitle.addEventListener('blur', () => {
      moduleTitle.style.backgroundColor = 'transparent';
      saveModuleTitle();
    });
    
    // Save on Enter key, prevent newline
    moduleTitle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        moduleTitle.blur(); // This will trigger the blur event which saves
      }
      // Prevent Escape from doing anything special
      if (e.key === 'Escape') {
        // Restore original title and blur
        if (selectedModule) {
          moduleTitle.textContent = selectedModule.title;
        }
        moduleTitle.blur();
      }
    });
    
    // Prevent paste of HTML/formatting, only allow plain text
    moduleTitle.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      document.execCommand('insertText', false, text);
    });
  }
  
  // View tabs
  document.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchBlueprintView(tab.dataset.view);
    });
  });
  
  // Editor actions
  if (runEditorBtn) runEditorBtn.addEventListener('click', runEditorCode);
  if (clearEditorOutputBtn) clearEditorOutputBtn.addEventListener('click', clearEditorOutput);

  // Initialize goal editor with live preview
  initGoalEditor();
  
  // Goal editor auto-save
  if (goalEditor) {
    goalEditor.addEventListener('input', () => {
      // If Monaco is active, ignore textarea events (textarea is hidden but kept as fallback).
      if (blueprintGoalMonacoEditor) return;
      clearTimeout(goalSaveTimeout);
      if (goalSaveStatus) goalSaveStatus.textContent = 'Unsaved changes...';
      goalSaveTimeout = setTimeout(saveGoalContent, 1000);
      
      // Update live preview and linked modules
      goalMarkdownSource = goalEditor.value;
      renderLivePreview();
      updateLinkedModules();
    });
  }

  // Editor textarea fallback auto-save + keybinds
  if (blueprintEditorTextarea) {
    blueprintEditorTextarea.addEventListener('input', () => {
      if (blueprintCodeMonacoEditor) return;
      clearTimeout(editorSaveTimeout);
      if (editorSaveStatus) editorSaveStatus.textContent = 'Unsaved changes...';
      editorSaveTimeout = setTimeout(saveEditorContent, 1000);
    });

    blueprintEditorTextarea.addEventListener('keydown', (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl) return;
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveEditorContent();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        runEditorCode();
      }
    });
  }
  
  // Add task button
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', showAddTaskModal);
  }
  
  // Add link button
  if (addLinkBtn) {
    addLinkBtn.addEventListener('click', showAddLinkModal);
  }
  
  // Add file reference button
  if (addFileRefBtn) {
    addFileRefBtn.addEventListener('click', browseAndAddFile);
  }
  
  // Canvas export/clear buttons
  const exportPngBtn = document.getElementById('exportCanvasPngBtn');
  const exportSvgBtn = document.getElementById('exportCanvasSvgBtn');
  const clearCanvasBtn = document.getElementById('clearCanvasBtn');
  
  if (exportPngBtn) {
    exportPngBtn.addEventListener('click', exportCanvasAsPng);
  }
  if (exportSvgBtn) {
    exportSvgBtn.addEventListener('click', exportCanvasAsSvg);
  }
  if (clearCanvasBtn) {
    clearCanvasBtn.addEventListener('click', clearCanvas);
  }
  
  const fullscreenCanvasBtn = document.getElementById('fullscreenCanvasBtn');
  if (fullscreenCanvasBtn) {
    fullscreenCanvasBtn.addEventListener('click', toggleCanvasFullscreen);
  }
  
  // Add Module Modal
  if (closeAddModuleBtn) {
    closeAddModuleBtn.addEventListener('click', hideAddModuleModal);
  }
  if (cancelAddModuleBtn) {
    cancelAddModuleBtn.addEventListener('click', hideAddModuleModal);
  }
  if (confirmAddModuleBtn) {
    confirmAddModuleBtn.addEventListener('click', createModule);
  }
  
  // Icon selection
  document.querySelectorAll('.module-icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedModuleIcon = btn.dataset.icon;
      document.querySelectorAll('.module-icon-btn').forEach(b => {
        b.style.borderColor = b === btn ? 'rgba(139, 92, 246, 0.5)' : 'transparent';
      });
    });
  });
  
  // Color selection
  document.querySelectorAll('.module-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedModuleColor = btn.dataset.color;
      document.querySelectorAll('.module-color-btn').forEach(b => {
        b.style.borderColor = b === btn ? 'white' : 'transparent';
      });
    });
  });
  
  // Add Task Modal
  if (closeAddTaskBtn) {
    closeAddTaskBtn.addEventListener('click', hideAddTaskModal);
  }
  if (cancelAddTaskBtn) {
    cancelAddTaskBtn.addEventListener('click', hideAddTaskModal);
  }
  if (confirmAddTaskBtn) {
    confirmAddTaskBtn.addEventListener('click', addNewTask);
  }
  
  // Add Link Modal
  if (closeAddLinkBtn) {
    closeAddLinkBtn.addEventListener('click', hideAddLinkModal);
  }
  if (cancelAddLinkBtn) {
    cancelAddLinkBtn.addEventListener('click', hideAddLinkModal);
  }
  if (confirmAddLinkBtn) {
    confirmAddLinkBtn.addEventListener('click', addNewLink);
  }
  
  // Search modal
  if (closeModuleSearchBtn) {
    closeModuleSearchBtn.addEventListener('click', hideModuleSearchModal);
  }
  
  // Global search in sidebar
  if (moduleSearchInput) {
    moduleSearchInput.addEventListener('focus', showModuleSearchModal);
  }
  
  // Global search input
  if (globalModuleSearch) {
    let searchTimeout = null;
    globalModuleSearch.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchInModules(globalModuleSearch.value);
      }, 300);
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
      if (!addModuleModal?.classList.contains('hidden')) {
        hideAddModuleModal();
      } else if (!addTaskModal?.classList.contains('hidden')) {
        hideAddTaskModal();
      } else if (!addLinkModal?.classList.contains('hidden')) {
        hideAddLinkModal();
      } else if (!moduleSearchModal?.classList.contains('hidden')) {
        hideModuleSearchModal();
      } else if (!blueprintModal?.classList.contains('hidden')) {
        closeBlueprints();
      }
    }
  });
}

// Initialize blueprint listeners when DOM is ready
document.addEventListener('DOMContentLoaded', initBlueprintListeners);

// Helper function for relative time
function formatRelativeTime(dateStr) {
  if (!dateStr) return 'Never';
  
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

// =====================================================
// Project Creation Wizard
// =====================================================

function initProjectCreationWizard() {
  // Load templates
  loadProjectTemplates();
  
  // Close button
  if (closeCreateProjectBtn) {
    closeCreateProjectBtn.addEventListener('click', hideCreateProjectModal);
  }
  
  // Cancel button
  if (wizardCancelBtn) {
    wizardCancelBtn.addEventListener('click', hideCreateProjectModal);
  }
  
  // Back button
  if (wizardBackBtn) {
    wizardBackBtn.addEventListener('click', () => {
      if (wizardStep > 1 && wizardStep < 3) {
        setWizardStep(wizardStep - 1);
      }
    });
  }
  
  // Next button
  if (wizardNextBtn) {
    wizardNextBtn.addEventListener('click', handleWizardNext);
  }
  
  // Browse location button
  if (browseLocationBtn) {
    browseLocationBtn.addEventListener('click', async () => {
      try {
        const dir = await window.electronAPI.selectProjectDirectory();
        if (dir && projectLocationInput) {
          projectLocationInput.value = dir;
          projectWizardData.parentDirectory = dir;
        }
      } catch (err) {
        console.error('Error selecting directory:', err);
        showNotification('Failed to select directory', 'error');
      }
    });
  }
  
  // Project location input click
  if (projectLocationInput) {
    projectLocationInput.addEventListener('click', async () => {
      try {
        const dir = await window.electronAPI.selectProjectDirectory();
        if (dir) {
          projectLocationInput.value = dir;
          projectWizardData.parentDirectory = dir;
        }
      } catch (err) {
        console.error('Error selecting directory:', err);
      }
    });
  }
  
  // Project name input validation
  if (projectNameInput) {
    let validateTimeout = null;
    projectNameInput.addEventListener('input', (e) => {
      clearTimeout(validateTimeout);
      validateTimeout = setTimeout(async () => {
        const name = e.target.value.trim();
        if (name) {
          try {
            const result = await window.electronAPI.validateProjectName(name);
            const errorEl = document.getElementById('projectNameError');
            const sanitizedEl = document.getElementById('projectNameSanitized');
            
            if (result.valid) {
              if (errorEl) errorEl.style.display = 'none';
              if (sanitizedEl && result.sanitized !== name) {
                sanitizedEl.textContent = `Will be created as: ${result.sanitized}`;
                sanitizedEl.style.display = 'block';
              } else if (sanitizedEl) {
                sanitizedEl.style.display = 'none';
              }
              projectWizardData.projectName = result.sanitized;
            } else {
              if (errorEl) {
                errorEl.textContent = result.errors.join(', ');
                errorEl.style.display = 'block';
              }
              if (sanitizedEl) sanitizedEl.style.display = 'none';
            }
          } catch (err) {
            console.error('Validation error:', err);
          }
        }
      }, 300);
    });
  }
  
  // Git clone checkbox
  if (useGitClone) {
    useGitClone.addEventListener('change', (e) => {
      if (gitCloneSection) {
        gitCloneSection.style.display = e.target.checked ? 'block' : 'none';
      }
      if (e.target.checked) {
        // Clear stack selection when using git
        selectedStack = null;
        selectedTemplate = null;
        document.querySelectorAll('.stack-card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
      }
    });
  }
  
  // Env vars checkbox
  if (addEnvVars) {
    addEnvVars.addEventListener('change', (e) => {
      if (envVarsSection) {
        envVarsSection.style.display = e.target.checked ? 'block' : 'none';
      }
    });
  }
  
  // Package manager buttons
  document.querySelectorAll('.pkg-manager-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pkg-manager-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = 'rgba(255,255,255,0.05)';
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.style.color = '#71717a';
      });
      btn.classList.add('active');
      btn.style.background = 'rgba(139, 92, 246, 0.15)';
      btn.style.borderColor = 'rgba(139, 92, 246, 0.3)';
      btn.style.color = '#a78bfa';
      projectWizardData.packageManager = btn.dataset.pkg;
    });
  });
  
  // TypeScript buttons
  document.querySelectorAll('.typescript-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.typescript-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = 'rgba(255,255,255,0.05)';
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.style.color = '#71717a';
      });
      btn.classList.add('active');
      btn.style.background = 'rgba(139, 92, 246, 0.15)';
      btn.style.borderColor = 'rgba(139, 92, 246, 0.3)';
      btn.style.color = '#a78bfa';
      projectWizardData.useTypeScript = btn.dataset.ts === 'true';
    });
  });
  
  // Success actions
  if (openInEditorBtn) {
    openInEditorBtn.addEventListener('click', () => {
      if (createdProjectData?.projectPath) {
        window.electronAPI.openInEditor(createdProjectData.projectPath);
        hideCreateProjectModal();
      }
    });
  }
  
  if (startDevServerBtn) {
    startDevServerBtn.addEventListener('click', async () => {
      if (createdProjectData?.projectPath) {
        hideCreateProjectModal();
        // Start the project
        await window.electronAPI.playProject(createdProjectData.projectPath);
      }
    });
  }
  
  if (retryCreationBtn) {
    retryCreationBtn.addEventListener('click', () => {
      setWizardStep(2);
    });
  }
  
  // Listen for creation progress
  window.electronAPI.onProjectCreationProgress((_event, progress) => {
    if (creationLog && progress.message) {
      const logLine = document.createElement('div');
      logLine.style.marginBottom = '4px';
      
      if (progress.phase === 'complete') {
        logLine.style.color = '#10b981';
        logLine.textContent = `✓ ${progress.message}`;
      } else if (progress.type === 'stderr') {
        logLine.style.color = '#f59e0b';
        logLine.textContent = progress.data;
      } else {
        logLine.textContent = `→ ${progress.message || progress.data || ''}`;
      }
      
      creationLog.appendChild(logLine);
      creationLog.scrollTop = creationLog.scrollHeight;
    }
    
    if (creationMessage && progress.message) {
      creationMessage.textContent = progress.message;
    }
  });
}

async function loadProjectTemplates() {
  try {
    projectTemplates = await window.electronAPI.getProjectTemplates();
    templateLibrary = await window.electronAPI.getTemplateLibrary();
    renderStackGrid();
    renderTemplateGrid();
  } catch (err) {
    console.error('Error loading templates:', err);
  }
}

function renderStackGrid() {
  if (!stackGrid) return;
  
  const stacks = [
    { id: 'react', icon: '⚛️', name: 'React.js', desc: 'UI library' },
    { id: 'nextjs', icon: '▲', name: 'Next.js', desc: 'React framework' },
    { id: 'vite', icon: '⚡', name: 'Vite + React', desc: 'Fast bundler' },
    { id: 'vue', icon: '💚', name: 'Vue.js', desc: 'Progressive framework' },
    { id: 'express', icon: '🚂', name: 'Express.js', desc: 'Node.js server' },
    { id: 'nestjs', icon: '🐱', name: 'NestJS', desc: 'Enterprise Node.js' },
  ];
  
  stackGrid.innerHTML = stacks.map(stack => `
    <div class="stack-card" data-stack="${stack.id}">
      <div class="stack-icon">${stack.icon}</div>
      <div class="stack-name">${stack.name}</div>
      <div class="stack-desc">${stack.desc}</div>
    </div>
  `).join('');
  
  // Add click handlers
  stackGrid.querySelectorAll('.stack-card').forEach(card => {
    card.addEventListener('click', () => {
      // Clear template selection
      selectedTemplate = null;
      document.querySelectorAll('.template-card').forEach(t => t.classList.remove('selected'));
      
      // Clear git clone
      if (useGitClone) useGitClone.checked = false;
      if (gitCloneSection) gitCloneSection.style.display = 'none';
      
      // Toggle selection
      if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        selectedStack = null;
      } else {
        document.querySelectorAll('.stack-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedStack = card.dataset.stack;
      }
      projectWizardData.stack = selectedStack;
      projectWizardData.template = null;
    });
  });
}

function renderTemplateGrid() {
  if (!templateGrid) return;
  
  const templates = [
    { id: 'react-tailwind', icon: '🎨', name: 'React + Tailwind', desc: 'React with Tailwind CSS' },
    { id: 'nextjs-typescript', icon: '📘', name: 'Next.js + TypeScript', desc: 'Type-safe Next.js' },
    { id: 'express-jwt', icon: '🔐', name: 'Express + JWT', desc: 'API with authentication' },
    { id: 'nestjs-rest-api', icon: '📡', name: 'NestJS REST API', desc: 'REST with Swagger docs' },
  ];
  
  templateGrid.innerHTML = templates.map(template => `
    <div class="template-card" data-template="${template.id}">
      <div class="template-icon">${template.icon}</div>
      <div class="template-info">
        <div class="template-name">${template.name}</div>
        <div class="template-desc">${template.desc}</div>
      </div>
    </div>
  `).join('');
  
  // Add click handlers
  templateGrid.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      // Clear stack selection
      selectedStack = null;
      document.querySelectorAll('.stack-card').forEach(s => s.classList.remove('selected'));
      
      // Clear git clone
      if (useGitClone) useGitClone.checked = false;
      if (gitCloneSection) gitCloneSection.style.display = 'none';
      
      // Toggle selection
      if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        selectedTemplate = null;
      } else {
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedTemplate = card.dataset.template;
        
        // Set the base stack from template
        const templateDef = templateLibrary[selectedTemplate];
        if (templateDef?.base) {
          selectedStack = templateDef.base;
        }
      }
      projectWizardData.template = selectedTemplate;
      projectWizardData.stack = selectedStack;
    });
  });
}

function showCreateProjectModal() {
  // Reset wizard state
  wizardStep = 1;
  selectedStack = null;
  selectedTemplate = null;
  projectWizardData = {
    projectName: '',
    parentDirectory: '',
    stack: null,
    template: null,
    packageManager: 'npm',
    useTypeScript: false,
    gitRepoUrl: null,
    envVariables: {},
  };
  createdProjectData = null;
  
  // Reset UI
  if (projectNameInput) projectNameInput.value = '';
  if (projectLocationInput) projectLocationInput.value = '';
  if (gitRepoUrl) gitRepoUrl.value = '';
  if (useGitClone) useGitClone.checked = false;
  if (gitCloneSection) gitCloneSection.style.display = 'none';
  if (addEnvVars) addEnvVars.checked = false;
  if (envVarsSection) envVarsSection.style.display = 'none';
  if (envVarsInput) envVarsInput.value = '';
  if (creationLog) creationLog.innerHTML = '';
  
  // Reset selections
  document.querySelectorAll('.stack-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  
  // Reset package manager to npm
  document.querySelectorAll('.pkg-manager-btn').forEach(btn => {
    if (btn.dataset.pkg === 'npm') {
      btn.classList.add('active');
      btn.style.background = 'rgba(139, 92, 246, 0.15)';
      btn.style.borderColor = 'rgba(139, 92, 246, 0.3)';
      btn.style.color = '#a78bfa';
    } else {
      btn.classList.remove('active');
      btn.style.background = 'rgba(255,255,255,0.05)';
      btn.style.borderColor = 'rgba(255,255,255,0.1)';
      btn.style.color = '#71717a';
    }
  });
  
  // Reset TypeScript buttons (default to JavaScript)
  document.querySelectorAll('.typescript-btn').forEach(btn => {
    if (btn.dataset.ts === 'false') {
      btn.classList.add('active');
      btn.style.background = 'rgba(139, 92, 246, 0.15)';
      btn.style.borderColor = 'rgba(139, 92, 246, 0.3)';
      btn.style.color = '#a78bfa';
    } else {
      btn.classList.remove('active');
      btn.style.background = 'rgba(255,255,255,0.05)';
      btn.style.borderColor = 'rgba(255,255,255,0.1)';
      btn.style.color = '#71717a';
    }
  });
  
  setWizardStep(1);
  
  if (createProjectModal) {
    createProjectModal.classList.remove('hidden');
  }
}

function hideCreateProjectModal() {
  if (wizardStep === 3 && !createdProjectData) {
    // Don't close during creation
    return;
  }
  
  if (createProjectModal) {
    createProjectModal.classList.add('hidden');
  }
  
  // Clean up listener
  window.electronAPI.removeProjectCreationListener();
}

function setWizardStep(step) {
  wizardStep = step;
  
  // Update step indicators
  document.querySelectorAll('#projectWizardSteps .wizard-step').forEach((stepEl, index) => {
    const stepNum = index + 1;
    const numEl = stepEl.querySelector('.step-number');
    const textEl = stepEl.querySelector('span');
    
    if (stepNum < step) {
      // Completed step
      stepEl.style.opacity = '1';
      if (numEl) {
        numEl.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        numEl.style.color = 'white';
        numEl.innerHTML = '✓';
      }
      if (textEl) textEl.style.color = '#10b981';
    } else if (stepNum === step) {
      // Current step
      stepEl.style.opacity = '1';
      if (numEl) {
        numEl.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
        numEl.style.color = 'white';
        numEl.textContent = stepNum;
      }
      if (textEl) textEl.style.color = '#fafafa';
    } else {
      // Future step
      stepEl.style.opacity = '0.5';
      if (numEl) {
        numEl.style.background = 'rgba(255,255,255,0.1)';
        numEl.style.color = '#71717a';
        numEl.textContent = stepNum;
      }
      if (textEl) textEl.style.color = '#71717a';
    }
  });
  
  // Show/hide step content
  document.getElementById('wizardStep1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('wizardStep2').style.display = step === 2 ? 'block' : 'none';
  document.getElementById('wizardStep3').style.display = step === 3 ? 'block' : 'none';
  
  // Show/hide buttons
  if (wizardBackBtn) {
    wizardBackBtn.style.display = step > 1 && step < 3 ? 'block' : 'none';
  }
  if (wizardNextBtn) {
    if (step === 1) {
      wizardNextBtn.textContent = 'Next →';
      wizardNextBtn.style.display = 'block';
    } else if (step === 2) {
      wizardNextBtn.textContent = 'Create Project';
      wizardNextBtn.style.display = 'block';
    } else {
      wizardNextBtn.style.display = 'none';
    }
  }
  if (wizardCancelBtn) {
    wizardCancelBtn.style.display = step < 3 ? 'block' : 'none';
  }
  
  // Reset step 3 states
  if (step === 3) {
    if (creationSpinner) creationSpinner.style.display = 'block';
    if (creationTitle) creationTitle.style.display = 'block';
    if (creationMessage) creationMessage.style.display = 'block';
    if (creationLog) creationLog.style.display = 'block';
    if (creationSuccess) creationSuccess.style.display = 'none';
    if (creationError) creationError.style.display = 'none';
  }
}

async function handleWizardNext() {
  if (wizardStep === 1) {
    // Validate step 1
    const isGitClone = useGitClone?.checked;
    
    if (isGitClone) {
      const repoUrl = gitRepoUrl?.value?.trim();
      if (!repoUrl) {
        showNotification('Please enter a Git repository URL', 'warning');
        return;
      }
      projectWizardData.gitRepoUrl = repoUrl;
      projectWizardData.stack = 'node'; // Will detect after clone
    } else if (!selectedStack && !selectedTemplate) {
      showNotification('Please select a technology stack or template', 'warning');
      return;
    }
    
    setWizardStep(2);
    
  } else if (wizardStep === 2) {
    // Validate step 2
    const projectName = projectNameInput?.value?.trim();
    const projectLocation = projectLocationInput?.value?.trim();
    
    if (!projectName) {
      showNotification('Please enter a project name', 'warning');
      projectNameInput?.focus();
      return;
    }
    
    if (!projectLocation) {
      showNotification('Please select a project location', 'warning');
      return;
    }
    
    // Parse env variables if provided
    if (addEnvVars?.checked && envVarsInput?.value) {
      const envVars = {};
      envVarsInput.value.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      });
      projectWizardData.envVariables = envVars;
    }
    
    // Validate project name
    try {
      const validation = await window.electronAPI.validateProjectName(projectName);
      if (!validation.valid) {
        showNotification(validation.errors.join(', '), 'error');
        return;
      }
      projectWizardData.projectName = validation.sanitized;
    } catch (err) {
      showNotification('Failed to validate project name', 'error');
      return;
    }
    
    projectWizardData.parentDirectory = projectLocation;
    
    // Start creation
    setWizardStep(3);
    await createNewProject();
  }
}

async function createNewProject() {
  if (creationLog) creationLog.innerHTML = '';
  
  const logMessage = (msg, type = 'info') => {
    if (creationLog) {
      const line = document.createElement('div');
      line.style.marginBottom = '4px';
      if (type === 'success') line.style.color = '#10b981';
      else if (type === 'error') line.style.color = '#f43f5e';
      else if (type === 'warning') line.style.color = '#f59e0b';
      line.textContent = msg;
      creationLog.appendChild(line);
      creationLog.scrollTop = creationLog.scrollHeight;
    }
  };
  
  logMessage('→ Starting project creation...');
  logMessage(`→ Stack: ${projectWizardData.stack || 'From Git'}`);
  logMessage(`→ Location: ${projectWizardData.parentDirectory}`);
  
  try {
    const result = await window.electronAPI.createProject({
      projectName: projectWizardData.projectName,
      parentDirectory: projectWizardData.parentDirectory,
      stack: projectWizardData.stack,
      template: projectWizardData.template,
      packageManager: projectWizardData.packageManager,
      useTypeScript: projectWizardData.useTypeScript,
      gitRepoUrl: projectWizardData.gitRepoUrl,
      envVariables: projectWizardData.envVariables,
    });
    
    if (result.success) {
      logMessage('✓ Project created successfully!', 'success');
      createdProjectData = result;
      
      // Show success state
      if (creationSpinner) creationSpinner.style.display = 'none';
      if (creationTitle) creationTitle.style.display = 'none';
      if (creationMessage) creationMessage.style.display = 'none';
      if (creationLog) creationLog.style.display = 'none';
      if (creationSuccess) {
        creationSuccess.style.display = 'block';
        if (successProjectPath) {
          successProjectPath.textContent = result.projectPath;
        }
      }
      
      // Save the parent directory to scanPaths for future scans
      addCreatedProjectPath(projectWizardData.parentDirectory);
      
      // Add to projects list
      if (result.project) {
        // Check if project already exists (by path)
        const existingIndex = currentProjects.findIndex(p => p.path === result.project.path);
        if (existingIndex === -1) {
          currentProjects.unshift(result.project);
        } else {
          currentProjects[existingIndex] = result.project;
        }
        saveProjects(); // Persist to localStorage
        filterAndRenderProjects();
        updateRunningCount();
        renderCollections();
      } else {
        // Create a minimal project object from the result
        const newProject = {
          path: result.projectPath,
          name: result.projectName,
          framework: result.framework || result.stack,
          hasPackageJson: true,
          timestamp: Date.now(),
        };
        currentProjects.unshift(newProject);
        saveProjects();
        filterAndRenderProjects();
        updateRunningCount();
        renderCollections();
      }
      
      showNotification(`Project "${result.projectName}" created successfully!`, 'success');
      
    } else {
      logMessage(`✗ ${result.error}`, 'error');
      
      // Show error state
      if (creationSpinner) creationSpinner.style.display = 'none';
      if (creationTitle) creationTitle.style.display = 'none';
      if (creationMessage) creationMessage.style.display = 'none';
      if (creationLog) creationLog.style.display = 'none';
      if (creationError) {
        creationError.style.display = 'block';
        if (errorMessage) {
          errorMessage.textContent = result.error;
        }
      }
      
      showNotification(`Failed: ${result.error}`, 'error');
    }
    
  } catch (err) {
    console.error('Project creation error:', err);
    logMessage(`✗ ${err.message || 'Unknown error'}`, 'error');
    
    if (creationSpinner) creationSpinner.style.display = 'none';
    if (creationTitle) creationTitle.style.display = 'none';
    if (creationMessage) creationMessage.style.display = 'none';
    if (creationLog) creationLog.style.display = 'none';
    if (creationError) {
      creationError.style.display = 'block';
      if (errorMessage) {
        errorMessage.textContent = err.message || 'An unexpected error occurred';
      }
    }
    
    showNotification('Project creation failed', 'error');
  }
}

// Expose globally for command palette and buttons
window.showCreateProjectModal = showCreateProjectModal;

// =====================================================
// Expose Blueprint Functions Globally for HTML onclick
// =====================================================
window.selectModule = selectModule;
window.showAddModuleModal = showAddModuleModal;
window.hideAddModuleModal = hideAddModuleModal;
window.createModule = createModule;
window.deleteModule = deleteModule;
window.switchBlueprintView = switchBlueprintView;
window.onModuleDragStart = onModuleDragStart;
window.onModuleDragOver = onModuleDragOver;
window.onModuleDrop = onModuleDrop;
window.onModuleDragLeave = onModuleDragLeave;
window.showAddTaskModal = showAddTaskModal;
window.hideAddTaskModal = hideAddTaskModal;
window.createTask = createTask;
window.deleteTask = deleteTask;
window.updateTaskStatus = updateTaskStatus;
window.onTaskDragStart = onTaskDragStart;
window.onTaskDragEnd = onTaskDragEnd;
window.onTaskDragOver = onTaskDragOver;
window.onTaskDragLeave = onTaskDragLeave;
window.onTaskDrop = onTaskDrop;
window.deleteTaskItem = deleteTaskItem;
window.editTask = editTask;
window.showAddLinkModal = showAddLinkModal;
window.hideAddLinkModal = hideAddLinkModal;
window.addLink = addLink;
window.browseLocalFile = browseLocalFile;
window.openExternalLink = openExternalLink;
window.openFileInIDE = openFileInIDE;
window.removeResourceItem = removeResourceItem;
window.exportCanvas = exportCanvas;
window.exportCanvasAsPng = exportCanvasAsPng;
window.exportCanvasAsSvg = exportCanvasAsSvg;
window.clearCanvas = clearCanvas;
window.toggleCanvasFullscreen = toggleCanvasFullscreen;
window.showModuleSearchModal = showModuleSearchModal;
window.hideModuleSearchModal = hideModuleSearchModal;
window.searchInModules = searchInModules;
window.closeBlueprints = closeBlueprints;
window.openBlueprints = openBlueprints;


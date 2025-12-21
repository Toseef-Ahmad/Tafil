/**
 * TAFIL Feature Limits System
 * 
 * Psychologically intelligent Free vs Pro limits:
 * - Free users must feel productive, not punished
 * - Pro feels like power/speed/depth, not basic access
 * - Soft limits with graceful fallbacks
 * - Never block core value (execution)
 */

const { getLicenseStatus, silentCheck } = require('./featureGuard');

// =====================================================
// FEATURE LIMITS CONFIGURATION
// =====================================================

/**
 * "Free-to-Run, Pay-to-Save" Monetization Model (VS Code Strategy)
 * 
 * Core Philosophy:
 * - FREE: Unlimited project running + all language execution (hook them!)
 * - PRO: Saving (snippets) + Power workflows (SSH, Blueprints)
 * 
 * This builds massive user base while monetizing "Power Users"
 */

const LIMITS = {
  // FREE TIER - "Free-to-Run" approach
  free: {
    projects: Infinity,        // UNLIMITED projects (VS Code strategy)
    snippets: 0,               // NO saving - this is the gate!
    historyDays: 7,            // 7 days of execution history
    languages: 'all',          // ALL languages FREE (hook them!)
    export: ['clipboard'],     // Copy to clipboard only
    themes: ['dark', 'light'], // Basic themes
    templates: 'all',          // All templates free
    canSync: false,            // No cloud sync
    canBatchRun: false,        // No batch execution
    canCustomTheme: false,     // No custom themes
    
    // FREE EXECUTION - Hook users by letting them run everything
    canAccessSSH: true,        // SSH available (20-min daily pass)
    canAccessBlueprints: true, // Blueprints available (20-min daily pass)
    canSaveSnippets: false,    // BLOCKED - Pay to save!
    maxTodos: Infinity,        // Unlimited todos
    maxCollections: 0,         // No snippet collections (Pro)
    canUseTimeTravel: true,    // Time Travel shows last 3 states
    canUseInlineResults: true, // Inline results always work
    canUsePythonExec: true,    // Python FREE - no limits
    canUseTypeScriptExec: true, // TypeScript FREE - no limits
    
    // NO execution quotas - all languages run unlimited!
    dailyTypescriptRuns: Infinity,  // UNLIMITED TS runs
    dailyPythonRuns: Infinity,      // UNLIMITED Python runs
    dailySshSessions: Infinity,     // SSH sessions managed by 20-min pass
    sshSessionMinutes: 20,          // 20-min daily Pro Pass
    maxActiveBlueprints: 1,         // 1 active blueprint module
    timeTravelStates: 3,            // Show last 3 variable states
  },
  
  // PRO TIER - Unlimited everything
  pro: {
    projects: Infinity,
    snippets: Infinity,
    historyDays: Infinity,
    languages: 'all',
    export: ['clipboard', 'markdown', 'gist', 'pdf'],
    themes: 'all',
    templates: 'all',
    canSync: true,
    canBatchRun: true,
    canCustomTheme: true,
    
    // Unlimited Access
    canAccessSSH: true,
    canAccessBlueprints: true,
    canSaveSnippets: true,
    maxTodos: Infinity,
    maxCollections: Infinity,
    canUseTimeTravel: true,
    canUseInlineResults: true,
    canUsePythonExec: true,
    canUseTypeScriptExec: true,
    
    // No Quotas
    dailyTypescriptRuns: Infinity,
    dailyPythonRuns: Infinity,
    dailySshSessions: Infinity,
    sshSessionMinutes: Infinity,
    maxActiveBlueprints: Infinity,
    timeTravelStates: Infinity,
  },
};

// All supported languages (Pro gets all)
const ALL_LANGUAGES = [
  'javascript', 'typescript', 'python', 'shell', 'bash',
  'go', 'rust', 'ruby', 'php', 'java', 'kotlin', 'swift',
  'c', 'cpp', 'sql', 'html', 'css', 'json', 'yaml', 'markdown'
];

// =====================================================
// TIER DETECTION
// =====================================================

/**
 * Get current user tier
 * @returns {'free' | 'pro'}
 */
function getCurrentTier() {
  const status = getLicenseStatus();
  if (status.isPro || status.status === 'active') {
    return 'pro';
  }
  return 'free';
}

/**
 * Check if user is Pro
 * @returns {boolean}
 */
function isPro() {
  return getCurrentTier() === 'pro';
}

/**
 * Get current limits based on tier
 */
function getCurrentLimits() {
  return LIMITS[getCurrentTier()];
}

// =====================================================
// PROJECT LIMITS
// =====================================================

/**
 * Check if user can create a new project
 * @param {number} currentProjectCount - Current number of projects
 * @returns {{ allowed: boolean, reason?: string, limit?: number, current?: number, upgradeHint?: string }}
 */
function canCreateProject(currentProjectCount) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  if (tier === 'pro') {
    return { allowed: true };
  }
  
  if (currentProjectCount >= limits.projects) {
    return {
      allowed: false,
      reason: `You've filled up ${limits.projects} projects!`,
      limit: limits.projects,
      current: currentProjectCount,
      upgradeHint: 'Pro unlocks unlimited projects so you can build without limits.',
      softAction: 'archive', // Suggest archiving instead of hard block
    };
  }
  
  // Near limit warning (at 2 projects for free tier)
  if (currentProjectCount === limits.projects - 1) {
    return {
      allowed: true,
      warning: `This is your last free project slot (${currentProjectCount + 1}/${limits.projects}).`,
      upgradeHint: 'Upgrade to Pro for unlimited projects.',
    };
  }
  
  return { allowed: true };
}

/**
 * Get project limit info
 */
function getProjectLimitInfo(currentCount) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  return {
    tier,
    limit: tier === 'pro' ? '∞' : limits.projects,
    current: currentCount,
    remaining: tier === 'pro' ? '∞' : Math.max(0, limits.projects - currentCount),
    isAtLimit: tier === 'free' && currentCount >= limits.projects,
    isNearLimit: tier === 'free' && currentCount >= limits.projects - 1,
  };
}

// =====================================================
// SNIPPET LIMITS
// =====================================================

/**
 * Check if user can save a new snippet
 * FREE-TO-RUN, PAY-TO-SAVE: Snippets are a Pro feature
 * @param {number} currentSnippetCount - Current number of saved snippets (ignored now)
 */
function canSaveSnippet(currentSnippetCount) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  // Pro users can save unlimited snippets
  if (tier === 'pro') {
    return { allowed: true };
  }
  
  // FREE-TO-RUN, PAY-TO-SAVE: Free users cannot save snippets
  if (!limits.canSaveSnippets) {
    return {
      allowed: false,
      reason: 'Snippets are a Pro feature',
      limit: 0,
      current: currentSnippetCount,
      upgradeHint: 'Upgrade to Pro to save your code snippets forever and build your personal code library.',
      softAction: null,
    };
  }
  
  return { allowed: true };
}

/**
 * Get snippet limit info
 */
function getSnippetLimitInfo(currentCount) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  return {
    tier,
    limit: tier === 'pro' ? '∞' : limits.snippets,
    current: currentCount,
    remaining: tier === 'pro' ? '∞' : Math.max(0, limits.snippets - currentCount),
    isAtLimit: tier === 'free' && currentCount >= limits.snippets,
  };
}

// =====================================================
// HISTORY LIMITS
// =====================================================

/**
 * Filter history to respect tier limits
 * @param {Array} history - Full history array
 * @returns {Array} Filtered history
 */
function filterHistoryByTier(history) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  if (tier === 'pro' || limits.historyDays === Infinity) {
    return history;
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - limits.historyDays);
  
  return history.filter(item => {
    const itemDate = new Date(item.timestamp || item.createdAt || item.date);
    return itemDate >= cutoffDate;
  });
}

/**
 * Get history limit info
 */
function getHistoryLimitInfo() {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  return {
    tier,
    days: tier === 'pro' ? '∞ (forever)' : `${limits.historyDays} days`,
    isLimited: tier === 'free',
    upgradeHint: 'Pro keeps your full execution history searchable forever.',
  };
}

// =====================================================
// LANGUAGE LIMITS
// =====================================================

/**
 * Check if a language is available
 * @param {string} language - Language ID
 */
function isLanguageAvailable(language) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  if (tier === 'pro' || limits.languages === 'all') {
    return { allowed: true };
  }
  
  const lang = language.toLowerCase();
  if (limits.languages.includes(lang)) {
    return { allowed: true };
  }
  
  return {
    allowed: false,
    reason: `${language} is a Pro language.`,
    availableLanguages: limits.languages,
    upgradeHint: `Pro unlocks ${ALL_LANGUAGES.length}+ languages including ${language}.`,
  };
}

/**
 * Get available languages for current tier
 */
function getAvailableLanguages() {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  if (tier === 'pro' || limits.languages === 'all') {
    return {
      languages: ALL_LANGUAGES,
      isLimited: false,
    };
  }
  
  return {
    languages: limits.languages,
    isLimited: true,
    proLanguages: ALL_LANGUAGES.filter(l => !limits.languages.includes(l)),
  };
}

// =====================================================
// EXPORT LIMITS
// =====================================================

/**
 * Check if export format is available
 * @param {string} format - Export format (clipboard, markdown, gist, pdf)
 */
function canExport(format) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  if (tier === 'pro') {
    return { allowed: true };
  }
  
  if (limits.export.includes(format)) {
    return { allowed: true };
  }
  
  return {
    allowed: false,
    reason: `Export to ${format} is a Pro feature.`,
    freeAlternative: 'You can still copy to clipboard.',
    upgradeHint: 'Pro adds one-click export to Markdown, GitHub Gist, and PDF.',
  };
}

/**
 * Get available export formats
 */
function getAvailableExports() {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  return {
    tier,
    formats: tier === 'pro' ? LIMITS.pro.export : limits.export,
    isLimited: tier === 'free',
  };
}

// =====================================================
// PRO FEATURE CHECKS
// =====================================================

/**
 * Check if cloud sync is available
 */
function canSync() {
  return { allowed: isPro(), upgradeHint: 'Pro enables cloud sync across all your devices.' };
}

/**
 * Check if batch execution is available
 */
function canBatchRun() {
  return { allowed: isPro(), upgradeHint: 'Pro lets you run multiple snippets at once.' };
}

/**
 * Check if custom themes are available
 */
function canCustomTheme() {
  return { allowed: isPro(), upgradeHint: 'Pro unlocks custom themes to make TAFIL yours.' };
}

// =====================================================
// SSH ACCESS (Quota-Based)
// =====================================================

/**
 * Check if user can start an SSH session
 * Free users get 1 session per day (max 10 mins)
 */
function canAccessSSH() {
  // SSH is always accessible - quota checked separately
  return { allowed: true };
}

/**
 * Check SSH session quota
 * @param {number} sessionsUsedToday - Sessions used today
 */
function canStartSshSession(sessionsUsedToday = 0) {
  const tier = getCurrentTier();
  const limits = getCurrentLimits();
  
  if (tier === 'pro') {
    return { allowed: true, unlimited: true };
  }
  
  const remaining = limits.dailySshSessions - sessionsUsedToday;
  
  if (remaining <= 0) {
    return {
      allowed: false,
      quotaType: 'sshSessions',
      reason: "You've used your daily SSH session",
      remaining: 0,
      limit: limits.dailySshSessions,
      upgradeHint: 'Pro unlocks unlimited SSH sessions',
      resetTime: getTimeUntilMidnight(),
    };
  }
  
  return {
    allowed: true,
    remaining,
    limit: limits.dailySshSessions,
    sessionMinutes: limits.sshSessionMinutes,
  };
}

/**
 * Check if SSH session time limit is exceeded
 * @param {number} minutesUsed - Minutes used in current session
 */
function isSshSessionExpired(minutesUsed) {
  const tier = getCurrentTier();
  if (tier === 'pro') return { expired: false, unlimited: true };
  
  const limits = getCurrentLimits();
  const remaining = limits.sshSessionMinutes - minutesUsed;
  
  return {
    expired: remaining <= 0,
    remaining: Math.max(0, remaining),
    limit: limits.sshSessionMinutes,
    minutesUsed,
  };
}

/**
 * Get time until midnight (quota reset)
 */
function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  
  const diff = midnight - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  return { hours, minutes, display: `${hours}h ${minutes}m` };
}

// =====================================================
// BLUEPRINTS ACCESS (1 Active Blueprint Free)
// =====================================================

/**
 * Check if user can access Blueprints
 * Free users can access Blueprints (with 1 active limit)
 */
function canAccessBlueprints() {
  // Blueprints always accessible
  return { allowed: true };
}

/**
 * Check if user can create a new blueprint
 * Free users can have 1 active blueprint at a time
 * @param {number} activeBlueprints - Current active blueprints count
 */
function canCreateBlueprint(activeBlueprints = 0) {
  const tier = getCurrentTier();
  const limits = getCurrentLimits();
  
  if (tier === 'pro') {
    return { allowed: true, unlimited: true };
  }
  
  if (activeBlueprints >= limits.maxActiveBlueprints) {
    return {
      allowed: false,
      quotaType: 'blueprints',
      reason: `You're using your free blueprint slot`,
      limit: limits.maxActiveBlueprints,
      current: activeBlueprints,
      upgradeHint: 'Pro unlocks unlimited blueprints for all your projects',
    };
  }
  
  return {
    allowed: true,
    remaining: limits.maxActiveBlueprints - activeBlueprints,
    limit: limits.maxActiveBlueprints,
  };
}

/**
 * Check if user can create/edit todos
 * Free users have unlimited todos (hook them!)
 */
function canCreateTodo(currentTodoCount) {
  // Todos are always allowed - this is the "hook"
  return { allowed: true };
}

// =====================================================
// COLLECTIONS LIMIT
// =====================================================

/**
 * Check if user can create a new collection
 * @param {number} currentCollectionCount - Current number of collections
 */
function canCreateCollection(currentCollectionCount) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  if (tier === 'pro') {
    return { allowed: true };
  }
  
  if (currentCollectionCount >= limits.maxCollections) {
    return {
      allowed: false,
      reason: `You've reached the free limit of ${limits.maxCollections} collections.`,
      limit: limits.maxCollections,
      current: currentCollectionCount,
      upgradeHint: 'Pro unlocks unlimited collections to organize your projects.',
    };
  }
  
  return { allowed: true };
}

/**
 * Get collection limit info
 */
function getCollectionLimitInfo(currentCount) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  return {
    tier,
    limit: tier === 'pro' ? '∞' : limits.maxCollections,
    current: currentCount,
    remaining: tier === 'pro' ? '∞' : Math.max(0, limits.maxCollections - currentCount),
    isAtLimit: tier === 'free' && currentCount >= limits.maxCollections,
  };
}

// =====================================================
// TIME TRAVEL (Taste of Power - Last 3 States Free)
// =====================================================

/**
 * Check Time Travel access
 * Free users see last 3 states, Pro sees unlimited
 */
function canUseTimeTravel() {
  // Time Travel is always available (with state limit)
  return { allowed: true };
}

/**
 * Get Time Travel state limit
 * Free = 3 states, Pro = unlimited
 */
function getTimeTravelLimit() {
  const tier = getCurrentTier();
  const limits = getCurrentLimits();
  
  if (tier === 'pro') {
    return {
      unlimited: true,
      limit: Infinity,
      message: 'Full history available',
    };
  }
  
  return {
    unlimited: false,
    limit: limits.timeTravelStates,
    message: `Showing last ${limits.timeTravelStates} states`,
    upgradeHint: 'Pro shows complete variable history',
  };
}

/**
 * Filter value history based on tier
 * @param {Array} history - Full value history
 */
function filterValueHistory(history) {
  if (!Array.isArray(history)) return history;
  
  const tier = getCurrentTier();
  if (tier === 'pro') return history;
  
  const limits = getCurrentLimits();
  const limit = limits.timeTravelStates || 3;
  
  // Return last N states
  return history.slice(-limit);
}

// =====================================================
// LANGUAGE EXECUTION (Quota-Based)
// =====================================================

/**
 * Check if user can execute TypeScript
 * Free users get 15 runs per day
 * @param {number} runsToday - TypeScript runs today
 */
function canExecuteTypeScript(runsToday = 0) {
  const tier = getCurrentTier();
  const limits = getCurrentLimits();
  
  if (tier === 'pro') {
    return { allowed: true, unlimited: true, remaining: Infinity };
  }
  
  const remaining = limits.dailyTypescriptRuns - runsToday;
  
  if (remaining <= 0) {
    return {
      allowed: false,
      quotaType: 'typescriptExecutions',
      reason: `You've used your daily ${limits.dailyTypescriptRuns} TypeScript runs`,
      remaining: 0,
      limit: limits.dailyTypescriptRuns,
      used: runsToday,
      upgradeHint: 'Pro unlocks unlimited TypeScript execution',
      resetTime: getTimeUntilMidnight(),
    };
  }
  
  return {
    allowed: true,
    remaining,
    limit: limits.dailyTypescriptRuns,
    used: runsToday,
    percentUsed: Math.round((runsToday / limits.dailyTypescriptRuns) * 100),
  };
}

/**
 * Check if user can execute Python
 * Free users get 15 runs per day
 * @param {number} runsToday - Python runs today
 */
function canExecutePython(runsToday = 0) {
  const tier = getCurrentTier();
  const limits = getCurrentLimits();
  
  if (tier === 'pro') {
    return { allowed: true, unlimited: true, remaining: Infinity };
  }
  
  const remaining = limits.dailyPythonRuns - runsToday;
  
  if (remaining <= 0) {
    return {
      allowed: false,
      quotaType: 'pythonExecutions',
      reason: `You've used your daily ${limits.dailyPythonRuns} Python runs`,
      remaining: 0,
      limit: limits.dailyPythonRuns,
      used: runsToday,
      upgradeHint: 'Pro unlocks unlimited Python execution',
      resetTime: getTimeUntilMidnight(),
    };
  }
  
  return {
    allowed: true,
    remaining,
    limit: limits.dailyPythonRuns,
    used: runsToday,
    percentUsed: Math.round((runsToday / limits.dailyPythonRuns) * 100),
  };
}

/**
 * Get language quota status for UI display
 */
function getLanguageQuotaStatus(language, runsToday = 0) {
  const tier = getCurrentTier();
  const limits = getCurrentLimits();
  
  if (tier === 'pro') {
    return {
      unlimited: true,
      display: 'Unlimited',
      canRun: true,
    };
  }
  
  let limit = 0;
  switch (language) {
    case 'typescript':
      limit = limits.dailyTypescriptRuns;
      break;
    case 'python':
      limit = limits.dailyPythonRuns;
      break;
    default:
      return { unlimited: true, display: 'Unlimited', canRun: true };
  }
  
  const remaining = Math.max(0, limit - runsToday);
  
  return {
    unlimited: false,
    remaining,
    limit,
    used: runsToday,
    display: `${remaining}/${limit} today`,
    canRun: remaining > 0,
    percentUsed: Math.round((runsToday / limit) * 100),
  };
}

// =====================================================
// UPGRADE NUDGE TRACKING
// =====================================================

// Track upgrade nudges per session to avoid spam
let nudgeCount = 0;
const MAX_NUDGES_PER_SESSION = 1;

/**
 * Check if we should show an upgrade nudge
 */
function shouldShowUpgradeNudge() {
  if (isPro()) return false;
  if (nudgeCount >= MAX_NUDGES_PER_SESSION) return false;
  return true;
}

/**
 * Record that an upgrade nudge was shown
 */
function recordUpgradeNudge() {
  nudgeCount++;
}

/**
 * Reset nudge count (call on app restart)
 */
function resetNudgeCount() {
  nudgeCount = 0;
}

// =====================================================
// FEATURE SUMMARY FOR UI
// =====================================================

/**
 * Get comprehensive feature summary for UI display
 */
function getFeatureSummary() {
  const tier = getCurrentTier();
  const limits = getCurrentLimits();
  
  return {
    tier,
    isPro: tier === 'pro',
    
    // Feature Access
    features: {
      playground: {
        label: 'Playground',
        free: 'JavaScript only, 3 snippets',
        pro: 'All languages, unlimited snippets',
        icon: '⚡',
        freeAccess: true,
        proOnly: false,
      },
      ssh: {
        label: 'SSH Terminal',
        free: '🔒 Locked',
        pro: 'Full access',
        icon: '🔐',
        freeAccess: false,
        proOnly: true,
      },
      blueprints: {
        label: 'Blueprints',
        free: '🔒 Locked',
        pro: 'Full access with Kanban & diagrams',
        icon: '📋',
        freeAccess: false,
        proOnly: true,
      },
      timeTravel: {
        label: 'Time Travel',
        free: '🔒 Locked',
        pro: 'Full variable history',
        icon: '⏱️',
        freeAccess: false,
        proOnly: true,
      },
      collections: {
        label: 'Collections',
        free: `${limits.maxCollections} collections`,
        pro: 'Unlimited',
        icon: '📁',
        freeAccess: true,
        proOnly: false,
      },
    },
    
    // Limits
    projects: {
      label: 'Projects',
      limit: tier === 'pro' ? 'Unlimited' : `${limits.projects}`,
      icon: '📁',
    },
    snippets: {
      label: 'Saved Snippets',
      limit: tier === 'pro' ? 'Unlimited' : `${limits.snippets}`,
      icon: '💾',
    },
    history: {
      label: 'Execution History',
      limit: tier === 'pro' ? 'Forever' : `${limits.historyDays} days`,
      icon: '📜',
    },
    languages: {
      label: 'Languages',
      limit: tier === 'pro' ? 'All (15+)' : 'JavaScript only',
      icon: '🌐',
    },
    export: {
      label: 'Export',
      limit: tier === 'pro' ? 'Clipboard, MD, Gist, PDF' : 'Clipboard only',
      icon: '📤',
    },
    sync: {
      label: 'Cloud Sync',
      limit: tier === 'pro' ? '✓ Enabled' : '✗ Not available',
      icon: '☁️',
    },
    themes: {
      label: 'Themes',
      limit: tier === 'pro' ? 'All + Custom' : 'Light & Dark',
      icon: '🎨',
    },
    
    // Pro benefits summary
    proBenefits: [
      '🔐 SSH Terminal for remote servers',
      '📋 Blueprints with Kanban & diagrams',
      '⏱️ Time Travel debugging',
      '📘 TypeScript & Python execution',
      '💾 Unlimited snippets',
      '📁 Unlimited collections',
      '📜 Forever execution history',
      '📤 Export to Markdown, Gist, PDF',
      '☁️ Cloud sync across devices',
      '🎨 Custom themes',
      '⚡ Priority support',
    ],
    
    // What's locked in Free
    freeLockedFeatures: [
      { name: 'SSH Terminal', icon: '🔐', description: 'Secure remote server access' },
      { name: 'Blueprints', icon: '📋', description: 'Project planning with Kanban & diagrams' },
      { name: 'Time Travel', icon: '⏱️', description: 'See variable changes during execution' },
      { name: 'TypeScript', icon: '📘', description: 'Run TypeScript with type checking' },
      { name: 'Python', icon: '🐍', description: 'Run Python scripts' },
    ],
    
    // Price
    price: '$29',
    priceNote: 'One-time purchase. Yours forever.',
  };
}

// =====================================================
// UPGRADE MESSAGES (Psychologically Positive)
// =====================================================

const UPGRADE_MESSAGES = {
  projects: {
    title: "🎉 You've filled up 5 projects!",
    message: "That means you're getting real work done.",
    action: "Free includes 5 projects.",
    options: [
      { label: 'Archive a project', action: 'archive' },
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
  },
  snippets: {
    title: "💾 You've saved 3 snippets!",
    message: "You're building a useful code library.",
    action: "Free includes 3 snippets. Pro gives you unlimited.",
    options: [
      { label: 'Delete an old snippet', action: 'delete' },
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
  },
  history: {
    title: "📜 Looking for older history?",
    message: "Free keeps 3 days of execution history.",
    action: "Pro keeps your full history forever — so you never lose an experiment.",
    options: [
      { label: 'That\'s okay', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
  },
  language: {
    title: "✨ {language} is a Pro feature",
    message: "Free includes JavaScript only.",
    action: "Pro unlocks TypeScript, Python, and 15+ languages.",
    options: [
      { label: 'Use JavaScript', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
  },
  export: {
    title: "✨ Export to {format} is a Pro feature",
    message: "You can still copy your code to clipboard.",
    action: "Pro adds one-click export to Gist, Markdown, and PDF.",
    options: [
      { label: 'Copy to clipboard', action: 'clipboard' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
  },
  ssh: {
    title: "🔐 SSH Terminal is a Pro feature",
    message: "Connect to remote servers securely.",
    action: "Pro unlocks SSH Terminal for remote server management.",
    options: [
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
    icon: '🔐',
    featureHighlights: [
      'Secure SSH connections',
      'Save unlimited hosts',
      'Full terminal emulator',
      'Session management',
    ],
  },
  blueprints: {
    title: "📋 Blueprints is a Pro feature",
    message: "Plan and organize your projects like a pro.",
    action: "Pro unlocks Blueprints with Kanban boards, diagrams, and notes.",
    options: [
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
    icon: '📋',
    featureHighlights: [
      'Kanban boards for tasks',
      'Excalidraw diagrams',
      'Markdown notes',
      'Project modules',
    ],
  },
  timeTravel: {
    title: "⏱️ Time Travel is a Pro feature",
    message: "See how variables change during execution.",
    action: "Pro unlocks Time Travel to debug like a pro.",
    options: [
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
    icon: '⏱️',
  },
  collections: {
    title: "📁 You've reached 2 collections!",
    message: "Organize your projects your way.",
    action: "Free includes 2 collections. Pro gives you unlimited.",
    options: [
      { label: 'Delete a collection', action: 'delete' },
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
  },
  todos: {
    title: "✅ You've created 5 todos!",
    message: "Stay on top of your tasks.",
    action: "Free includes 5 todos. Pro gives you unlimited.",
    options: [
      { label: 'Complete a todo', action: 'complete' },
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
  },
  typescript: {
    title: "✨ TypeScript is a Pro feature",
    message: "Run TypeScript with full type checking.",
    action: "Pro unlocks TypeScript, Python, and more.",
    options: [
      { label: 'Use JavaScript', action: 'javascript' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
    icon: '📘',
  },
  python: {
    title: "🐍 Python is a Pro feature",
    message: "Run Python scripts directly in the playground.",
    action: "Pro unlocks Python, TypeScript, and more.",
    options: [
      { label: 'Use JavaScript', action: 'javascript' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
    icon: '🐍',
  },
  generic: {
    title: "✨ This is a Pro feature",
    message: "Upgrade when you're ready.",
    action: "Pro unlocks power, speed, and unlimited capacity.",
    options: [
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Upgrade to Pro', action: 'upgrade' },
    ],
  },
};

/**
 * Get upgrade message for a specific limit type
 */
function getUpgradeMessage(type, params = {}) {
  const msg = UPGRADE_MESSAGES[type] || UPGRADE_MESSAGES.generic;
  
  // Replace placeholders
  let result = JSON.parse(JSON.stringify(msg));
  Object.keys(params).forEach(key => {
    result.title = result.title.replace(`{${key}}`, params[key]);
    result.message = result.message.replace(`{${key}}`, params[key]);
    result.action = result.action.replace(`{${key}}`, params[key]);
  });
  
  return result;
}

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  // Tier detection
  getCurrentTier,
  isPro,
  getCurrentLimits,
  
  // Project limits
  canCreateProject,
  getProjectLimitInfo,
  
  // Snippet limits
  canSaveSnippet,
  getSnippetLimitInfo,
  
  // History limits
  filterHistoryByTier,
  getHistoryLimitInfo,
  
  // Language limits
  isLanguageAvailable,
  getAvailableLanguages,
  ALL_LANGUAGES,
  
  // Export limits
  canExport,
  getAvailableExports,
  
  // Pro feature checks
  canSync,
  canBatchRun,
  canCustomTheme,
  
  // SSH Access (Quota-Based)
  canAccessSSH,
  canStartSshSession,
  isSshSessionExpired,
  getTimeUntilMidnight,
  
  // Blueprints Access
  canAccessBlueprints,
  canCreateBlueprint,
  canCreateTodo,
  
  // Collections
  canCreateCollection,
  getCollectionLimitInfo,
  
  // Time Travel (Taste of Power)
  canUseTimeTravel,
  getTimeTravelLimit,
  filterValueHistory,
  
  // Language Execution (Quota-Based)
  canExecuteTypeScript,
  canExecutePython,
  getLanguageQuotaStatus,
  
  // Upgrade nudging
  shouldShowUpgradeNudge,
  recordUpgradeNudge,
  resetNudgeCount,
  
  // UI helpers
  getFeatureSummary,
  getUpgradeMessage,
  UPGRADE_MESSAGES,
  
  // Constants
  LIMITS,
};


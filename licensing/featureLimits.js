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

const LIMITS = {
  // FREE TIER
  free: {
    projects: 3,              // 3 projects (enough for learning + experimenting)
    snippets: 10,             // 10 saved snippets
    historyDays: 7,           // 7 days of execution history
    languages: ['javascript', 'python', 'shell'], // Core languages
    export: ['clipboard'],    // Copy to clipboard only
    themes: ['dark', 'light'], // Basic themes
    templates: 5,             // 5 basic templates
    canSync: false,           // No cloud sync
    canBatchRun: false,       // No batch execution
    canCustomTheme: false,    // No custom themes
  },
  
  // PRO TIER
  pro: {
    projects: Infinity,       // Unlimited projects
    snippets: Infinity,       // Unlimited snippets
    historyDays: Infinity,    // Forever history
    languages: 'all',         // All languages (15+)
    export: ['clipboard', 'markdown', 'gist', 'pdf'], // Full export
    themes: 'all',            // All themes + custom
    templates: 'all',         // All templates
    canSync: true,            // Cloud sync
    canBatchRun: true,        // Batch execution
    canCustomTheme: true,     // Custom themes
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
 * @param {number} currentSnippetCount - Current number of saved snippets
 */
function canSaveSnippet(currentSnippetCount) {
  const limits = getCurrentLimits();
  const tier = getCurrentTier();
  
  if (tier === 'pro') {
    return { allowed: true };
  }
  
  if (currentSnippetCount >= limits.snippets) {
    return {
      allowed: false,
      reason: `Nice library! You've saved ${limits.snippets} snippets.`,
      limit: limits.snippets,
      current: currentSnippetCount,
      upgradeHint: 'Pro lets you save unlimited snippets — build your personal code library.',
      softAction: 'delete_old', // Suggest deleting old snippets
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
      limit: tier === 'pro' ? 'All (15+)' : `${limits.languages.length} (JS, Python, Shell)`,
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
      'Unlimited projects',
      'Unlimited snippets',
      'Full execution history (forever)',
      '15+ programming languages',
      'Export to Markdown, Gist, PDF',
      'Cloud sync across devices',
      'Custom themes',
      'Batch execution',
      'Priority support',
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
    title: "🎉 You've filled up 3 projects!",
    message: "That means you're getting real work done.",
    action: "Free includes 3 projects.",
    options: [
      { label: 'Archive a project', action: 'archive' },
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'See Pro', action: 'upgrade' },
    ],
  },
  snippets: {
    title: "💾 Nice library! You've saved 10 snippets.",
    message: "You're building something useful.",
    action: "Free includes 10 snippets.",
    options: [
      { label: 'Delete an old snippet', action: 'delete' },
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'See Pro', action: 'upgrade' },
    ],
  },
  history: {
    title: "📜 Looking for older history?",
    message: "Free keeps 7 days of execution history.",
    action: "Pro keeps your full history forever — so you never lose an experiment.",
    options: [
      { label: 'That\'s okay', action: 'dismiss' },
      { label: 'Learn about Pro', action: 'upgrade' },
    ],
  },
  language: {
    title: "✨ {language} is a Pro language",
    message: "Free includes JavaScript, Python, and Shell.",
    action: "Pro unlocks 15+ languages for all your experiments.",
    options: [
      { label: 'Use a free language', action: 'dismiss' },
      { label: 'Learn about Pro', action: 'upgrade' },
    ],
  },
  export: {
    title: "✨ Export to {format} is a Pro feature",
    message: "You can still copy your code to clipboard.",
    action: "Pro adds one-click export to Gist, Markdown, and PDF.",
    options: [
      { label: 'Copy to clipboard', action: 'clipboard' },
      { label: 'Learn about Pro', action: 'upgrade' },
    ],
  },
  generic: {
    title: "✨ This is a Pro feature",
    message: "Upgrade when you're ready.",
    action: "Pro unlocks power, speed, and unlimited capacity.",
    options: [
      { label: 'Maybe later', action: 'dismiss' },
      { label: 'Learn about Pro', action: 'upgrade' },
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


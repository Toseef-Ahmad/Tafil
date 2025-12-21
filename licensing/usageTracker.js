/**
 * TAFIL Usage Tracker
 * 
 * Implements the "Taste of Power" monetization model:
 * - Daily usage quotas instead of hard locks
 * - Users experience Pro features with limits
 * - Creates desire to upgrade without frustration
 */

const { app } = require('electron');
const fs = require('fs');
const path = require('path');

// Daily quotas for free users
const FREE_QUOTAS = {
  typescriptExecutions: 15,    // 15 TS runs per day
  pythonExecutions: 15,        // 15 Python runs per day
  sshSessions: 1,              // 1 SSH session per day
  sshSessionMinutes: 10,       // Max 10 minutes per session
  timeTravelStates: 3,         // Show last 3 states (Pro = unlimited)
  blueprints: 1,               // 1 active blueprint (Pro = unlimited)
  snippets: 5,                 // 5 snippets (Pro = unlimited)
  collections: 3,              // 3 collections (Pro = unlimited)
};

// Pro users get unlimited
const PRO_QUOTAS = {
  typescriptExecutions: Infinity,
  pythonExecutions: Infinity,
  sshSessions: Infinity,
  sshSessionMinutes: Infinity,
  timeTravelStates: Infinity,
  blueprints: Infinity,
  snippets: Infinity,
  collections: Infinity,
};

let usageData = null;
let usageFilePath = null;

/**
 * Get the usage data file path
 */
function getUsageFilePath() {
  if (usageFilePath) return usageFilePath;
  
  const userDataPath = app.getPath('userData');
  usageFilePath = path.join(userDataPath, 'usage-stats.json');
  return usageFilePath;
}

/**
 * Load usage data from disk
 */
function loadUsageData() {
  if (usageData) return usageData;
  
  try {
    const filePath = getUsageFilePath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      usageData = data;
      
      // Check if we need to reset daily counters
      if (shouldResetDaily(data.lastResetDate)) {
        resetDailyCounters();
      }
      
      return usageData;
    }
  } catch (e) {
    console.warn('Failed to load usage data:', e);
  }
  
  // Initialize fresh data
  usageData = createFreshUsageData();
  saveUsageData();
  return usageData;
}

/**
 * Create fresh usage data structure
 */
function createFreshUsageData() {
  const today = new Date().toISOString().split('T')[0];
  return {
    lastResetDate: today,
    daily: {
      typescriptExecutions: 0,
      pythonExecutions: 0,
      sshSessions: 0,
      sshMinutesUsed: 0,
    },
    lifetime: {
      totalExecutions: 0,
      totalSshSessions: 0,
      upgradePromptsShown: 0,
      firstUsedDate: today,
    },
    currentSession: {
      sshStartTime: null,
      activeBlueprints: [],
    },
  };
}

/**
 * Check if we should reset daily counters
 */
function shouldResetDaily(lastResetDate) {
  if (!lastResetDate) return true;
  
  const today = new Date().toISOString().split('T')[0];
  return lastResetDate !== today;
}

/**
 * Reset daily counters
 */
function resetDailyCounters() {
  const today = new Date().toISOString().split('T')[0];
  usageData.lastResetDate = today;
  usageData.daily = {
    typescriptExecutions: 0,
    pythonExecutions: 0,
    sshSessions: 0,
    sshMinutesUsed: 0,
  };
  saveUsageData();
  console.log('🔄 Daily usage counters reset');
}

/**
 * Save usage data to disk
 */
function saveUsageData() {
  try {
    const filePath = getUsageFilePath();
    fs.writeFileSync(filePath, JSON.stringify(usageData, null, 2));
  } catch (e) {
    console.warn('Failed to save usage data:', e);
  }
}

/**
 * Get current quotas based on license status
 */
function getQuotas(isPro) {
  return isPro ? PRO_QUOTAS : FREE_QUOTAS;
}

/**
 * Get current daily usage stats
 */
function getDailyUsage() {
  loadUsageData();
  return { ...usageData.daily };
}

/**
 * Get remaining quota for a feature
 */
function getRemaining(feature, isPro) {
  loadUsageData();
  const quotas = getQuotas(isPro);
  const limit = quotas[feature];
  
  if (limit === Infinity) {
    return { remaining: Infinity, limit: Infinity, used: 0, unlimited: true };
  }
  
  let used = 0;
  switch (feature) {
    case 'typescriptExecutions':
      used = usageData.daily.typescriptExecutions;
      break;
    case 'pythonExecutions':
      used = usageData.daily.pythonExecutions;
      break;
    case 'sshSessions':
      used = usageData.daily.sshSessions;
      break;
    case 'sshSessionMinutes':
      used = usageData.daily.sshMinutesUsed;
      break;
    default:
      used = 0;
  }
  
  const remaining = Math.max(0, limit - used);
  
  return {
    remaining,
    limit,
    used,
    unlimited: false,
    percentUsed: Math.round((used / limit) * 100),
  };
}

/**
 * Check if user can perform an action
 */
function canPerform(feature, isPro) {
  const { remaining, unlimited } = getRemaining(feature, isPro);
  return unlimited || remaining > 0;
}

/**
 * Record a TypeScript execution
 */
function recordTypescriptExecution() {
  loadUsageData();
  usageData.daily.typescriptExecutions++;
  usageData.lifetime.totalExecutions++;
  saveUsageData();
  return usageData.daily.typescriptExecutions;
}

/**
 * Record a Python execution
 */
function recordPythonExecution() {
  loadUsageData();
  usageData.daily.pythonExecutions++;
  usageData.lifetime.totalExecutions++;
  saveUsageData();
  return usageData.daily.pythonExecutions;
}

/**
 * Start an SSH session
 */
function startSshSession() {
  loadUsageData();
  usageData.daily.sshSessions++;
  usageData.lifetime.totalSshSessions++;
  usageData.currentSession.sshStartTime = Date.now();
  saveUsageData();
  return usageData.daily.sshSessions;
}

/**
 * Get SSH session elapsed time in minutes
 */
function getSshSessionMinutes() {
  loadUsageData();
  if (!usageData.currentSession.sshStartTime) return 0;
  
  const elapsed = Date.now() - usageData.currentSession.sshStartTime;
  return Math.floor(elapsed / 60000); // Convert to minutes
}

/**
 * Check if SSH session has exceeded time limit
 */
function isSshSessionExpired(isPro) {
  if (isPro) return false;
  
  const minutes = getSshSessionMinutes();
  return minutes >= FREE_QUOTAS.sshSessionMinutes;
}

/**
 * End SSH session
 */
function endSshSession() {
  loadUsageData();
  if (usageData.currentSession.sshStartTime) {
    const minutes = getSshSessionMinutes();
    usageData.daily.sshMinutesUsed += minutes;
    usageData.currentSession.sshStartTime = null;
    saveUsageData();
  }
}

/**
 * Record an upgrade prompt shown
 */
function recordUpgradePrompt() {
  loadUsageData();
  usageData.lifetime.upgradePromptsShown++;
  saveUsageData();
}

/**
 * Get comprehensive usage summary for UI
 */
function getUsageSummary(isPro) {
  loadUsageData();
  const quotas = getQuotas(isPro);
  
  return {
    isPro,
    daily: usageData.daily,
    lifetime: usageData.lifetime,
    quotas: FREE_QUOTAS,
    
    // Quick access to remaining
    typescript: getRemaining('typescriptExecutions', isPro),
    python: getRemaining('pythonExecutions', isPro),
    ssh: getRemaining('sshSessions', isPro),
    sshTime: getRemaining('sshSessionMinutes', isPro),
    
    // Display strings
    display: {
      typescript: isPro ? 'Unlimited' : `${FREE_QUOTAS.typescriptExecutions - usageData.daily.typescriptExecutions}/${FREE_QUOTAS.typescriptExecutions} today`,
      python: isPro ? 'Unlimited' : `${FREE_QUOTAS.pythonExecutions - usageData.daily.pythonExecutions}/${FREE_QUOTAS.pythonExecutions} today`,
      ssh: isPro ? 'Unlimited' : `${FREE_QUOTAS.sshSessions - usageData.daily.sshSessions}/${FREE_QUOTAS.sshSessions} session today`,
    },
    
    // Time until reset
    resetTime: getTimeUntilReset(),
  };
}

/**
 * Get time until daily reset
 */
function getTimeUntilReset() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  return { hours, minutes, display: `${hours}h ${minutes}m` };
}

/**
 * Get upgrade message for a specific quota hit
 */
function getQuotaHitMessage(feature) {
  const messages = {
    typescriptExecutions: {
      title: "You're a Power User! ⚡",
      subtitle: `You've used your daily ${FREE_QUOTAS.typescriptExecutions} TypeScript runs`,
      benefit: "Upgrade to Pro for unlimited TypeScript execution",
      icon: "📘",
    },
    pythonExecutions: {
      title: "Python Power User! 🐍",
      subtitle: `You've used your daily ${FREE_QUOTAS.pythonExecutions} Python runs`,
      benefit: "Upgrade to Pro for unlimited Python execution",
      icon: "🐍",
    },
    sshSessions: {
      title: "SSH Session Limit",
      subtitle: "You've used your daily SSH session",
      benefit: "Upgrade to Pro for unlimited SSH connections",
      icon: "🔐",
    },
    sshSessionMinutes: {
      title: "Session Time Limit",
      subtitle: `Your ${FREE_QUOTAS.sshSessionMinutes}-minute SSH session has ended`,
      benefit: "Upgrade to Pro for unlimited session time",
      icon: "⏱️",
    },
  };
  
  return messages[feature] || {
    title: "Daily Limit Reached",
    subtitle: "You've hit your daily quota for this feature",
    benefit: "Upgrade to Pro for unlimited access",
    icon: "⭐",
  };
}

module.exports = {
  // Quotas
  FREE_QUOTAS,
  PRO_QUOTAS,
  getQuotas,
  
  // Usage tracking
  loadUsageData,
  getDailyUsage,
  getRemaining,
  canPerform,
  getUsageSummary,
  
  // Recording
  recordTypescriptExecution,
  recordPythonExecution,
  startSshSession,
  endSshSession,
  getSshSessionMinutes,
  isSshSessionExpired,
  recordUpgradePrompt,
  
  // Helpers
  resetDailyCounters,
  getTimeUntilReset,
  getQuotaHitMessage,
};


/**
 * TAFIL Pro Timer System
 * 
 * "20-Minute Daily Pro Pass" Implementation
 * 
 * - Free users get 20 minutes of "Active Pro Time" per day
 * - Timer only counts down when actively using Pro features
 * - When time runs out, switch to read-only mode (not close)
 * - Resets at midnight
 */

const { app } = require('electron');
const fs = require('fs');
const path = require('path');

// Daily Pro Time Limit (in seconds)
const FREE_PRO_SECONDS = 20 * 60; // 20 minutes = 1200 seconds

// State
let timerData = null;
let timerFilePath = null;
let isTimerActive = false;
let timerInterval = null;
let lastTickTime = null;

/**
 * Get timer data file path
 */
function getTimerFilePath() {
  if (timerFilePath) return timerFilePath;
  
  const userDataPath = app.getPath('userData');
  timerFilePath = path.join(userDataPath, 'pro-timer.json');
  return timerFilePath;
}

/**
 * Load timer data from disk
 */
function loadTimerData() {
  if (timerData) return timerData;
  
  try {
    const filePath = getTimerFilePath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      timerData = data;
      
      // Check if we need to reset daily timer
      if (shouldResetDaily(data.lastResetDate)) {
        resetDailyTimer();
      }
      
      return timerData;
    }
  } catch (e) {
    console.warn('Failed to load timer data:', e);
  }
  
  // Initialize fresh data
  timerData = createFreshTimerData();
  saveTimerData();
  return timerData;
}

/**
 * Create fresh timer data
 */
function createFreshTimerData() {
  const today = new Date().toISOString().split('T')[0];
  return {
    lastResetDate: today,
    secondsUsedToday: 0,
    totalSecondsLimit: FREE_PRO_SECONDS,
    isExpired: false,
    sessions: [],
    lifetime: {
      totalSecondsUsed: 0,
      totalSessions: 0,
      firstUsedDate: today,
    },
  };
}

/**
 * Check if we should reset daily timer
 */
function shouldResetDaily(lastResetDate) {
  if (!lastResetDate) return true;
  
  const today = new Date().toISOString().split('T')[0];
  return lastResetDate !== today;
}

/**
 * Reset daily timer
 */
function resetDailyTimer() {
  const today = new Date().toISOString().split('T')[0];
  timerData.lastResetDate = today;
  timerData.secondsUsedToday = 0;
  timerData.isExpired = false;
  timerData.sessions = [];
  saveTimerData();
  console.log('🔄 Daily Pro timer reset - 20 minutes available');
}

/**
 * Save timer data to disk
 */
function saveTimerData() {
  try {
    const filePath = getTimerFilePath();
    fs.writeFileSync(filePath, JSON.stringify(timerData, null, 2));
  } catch (e) {
    console.warn('Failed to save timer data:', e);
  }
}

/**
 * Get remaining seconds
 */
function getRemainingSeconds() {
  loadTimerData();
  const remaining = FREE_PRO_SECONDS - timerData.secondsUsedToday;
  return Math.max(0, remaining);
}

/**
 * Format seconds as MM:SS
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get timer status for UI
 */
function getTimerStatus() {
  loadTimerData();
  
  const remaining = getRemainingSeconds();
  const isExpired = remaining <= 0;
  const percentUsed = Math.round((timerData.secondsUsedToday / FREE_PRO_SECONDS) * 100);
  
  return {
    isActive: isTimerActive,
    isExpired,
    secondsUsed: timerData.secondsUsedToday,
    secondsRemaining: remaining,
    totalSeconds: FREE_PRO_SECONDS,
    percentUsed,
    display: formatTime(remaining),
    displayFull: `${Math.floor(remaining / 60)} min ${remaining % 60} sec`,
    resetTime: getTimeUntilMidnight(),
  };
}

/**
 * Get time until midnight
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

/**
 * Start the Pro timer
 * Call this when user starts using a Pro feature
 */
function startTimer(callback) {
  loadTimerData();
  
  // Check if already expired
  if (timerData.isExpired || getRemainingSeconds() <= 0) {
    timerData.isExpired = true;
    saveTimerData();
    if (callback) callback({ isExpired: true, remaining: 0 });
    return false;
  }
  
  if (isTimerActive) {
    return true; // Already running
  }
  
  isTimerActive = true;
  lastTickTime = Date.now();
  
  // Start interval to tick every second
  timerInterval = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - lastTickTime) / 1000);
    
    if (elapsed >= 1) {
      timerData.secondsUsedToday += elapsed;
      timerData.lifetime.totalSecondsUsed += elapsed;
      lastTickTime = now;
      
      const remaining = getRemainingSeconds();
      
      if (remaining <= 0) {
        timerData.isExpired = true;
        stopTimer();
        saveTimerData();
        if (callback) callback({ isExpired: true, remaining: 0 });
      } else {
        saveTimerData();
        if (callback) callback({ isExpired: false, remaining });
      }
    }
  }, 1000);
  
  // Record session start
  timerData.sessions.push({
    startTime: new Date().toISOString(),
    type: 'pro_feature',
  });
  timerData.lifetime.totalSessions++;
  saveTimerData();
  
  console.log('⏱️ Pro timer started - ' + formatTime(getRemainingSeconds()) + ' remaining');
  return true;
}

/**
 * Stop the Pro timer
 * Call this when user stops using Pro features
 */
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isTimerActive = false;
  lastTickTime = null;
  
  // Update last session end time
  if (timerData && timerData.sessions.length > 0) {
    const lastSession = timerData.sessions[timerData.sessions.length - 1];
    if (!lastSession.endTime) {
      lastSession.endTime = new Date().toISOString();
    }
    saveTimerData();
  }
  
  console.log('⏱️ Pro timer paused');
}

/**
 * Check if Pro features are available
 */
function canUseProFeatures() {
  loadTimerData();
  const remaining = getRemainingSeconds();
  return remaining > 0;
}

/**
 * Get expired state message
 */
function getExpiredMessage() {
  return {
    title: "⏱️ Daily Pro Time Used",
    subtitle: "You've used your 20-minute Pro Pass for today",
    message: "Your work is safe. Switch to read-only mode until tomorrow, or upgrade to Pro for unlimited access.",
    resetTime: getTimeUntilMidnight(),
    benefits: [
      'Unlimited Blueprint editing',
      'Unlimited SSH sessions',
      'TypeScript & Python with no limits',
      'Full Time Travel history',
    ],
  };
}

/**
 * Add bonus time (for special promotions)
 */
function addBonusTime(seconds) {
  loadTimerData();
  timerData.secondsUsedToday = Math.max(0, timerData.secondsUsedToday - seconds);
  timerData.isExpired = false;
  saveTimerData();
  return getRemainingSeconds();
}

module.exports = {
  // Constants
  FREE_PRO_SECONDS,
  
  // Timer control
  startTimer,
  stopTimer,
  
  // Status
  getTimerStatus,
  getRemainingSeconds,
  canUseProFeatures,
  formatTime,
  
  // Reset
  resetDailyTimer,
  
  // Messages
  getExpiredMessage,
  getTimeUntilMidnight,
  
  // Bonus
  addBonusTime,
};


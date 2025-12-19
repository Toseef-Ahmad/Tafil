/**
 * Device ID Generator
 * 
 * Generates a stable, unique device identifier using:
 * - OS type and platform
 * - Hostname
 * - Random install UUID (stored locally for stability)
 * 
 * Does NOT use MAC address or disk serials for privacy/stability
 */

const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Get the Tafil data directory
function getTafilDataDir() {
  const homeDir = os.homedir();
  const tafilDir = path.join(homeDir, '.tafil');
  
  if (!fs.existsSync(tafilDir)) {
    fs.mkdirSync(tafilDir, { recursive: true, mode: 0o700 });
  }
  
  return tafilDir;
}

// Get or create install UUID (persists across sessions)
function getInstallUUID() {
  const uuidPath = path.join(getTafilDataDir(), '.install-id');
  
  try {
    if (fs.existsSync(uuidPath)) {
      const uuid = fs.readFileSync(uuidPath, 'utf8').trim();
      if (uuid && uuid.length >= 32) {
        return uuid;
      }
    }
  } catch (e) {
    // Ignore read errors, generate new
  }
  
  // Generate new UUID
  const newUUID = crypto.randomUUID();
  
  try {
    fs.writeFileSync(uuidPath, newUUID, { mode: 0o600 });
  } catch (e) {
    console.error('Failed to persist install UUID:', e.message);
  }
  
  return newUUID;
}

// Generate device fingerprint components
function getDeviceComponents() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    osType: os.type(),
    osRelease: os.release(),
    installId: getInstallUUID(),
  };
}

// Generate stable device ID hash
function generateDeviceId() {
  const components = getDeviceComponents();
  
  // Create a stable string from components
  const fingerprint = [
    components.platform,
    components.arch,
    components.hostname,
    components.osType,
    components.installId,
  ].join('|');
  
  // Hash for privacy and consistency
  const hash = crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex');
  
  // Return first 32 chars for readability
  return hash.substring(0, 32);
}

// Get device ID (cached for performance)
let cachedDeviceId = null;

function getDeviceId() {
  if (!cachedDeviceId) {
    cachedDeviceId = generateDeviceId();
  }
  return cachedDeviceId;
}

// Get short device ID for display
function getShortDeviceId() {
  const full = getDeviceId();
  return full.substring(0, 8).toUpperCase();
}

// Validate that a device ID matches current device
function isCurrentDevice(deviceId) {
  if (!deviceId) return false;
  return deviceId === getDeviceId();
}

module.exports = {
  getDeviceId,
  getShortDeviceId,
  getDeviceComponents,
  isCurrentDevice,
  getTafilDataDir,
};


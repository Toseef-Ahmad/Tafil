/**
 * Feature Guard
 * 
 * Provides license checks that are:
 * - Spread across the app
 * - Non-obvious
 * - Defensive
 * 
 * DO NOT use simple if (isPro) patterns.
 * These checks are designed to be resilient to tampering.
 */

const crypto = require('crypto');
const { verifyLicense, VerifyResult } = require('./verifier');
const { loadLicense } = require('./licenseLoader');
const { getDeviceId } = require('./deviceId');

// Internal state (obfuscated names)
let _vc = null; // verification cache
let _vt = 0;    // verification timestamp
const _vi = 30000; // cache interval (30s)

// Salts for integrity checks (obfuscated)
const _s1 = 'tfl_';
const _s2 = '_grd';
const _s3 = 'chk';

// Get cached verification or verify fresh
function _getVerification() {
  const now = Date.now();
  if (!_vc || (now - _vt) > _vi) {
    _vc = verifyLicense();
    _vt = now;
  }
  return _vc;
}

// Hash check for integrity (obfuscated)
function _intCheck(v, s) {
  if (!v || !s) return false;
  try {
    const h = crypto.createHash('md5').update(s).digest('hex').substring(0, 8);
    return v === h;
  } catch {
    return false;
  }
}

// Generate integrity token
function _genToken(seed) {
  return crypto.createHash('md5').update(`${_s1}${seed}${_s2}`).digest('hex').substring(0, 8);
}

/**
 * Guard: Check if action is allowed
 * Returns { allowed: boolean, reason?: string }
 */
function guardAction(actionName) {
  const v = _getVerification();
  
  if (!v || !v.valid) {
    const reasons = {
      [VerifyResult.NO_LICENSE]: 'Please activate your license to use this feature.',
      [VerifyResult.WRONG_DEVICE]: 'License is registered to a different device. Please reactivate.',
      [VerifyResult.INVALID_SIGNATURE]: 'License validation failed. Please reactivate.',
      [VerifyResult.EXPIRED]: 'Your license has expired.',
    };
    
    return {
      allowed: false,
      code: v?.code || VerifyResult.NO_LICENSE,
      reason: reasons[v?.code] || 'License required for this feature.',
    };
  }
  
  // License is valid - check features
  const features = v.features || {};
  
  // If license has proFeatures: true, allow everything
  if (features.proFeatures === true || features.pro === true) {
    return { allowed: true };
  }
  
  // Map actions to required features (for granular licenses)
  const actionFeatures = {
    'project.create': 'projects',
    'project.run': 'projects',
    'playground.execute': 'playground',
    'blueprint.edit': 'blueprint',
    'ssh.connect': 'pro',
    'dependency.install': 'projects',
    'server.start': 'projects',
  };
  
  const requiredFeature = actionFeatures[actionName];
  if (requiredFeature && !features[requiredFeature]) {
    return {
      allowed: false,
      code: 'feature_disabled',
      reason: `This feature requires ${requiredFeature} license.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Quick guards for common actions
 * These are designed to be called at multiple points
 */

// Guard for project creation
function canCreateProject() {
  const r = guardAction('project.create');
  return r.allowed;
}

// Guard for running projects
function canRunProject() {
  const r = guardAction('project.run');
  return r.allowed;
}

// Guard for playground execution
function canExecutePlayground() {
  const r = guardAction('playground.execute');
  return r.allowed;
}

// Guard for blueprint editing
function canEditBlueprint() {
  const r = guardAction('blueprint.edit');
  return r.allowed;
}

// Guard for SSH connections
function canConnectSSH() {
  const r = guardAction('ssh.connect');
  return r.allowed;
}

// Guard for dependency installation
function canInstallDependencies() {
  const r = guardAction('dependency.install');
  return r.allowed;
}

/**
 * Integrity check - call this at random intervals
 * Returns true if license is intact
 */
function checkIntegrity() {
  const license = loadLicense();
  if (!license) return false;
  
  // Verify basic structure (support both old and new formats)
  if (!license.signature) return false;
  if (!license.payload && !license.data) return false;
  
  const payload = license.payload || license.data;
  
  // Verify device (support both deviceId and deviceFingerprint)
  const deviceId = payload.deviceId || payload.deviceFingerprint;
  if (deviceId && deviceId !== getDeviceId()) return false;
  
  // Verify app name (optional for new format)
  if (payload.app && payload.app !== 'TAFIL') return false;
  
  return true;
}

/**
 * Get license status for UI
 */
function getLicenseStatus() {
  const v = _getVerification();
  
  if (!v) {
    return {
      status: 'unknown',
      message: 'Unable to check license',
      needsActivation: true,
      isPro: false,
    };
  }
  
  if (v.valid) {
    const features = v.features || {};
    const isPro = features.proFeatures === true || features.pro === true;
    
    return {
      status: 'active',
      isPro: isPro,
      allFeaturesUnlocked: isPro,
      message: 'License is active',
      needsActivation: false,
      features: v.features,
      licenseKey: v.payload?.licenseKey,
      email: v.payload?.email,
    };
  }
  
  // Handle specific cases
  switch (v.code) {
    case VerifyResult.NO_LICENSE:
      return {
        status: 'not_activated',
        message: 'No license found',
        needsActivation: true,
      };
    
    case VerifyResult.WRONG_DEVICE:
      return {
        status: 'wrong_device',
        message: 'License registered to different device',
        needsReactivation: true,
      };
    
    case VerifyResult.EXPIRED:
      return {
        status: 'expired',
        message: 'License has expired',
        needsActivation: true,
      };
    
    case VerifyResult.INVALID_SIGNATURE:
    case VerifyResult.TAMPERED:
      return {
        status: 'invalid',
        message: 'License is invalid',
        needsActivation: true,
      };
    
    default:
      return {
        status: 'error',
        message: v.message || 'License error',
        needsActivation: true,
      };
  }
}

/**
 * Clear verification cache
 * Call this after activation/deactivation
 */
function clearCache() {
  _vc = null;
  _vt = 0;
}

/**
 * Silent check - returns boolean only
 * Use this for spread checks throughout the app
 */
function silentCheck() {
  try {
    const v = _getVerification();
    return v && v.valid === true;
  } catch {
    return false;
  }
}

// Alias for spread checks (obfuscated names)
const _c1 = silentCheck;
const _c2 = checkIntegrity;

module.exports = {
  guardAction,
  canCreateProject,
  canRunProject,
  canExecutePlayground,
  canEditBlueprint,
  canConnectSSH,
  canInstallDependencies,
  checkIntegrity,
  getLicenseStatus,
  clearCache,
  silentCheck,
  // Obfuscated exports for spread checks
  _c1,
  _c2,
};


/**
 * Tafil Licensing Module
 * 
 * Offline-first licensing system.
 * 
 * Usage:
 *   const licensing = require('./licensing');
 * 
 *   // Check license on startup (OFFLINE)
 *   const status = licensing.checkLicense();
 * 
 *   // Activate (requires network)
 *   await licensing.activate(key, email);
 * 
 *   // Feature guards (OFFLINE)
 *   if (licensing.canCreateProject()) { ... }
 */

const deviceId = require('./deviceId');
const licenseLoader = require('./licenseLoader');
const verifier = require('./verifier');
const featureGuard = require('./featureGuard');
const activator = require('./activator');

// Re-export everything
module.exports = {
  // Device ID
  getDeviceId: deviceId.getDeviceId,
  getShortDeviceId: deviceId.getShortDeviceId,
  isCurrentDevice: deviceId.isCurrentDevice,
  
  // License loading
  loadLicense: licenseLoader.loadLicense,
  saveLicense: licenseLoader.saveLicense,
  removeLicense: licenseLoader.removeLicense,
  hasLicenseFile: licenseLoader.hasLicenseFile,
  getLicenseInfo: licenseLoader.getLicenseInfo,
  
  // Verification (OFFLINE)
  verifyLicense: verifier.verifyLicense,
  isLicenseValid: verifier.isLicenseValid,
  getLicenseFeatures: verifier.getLicenseFeatures,
  hasFeature: verifier.hasFeature,
  isPro: verifier.isPro,
  VerifyResult: verifier.VerifyResult,
  
  // Feature guards (OFFLINE)
  guardAction: featureGuard.guardAction,
  canCreateProject: featureGuard.canCreateProject,
  canRunProject: featureGuard.canRunProject,
  canExecutePlayground: featureGuard.canExecutePlayground,
  canEditBlueprint: featureGuard.canEditBlueprint,
  canConnectSSH: featureGuard.canConnectSSH,
  canInstallDependencies: featureGuard.canInstallDependencies,
  getLicenseStatus: featureGuard.getLicenseStatus,
  checkIntegrity: featureGuard.checkIntegrity,
  clearCache: featureGuard.clearCache,
  silentCheck: featureGuard.silentCheck,
  
  // Activation (requires network)
  activateLicense: activator.activateLicense,
  deactivateLicense: activator.deactivateLicense,
  fetchPublicKey: activator.fetchPublicKey,
  checkServerConnection: activator.checkServerConnection,
  
  // Quick check function
  checkLicense: () => {
    const status = featureGuard.getLicenseStatus();
    return status;
  },
};


/**
 * Tafil Licensing Module
 * 
 * Offline-first licensing system with server integration
 */

const deviceId = require('./deviceId');
const licenseLoader = require('./licenseLoader');
const verifier = require('./verifier');
const featureGuard = require('./featureGuard');
const featureLimits = require('./featureLimits');
const activator = require('./activator');
const licenseManager = require('./license-manager');
const { registerLicenseHandlers } = require('./license-ipc');

// Re-export everything (keeping backward compatibility)
module.exports = {
  // Device ID
  getDeviceId: deviceId.getDeviceId,
  getShortDeviceId: deviceId.getShortDeviceId,
  isCurrentDevice: deviceId.isCurrentDevice,
  
  // License loading (old system - kept for compatibility)
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
  
  // New server-based license manager
  licenseManager: licenseManager,
  registerLicenseHandlers: registerLicenseHandlers,
  
  // Quick check function
  checkLicense: () => {
    const status = featureGuard.getLicenseStatus();
    return status;
  },
  
  // Feature Limits (Free vs Pro)
  featureLimits: featureLimits,
  getCurrentTier: featureLimits.getCurrentTier,
  isPro: featureLimits.isPro,
  canCreateProject: featureLimits.canCreateProject,
  canSaveSnippet: featureLimits.canSaveSnippet,
  filterHistoryByTier: featureLimits.filterHistoryByTier,
  isLanguageAvailable: featureLimits.isLanguageAvailable,
  canExport: featureLimits.canExport,
  getFeatureSummary: featureLimits.getFeatureSummary,
  getUpgradeMessage: featureLimits.getUpgradeMessage,
};


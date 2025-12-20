/**
 * License IPC Handlers
 * Exposes license manager functions to renderer process
 */

const { ipcMain } = require('electron');
const licenseManager = require('./license-manager');

/**
 * Register all license-related IPC handlers
 */
function registerLicenseHandlers() {
  
  /**
   * Get current license status
   */
  ipcMain.handle('license:getStatus', async () => {
    try {
      return licenseManager.getStatus();
    } catch (error) {
      console.error('Get status error:', error);
      return { error: error.message };
    }
  });

  /**
   * Activate a new license
   */
  ipcMain.handle('license:activate', async (event, licenseKey) => {
    try {
      const result = await licenseManager.activate(licenseKey);
      return { success: true, ...result };
    } catch (error) {
      console.error('Activation error:', error);
      return { success: false, error: error.message };
    }
  });

  /**
   * Sync with server (manual check)
   */
  ipcMain.handle('license:sync', async () => {
    try {
      const result = await licenseManager.syncWithServer();
      return { success: true, ...result };
    } catch (error) {
      console.error('Sync error:', error);
      return { success: false, error: error.message };
    }
  });

  /**
   * Deactivate current device
   */
  ipcMain.handle('license:deactivate', async () => {
    try {
      const result = await licenseManager.deactivate();
      return { success: true, ...result };
    } catch (error) {
      console.error('Deactivation error:', error);
      return { success: false, error: error.message };
    }
  });

  /**
   * Check if license is valid
   */
  ipcMain.handle('license:isValid', async () => {
    return licenseManager.hasValidLicense();
  });

  /**
   * Get device fingerprint (for debugging)
   */
  ipcMain.handle('license:getFingerprint', async () => {
    const fingerprint = licenseManager.generateDeviceFingerprint();
    return fingerprint.substring(0, 16) + '...'; // Return partial for display
  });

  console.log('✅ License IPC handlers registered');
}

module.exports = { registerLicenseHandlers };


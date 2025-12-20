/**
 * License Preload API
 * Safely exposes license functions to renderer process
 * Add these to your existing preload.js file
 */

const { contextBridge, ipcRenderer } = require('electron');

// Add this to your contextBridge.exposeInMainWorld() call
const licenseAPI = {
  /**
   * Get current license status
   */
  getStatus: () => ipcRenderer.invoke('license:getStatus'),

  /**
   * Activate a license
   */
  activate: (licenseKey) => ipcRenderer.invoke('license:activate', licenseKey),

  /**
   * Sync with server
   */
  sync: () => ipcRenderer.invoke('license:sync'),

  /**
   * Deactivate current device
   */
  deactivate: () => ipcRenderer.invoke('license:deactivate'),

  /**
   * Check if license is valid
   */
  isValid: () => ipcRenderer.invoke('license:isValid'),

  /**
   * Get device fingerprint (partial, for display)
   */
  getFingerprint: () => ipcRenderer.invoke('license:getFingerprint')
};

// Export for use in preload.js
module.exports = { licenseAPI };

// Or use directly:
// contextBridge.exposeInMainWorld('license', licenseAPI);


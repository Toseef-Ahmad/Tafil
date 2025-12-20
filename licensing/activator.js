/**
 * License Activator
 * 
 * Handles communication with the license server for:
 * - Activation (first time)
 * - Reactivation (device change)
 * - Deactivation
 * 
 * This is the ONLY part that makes network calls.
 * Normal app operation is fully OFFLINE.
 */

const https = require('https');
const http = require('http');
const { getDeviceId } = require('./deviceId');
const { saveLicense, removeLicense } = require('./licenseLoader');
const { clearCache } = require('./featureGuard');

// License server configuration
// Production server URL
const LICENSE_SERVER = {
  host: 'api.tafil.app',  // Production domain
  port: 443,               // HTTPS port
  protocol: 'https',       // Production uses HTTPS
};

// Build server URL
function getServerUrl(path) {
  return `${LICENSE_SERVER.protocol}://${LICENSE_SERVER.host}:${LICENSE_SERVER.port}${path}`;
}

// Make HTTP request to license server
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(getServerUrl(path));
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Tafil-Desktop/1.0',
      },
      timeout: 30000,
    };
    
    const req = client.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(json.error || json.message || `Server error: ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error(`Invalid response from server: ${e.message}`));
        }
      });
    });
    
    req.on('error', (e) => {
      if (e.code === 'ECONNREFUSED') {
        reject(new Error('Cannot connect to license server. Please check your internet connection.'));
      } else if (e.code === 'ETIMEDOUT' || e.code === 'ESOCKETTIMEDOUT') {
        reject(new Error('Connection timed out. Please try again.'));
      } else {
        reject(new Error(`Network error: ${e.message}`));
      }
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out. Please try again.'));
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Activate license
 * 
 * @param {string} licenseKey - The license key
 * @param {string} email - User's email
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function activateLicense(licenseKey, email) {
  if (!licenseKey || !email) {
    return { success: false, error: 'License key and email are required' };
  }
  
  // Normalize inputs
  const key = licenseKey.trim().toUpperCase();
  const mail = email.trim().toLowerCase();
  const deviceId = getDeviceId();
  
  try {
    const response = await makeRequest('POST', '/api/license/activate', {
      license_key: key,
      device_fingerprint: deviceId,
      device_name: require('os').hostname() || 'TAFIL Device',
      platform: require('os').platform(),
      app_version: '1.0.0',
    });
    
    // Response format: { success: true, signedLicense: {data, signature}, licenseInfo: {...} }
    if (!response.success || !response.signedLicense) {
      return { success: false, error: response.error || 'Activation failed' };
    }
    
    // Save the complete signed license (new format) for proper verification
    // We'll store both the original data and converted payload
    const licenseToSave = {
      // New format (for proper signature verification)
      data: response.signedLicense.data,
      signature: response.signedLicense.signature,
      algorithm: response.signedLicense.algorithm,
      // Old format (for backward compatibility)
      payload: {
        app: 'TAFIL',
        licenseKey: response.signedLicense.data.licenseKey,
        deviceId: deviceId,
        email: response.signedLicense.data.email,
        issuedAt: response.signedLicense.data.issuedAt,
        expiresAt: response.signedLicense.data.expiresAt,
        features: response.signedLicense.data.features,
        maxDevices: response.signedLicense.data.features?.maxDevices || 3,
      }
    };
    
    // Save the license locally
    saveLicense(licenseToSave);
    
    // Clear verification cache
    clearCache();
    
    return {
      success: true,
      message: 'License activated successfully!',
      license: licenseToSave,
      licenseInfo: response.licenseInfo,
    };
    
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Deactivate license (for device transfer)
 * 
 * @param {string} licenseKey - The license key
 * @param {string} email - User's email
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function deactivateLicense(licenseKey, email) {
  if (!licenseKey || !email) {
    return { success: false, error: 'License key and email are required' };
  }
  
  try {
    const response = await makeRequest('POST', '/api/license/deactivate', {
      license_key: licenseKey.trim().toUpperCase(),
      device_fingerprint: getDeviceId(),
    });
    
    if (!response.success) {
      return { success: false, error: response.error || 'Deactivation failed' };
    }
    
    // Remove local license file
    removeLicense();
    
    // Clear verification cache
    clearCache();
    
    return {
      success: true,
      message: 'License deactivated. You can now activate on another device.',
      remainingResets: response.remainingResets,
    };
    
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Fetch public key from server
 * Useful for initial setup or key rotation
 */
async function fetchPublicKey() {
  try {
    const response = await makeRequest('GET', '/public-key');
    return { success: true, publicKey: response.publicKey };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Check server connectivity
 */
async function checkServerConnection() {
  try {
    await makeRequest('GET', '/public-key');
    return { connected: true };
  } catch (e) {
    return { connected: false, error: e.message };
  }
}

module.exports = {
  activateLicense,
  deactivateLicense,
  fetchPublicKey,
  checkServerConnection,
  LICENSE_SERVER,
};


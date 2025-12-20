/**
 * License Loader
 * 
 * Handles loading and saving license files to disk.
 * License is stored at: ~/.tafil/license.json
 * 
 * License file format:
 * {
 *   "payload": { ... signed data ... },
 *   "signature": "base64-signature"
 * }
 */

const fs = require('fs');
const path = require('path');
const { getTafilDataDir } = require('./deviceId');

const LICENSE_FILENAME = 'license.json';

// Get license file path
function getLicenseFilePath() {
  return path.join(getTafilDataDir(), LICENSE_FILENAME);
}

// Load license from disk
function loadLicense() {
  const licensePath = getLicenseFilePath();
  
  try {
    if (!fs.existsSync(licensePath)) {
      return null;
    }
    
    const content = fs.readFileSync(licensePath, 'utf8');
    const license = JSON.parse(content);
    
    // Validate structure
    if (!license || !license.payload || !license.signature) {
      console.warn('Invalid license file structure');
      return null;
    }
    
    return license;
  } catch (e) {
    console.error('Failed to load license:', e.message);
    return null;
  }
}

// Save license to disk
function saveLicense(licenseData) {
  if (!licenseData || !licenseData.signature) {
    throw new Error('Invalid license data: missing signature');
  }
  
  // Accept either payload (old format) or data (new format)
  if (!licenseData.payload && !licenseData.data) {
    throw new Error('Invalid license data: missing payload or data');
  }
  
  const licensePath = getLicenseFilePath();
  
  try {
    // Ensure directory exists
    const dir = path.dirname(licensePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    }
    
    // Write license file with restricted permissions
    fs.writeFileSync(
      licensePath,
      JSON.stringify(licenseData, null, 2),
      { mode: 0o600 }
    );
    
    console.log('✅ License saved successfully');
    return true;
  } catch (e) {
    console.error('Failed to save license:', e.message);
    throw new Error('Failed to save license file');
  }
}

// Remove license file
function removeLicense() {
  const licensePath = getLicenseFilePath();
  
  try {
    if (fs.existsSync(licensePath)) {
      fs.unlinkSync(licensePath);
    }
    return true;
  } catch (e) {
    console.error('Failed to remove license:', e.message);
    return false;
  }
}

// Check if license file exists
function hasLicenseFile() {
  return fs.existsSync(getLicenseFilePath());
}

// Get license info (safe version without signature)
function getLicenseInfo() {
  const license = loadLicense();
  if (!license || !license.payload) {
    return null;
  }
  
  const { payload } = license;
  return {
    licenseKey: payload.licenseKey,
    email: payload.email,
    issuedAt: payload.issuedAt,
    features: payload.features || {},
    app: payload.app,
  };
}

module.exports = {
  loadLicense,
  saveLicense,
  removeLicense,
  hasLicenseFile,
  getLicenseInfo,
  getLicenseFilePath,
};


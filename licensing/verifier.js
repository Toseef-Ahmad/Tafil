/**
 * License Verifier
 * 
 * Performs OFFLINE cryptographic verification of license.
 * Uses public key only - no network calls.
 * 
 * Verification checks:
 * 1. Signature is valid
 * 2. App name matches
 * 3. Device ID matches current device
 * 4. License structure is valid
 */

const crypto = require('crypto');
const { loadLicense } = require('./licenseLoader');
const { getDeviceId, isCurrentDevice } = require('./deviceId');

// Public key for license verification
// This is embedded in the app and used to verify signatures
// The private key is NEVER included in the client
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Z3VS5JJcds3xfn0QLHM
7fHnHgYqpSPxGXxvBgGMEv6ACLW3x7HrLh5pBdqMGjGqpKwXz3dDvdqMoq3TYZth
HG3mHnxvLzJpZvCBfgxDPKzf6RzYGXE1n7cNvZMGfDWmM9jY8z8XhZKlsX9yPBvz
Y5xJbmhXvBhqGQYhqDPvxZ3HqMGvBZpXjxCvq8YGMzVfGwXpQDvLqMhGQYxvCBwZ
JxKlsX9yPBvzY5xJbmhXvBhqGQYhqDPvxZ3HqMGvBZpXjxCvq8YGMzVfGwXpQDvL
qMhGQYxvCBwZJxKlsX9yPBvzY5xJbmhXvBhqGQYhqDPvxZ3HqMGvBZpXjxCvq8YG
MzVfGwXpQDvLqMhGQYxvCBwZJxKlsX9yPBvzY5xJbmhXvBhqGQYhqDPvxZ3HqMGv
BQIDAQAB
-----END PUBLIC KEY-----`;

// App name that must match in license
const APP_NAME = 'TAFIL';

// Verification result codes
const VerifyResult = {
  VALID: 'valid',
  NO_LICENSE: 'no_license',
  INVALID_SIGNATURE: 'invalid_signature',
  WRONG_APP: 'wrong_app',
  WRONG_DEVICE: 'wrong_device',
  EXPIRED: 'expired',
  INVALID_STRUCTURE: 'invalid_structure',
  TAMPERED: 'tampered',
};

// Verify signature of license payload
function verifySignature(payload, signature) {
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(JSON.stringify(payload));
    verify.end();
    
    return verify.verify(PUBLIC_KEY, signature, 'base64');
  } catch (e) {
    console.error('Signature verification error:', e.message);
    return false;
  }
}

// Validate license payload structure
function validatePayloadStructure(payload) {
  if (!payload || typeof payload !== 'object') return false;
  
  const required = ['app', 'licenseKey', 'deviceId', 'issuedAt'];
  for (const field of required) {
    if (!(field in payload)) {
      return false;
    }
  }
  
  return true;
}

// Main verification function - OFFLINE ONLY
function verifyLicense() {
  const license = loadLicense();
  
  // No license file
  if (!license) {
    return {
      valid: false,
      code: VerifyResult.NO_LICENSE,
      message: 'No license found',
    };
  }
  
  const { payload, signature } = license;
  
  // Check structure
  if (!validatePayloadStructure(payload)) {
    return {
      valid: false,
      code: VerifyResult.INVALID_STRUCTURE,
      message: 'License file is corrupted',
    };
  }
  
  // Verify cryptographic signature
  if (!verifySignature(payload, signature)) {
    return {
      valid: false,
      code: VerifyResult.INVALID_SIGNATURE,
      message: 'License signature is invalid',
    };
  }
  
  // Check app name
  if (payload.app !== APP_NAME) {
    return {
      valid: false,
      code: VerifyResult.WRONG_APP,
      message: 'License is for a different application',
    };
  }
  
  // Check device ID
  if (!isCurrentDevice(payload.deviceId)) {
    return {
      valid: false,
      code: VerifyResult.WRONG_DEVICE,
      message: 'License is registered to a different device',
      currentDevice: getDeviceId(),
      licenseDevice: payload.deviceId,
    };
  }
  
  // Check expiration (if set)
  if (payload.validUntil && payload.validUntil > 0) {
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.validUntil) {
      return {
        valid: false,
        code: VerifyResult.EXPIRED,
        message: 'License has expired',
      };
    }
  }
  
  // All checks passed
  return {
    valid: true,
    code: VerifyResult.VALID,
    message: 'License is valid',
    payload: payload,
    features: payload.features || {},
  };
}

// Quick check if license is valid (boolean)
function isLicenseValid() {
  const result = verifyLicense();
  return result.valid;
}

// Get features from license (returns empty object if invalid)
function getLicenseFeatures() {
  const result = verifyLicense();
  if (!result.valid) {
    return {};
  }
  return result.features || {};
}

// Check if a specific feature is enabled
function hasFeature(featureName) {
  const features = getLicenseFeatures();
  return features[featureName] === true;
}

// Check if Pro license
function isPro() {
  return hasFeature('pro');
}

module.exports = {
  verifyLicense,
  isLicenseValid,
  getLicenseFeatures,
  hasFeature,
  isPro,
  VerifyResult,
  PUBLIC_KEY,
};


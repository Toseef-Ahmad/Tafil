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

// Public key for license verification (RSA-4096 from production server)
// This is embedded in the app and used to verify signatures
// The private key is NEVER included in the client
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtU6rrbwTviPus/YGYL5J
M5woVfg3M2/q5bjLl0KDgGPB+mDPaRnKllwTO/Vbyb/k4MeSsOTCFh5+nbHRkeVA
jq2WcaOo4SJhanmVqe1ld3j84dyIyOxWWQ0OlxYmgGLFIw8dcpFi1nOqrWqk2PqD
gLt/VR1+q3jWFPPh1QQ0s0z+HM/zfYbdbbjOLEYcw3YAc2+FaXic03nUKDYPlF/2
qZxthdaGlkMxLDBaYewHLuhFlsxCsDcoodRNXhfoyIjSplgeail/MmsDsg9en+H2
r+9dbuJmrgZkoNTG6wHEwvrXNmIBpxUSYQsrJCp7eg6Qm8RU5R4zPsiHtrUuRnHy
kFfyET5QpecHKlgayIsxszAPsOGSx/PFWcZULiB9snG6UjCXO/ZBODftio0cdi0L
/rnhCUZyA+LMgoS57jBGB/a3kvOdb02nBNtuY7gpyK50xhWbCTMgm6SQH6K+J6Jh
qcd6X/Kn4ckUU/X5SKmVvmvbei5mIK06qQECIIEpPXyh23IyjPfWAl0t/ac0ohWR
NoHqSdK7LOANJIsV6n3VFMGkR1RGqf2kF0RoGfA6mEZw44vLqUfzFp1MD4xX/LSc
/9FmObGg6+kmufl9JzGEHdNY+ixgp7vVuN8ON1yXVZ59UD9AIHYIv57YHesMyZ0q
q48zZj032cHQqRYk5thPLH0CAwEAAQ==
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

// Verify signature of license (handles both old and new formats)
function verifySignature(license, signature) {
  try {
    // If license has 'data' field, use it (new server format)
    const dataToVerify = license.data || license;
    
    // Create canonical JSON string (sorted keys) - matches server
    const dataString = JSON.stringify(dataToVerify, Object.keys(dataToVerify).sort());
    
    // Verify using RSA-PSS (matches server signature)
    const isValid = crypto.verify(
      'sha256',
      Buffer.from(dataString),
      {
        key: PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN
      },
      Buffer.from(signature, 'base64')
    );
    
    return isValid;
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
  
  const { payload, signature, data } = license;
  
  // Use payload for compatibility checks
  const licensePayload = payload || data;
  
  // Check structure (allow missing 'app' field for new format)
  if (!licensePayload || typeof licensePayload !== 'object') {
    return {
      valid: false,
      code: VerifyResult.INVALID_STRUCTURE,
      message: 'License file is corrupted',
    };
  }
  
  // Verify cryptographic signature (pass whole license for new format support)
  if (!verifySignature(license, signature)) {
    return {
      valid: false,
      code: VerifyResult.INVALID_SIGNATURE,
      message: 'License signature is invalid',
    };
  }
  
  // Check app name (optional for new format)
  if (licensePayload.app && licensePayload.app !== APP_NAME) {
    return {
      valid: false,
      code: VerifyResult.WRONG_APP,
      message: 'License is for a different application',
    };
  }
  
  // Check device ID (support both deviceId and deviceFingerprint)
  const licenseDeviceId = licensePayload.deviceId || licensePayload.deviceFingerprint;
  if (licenseDeviceId && !isCurrentDevice(licenseDeviceId)) {
    return {
      valid: false,
      code: VerifyResult.WRONG_DEVICE,
      message: 'License is registered to a different device',
      currentDevice: getDeviceId(),
      licenseDevice: licenseDeviceId,
    };
  }
  
  // Check expiration (support both validUntil timestamp and expiresAt ISO string)
  const expiryTime = licensePayload.validUntil || (licensePayload.expiresAt ? new Date(licensePayload.expiresAt).getTime() / 1000 : null);
  if (expiryTime && expiryTime > 0) {
    const now = Math.floor(Date.now() / 1000);
    const gracePeriod = (licensePayload.gracePeriodDays || 30) * 24 * 60 * 60;
    if (now > (expiryTime + gracePeriod)) {
      return {
        valid: false,
        code: VerifyResult.EXPIRED,
        message: 'License has expired',
      };
    }
  }
  
  // All checks passed - return with all features enabled
  return {
    valid: true,
    code: VerifyResult.VALID,
    message: 'License is valid',
    payload: licensePayload,
    features: licensePayload.features || {
      pro: true,
      projects: true,
      playground: true,
      blueprint: true,
      ssh: true,
      maxDevices: licensePayload.maxDevices || 3
    },
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
  // If proFeatures is true, all features are enabled
  if (features.proFeatures === true || features.pro === true) {
    return true;
  }
  return features[featureName] === true;
}

// Check if Pro license
function isPro() {
  const features = getLicenseFeatures();
  return features.pro === true || features.proFeatures === true;
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


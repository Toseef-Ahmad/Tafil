/**
 * TAFIL License Manager
 * Offline-first license management for TAFIL desktop app
 */

const crypto = require('crypto');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const deviceId = require('./deviceId');

// License server URL - production
const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || 'https://api.tafil.app';

// Public key for verifying licenses (embedded in app)
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

// Grace period in days
const GRACE_PERIOD_DAYS = 30;
const SYNC_INTERVAL_DAYS = 14;

class LicenseManager {
  constructor() {
    this.licenseFilePath = this.getLicenseFilePath();
    this.deviceFingerprint = null;
    this.currentLicense = null;
    this.isValid = false;
    this.validationError = null;
  }

  /**
   * Get license file storage path
   */
  getLicenseFilePath() {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, '.tafil-license');
  }

  /**
   * Generate stable device fingerprint
   * Uses install-based ID for stability across OS updates/hardware changes.
   */
  generateDeviceFingerprint() {
    if (this.deviceFingerprint) {
      return this.deviceFingerprint;
    }

    const stableId = deviceId.getDeviceId();
    this.deviceFingerprint = stableId;
    return stableId;
  }

  /**
   * Get human-readable device name
   */
  getDeviceName() {
    return os.hostname() || `${os.platform()}-device`;
  }

  /**
   * Get platform identifier
   */
  getPlatform() {
    return os.platform(); // darwin, win32, linux
  }

  /**
   * Get app version
   */
  getAppVersion() {
    return app.getVersion();
  }

  /**
   * Initialize license manager
   * Loads and validates local license on startup
   */
  async initialize() {
    try {
      console.log('🔐 Initializing license manager...');
      
      this.generateDeviceFingerprint();
      
      // Load local license
      const localLicense = this.loadLocalLicense();
      
      if (!localLicense) {
        console.log('❌ No local license found');
        this.isValid = false;
        this.validationError = 'NO_LICENSE';
        return { valid: false, error: 'NO_LICENSE' };
      }

      // Verify signature
      const signatureValid = this.verifySignature(localLicense);
      if (!signatureValid) {
        console.log('❌ License signature invalid');
        this.isValid = false;
        this.validationError = 'INVALID_SIGNATURE';
        return { valid: false, error: 'INVALID_SIGNATURE' };
      }

      // Check device fingerprint
      if (localLicense.data.deviceFingerprint !== this.deviceFingerprint) {
        console.log('❌ Device fingerprint mismatch');
        this.isValid = false;
        this.validationError = 'DEVICE_MISMATCH';
        return { valid: false, error: 'DEVICE_MISMATCH' };
      }

      // Check expiry with grace period
      const now = new Date();
      const expiresAt = new Date(localLicense.data.expiresAt);
      const gracePeriodMs = (localLicense.data.gracePeriodDays || GRACE_PERIOD_DAYS) * 24 * 60 * 60 * 1000;
      const graceEndDate = new Date(expiresAt.getTime() + gracePeriodMs);

      if (now > graceEndDate) {
        console.log('❌ License expired (grace period ended)');
        this.isValid = false;
        this.validationError = 'EXPIRED';
        return { valid: false, error: 'EXPIRED' };
      }

      // Check if we should sync with server
      const shouldSync = this.shouldSyncWithServer(localLicense);
      if (shouldSync) {
        console.log('📡 Syncing with license server...');
        try {
          await this.syncWithServer(localLicense.data.licenseKey);
        } catch (error) {
          console.log('⚠️  Server sync failed, continuing offline:', error.message);
          // Continue with local license if within grace period
        }
      }

      this.currentLicense = localLicense;
      this.isValid = true;
      console.log('✅ License valid');

      return {
        valid: true,
        license: {
          email: localLicense.data.email,
          expiresAt: localLicense.data.expiresAt,
          features: localLicense.data.features
        }
      };

    } catch (error) {
      console.error('License initialization error:', error);
      this.isValid = false;
      this.validationError = 'UNKNOWN_ERROR';
      return { valid: false, error: error.message };
    }
  }

  /**
   * Verify cryptographic signature of license blob
   */
  verifySignature(signedBlob) {
    try {
      const { data, signature, algorithm } = signedBlob;
      
      if (algorithm !== 'RSA-SHA256-PSS') {
        return false;
      }

      // Create canonical JSON string
      const dataString = JSON.stringify(data, Object.keys(data).sort());
      
      // Verify signature
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
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Check if we should sync with server
   */
  shouldSyncWithServer(license) {
    const lastSync = license.lastSyncAt ? new Date(license.lastSyncAt) : new Date(license.data.issuedAt);
    const daysSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceSync > SYNC_INTERVAL_DAYS;
  }

  /**
   * Activate a new license
   */
  async activate(licenseKey) {
    try {
      console.log('🔐 Activating license...');

      const response = await fetch(`${LICENSE_SERVER_URL}/api/license/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: licenseKey,
          device_fingerprint: this.deviceFingerprint,
          device_name: this.getDeviceName(),
          platform: this.getPlatform(),
          app_version: this.getAppVersion()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.code || 'Activation failed');
      }

      // Save license locally
      this.saveLocalLicense(result.signedLicense);
      this.currentLicense = result.signedLicense;
      this.isValid = true;

      console.log('✅ License activated successfully');

      return {
        success: true,
        licenseInfo: result.licenseInfo
      };

    } catch (error) {
      console.error('Activation error:', error);
      throw error;
    }
  }

  /**
   * Verify license with server
   */
  async syncWithServer(licenseKey) {
    try {
      const response = await fetch(`${LICENSE_SERVER_URL}/api/license/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: licenseKey || this.currentLicense?.data.licenseKey,
          device_fingerprint: this.deviceFingerprint
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.code || 'Verification failed');
      }

      // Update local license with fresh signature
      result.signedLicense.lastSyncAt = new Date().toISOString();
      this.saveLocalLicense(result.signedLicense);
      this.currentLicense = result.signedLicense;

      console.log('✅ License synced with server');

      return result;
    } catch (error) {
      console.error('Server sync error:', error);
      throw error;
    }
  }

  /**
   * Deactivate current device
   */
  async deactivate() {
    try {
      if (!this.currentLicense) {
        throw new Error('No active license');
      }

      const response = await fetch(`${LICENSE_SERVER_URL}/api/license/deactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: this.currentLicense.data.licenseKey,
          device_fingerprint: this.deviceFingerprint
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Deactivation failed');
      }

      // Remove local license
      this.removeLocalLicense();
      this.currentLicense = null;
      this.isValid = false;

      console.log('✅ License deactivated');

      return result;
    } catch (error) {
      console.error('Deactivation error:', error);
      throw error;
    }
  }

  /**
   * Load license from local storage
   */
  loadLocalLicense() {
    try {
      if (!fs.existsSync(this.licenseFilePath)) {
        return null;
      }

      const encrypted = fs.readFileSync(this.licenseFilePath, 'utf8');
      // Try decrypt with current fingerprint; fall back to legacy if needed.
      let decrypted;
      try {
        decrypted = this.decrypt(encrypted, this.deviceFingerprint);
      } catch (primaryErr) {
        // Attempt legacy fingerprint (pre-stable change)
        const legacyFingerprint = this.generateLegacyFingerprint();
        decrypted = this.decrypt(encrypted, legacyFingerprint);
        // If legacy works, re-encrypt with the stable fingerprint for the future.
        this.saveLocalLicense(JSON.parse(decrypted));
      }
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to load local license:', error);
      return null;
    }
  }

  /**
   * Save license to local storage (encrypted)
   */
  saveLocalLicense(license) {
    try {
      const licenseWithMeta = {
        ...license,
        lastSyncAt: new Date().toISOString()
      };
      
      const encrypted = this.encrypt(JSON.stringify(licenseWithMeta), this.deviceFingerprint);
      fs.writeFileSync(this.licenseFilePath, encrypted, 'utf8');
      
      console.log('💾 License saved locally');
    } catch (error) {
      console.error('Failed to save license:', error);
      throw error;
    }
  }

  /**
   * Remove local license file
   */
  removeLocalLicense() {
    try {
      if (fs.existsSync(this.licenseFilePath)) {
        fs.unlinkSync(this.licenseFilePath);
      }
    } catch (error) {
      console.error('Failed to remove license:', error);
    }
  }

  /**
   * Simple encryption for local storage
   * Not meant to prevent determined attacks, just obfuscation
   */
  encrypt(text, fingerprint) {
    const key = crypto.scryptSync(fingerprint, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Simple decryption for local storage
   */
  decrypt(text, fingerprint) {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const key = crypto.scryptSync(fingerprint, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Legacy fingerprint generator (pre-stable change) for migration
   */
  generateLegacyFingerprint() {
    const factors = [
      os.hostname(),
      os.platform(),
      os.arch(),
      os.cpus()[0].model,
      os.totalmem().toString()
    ];
    return crypto.createHash('sha256').update(factors.join('|')).digest('hex');
  }

  /**
   * Get current license status
   */
  getStatus() {
    return {
      isValid: this.isValid,
      error: this.validationError,
      license: this.currentLicense ? {
        email: this.currentLicense.data.email,
        expiresAt: this.currentLicense.data.expiresAt,
        features: this.currentLicense.data.features,
        deviceFingerprint: this.deviceFingerprint.substring(0, 8) + '...'
      } : null
    };
  }

  /**
   * Check if license is valid
   */
  hasValidLicense() {
    return this.isValid;
  }
}

module.exports = new LicenseManager();


#!/usr/bin/env node
/**
 * Remove License Script
 * 
 * Removes all license files to test the app without a license.
 * This will delete:
 * 1. ~/.tafil/license.json (licenseLoader format)
 * 2. [userData]/.tafil-license (license-manager format)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get license file paths
function getLicensePaths() {
  const paths = [];
  const platform = os.platform();
  
  // Path 1: ~/.tafil/license.json (licenseLoader)
  const tafilDir = path.join(os.homedir(), '.tafil');
  const licenseLoaderPath = path.join(tafilDir, 'license.json');
  paths.push({ path: licenseLoaderPath, type: 'licenseLoader' });
  
  // Path 2: [userData]/.tafil-license (license-manager)
  // Try to get Electron userData path based on platform
  let userDataPath;
  
  if (platform === 'darwin') {
    // macOS
    userDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'electron-node-manager');
  } else if (platform === 'win32') {
    // Windows
    userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'electron-node-manager');
  } else {
    // Linux and others
    userDataPath = path.join(os.homedir(), '.config', 'electron-node-manager');
  }
  
  const licenseManagerPath = path.join(userDataPath, '.tafil-license');
  paths.push({ path: licenseManagerPath, type: 'license-manager' });
  
  // Also check for app name variations
  const appNameVariations = ['tafil', 'Tafil'];
  appNameVariations.forEach(appName => {
    let altPath;
    if (platform === 'darwin') {
      altPath = path.join(os.homedir(), 'Library', 'Application Support', appName, '.tafil-license');
    } else if (platform === 'win32') {
      altPath = path.join(os.homedir(), 'AppData', 'Roaming', appName, '.tafil-license');
    } else {
      altPath = path.join(os.homedir(), '.config', appName, '.tafil-license');
    }
    paths.push({ path: altPath, type: `license-manager (${appName})` });
  });
  
  return paths;
}

// Remove license files
function removeLicenses() {
  console.log('🔓 Removing license files...\n');
  
  const licensePaths = getLicensePaths();
  let removedCount = 0;
  
  licensePaths.forEach(({ path: licensePath, type }) => {
    try {
      if (fs.existsSync(licensePath)) {
        fs.unlinkSync(licensePath);
        console.log(`✅ Removed: ${type}`);
        console.log(`   ${licensePath}\n`);
        removedCount++;
      } else {
        console.log(`ℹ️  Not found: ${type}`);
        console.log(`   ${licensePath}\n`);
      }
    } catch (error) {
      console.error(`❌ Error removing ${type}:`);
      console.error(`   ${licensePath}`);
      console.error(`   ${error.message}\n`);
    }
  });
  
  if (removedCount === 0) {
    console.log('ℹ️  No license files found. App should run without license.\n');
  } else {
    console.log(`✅ Removed ${removedCount} license file(s).`);
    console.log('🔄 Restart the app to test without license.\n');
  }
}

// Run if called directly
if (require.main === module) {
  removeLicenses();
}

module.exports = { removeLicenses, getLicensePaths };


// utils/configManager.js
const { app } = require('electron');
const path = require('path');
const fs = require('fs-extra');

const configPath = path.join(app.getPath('userData'), 'config.json');

const defaultConfig = {
  scanPaths: [process.env.HOME || process.env.USERPROFILE],
  excludedPaths: ['node_modules', '.git'],
  portRange: { start: 3000, end: 4000 },
  autoScanInterval: 3600,
  defaultStartCommand: 'npm start'
};

const loadConfig = async () => {
  try {
    return await fs.readJson(configPath);
  } catch {
    await saveConfig(defaultConfig);
    return defaultConfig;
  }
};

const saveConfig = async (config) => {
  await fs.ensureDir(path.dirname(configPath));
  return fs.writeJson(configPath, config);
};

module.exports = { loadConfig, saveConfig };
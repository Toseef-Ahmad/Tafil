console.log('Starting test...');
const electron = require('electron');
console.log('electron module:', Object.keys(electron));
console.log('app:', electron.app);
console.log('BrowserWindow:', electron.BrowserWindow);
if (electron.app) {
  electron.app.whenReady().then(() => {
    console.log('Ready!');
    electron.app.quit();
  });
}

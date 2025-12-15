const { app, BrowserWindow } = require('electron');
console.log('app:', app);
console.log('BrowserWindow:', BrowserWindow);
if (app) {
  app.whenReady().then(() => console.log('App ready!'));
}

// Minimal test
const { app, BrowserWindow } = require('electron');
console.log('APP:', app);
app.whenReady().then(() => {
  console.log('Ready!');
  const win = new BrowserWindow({ width: 400, height: 300 });
  win.loadURL('data:text/html,<h1>Test</h1>');
});

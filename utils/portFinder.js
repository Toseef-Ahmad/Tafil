// utils/portFinder.js
const net = require('net');

function findFreePort(startPort = 3000, endPort = 3100) {
  return new Promise((resolve) => {
    let currentPort = startPort;

    const tryPort = () => {
      if (currentPort > endPort) {
        return resolve(null); // No free port available
      }

      const server = net.createServer();
      server.unref();

      server.on('error', () => {
        // Port is in use, try next
        currentPort++;
        tryPort();
      });

      server.listen(currentPort, () => {
        const availablePort = currentPort;
        server.close(() => resolve(availablePort));
      });
    };

    tryPort();
  });
}


module.exports = {
  findFreePort
};
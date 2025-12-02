// utils/externalProcessDetector.js
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const os = require('os');

/**
 * Detect all Node.js processes running on common dev server ports
 * Returns array of { pid, port, command, projectPath }
 */
async function detectExternalNodeProcesses() {
  const isWindows = os.platform() === 'win32';
  const isMac = os.platform() === 'darwin';
  
  try {
    let processes = [];
    
    if (isWindows) {
      // Windows: Use netstat to find processes listening on ports
      const { stdout } = await execAsync('netstat -ano');
      const lines = stdout.split('\n');
      
      for (const line of lines) {
        // Look for LISTENING state
        if (line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const localAddress = parts[1];
          const pid = parts[4];
          
          if (localAddress && pid) {
            const portMatch = localAddress.match(/:(\d+)$/);
            if (portMatch) {
              const port = parseInt(portMatch[1]);
              
              // Check if it's a common dev server port (3000-9000)
              if (port >= 3000 && port <= 9000) {
                try {
                  // Get process details
                  const { stdout: tasklistOutput } = await execAsync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
                  const processName = tasklistOutput.split(',')[0].replace(/"/g, '');
                  
                  if (processName.toLowerCase().includes('node')) {
                    processes.push({
                      pid: parseInt(pid),
                      port,
                      command: processName,
                      projectPath: null, // We'll try to detect this
                      external: true
                    });
                  }
                } catch (err) {
                  // Skip if we can't get process details
                }
              }
            }
          }
        }
      }
    } else {
      // macOS/Linux: Use lsof to find processes listening on ports
      try {
        const { stdout } = await execAsync('lsof -i -P -n | grep LISTEN');
        const lines = stdout.split('\n');
        
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length < 9) continue;
          
          const command = parts[0];
          const pid = parseInt(parts[1]);
          const addressPort = parts[8];
          
          // Check if it's a node process
          if (command.toLowerCase().includes('node')) {
            const portMatch = addressPort.match(/:(\d+)$/);
            if (portMatch) {
              const port = parseInt(portMatch[1]);
              
              // Check if it's a common dev server port
              if (port >= 3000 && port <= 9000) {
                // Try to get the working directory and command
                let projectPath = null;
                let fullCommand = command;
                
                try {
                  if (isMac) {
                    const { stdout: cwdOutput } = await execAsync(`lsof -a -d cwd -p ${pid} -Fn | tail -1`);
                    projectPath = cwdOutput.replace(/^n/, '').trim();
                  } else {
                    // Linux
                    const { stdout: cwdOutput } = await execAsync(`pwdx ${pid}`);
                    projectPath = cwdOutput.split(':')[1].trim();
                  }
                  
                  // Get full command
                  const { stdout: cmdOutput } = await execAsync(`ps -p ${pid} -o command=`);
                  fullCommand = cmdOutput.trim();
                } catch (err) {
                  // Skip if we can't get details
                }
                
                processes.push({
                  pid,
                  port,
                  command: fullCommand,
                  projectPath,
                  external: true
                });
              }
            }
          }
        }
      } catch (err) {
        console.error('Error detecting external processes:', err);
      }
    }
    
    return processes;
  } catch (err) {
    console.error('Error in detectExternalNodeProcesses:', err);
    return [];
  }
}

/**
 * Check if a specific port is being used by an external process
 */
async function getProcessOnPort(port) {
  const isWindows = os.platform() === 'win32';
  
  try {
    if (isWindows) {
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
      
      if (lines.length > 0) {
        const parts = lines[0].trim().split(/\s+/);
        const pid = parts[4];
        
        const { stdout: tasklistOutput } = await execAsync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
        const processName = tasklistOutput.split(',')[0].replace(/"/g, '');
        
        return {
          pid: parseInt(pid),
          port,
          command: processName,
          external: true
        };
      }
    } else {
      const { stdout } = await execAsync(`lsof -i :${port} -P -n | grep LISTEN`);
      const lines = stdout.split('\n').filter(line => line.trim());
      
      if (lines.length > 0) {
        const parts = lines[0].trim().split(/\s+/);
        const command = parts[0];
        const pid = parseInt(parts[1]);
        
        // Get full command
        let fullCommand = command;
        let projectPath = null;
        
        try {
          const { stdout: cmdOutput } = await execAsync(`ps -p ${pid} -o command=`);
          fullCommand = cmdOutput.trim();
          
          // Try to get working directory
          if (os.platform() === 'darwin') {
            const { stdout: cwdOutput } = await execAsync(`lsof -a -d cwd -p ${pid} -Fn | tail -1`);
            projectPath = cwdOutput.replace(/^n/, '').trim();
          } else {
            const { stdout: cwdOutput } = await execAsync(`pwdx ${pid}`);
            projectPath = cwdOutput.split(':')[1].trim();
          }
        } catch (err) {
          // Ignore errors getting details
        }
        
        return {
          pid,
          port,
          command: fullCommand,
          projectPath,
          external: true
        };
      }
    }
  } catch (err) {
    // No process on this port
  }
  
  return null;
}

module.exports = {
  detectExternalNodeProcesses,
  getProcessOnPort
};


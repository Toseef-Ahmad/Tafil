# External Process Detection Feature

## Overview

Tafil can now detect **ALL Node.js dev servers running on your machine**, not just the ones started by Tafil!

This means you can see projects that are:
- ✅ Running in external terminals
- ✅ Started before Tafil was opened
- ✅ Running in other IDEs
- ✅ Started by other tools

## Features

### 1. **Auto-Detection of External Processes**

Scans all active ports (3000-9000) and detects:
- Port number
- Process ID (PID)
- Command/script running
- Project directory (if detectable)

### 2. **Port Conflict Detection**

When you try to start a project, Tafil now knows if:
- Another Tafil project is using the port
- An external process is using the port (with details!)

### 3. **Visual Indicators**

External processes can be shown with:
- 🔵 External indicator badge
- Port number
- "Stop External" button (to kill the process)
- Project path (if detected)

## How It Works

### Detection Methods

**macOS/Linux:**
```bash
lsof -i -P -n | grep LISTEN  # Find all listening processes
lsof -a -d cwd -p <pid>      # Get working directory
ps -p <pid> -o command=      # Get full command
```

**Windows:**
```cmd
netstat -ano                  # Find all listening processes
tasklist /FI "PID eq <pid>"  # Get process details
```

### API Functions

#### 1. Detect All External Processes

```javascript
const result = await window.electronAPI.detectExternalProcesses();

// Returns:
{
  success: true,
  processes: [
    {
      pid: 12345,
      port: 3000,
      command: 'node server.js',
      projectPath: '/Users/you/my-project',
      external: true
    },
    // ... more processes
  ]
}
```

#### 2. Check Specific Port

```javascript
const result = await window.electronAPI.checkPortProcess(3000);

// Returns:
{
  success: true,
  process: {
    pid: 12345,
    port: 3000,
    command: 'npm run dev',
    projectPath: '/Users/you/my-app',
    external: true
  }
}
```

## UI Integration Example

### Show External Processes in UI

```javascript
// In renderer.js

// Add a button to scan for external processes
const scanExternalBtn = document.getElementById('scanExternalBtn');
scanExternalBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.detectExternalProcesses();
  
  if (result.success) {
    console.log(`Found ${result.processes.length} external processes:`);
    result.processes.forEach(proc => {
      console.log(`  Port ${proc.port}: ${proc.command} (PID: ${proc.pid})`);
      if (proc.projectPath) {
        console.log(`    Path: ${proc.projectPath}`);
      }
    });
    
    // TODO: Display in UI
    displayExternalProcesses(result.processes);
  }
});

function displayExternalProcesses(processes) {
  // Example: Add to running projects panel with "External" badge
  processes.forEach(proc => {
    // Create card or list item
    const card = document.createElement('div');
    card.className = 'project-card external-process';
    card.innerHTML = `
      <div class="external-badge">🔵 External</div>
      <div class="port">Port: ${proc.port}</div>
      <div class="command">${proc.command}</div>
      ${proc.projectPath ? `<div class="path">${proc.projectPath}</div>` : ''}
      <button onclick="killExternalProcess(${proc.pid})">Stop</button>
    `;
    // Add to UI...
  });
}
```

### Auto-Scan on App Start

```javascript
// In renderer.js - DOMContentLoaded

document.addEventListener("DOMContentLoaded", async () => {
  // ... existing initialization ...
  
  // Scan for external processes
  await scanForExternalProcesses();
  
  // Re-scan every 10 seconds
  setInterval(scanForExternalProcesses, 10000);
});

async function scanForExternalProcesses() {
  const result = await window.electronAPI.detectExternalProcesses();
  if (result.success) {
    // Update UI with external processes
    updateExternalProcessesList(result.processes);
  }
}
```

### Show in Running Projects Panel

```javascript
function renderRunningProjects() {
  // Show Tafil-managed projects
  runningProjects.forEach(project => {
    // ... render project card ...
  });
  
  // Show external processes
  externalProcesses.forEach(proc => {
    const card = createExternalProcessCard(proc);
    runningProjectsContainer.appendChild(card);
  });
}

function createExternalProcessCard(proc) {
  const card = document.createElement('div');
  card.className = 'project-card external';
  card.innerHTML = `
    <div class="external-indicator">
      <span class="badge">External Process</span>
      <span class="port-badge">:${proc.port}</span>
    </div>
    <div class="command">${proc.command}</div>
    ${proc.projectPath ? `
      <div class="project-path">${path.basename(proc.projectPath)}</div>
    ` : ''}
    <div class="actions">
      <button class="open-browser" onclick="openBrowser(${proc.port})">
        Open in Browser
      </button>
      <button class="kill-process" onclick="killProcess(${proc.pid})">
        Stop Process
      </button>
    </div>
  `;
  return card;
}
```

## Usage Flow

### 1. User Scenario: Project Already Running

```
User: Runs `npm run dev` in terminal (port 3000)
      Opens Tafil

Tafil: Scans for external processes
       Finds port 3000 with node process
       Shows: "🔵 External Process on port 3000"

User: Tries to run another project
Tafil: "Port 3000 is already in use by an external process"
       Shows: Which process is using it
       Offers: "Stop external process" or "Use custom port"
```

### 2. Monitoring Mode

```
Tafil Dashboard:
┌─────────────────────────────────────┐
│ Running Projects (3)                │
├─────────────────────────────────────┤
│ 🟢 my-app (Tafil) - Port 3000      │
│ 🟢 api-server (Tafil) - Port 4000  │
│ 🔵 external-app (External) - Port 5173 │
│    /Users/you/external-app          │
│    [Open Browser] [Stop]            │
└─────────────────────────────────────┘
```

## Benefits

1. **Complete Visibility**
   - See ALL running dev servers
   - No more mystery ports

2. **Better Port Management**
   - Know why a port is occupied
   - Quick access to stop external processes

3. **Convenience**
   - Open external projects in browser
   - Stop external processes without terminal

4. **Developer Experience**
   - One dashboard for all running projects
   - Whether started in Tafil or not

## Technical Notes

### Permissions

- **macOS**: No special permissions needed for `lsof`
- **Windows**: Works with standard user privileges
- **Linux**: `lsof` available on most distros

### Limitations

- Only detects Node.js processes (not Python/Ruby/etc.)
- Only scans ports 3000-9000 (common dev server range)
- Project path detection may fail for some setups
- Requires processes to be listening on network ports

### Future Enhancements

- [ ] Detect other dev server types (Python, Ruby, PHP)
- [ ] Expand port range (configurable)
- [ ] Better project path detection
- [ ] Show process uptime
- [ ] Memory/CPU usage per process
- [ ] One-click adopt external process into Tafil management

## Files Added

- `utils/externalProcessDetector.js` - Core detection logic
- IPC handlers in `main.js`:
  - `detect-external-processes`
  - `check-port-process`
- Exposed in `preload.js`:
  - `detectExternalProcesses()`
  - `checkPortProcess(port)`

## Testing

1. **Start external process:**
   ```bash
   cd some-project
   npm run dev
   ```

2. **In Tafil, call:**
   ```javascript
   const result = await window.electronAPI.detectExternalProcesses();
   console.log(result);
   ```

3. **Should see:**
   ```javascript
   {
     success: true,
     processes: [
       {
         pid: 12345,
         port: 3000,
         command: 'npm run dev',
         projectPath: '/path/to/some-project',
         external: true
       }
     ]
   }
   ```

---

**This feature gives developers complete visibility into all running Node.js dev servers on their machine!** 🎉


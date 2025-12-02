# Port Conflict Detection Fix

## Problem

When a project was started in Tafil while an **external process** (not managed by Tafil) was already using the same port:

1. Tafil would start the project
2. The project would show as "running" with the occupied port
3. Opening the port in browser would show the **external application**, not the Tafil project
4. User confusion: "Why is my project showing running but it's the wrong app?"

## Root Cause

Tafil was **not checking if a port was already occupied by an external process** before starting a project. It would:

1. Check if the port was available
2. But if it became occupied between the check and the start
3. Or if the project detected it couldn't use the port and exited silently
4. Tafil would still report it as "running" with that port number

## Solution Implemented

### 1. **Port Ownership Tracking**

Added a new function `checkPortOwnership()` that distinguishes between:
- **Tafil-managed processes**: Projects running within Tafil
- **External processes**: Other applications using the port

```javascript
function checkPortOwnership(port) {
  // Check if any running process in Tafil is using this port
  for (const [projPath, info] of runningProcesses.entries()) {
    if (info.port === port) {
      return { isTafil: true, projectPath: projPath };
    }
  }
  return { isTafil: false, projectPath: null };
}
```

### 2. **Enhanced Port Checking**

Before starting a project, Tafil now:

1. Checks if the port is available
2. If occupied, checks **who** is using it:
   - **Another Tafil project**: Shows which project and suggests stopping it
   - **External application**: Warns user and suggests using custom port

```javascript
if (!isDefaultAvailable) {
  const ownership = checkPortOwnership(projectInfo.defaultPort);
  
  if (ownership.isTafil) {
    // Another Tafil project is using this port
    return {
      success: false,
      error: `Port ${projectInfo.defaultPort} is already in use by another project managed by Tafil:\n${path.basename(ownership.projectPath)}\n\nPlease stop that project first, or use a custom port.`
    };
  } else {
    // External process is using the port
    return {
      success: false,
      error: `Port ${projectInfo.defaultPort} is already in use by another application (not managed by Tafil).\n\nPlease:\n- Stop the external application using port ${projectInfo.defaultPort}, or\n- Click "Custom Port" to specify a different port for this project.`
    };
  }
}
```

### 3. **Process Information Storage**

Changed `runningProcesses` from storing just the process to storing an object with:
- `process`: The child process
- `port`: The actual port being used
- `framework`: The detected framework

```javascript
runningProcesses.set(projectPath, { 
  process: child, 
  port: suggestedPort,
  framework: projectInfo.framework 
});
```

### 4. **Dynamic Port Updating**

When the actual port is detected from the output, it updates the stored port information:

```javascript
if (runningProcesses.has(projectPath)) {
  const processInfo = runningProcesses.get(projectPath);
  processInfo.port = actualPort;
  runningProcesses.set(projectPath, processInfo);
}
```

## User Experience Improvements

### Before:
❌ Project starts, shows "running on port 3000"  
❌ User opens `localhost:3000` → sees external app  
❌ Confusion: "Why isn't my project showing?"

### After:
✅ Clear error message before starting  
✅ Tells user exactly what's using the port  
✅ Suggests solutions (stop external app or use custom port)  
✅ Prevents false "running" status

## Error Messages

### Tafil Project Conflict:
```
Port 3000 is already in use by another project managed by Tafil:
my-other-project

Please stop that project first, or use a custom port.
```

### External Application Conflict:
```
Port 3000 is already in use by another application (not managed by Tafil).

Please:
- Stop the external application using port 3000, or
- Click "Custom Port" to specify a different port for this project.
```

## Testing

1. ✅ Start external app on port 3000
2. ✅ Try to start Tafil project on port 3000
3. ✅ Verify clear error message
4. ✅ Stop external app
5. ✅ Start Tafil project successfully
6. ✅ Try to start another Tafil project on same port
7. ✅ Verify it shows which Tafil project is using the port

## Files Modified

- `main.js`:
  - Added `checkPortOwnership()` function
  - Enhanced port checking logic in `play-project` handler
  - Updated `runningProcesses` to store port information
  - Updated `stop-project` to handle new format

---

**Result**: Users now get clear, actionable error messages when port conflicts occur, preventing confusion and false "running" states.


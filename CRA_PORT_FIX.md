# Create React App (CRA) Port Conflict Fix

## Problem

When trying to run a Create React App project while port 3000 was already occupied, the application would fail with the error:

```
[stdout] [31mSomething is already running on port 3000.[39m
```

Even though the app was supposed to automatically find an available port, CRA would check port 3000 first and fail before respecting the `PORT` environment variable.

## Root Cause

Create React App has a built-in port checker in `react-scripts start` that:

1. **First checks if the default port (3000) is available**
2. If port 3000 is occupied, it displays "Something is already running on port 3000."
3. It then prompts the user: "Would you like to run the app on another port instead?"
4. Only after receiving "Y" (yes) does it use the `PORT` environment variable or find an available port

When running programmatically (non-interactively), CRA would get stuck at the prompt or simply fail.

## Solution Implemented

### 1. **Environment Variable Setup**
Set the `PORT` environment variable BEFORE spawning the process:

```javascript
if (projectInfo.framework === 'cra') {
  // Create React App specific settings
  env.PORT = suggestedPort.toString();
  env.BROWSER = 'none'; // Don't auto-open browser
  env.SKIP_PREFLIGHT_CHECK = 'true'; // Skip some checks
  console.log(`Setting CRA environment: PORT=${suggestedPort}, BROWSER=none`);
}
```

### 2. **Automatic Port Availability Check**
Before starting the project, we verify the default port and find an available fallback:

```javascript
if (!isDefaultAvailable) {
  const fallbackPort = await findAvailablePort(projectInfo.defaultPort);
  if (fallbackPort) {
    console.log(`Default port ${projectInfo.defaultPort} occupied. Using fallback: ${fallbackPort}`);
    suggestedPort = fallbackPort;
  }
}
```

### 3. **Auto-Response to CRA Prompt**
Automatically send "y\n" to stdin to respond to CRA's interactive prompt:

```javascript
// For CRA: Automatically respond "Y" to the prompt
if (projectInfo.framework === 'cra') {
  setTimeout(() => {
    try {
      child.stdin?.write('y\n');
      console.log('Sent auto-response to CRA port prompt');
    } catch (err) {
      console.log('Could not write to stdin (may not be needed):', err.message);
    }
  }, 500);
}
```

### 4. **Detect and Respond to Port Prompt in Output**
Monitor stdout for CRA's port prompt and respond immediately:

```javascript
if (projectInfo.framework === 'cra' && output.includes('Would you like to run the app on another port instead?')) {
  console.log('Detected CRA port prompt, sending auto-response...');
  try {
    child.stdin?.write('y\n');
  } catch (err) {
    console.error('Error writing to stdin:', err);
  }
}
```

### 5. **Improved Error Handling**
Don't treat CRA's "Something is already running on port" as a critical error since we're handling it:

```javascript
const isCriticalError = 
  (error.toLowerCase().includes('error:') ||
  error.toLowerCase().includes('failed') ||
  error.toLowerCase().includes('cannot find') ||
  error.toLowerCase().includes('eacces') ||
  error.toLowerCase().includes('permission denied')) &&
  !error.includes('Something is already running on port'); // CRA will prompt for alternative
```

## How It Works Now

1. **Project Detection**: The app detects that the project is a Create React App
2. **Port Check**: Checks if the default port (3000) is available
3. **Find Fallback**: If port 3000 is occupied, finds the next available port (3001, 3002, etc.)
4. **Set Environment**: Sets the `PORT` environment variable to the available port
5. **Spawn Process**: Starts `npm start` with the configured environment
6. **Auto-Response**: Automatically responds "Y" to CRA's prompt (if it appears)
7. **Port Detection**: Monitors output to detect and display the actual running port
8. **Success**: The project runs successfully on the available port

## Benefits

✅ **No Manual Intervention**: Projects start automatically without user interaction  
✅ **Intelligent Port Selection**: Automatically finds available ports  
✅ **Error Prevention**: Doesn't fail when default port is occupied  
✅ **Accurate Display**: Shows the actual port the project is running on  
✅ **Framework-Specific Handling**: Optimized for CRA's behavior  

## Testing

To verify the fix:

1. Start a project on port 3000 (any HTTP server)
2. Try to run a CRA project - it should automatically use port 3001
3. Check the project card - it should show the correct port (3001)
4. Open `http://localhost:3001` - the app should be accessible

## Notes

- This fix is specific to Create React App but doesn't affect other frameworks
- The `BROWSER=none` setting prevents CRA from auto-opening a browser window
- The `SKIP_PREFLIGHT_CHECK=true` setting reduces startup checks for smoother operation
- The auto-response mechanism has two layers (setTimeout + output detection) for maximum reliability


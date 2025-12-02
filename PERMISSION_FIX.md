# Permission Denied Fix

## Problem

When trying to run a specific project, the error appeared:
```
Error: Process failed. Permission denied.
```

But other projects worked fine.

## Root Cause

The `checkExecutePermissions()` function was checking for **execute permissions on the folder**, which:
1. Is too strict (we only need read access to run npm commands)
2. Some projects may have restrictive permissions after being copied/moved
3. macOS/Linux folder permissions can vary

## Solution Implemented

### 1. **Improved Permission Checking**

Changed from checking execute permissions to just checking read access:

```javascript
async function checkExecutePermissions(projectPath) {
  try {
    // Just check if we can read the directory and package.json
    const stats = await fsPromises.stat(projectPath);
    if (!stats.isDirectory()) {
      return false;
    }
    
    // Check if we can access package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    await fsPromises.access(packageJsonPath, fs.constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
}
```

### 2. **Automatic Permission Fixing**

Added `fixProjectPermissions()` function that automatically fixes permissions:

```javascript
async function fixProjectPermissions(projectPath) {
  if (isWindows) {
    return true; // Windows doesn't need this
  }
  
  try {
    // Make sure we have read/write/execute access
    await execAsync(`chmod -R u+rwX "${projectPath}"`);
    return true;
  } catch (err) {
    return false;
  }
}
```

**What `chmod -R u+rwX` does:**
- `-R`: Recursive (applies to all files/folders inside)
- `u+rwX`: Give user (owner) read, write, and execute permissions
  - `r`: Read files and list directory contents
  - `w`: Write/modify files
  - `X`: Execute (only on directories and files that already have execute)

### 3. **Smart Permission Flow**

When starting a project:

1. **Check permissions** → If OK, proceed
2. **If denied** → Try to fix automatically
3. **Check again** → If fixed, proceed
4. **If still denied** → Show helpful error with manual fix command

```javascript
let hasPermissions = await checkExecutePermissions(projectPath);
if (!hasPermissions) {
  console.log(`⚠️ Permission denied. Attempting to fix...`);
  
  const fixed = await fixProjectPermissions(projectPath);
  
  if (fixed) {
    hasPermissions = await checkExecutePermissions(projectPath);
    if (hasPermissions) {
      console.log(`✅ Permissions fixed!`);
    }
  }
}
```

## User Experience

### Before:
```
❌ Error: Process failed. Permission denied.
```
→ User doesn't know what to do

### After:
**Auto-fix succeeds:**
```
⚠️ Permission denied. Attempting to fix...
✅ Permissions fixed!
🚀 Starting project...
```

**Auto-fix fails (rare):**
```
❌ Permission denied. Could not automatically fix permissions.

Please run this command in terminal:
chmod -R u+rwX "/path/to/project"
```
→ Clear instructions on how to fix

## Why This Happens

Common reasons a project might have permission issues:

1. **Copied from another user** - inherits restrictive permissions
2. **Downloaded and extracted** - archive extraction can set odd permissions
3. **Cloned from git on external drive** - different file system permissions
4. **Moved from another machine** - permissions don't transfer correctly

## Testing

1. ✅ Create a project with restrictive permissions
2. ✅ Try to run it in Tafil
3. ✅ Verify automatic fix works
4. ✅ Verify helpful error if auto-fix fails

## Manual Fix (if needed)

If the automatic fix doesn't work, run this in terminal:

```bash
chmod -R u+rwX "/path/to/your/project"
```

Replace `/path/to/your/project` with your actual project path.

## Files Modified

- `main.js`:
  - Updated `checkExecutePermissions()` - Less strict checking
  - Added `fixProjectPermissions()` - Auto-fix function
  - Updated `play-project` handler - Try auto-fix before failing

---

**Result**: Projects with permission issues now either:
- ✅ Get fixed automatically and run
- ✅ Show clear instructions on how to fix manually


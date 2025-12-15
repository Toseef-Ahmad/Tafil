# 🔧 Troubleshooting Guide

## Issues Fixed

### 1. Monaco Editor Not Loading (No Syntax Colors)

**Problem**: Monaco Editor wasn't loading due to CSP (Content Security Policy) restrictions.

**Fix Applied**:
- Updated CSP in `index.html` to allow:
  - `worker-src 'self' blob: https://cdn.jsdelivr.net` (for Monaco web workers)
  - `connect-src 'self' https://cdn.jsdelivr.net` (for loading Monaco files)
  - `font-src data:` (for Monaco fonts)

**How to Verify**:
1. Open DevTools (View → Toggle Developer Tools)
2. Go to Console tab
3. Look for these messages:
   ```
   ✅ Monaco loader script loaded
   ✅ Require available, configuring Monaco paths...
   ✅ Monaco paths configured, loading editor...
   ✅ Monaco Editor loaded successfully!
   ```

4. If you see errors, check:
   - Network tab for failed requests
   - Console for CSP violations
   - Make sure you have internet connection

---

### 2. Auto-Run Not Executing

**Problem**: Code wasn't running automatically even with auto-run enabled.

**Fixes Applied**:
- Added visual feedback ("Running..." status)
- Increased initial run delay to 1000ms
- Added better logging
- Fixed Promise return in runCode()

**How to Verify**:
1. Open Playground tab
2. Type: `console.log('test')`
3. Wait 500ms
4. Check output panel - should show: `✓ test`
5. Status badge should show "Auto-run ⚡" with green dot

**If Not Working**:
- Check DevTools Console for errors
- Look for: `🚀 Running initial code...`
- Make sure auto-run badge shows green dot
- Try pressing `Cmd/Ctrl + Enter` manually

---

### 3. SSH Terminal Not Appearing

**Problem**: After clicking "Connect", terminal panel wasn't visible.

**Fixes Applied**:
- Added extensive logging
- Verified CSS classes
- Multiple focus attempts
- Better error handling

**How to Verify**:
1. Go to SSH tab
2. Click "Connect" on a host
3. Check DevTools Console for:
   ```
   🔄 showTerminal called with: [Host Name]
   ✅ Hiding hosts view, showing terminal panel
   ✅ SSH Terminal shown, focused, and ready for input
   ```

4. Terminal panel should appear with:
   - Green pulsing dot
   - "Interactive Terminal" badge
   - Success message
   - Cursor prompt (▶)

**If Terminal Not Appearing**:
- Check Console for errors
- Look for: `❌ Terminal panel or hosts view not found!`
- Make sure you're on the SSH module (not Projects or Playground)
- Try refreshing the app

---

## Debug Checklist

### Monaco Editor Issues:

- [ ] Open DevTools Console
- [ ] Look for Monaco loading messages (✅ or ❌)
- [ ] Check Network tab for failed CDN requests
- [ ] Verify internet connection
- [ ] Look for CSP violations in Console
- [ ] Try refreshing the app (Cmd/Ctrl + R)

### Auto-Run Issues:

- [ ] Check status badge shows "Auto-run ⚡"
- [ ] Look for green pulsing dot
- [ ] Try toggling auto-run (Cmd/Ctrl + Shift + R)
- [ ] Try manual run (Cmd/Ctrl + Enter)
- [ ] Check Console for execution errors
- [ ] Verify code has no syntax errors

### SSH Terminal Issues:

- [ ] Verify you're on SSH tab (🔒 icon)
- [ ] Check host configuration is correct
- [ ] Look for connection messages in Console
- [ ] Verify terminal panel element exists
- [ ] Try disconnecting and reconnecting
- [ ] Check SSH credentials (username, key, password)

---

## Console Commands for Debugging

Open DevTools Console and run these:

### Check Monaco:
```javascript
console.log('Monaco loaded:', !!window.monaco);
console.log('Monaco editor:', !!monacoEditor);
```

### Check Terminal:
```javascript
console.log('Terminal panel:', document.getElementById('sshTerminalPanel'));
console.log('SSH hosts view:', document.getElementById('sshHostsView'));
console.log('Terminal object:', !!terminal);
```

### Check Auto-Run:
```javascript
console.log('Auto-run enabled:', isAutoRunEnabled);
console.log('Run button:', document.getElementById('runCodeBtn'));
```

---

## Common Errors & Solutions

### Error: "Monaco Editor load timeout"
**Solution**: Check internet connection, CSP might be blocking CDN

### Error: "Terminal panel or hosts view not found!"
**Solution**: Make sure you're on SSH module, elements might not be initialized

### Error: "Failed to execute 'postMessage' on 'Worker'"
**Solution**: CSP worker-src needs to allow blob: and CDN

### No output in Playground
**Solution**: Check if executeJS IPC handler exists in main.js

---

## Still Having Issues?

1. **Clear cache and restart**:
   ```bash
   rm -rf node_modules
   npm install
   npm start
   ```

2. **Check DevTools Console** - All errors will show there

3. **Enable verbose logging**:
   - Open DevTools before launching
   - Watch Console for all ✅ and ❌ messages

4. **Test in order**:
   - First: Check Monaco loads (Playground tab)
   - Second: Test auto-run (type code)
   - Third: Test SSH (connect to host)

---

## Expected Console Output

### Successful Startup:
```
🚀 Tafil initializing...
🚀 initPlayground called
✅ codeEditor exists: true
✅ runCodeBtn exists: true
📥 Loading Monaco Editor...
🔄 Starting Monaco Editor load...
📥 Appending Monaco loader script to document...
✅ Monaco loader script loaded
✅ Require available, configuring Monaco paths...
✅ Monaco paths configured, loading editor...
✅ Monaco Editor loaded successfully!
✅ Monaco Editor initialized with auto-run enabled
🚀 Running initial code...
```

### Successful SSH Connection:
```
🔄 showTerminal called with: My Server
✅ sshTerminalPanel exists: true
✅ sshHostsView exists: true
✅ Hiding hosts view, showing terminal panel
✅ Terminal host name set to: My Server
✅ SSH Terminal shown, focused, and ready for input
```

---

## Need More Help?

- Check [IDE_FEATURES.md](./IDE_FEATURES.md) for feature docs
- Check [QUICK_START_IDE.md](./QUICK_START_IDE.md) for usage guide
- Check [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) for what to expect

**Report bugs**: Include DevTools Console output!


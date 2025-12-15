# 🚀 Quick Start: IDE Features

## JavaScript Playground - RunJS/Quokka Style Auto-Execution

### Step-by-Step:

1. **Open Playground**
   - Click the `< >` **Playground** tab in the left sidebar

2. **Start Coding**
   ```javascript
   // Just type - it runs automatically!
   console.log('Hello World!');
   ```

3. **See Results**
   - Output appears in the panel below
   - Execution time shows in bottom-right
   - Status shows "Auto-run ⚡" with green dot

4. **Enjoy IntelliSense**
   - Start typing `console.` → see all methods
   - Start typing `fetch(` → see parameter hints
   - Hover over functions → see documentation

### Keyboard Shortcuts:
- `Cmd/Ctrl + Enter` → Run code manually
- `Cmd/Ctrl + Shift + R` → Toggle auto-run on/off
- `Ctrl + Space` → Force show autocomplete
- Trash icon → Clear output

---

## SSH Terminal - Interactive Shell Access

### How to Enter SSH (Step-by-Step):

#### First Time Setup:

1. **Open SSH Module**
   ```
   Click the 🔒 "SSH" tab in the left sidebar
   ```

2. **Add Your First Host**
   ```
   Click "Add Host" button
   
   Fill in the form:
   - Host Name: "My Server"
   - Hostname: "192.168.1.100" (or domain)
   - Username: "root" (or your username)
   - Port: 22 (default)
   - Auth: Choose "SSH Key" or "Password"
     - For SSH Key: Browse to ~/.ssh/id_rsa
     - For Password: Enter your password
   
   Click "Save Host"
   ```

#### Connecting to SSH:

3. **Connect to the Host**
   ```
   Find your host card
   Click the green "Connect" button
   ```

4. **Wait for Connection**
   ```
   You'll see:
   - Notification: "Connecting to My Server..."
   - Terminal appears
   - Shows: "Successfully connected!"
   ```

5. **Terminal is Ready! 🎉**
   ```
   You'll see something like:
   
   ✓ Successfully connected to My Server!
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Host: 192.168.1.100:22
     User: root
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   🚀 Interactive SSH Terminal Ready!
   You can now type commands and interact with your server.
   Try: ls, pwd, cd, etc.
   
   ▶ |  ← Cursor is here, ready for input
   ```

6. **Start Typing Commands!**
   ```bash
   ls -la              # List files
   pwd                 # Current directory
   cd /var/www         # Change directory
   npm install         # Install packages
   cat package.json    # View files
   htop                # Monitor processes
   ```

#### Visual Indicators:

✅ **Connected State**:
- Green pulsing dot at top
- "Interactive Terminal" badge visible
- "SSH Connected" status
- Cursor blinking in terminal

❌ **Not Connected**:
- Terminal shows instructions
- No green dot
- "Connect" button available on host cards

---

## FAQ

### Playground:

**Q: Why isn't my code running automatically?**  
A: Check the status badge - it should say "Auto-run ⚡" with a green pulsing dot. If it says "Manual", press `Cmd/Ctrl + Shift + R` to enable auto-run.

**Q: IntelliSense isn't showing suggestions?**  
A: Press `Ctrl + Space` to manually trigger it. Also make sure you're typing valid JavaScript.

**Q: Can I use async/await?**  
A: Yes! The playground supports modern JavaScript including async/await, promises, and ES2020+ features.

---

### SSH:

**Q: After clicking "Connect", where is the terminal?**  
A: The terminal appears automatically after connection! The host list view is hidden and replaced with the terminal panel. Look for the green pulsing dot and "Interactive Terminal" badge at the top.

**Q: I can't type anything in the terminal?**  
A: Click inside the terminal area to focus it. You should see a blinking cursor. If not, try clicking "Disconnect" and "Connect" again.

**Q: How do I get back to the host list?**  
A: Click the "Close Terminal" button (X icon) in the top-left of the terminal header.

**Q: Can I have multiple SSH sessions?**  
A: Currently, one active session at a time. Disconnect from one host before connecting to another.

**Q: Why can't I connect?**  
A: Common issues:
- Wrong IP address or hostname
- Firewall blocking port 22
- Incorrect username
- Wrong SSH key path or password
- Server not accepting SSH connections

---

## Pro Tips

### Playground:
1. Save your snippets for later use
2. Use `console.table()` for arrays/objects
3. Press `Cmd/Ctrl + Enter` for instant execution
4. Monaco has full VS Code editing features!

### SSH:
1. Use SSH keys instead of passwords (more secure)
2. Save multiple hosts for quick switching
3. Use Groups to organize by project/environment
4. Keep terminal open - minimize window instead
5. Use standard terminal shortcuts (Ctrl+C, Ctrl+D, etc.)

---

## Need More Help?

- Full documentation: [IDE_FEATURES.md](./IDE_FEATURES.md)
- Report issues: [GitHub Issues](https://github.com/Toseef-Ahmad/Tafil/issues)
- General docs: [docs/](./docs/)

**Enjoy your new IDE features! 🎉**


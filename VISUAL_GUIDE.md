# 👀 Visual Guide - What You'll See

## JavaScript Playground - Auto-Run Interface

### What the Screen Looks Like:

```
┌─────────────────────────────────────────────────────────────────┐
│ 📁 Projects  < > Playground  🔒 SSH                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  JavaScript Playground  ● Node.js Runtime  ⚡ Auto-run (Quokka) │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                  │
│  1  // Type your code here - runs automatically!               │
│  2  console.log('Hello, World!');                              │
│  3                                                              │
│  4  const sum = (a, b) => a + b;                               │
│  5  console.log('Sum:', sum(5, 3));  ← IntelliSense appears!   │
│  6                                                              │
│  7  // Try hovering over functions for docs                    │
│  8                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                  │
│  Output                                           500ms  ↻ 🗑️ 💾│
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  ✓ Hello, World!                                               │
│  ✓ Sum: 8                                                      │
│                                                                  │
│  → undefined                                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### IntelliSense in Action:

When you type `console.`:

```
  console.
  ┌─────────────────────────────┐
  │ ● log     (...args: any[])  │ ← Shows all methods
  │ ● error   (...args: any[])  │
  │ ● warn    (...args: any[])  │
  │ ● info    (...args: any[])  │
  │ ● debug   (...args: any[])  │
  │ ● table   (data: any)       │
  │ ● clear   ()                │
  │ ● time    (label: string)   │
  │ ● timeEnd (label: string)   │
  └─────────────────────────────┘
```

When you type `fetch(`:

```
  fetch(url: string, options?: any): Promise<Response>
        └─ Parameter hint shows what to type!
```

### Status Indicators:

**Auto-run Enabled:**
```
⚡ Auto-run (like Quokka)
● ← Green pulsing dot
```

**Running:**
```
● Running...
  ← Yellow pulsing dot
```

**Manual Mode:**
```
● Manual
  ← Gray dot (press Cmd+Shift+R to enable auto-run)
```

---

## SSH Terminal - Connection Flow

### Step 1: SSH Host List

```
┌─────────────────────────────────────────────────────────────────┐
│ 📁 Projects  < > Playground  🔒 SSH                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SSH Hosts                                     + Add Host       │
│  Connect to your servers with one click                         │
│                                                                  │
│  ┌───────────────────────────┐  ┌───────────────────────────┐ │
│  │ 🖥️  Production Server     │  │ 🖥️  Staging Server       │ │
│  │                            │  │                            │ │
│  │ 192.168.1.100:22          │  │ staging.example.com:22    │ │
│  │ 👤 root  🏷️ Production     │  │ 👤 deploy  🏷️ Staging     │ │
│  │                            │  │                            │ │
│  │ [Connect]  🗑️              │  │ [Connect]  🗑️              │ │
│  └───────────────────────────┘  └───────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Clicking "Connect"

```
You'll see a notification:
┌─────────────────────────────────┐
│ ℹ️  Connecting to Production    │
│    Server...                    │
└─────────────────────────────────┘
```

### Step 3: Terminal Appears!

```
┌─────────────────────────────────────────────────────────────────┐
│ 📁 Projects  < > Playground  🔒 SSH                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ✕  ● Production Server  🖥️ Interactive Terminal  ✓ SSH  [Disc] │
│    └─ Green pulsing dot!                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                  │
│ ✓ Successfully connected to Production Server!                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│   Host: 192.168.1.100:22                                        │
│   User: root                                                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                  │
│ 🚀 Interactive SSH Terminal Ready!                              │
│ You can now type commands and interact with your server.        │
│ Try: ls, pwd, cd, etc.                                          │
│                                                                  │
│ ▶ |  ← YOUR CURSOR IS HERE - START TYPING!                     │
│                                                                  │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 4: Typing Commands

```
│ ▶ ls -la                                                         │
│ total 48                                                         │
│ drwxr-xr-x  8 root root 4096 Dec 15 10:30 .                    │
│ drwxr-xr-x 23 root root 4096 Dec 14 09:15 ..                   │
│ -rw-r--r--  1 root root  220 Dec 10 08:00 .bashrc              │
│ drwxr-xr-x  3 root root 4096 Dec 14 10:15 app                  │
│ -rw-r--r--  1 root root 3456 Dec 15 09:45 package.json         │
│                                                                  │
│ ▶ cd app                                                         │
│                                                                  │
│ ▶ pwd                                                            │
│ /root/app                                                        │
│                                                                  │
│ ▶ |  ← Ready for next command!                                  │
```

---

## Key Visual Elements to Look For

### ✅ Playground is Working:

1. **Status Badge**: Should say "Auto-run ⚡ (like Quokka)" with green pulsing dot
2. **Output Panel**: Shows results ~500ms after you stop typing
3. **IntelliSense**: Suggestions appear as you type (try `console.`)
4. **Execution Time**: Shows at bottom of output (e.g., "500ms")

### ✅ SSH is Connected:

1. **Green Pulsing Dot**: At top of terminal header
2. **"Interactive Terminal" Badge**: Shows terminal is ready
3. **Success Message**: "Successfully connected to [Host]!"
4. **Prompt (▶)**: Shows where to type
5. **Blinking Cursor**: After the prompt

### ❌ Common Issues:

**Playground not auto-running?**
```
● Manual  ← Status shows "Manual" not "Auto-run"

Fix: Press Cmd/Ctrl + Shift + R to toggle
```

**SSH terminal not appearing?**
```
- Check you're on the "SSH" tab (🔒 icon)
- Click "Connect" button on a host card
- Wait for connection (takes 2-10 seconds)
```

**Can't type in SSH terminal?**
```
- Click inside the black terminal area
- Look for blinking cursor after "▶"
- If no cursor, click "Disconnect" then "Connect" again
```

---

## Color Coding

### Playground:
- **Green** = Console logs, success
- **Red** = Errors
- **Orange** = Warnings
- **Blue** = Info messages
- **Purple** = Special values (undefined, null)

### SSH Terminal:
- **Green** = Success messages, prompts
- **Red** = Errors
- **Yellow** = Warnings, status changes
- **Cyan** = Headers, decorative lines
- **White** = Normal output

---

## Button Locations

### Playground:
```
Top-right of editor:
[▶ Run]  [↻ Auto-run]  [🗑️ Clear]  [💾 Save]
```

### SSH:
```
Top-left of terminal:
[✕ Close]  ● Connected  🖥️ Interactive Terminal

Top-right of terminal:
[SSH Connected]  [Disconnect]
```

---

## Quick Checklist

### "Is Playground Working?"
- [ ] See Monaco editor with line numbers
- [ ] Status says "Auto-run ⚡"
- [ ] Code executes automatically when typing
- [ ] IntelliSense shows when typing `console.`
- [ ] Output appears below editor

### "Is SSH Terminal Working?"
- [ ] Terminal panel is visible (not just host cards)
- [ ] See green pulsing dot at top
- [ ] See "Interactive Terminal" badge
- [ ] See success message about connection
- [ ] See "▶" prompt with blinking cursor
- [ ] Can type characters and they appear

---

## Still Having Issues?

1. **Refresh the app** - Close and reopen Tafil
2. **Check network** - Monaco needs internet on first load
3. **Check SSH credentials** - Verify username, password, or key path
4. **Read the docs**:
   - [IDE_FEATURES.md](./IDE_FEATURES.md)
   - [QUICK_START_IDE.md](./QUICK_START_IDE.md)

---

**You should now see everything working! 🎉**


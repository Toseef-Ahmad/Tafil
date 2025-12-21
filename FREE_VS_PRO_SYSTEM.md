# 🎯 TAFIL Free vs Pro Feature System

## Overview: "Taste of Power" Model

A revenue-optimized monetization system that:
- Lets FREE users **experience ALL features** with daily quotas
- Creates **desire to upgrade** when they hit limits mid-task
- Uses **glassmorphism paywalls** that feel premium, not annoying
- Converts users who are **already hooked** on the workflow
- Never hard-locks features - always provides a "taste"

---

## 📦 Implementation Files

| File | Purpose |
|------|---------|
| `licensing/featureLimits.js` | Core limits configuration & checks |
| `licensing/index.js` | Re-exports limit functions |
| `main.js` | IPC handlers for limits |
| `preload.js` | Renderer API exposure |
| `renderer.js` | UI integration & Pro modals |
| `index.html` | Upgrade modal & tier badge UI |

---

## 🆓 FREE TIER ("Taste of Power")

### Core Features (Unlimited)

| Feature | Details |
|---------|---------|
| **Project Management** | ✅ Unlimited runs |
| **JavaScript Playground** | ✅ Unlimited execution |
| Projects | 10 projects |
| Saved snippets | 5 snippets |
| Execution history | 7 days |
| Collections | 3 collections |
| Todos | ✅ Unlimited (the "hook"!) |
| Export | Clipboard only |
| Themes | Light & Dark |
| Offline mode | ✅ Always works |

### 20-Minute Daily Pro Pass ⏱️

Free users get **20 minutes of "Active Pro Time"** every 24 hours to use ANY Pro feature!

| When Timer Is Active | Features Available |
|---------------------|-------------------|
| Blueprints open | Full editing |
| TypeScript/Python running | Unlimited execution |
| SSH connected | Full terminal access |

**What happens at 0:00?**
- Switch to **View-Only Mode** (work is SAFE)
- Beautiful blur overlay with upgrade prompt
- Can still VIEW everything, just can't edit
- Resets at midnight

### Blueprint Module Gating

| Tier | Modules per Blueprint |
|------|----------------------|
| Free | 1 module (Kanban OR Diagram OR Notes) |
| Pro | Unlimited modules |

### Time Travel

| Tier | Variable History |
|------|-----------------|
| Free | Last 3 states |
| Pro | Full history |

---

## 💎 PRO TIER ($29 One-Time)

| Feature | Details |
|---------|---------|
| **SSH Terminal** | 🔐 Full remote server access |
| **Blueprints** | 📋 Kanban, diagrams, notes |
| **Time Travel** | ⏱️ Variable history debugging |
| Projects | ♾️ Unlimited |
| Snippets | ♾️ Unlimited |
| History | Forever |
| Languages | 15+ (TypeScript, Python, Go, Rust, etc.) |
| Collections | ♾️ Unlimited |
| Export | Markdown, Gist, PDF |
| Cloud sync | ✅ Enabled |
| Custom themes | ✅ Full customization |
| Priority support | ✅ Fast responses |

---

## 🧠 Psychology Implementation

### Upgrade Modal Design

```
╭─────────────────────────────────────────────────────╮
│  🎉 You've filled up 3 projects!                    │
│                                                     │
│  That means you're getting real work done.          │
│  Free includes 3 projects.                          │
│                                                     │
│  → Archive an old project, or                       │
│  → Upgrade to Pro for unlimited projects            │
│                                                     │
│  [Archive a project]    [Maybe later]    [See Pro]  │
╰─────────────────────────────────────────────────────╯
```

### Key Language Patterns (Used)

✅ "You're growing"
✅ "This is a Pro convenience"
✅ "Upgrade when ready"
✅ "Free is complete — Pro is power"

❌ Never: "Upgrade to continue"
❌ Never: "Feature locked"
❌ Never: "Trial expired"

### Nudge Limits

- **Max 1 upgrade mention per session** (unless hitting a limit)
- **Never interrupt execution flow**
- **Never block saving or running code**
- **Always provide a free alternative action**

---

## 🔧 API Usage (Renderer)

### Check Limits

```javascript
// Check if can create project
const result = await window.electronAPI.featureLimits.canCreateProject(projectCount);
if (!result.allowed) {
  showProjectLimitModal(projectCount);
  return;
}

// Check if can save snippet
const result = await window.electronAPI.featureLimits.canSaveSnippet(snippetCount);

// Check language availability
const result = await window.electronAPI.featureLimits.isLanguageAvailable('typescript');

// Check export format
const result = await window.electronAPI.featureLimits.canExport('markdown');

// Get tier info
const isPro = await window.electronAPI.featureLimits.isPro();
const tier = await window.electronAPI.featureLimits.getCurrentTier();

// Get feature summary for UI
const summary = await window.electronAPI.featureLimits.getFeatureSummary();
```

### Show Upgrade Modals

```javascript
// Generic upgrade modal
showUpgradeModal({
  title: "🎉 You're Growing!",
  message: "That means you're getting real work done.",
  action: "Free includes 3 projects.",
  showBenefits: true,
  showPrice: true,
  primaryLabel: 'See Pro',
  secondaryLabel: 'Maybe later',
});

// Specific limit modals
showProjectLimitModal(currentCount);
showSnippetLimitModal(currentCount);
showLanguageLimitModal('TypeScript');
showExportLimitModal('markdown');
showHistoryLimitModal();
showFeatureComparisonModal();
```

---

## 🎨 UI Components

### Tier Badge (Bottom Right)

- FREE: Subtle gray, clickable to show Pro features
- PRO: Purple gradient, shows "All features unlocked"

### Upgrade Modal

- Backdrop blur effect
- Positive, encouraging language
- 3-button layout: [Soft Action] [Dismiss] [Upgrade]
- Optional Pro benefits preview
- Optional price banner

---

## 📊 Feature Classification Table

| Feature | Free | Pro | Reasoning |
|---------|:----:|:---:|-----------|
| **Project Management** | ✅ | ✅ | Core value. Never limit. |
| **Playground (JavaScript)** | ✅ | ✅ | The magic moment. |
| Projects | 5 | ♾️ | Scale limit |
| Saved snippets | 3 | ♾️ | Creates desire for more |
| Execution history | 3 days | ♾️ | Depth limit |
| Collections | 2 | ♾️ | Organization limit |
| Languages | JS only | +15 | Clear upgrade path |
| **SSH Terminal** | 🔒 | ✅ | High-value Pro feature |
| **Blueprints** | 🔒 | ✅ | Advanced planning |
| **Time Travel** | 🔒 | ✅ | Pro debugging |
| **TypeScript** | 🔒 | ✅ | Power user language |
| **Python** | 🔒 | ✅ | Power user language |
| Offline mode | ✅ | ✅ | Trust. Never gate. |
| Export: Clipboard | ✅ | ✅ | Basic data portability |
| Export: MD/Gist/PDF | ❌ | ✅ | Convenience/power |
| Cloud sync | ❌ | ✅ | Multi-device power |
| Custom themes | ❌ | ✅ | Personalization |

---

## 🚀 Testing Checklist

### Pro Feature Locks
- [ ] Click SSH tab → Should show Pro upgrade modal
- [ ] Click Blueprints → Should show Pro upgrade modal
- [ ] Try TypeScript in Playground → Should show Pro modal
- [ ] Try Python in Playground → Should show Pro modal
- [ ] Click Time Travel (history count) → Should show Pro modal

### Limits
- [ ] Save 4th snippet → Should show upgrade modal
- [ ] Create 3rd collection → Should show upgrade modal
- [ ] Create 6th project → Should show limit modal

### Free Features (Must Always Work)
- [ ] Run JavaScript in Playground → ✅ Works
- [ ] Run/Stop projects → ✅ Works
- [ ] Copy to clipboard → ✅ Works
- [ ] Light/Dark themes → ✅ Works
- [ ] Offline mode → ✅ Works

### UI Indicators
- [ ] SSH tab shows PRO badge
- [ ] Tier badge shows FREE/PRO correctly
- [ ] Language selector shows 🔒 on TS/Python

---

## 🔐 License Integration

The system reads from the existing license:

```javascript
// In licensing/featureLimits.js
function getCurrentTier() {
  const status = getLicenseStatus();
  if (status.isPro || status.status === 'active') {
    return 'pro';
  }
  return 'free';
}
```

When license activates → All limits removed automatically.

---

## 💰 Pricing Strategy

| Option | Price | Psychology |
|--------|-------|------------|
| Pro Lifetime | **$29** | "Less than 3 months of any SaaS" |

**Key messaging:**
- One-time purchase
- Yours forever
- All future updates included
- No subscription

---

## 📈 Long-Term Benefits

1. **Retention**: Free is complete → Users keep app installed
2. **Word-of-mouth**: Happy free users recommend TAFIL
3. **Natural upgrades**: Growth triggers upgrade (not frustration)
4. **Goodwill**: No dark patterns = trust = long-term brand
5. **Future-proof**: New Pro features add value without breaking Free


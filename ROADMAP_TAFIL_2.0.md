## Tafil 2.0 Roadmap (MVP → Pro → Team)

### North Star
**Tafil becomes the developer’s local control plane**: it remembers what happened, explains failures with fixes, and restores/starts complex setups reliably (offline-first).

---

## MVP (Weeks 1–2): Project Brain + Deterministic Error Intelligence

### Goals
- **Make failures actionable** (no more “it crashed, good luck”).
- **Make projects rememberable** (last good run, last crash, last port, why it failed).

### Deliverables
- **Project Brain persistence (local)**:
  - Store per-project run history and last status in `app.getPath('userData')`
  - Capture: start time, exit code/signal, detected port, framework, error summary, log snippets
- **Deterministic error intelligence (no AI yet)**:
  - Detect and label common failures:
    - **Port conflict** (EADDRINUSE / CRA “Something is already running…”)
    - **Missing env vars** (best-effort extraction)
    - **Node mismatch / OpenSSL mismatch**
  - Emit `diagnostic` payload with title/details/suggestions
- **Surface in UI (minimal)**:
  - Show “Project Memory” inside existing Project Insights modal
  - Improve error notifications to show diagnostic title/details

---

## MVP+ (Weeks 3–4): “Get Running Again” workflows

### Goals
- Turn common pain loops into **one-click recovery paths**.

### Deliverables
- **Action buttons for suggestions** (UI):
  - Port conflict: “Switch port” / “Stop conflicting Tafil project”
  - Missing env: “Open .env template” / “Copy required keys”
  - Node mismatch: “Show required version” / “Open run instructions”
- **Runbook fields in Project Brain** (manual notes):
  - “How to run”, “Known issues”, “Stable Node version”, “Required env keys”
- **Export/import Project Brain** (local file) for machine moves

---

## Pro (Weeks 5–6): Environment Snapshot + Restore (Addiction feature)

### Goals
- **One-click restore** after machine change / reinstall / onboarding.

### Deliverables
- **Environment Snapshot (local)**:
  - Node version (best-effort detect: `package.json engines`, `nvmrc`, `volta`, `fnm`, `asdf`)
  - Global tooling (optional): npm globals, pnpm, yarn
  - Project-level: env templates, chosen ports, startup command
- **Restore Everything (guided)**:
  - Validate prerequisites (node present, package manager present)
  - Install deps, inject env, start project/system

---

## Team (Weeks 7–8): Shared onboarding + Secrets (B2B)

### Goals
- “New dev to productive in 5 minutes.”

### Deliverables
- **Team Workspace (sync)**:
  - Share runbooks + system graphs + env templates
- **Secrets Vault**:
  - Encrypted, per-project/per-env, inject-on-run
  - Optional cloud sync; offline-first remains default

---

## What we measure (to validate “dependence”)
- **Time-to-first-run** for a new machine/project
- **Crash-to-fix time** (how fast users recover)
- **Weekly active projects** per user (stickiness proxy)
- **Run success rate** over time per project



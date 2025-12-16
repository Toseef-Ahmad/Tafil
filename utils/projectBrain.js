// utils/projectBrain.js
// Persisted "Project Brain" memory store (offline-first, local-only).
const { app } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

const BRAIN_VERSION = 1;
const BRAIN_FILENAME = 'project-brain.json';
const MAX_LOG_CHARS = 20_000;
const MAX_RUN_HISTORY = 20;

function getBrainPath() {
  return path.join(app.getPath('userData'), BRAIN_FILENAME);
}

function nowIso() {
  return new Date().toISOString();
}

function safeString(x) {
  if (x == null) return '';
  return typeof x === 'string' ? x : String(x);
}

function truncate(s, maxChars = MAX_LOG_CHARS) {
  const str = safeString(s);
  if (str.length <= maxChars) return str;
  return str.slice(0, maxChars) + `\n…(truncated ${str.length - maxChars} chars)`;
}

function newRunId() {
  return `${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

async function loadBrain() {
  const brainPath = getBrainPath();
  try {
    const data = await fs.readJson(brainPath);
    if (data && typeof data === 'object' && data.version === BRAIN_VERSION && data.projects) {
      return data;
    }
  } catch {
    // ignore; will create fresh
  }

  const fresh = { version: BRAIN_VERSION, updatedAt: nowIso(), projects: {} };
  await fs.ensureDir(path.dirname(brainPath));
  await fs.writeJson(brainPath, fresh, { spaces: 2 });
  return fresh;
}

async function saveBrain(brain) {
  const brainPath = getBrainPath();
  const next = {
    version: BRAIN_VERSION,
    ...brain,
    updatedAt: nowIso(),
  };
  await fs.ensureDir(path.dirname(brainPath));
  await fs.writeJson(brainPath, next, { spaces: 2 });
  return next;
}

async function updateProject(projectPath, updater) {
  const brain = await loadBrain();
  const existing = brain.projects[projectPath] || {
    projectPath,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    runCount: 0,
    successCount: 0,
    errorCount: 0,
    runs: [],
    last: {},
  };

  const record = { ...existing, updatedAt: nowIso() };
  updater(record, brain);
  brain.projects[projectPath] = record;
  await saveBrain(brain);
  return record;
}

async function recordRunStart({ projectPath, projectName, framework, command, suggestedPort }) {
  const runId = newRunId();
  await updateProject(projectPath, (rec) => {
    rec.runCount = (rec.runCount || 0) + 1;
    rec.last = {
      ...(rec.last || {}),
      status: 'starting',
      runId,
      projectName: projectName || rec.last?.projectName,
      framework,
      command,
      suggestedPort,
      startedAt: nowIso(),
    };
  });
  return runId;
}

async function recordRunRunning({ projectPath, pid, actualPort }) {
  await updateProject(projectPath, (rec) => {
    rec.last = {
      ...(rec.last || {}),
      status: 'running',
      pid: pid ?? rec.last?.pid,
      actualPort: actualPort ?? rec.last?.actualPort,
      runningAt: nowIso(),
    };
  });
}

async function recordStopRequested({ projectPath }) {
  await updateProject(projectPath, (rec) => {
    rec.last = {
      ...(rec.last || {}),
      stopRequestedAt: nowIso(),
      stopRequested: true,
    };
  });
}

async function recordRunExit({ projectPath, code, signal, stdout, stderr, errorMessage }) {
  await updateProject(projectPath, (rec) => {
    const last = rec.last || {};
    const stopRequested = !!last.stopRequested;
    const status = code === 0 || stopRequested ? 'stopped' : 'error';

    const run = {
      id: last.runId || newRunId(),
      startedAt: last.startedAt || null,
      endedAt: nowIso(),
      status,
      stopRequested,
      exitCode: code ?? null,
      signal: signal ?? null,
      pid: last.pid ?? null,
      framework: last.framework ?? null,
      command: last.command ?? null,
      suggestedPort: last.suggestedPort ?? null,
      actualPort: last.actualPort ?? null,
      errorMessage: status === 'error' ? safeString(errorMessage || '') : '',
      stderrSnippet: status === 'error' ? truncate(stderr || '') : '',
      stdoutSnippet: status === 'error' ? truncate(stdout || '') : '',
      diagnostic: last.diagnostic || null,
    };

    rec.runs = Array.isArray(rec.runs) ? rec.runs : [];
    rec.runs.unshift(run);
    if (rec.runs.length > MAX_RUN_HISTORY) rec.runs.length = MAX_RUN_HISTORY;

    rec.last = {
      ...(rec.last || {}),
      status,
      endedAt: run.endedAt,
      exitCode: run.exitCode,
      signal: run.signal,
      errorMessage: run.errorMessage,
      stopRequested: false,
      diagnostic: last.diagnostic || null,
    };

    if (status === 'error') rec.errorCount = (rec.errorCount || 0) + 1;
    else rec.successCount = (rec.successCount || 0) + 1;
  });
}

async function recordDiagnostic({ projectPath, diagnostic }) {
  if (!diagnostic) return;
  await updateProject(projectPath, (rec) => {
    rec.last = {
      ...(rec.last || {}),
      diagnostic,
    };
  });
}

async function getProjectBrain(projectPath) {
  const brain = await loadBrain();
  return brain.projects[projectPath] || null;
}

/**
 * Save error context note for a run or error type
 * @param {string} projectPath - Project path
 * @param {string} note - User's note text
 * @param {string} runId - Optional: attach to specific run ID
 * @param {string} errorKind - Optional: attach to error type (PORT_IN_USE, MISSING_ENV, etc.)
 */
async function saveErrorNote(projectPath, note, runId = null, errorKind = null) {
  if (!note || !note.trim()) return; // Skip empty notes
  
  await updateProject(projectPath, (rec) => {
    if (!rec.errorNotes) rec.errorNotes = [];
    
    const noteEntry = {
      id: newRunId(),
      note: safeString(note).trim(),
      createdAt: nowIso(),
      runId: runId || null,
      errorKind: errorKind || null,
    };
    
    rec.errorNotes.unshift(noteEntry);
    
    // Keep only last 10 notes
    const MAX_NOTES = 10;
    if (rec.errorNotes.length > MAX_NOTES) {
      rec.errorNotes = rec.errorNotes.slice(0, MAX_NOTES);
    }
  });
}

/**
 * Get error notes for a project
 * @param {string} projectPath - Project path
 * @param {string} runId - Optional: filter by run ID
 * @param {string} errorKind - Optional: filter by error kind
 */
async function getErrorNotes(projectPath, runId = null, errorKind = null) {
  const brain = await loadBrain();
  const project = brain.projects[projectPath];
  if (!project || !project.errorNotes) return [];
  
  let notes = project.errorNotes;
  
  // Filter by runId if provided
  if (runId) {
    notes = notes.filter(n => n.runId === runId);
  }
  
  // Filter by errorKind if provided
  if (errorKind) {
    notes = notes.filter(n => n.errorKind === errorKind);
  }
  
  return notes;
}

/**
 * Save environment snapshot for a project
 */
async function saveEnvironmentSnapshot(projectPath, snapshot) {
  await updateProject(projectPath, (rec) => {
    rec.environmentSnapshot = {
      ...snapshot,
      savedAt: nowIso(),
    };
  });
}

/**
 * Get environment snapshot for a project
 */
async function getEnvironmentSnapshot(projectPath) {
  const brain = await loadBrain();
  const project = brain.projects[projectPath];
  return project?.environmentSnapshot || null;
}

/**
 * Update snapshot with latest port and command info
 */
async function updateSnapshotFromRun(projectPath, { port, command, framework }) {
  await updateProject(projectPath, (rec) => {
    if (rec.environmentSnapshot) {
      rec.environmentSnapshot.lastPort = port;
      rec.environmentSnapshot.lastCommand = command;
      rec.environmentSnapshot.lastFramework = framework;
      rec.environmentSnapshot.updatedAt = nowIso();
    }
  });
}

/**
 * Update project notes (human memory)
 */
async function updateProjectNotes(projectPath, notes) {
  await updateProject(projectPath, (rec) => {
    rec.notes = safeString(notes);
  });
}

/**
 * Save project architecture canvas data
 */
async function saveProjectArchitecture(projectPath, architectureData) {
  await updateProject(projectPath, (rec) => {
    rec.architecture = {
      ...architectureData,
      updatedAt: nowIso(),
    };
  });
}

/**
 * Get project architecture canvas data
 */
async function getProjectArchitecture(projectPath) {
  const brain = await loadBrain();
  const project = brain.projects[projectPath];
  return project?.architecture || null;
}

module.exports = {
  getProjectBrain,
  recordRunStart,
  recordRunRunning,
  recordStopRequested,
  recordRunExit,
  recordDiagnostic,
  saveEnvironmentSnapshot,
  getEnvironmentSnapshot,
  updateSnapshotFromRun,
  updateProjectNotes,
  saveErrorNote,
  getErrorNotes,
  saveProjectArchitecture,
  getProjectArchitecture,
};



// utils/blueprintManager.js
// Blueprint/Module Manager for Tafil - Handles .tafil/ folder operations
// Offline-first, Git-friendly storage in each project folder

const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

const TAFIL_DIR = '.tafil';
const BLUEPRINTS_FILE = 'blueprints.json';
const MODULES_DIR = 'modules';
const MODULE_EDITOR_FILE = 'editor.js';
const VERSION = 1;

// ========================================
// Utility Functions
// ========================================

function generateId() {
  return `${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

function nowIso() {
  return new Date().toISOString();
}

function getTafilPath(projectPath) {
  return path.join(projectPath, TAFIL_DIR);
}

function getBlueprintsPath(projectPath) {
  return path.join(getTafilPath(projectPath), BLUEPRINTS_FILE);
}

function getModulesPath(projectPath) {
  return path.join(getTafilPath(projectPath), MODULES_DIR);
}

function getModulePath(projectPath, moduleId) {
  return path.join(getModulesPath(projectPath), moduleId);
}

// ========================================
// Blueprint Data Structure
// ========================================

/*
Blueprint structure:
{
  version: 1,
  projectPath: string,
  createdAt: ISO string,
  updatedAt: ISO string,
  modules: [
    {
      id: string,
      title: string,
      description: string,
      order: number,
      createdAt: ISO string,
      updatedAt: ISO string,
      color: string (optional hex color),
      icon: string (optional emoji/icon)
    }
  ],
  settings: {
    defaultView: 'goal' | 'kanban' | 'canvas' | 'resources'
  }
}

Module folder structure (.tafil/modules/{moduleId}/):
- goal.md              - Markdown content for goals/description
- editor.js            - Code scratchpad per module (Blueprint Editor tab)
- tasks.json           - Kanban tasks data
- canvas.json          - Excalidraw canvas data
- resources.json       - Links and file references
- history/             - Versioned history of changes
  - {timestamp}_goal.md
  - {timestamp}_editor.js
  - {timestamp}_tasks.json
  - {timestamp}_canvas.json
*/

// ========================================
// Initialize .tafil folder
// ========================================

async function initTafilFolder(projectPath) {
  const tafilPath = getTafilPath(projectPath);
  const modulesPath = getModulesPath(projectPath);
  
  await fs.ensureDir(tafilPath);
  await fs.ensureDir(modulesPath);
  
  // Create .gitignore to optionally exclude certain files
  const gitignorePath = path.join(tafilPath, '.gitignore');
  if (!await fs.pathExists(gitignorePath)) {
    await fs.writeFile(gitignorePath, '# Tafil Blueprint files are Git-friendly by default\n# Uncomment lines below to exclude specific items\n# history/\n');
  }
  
  // Initialize blueprints.json if not exists
  const blueprintsPath = getBlueprintsPath(projectPath);
  if (!await fs.pathExists(blueprintsPath)) {
    const initial = {
      version: VERSION,
      projectPath,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      modules: [],
      settings: {
        defaultView: 'goal'
      }
    };
    await fs.writeJson(blueprintsPath, initial, { spaces: 2 });
    return initial;
  }
  
  return await loadBlueprints(projectPath);
}

// ========================================
// Blueprint CRUD Operations
// ========================================

async function loadBlueprints(projectPath) {
  const blueprintsPath = getBlueprintsPath(projectPath);
  
  try {
    if (await fs.pathExists(blueprintsPath)) {
      const data = await fs.readJson(blueprintsPath);
      return data;
    }
  } catch (err) {
    console.error('Error loading blueprints:', err);
  }
  
  // Initialize if not exists
  return await initTafilFolder(projectPath);
}

async function saveBlueprints(projectPath, blueprints) {
  await initTafilFolder(projectPath);
  const blueprintsPath = getBlueprintsPath(projectPath);
  
  const updated = {
    ...blueprints,
    updatedAt: nowIso()
  };
  
  await fs.writeJson(blueprintsPath, updated, { spaces: 2 });
  return updated;
}

// ========================================
// Module CRUD Operations
// ========================================

async function createModule(projectPath, moduleData) {
  const blueprints = await loadBlueprints(projectPath);
  
  const moduleId = generateId();
  const now = nowIso();
  
  const newModule = {
    id: moduleId,
    title: moduleData.title || 'Untitled Module',
    description: moduleData.description || '',
    order: blueprints.modules.length,
    createdAt: now,
    updatedAt: now,
    color: moduleData.color || '#8b5cf6',
    icon: moduleData.icon || '📦'
  };
  
  // Create module folder structure
  const modulePath = getModulePath(projectPath, moduleId);
  await fs.ensureDir(modulePath);
  await fs.ensureDir(path.join(modulePath, 'history'));
  
  // Initialize module files
  await fs.writeFile(path.join(modulePath, 'goal.md'), `# ${newModule.title}\n\n${newModule.description}\n`);
  await fs.writeJson(path.join(modulePath, 'tasks.json'), {
    version: 1,
    columns: [
      { id: 'todo', title: 'To Do', tasks: [] },
      { id: 'inprogress', title: 'In Progress', tasks: [] },
      { id: 'done', title: 'Done', tasks: [] }
    ],
    createdAt: now,
    updatedAt: now
  }, { spaces: 2 });
  await fs.writeJson(path.join(modulePath, 'canvas.json'), {
    version: 1,
    elements: [],
    appState: {},
    createdAt: now,
    updatedAt: now
  }, { spaces: 2 });
  await fs.writeJson(path.join(modulePath, 'resources.json'), {
    version: 1,
    links: [],
    files: [],
    createdAt: now,
    updatedAt: now
  }, { spaces: 2 });
  
  // Add to blueprints
  blueprints.modules.push(newModule);
  await saveBlueprints(projectPath, blueprints);
  
  return newModule;
}

async function updateModule(projectPath, moduleId, updates) {
  const blueprints = await loadBlueprints(projectPath);
  
  const moduleIndex = blueprints.modules.findIndex(m => m.id === moduleId);
  if (moduleIndex === -1) {
    throw new Error(`Module ${moduleId} not found`);
  }
  
  blueprints.modules[moduleIndex] = {
    ...blueprints.modules[moduleIndex],
    ...updates,
    updatedAt: nowIso()
  };
  
  await saveBlueprints(projectPath, blueprints);
  return blueprints.modules[moduleIndex];
}

async function deleteModule(projectPath, moduleId) {
  const blueprints = await loadBlueprints(projectPath);
  
  const moduleIndex = blueprints.modules.findIndex(m => m.id === moduleId);
  if (moduleIndex === -1) {
    throw new Error(`Module ${moduleId} not found`);
  }
  
  // Remove module folder
  const modulePath = getModulePath(projectPath, moduleId);
  if (await fs.pathExists(modulePath)) {
    await fs.remove(modulePath);
  }
  
  // Remove from blueprints and reorder
  blueprints.modules.splice(moduleIndex, 1);
  blueprints.modules.forEach((m, idx) => m.order = idx);
  
  await saveBlueprints(projectPath, blueprints);
  return true;
}

async function reorderModules(projectPath, moduleIds) {
  const blueprints = await loadBlueprints(projectPath);
  
  const newModules = moduleIds.map((id, index) => {
    const module = blueprints.modules.find(m => m.id === id);
    if (module) {
      return { ...module, order: index };
    }
    return null;
  }).filter(Boolean);
  
  blueprints.modules = newModules;
  await saveBlueprints(projectPath, blueprints);
  return blueprints.modules;
}

// ========================================
// Module Content Operations
// ========================================

async function getModuleGoal(projectPath, moduleId) {
  const modulePath = getModulePath(projectPath, moduleId);
  const goalPath = path.join(modulePath, 'goal.md');
  
  try {
    if (await fs.pathExists(goalPath)) {
      return await fs.readFile(goalPath, 'utf-8');
    }
  } catch (err) {
    console.error('Error reading goal:', err);
  }
  return '';
}

async function saveModuleGoal(projectPath, moduleId, content, saveHistory = true) {
  const modulePath = getModulePath(projectPath, moduleId);
  const goalPath = path.join(modulePath, 'goal.md');
  
  // Save to history before updating
  if (saveHistory && await fs.pathExists(goalPath)) {
    const historyPath = path.join(modulePath, 'history', `${Date.now()}_goal.md`);
    const oldContent = await fs.readFile(goalPath, 'utf-8');
    await fs.writeFile(historyPath, oldContent);
  }
  
  await fs.writeFile(goalPath, content);
  await updateModule(projectPath, moduleId, {});
  return true;
}

async function getModuleEditor(projectPath, moduleId) {
  const modulePath = getModulePath(projectPath, moduleId);
  const editorPath = path.join(modulePath, MODULE_EDITOR_FILE);
  
  try {
    if (await fs.pathExists(editorPath)) {
      return await fs.readFile(editorPath, 'utf-8');
    }
  } catch (err) {
    console.error('Error reading editor.js:', err);
  }
  
  // Default starter content
  return `// Module Editor Scratchpad\n// Saved in .tafil/modules/${moduleId}/editor.js\n\nconsole.log('Hello from Blueprint Editor');\n`;
}

async function saveModuleEditor(projectPath, moduleId, content, saveHistory = true) {
  const modulePath = getModulePath(projectPath, moduleId);
  const editorPath = path.join(modulePath, MODULE_EDITOR_FILE);
  
  await fs.ensureDir(modulePath);
  await fs.ensureDir(path.join(modulePath, 'history'));
  
  // Save to history before updating
  if (saveHistory && await fs.pathExists(editorPath)) {
    const historyPath = path.join(modulePath, 'history', `${Date.now()}_editor.js`);
    const oldContent = await fs.readFile(editorPath, 'utf-8');
    await fs.writeFile(historyPath, oldContent);
  }
  
  await fs.writeFile(editorPath, content || '');
  await updateModule(projectPath, moduleId, {});
  return true;
}

async function getModuleTasks(projectPath, moduleId) {
  const modulePath = getModulePath(projectPath, moduleId);
  const tasksPath = path.join(modulePath, 'tasks.json');
  
  try {
    if (await fs.pathExists(tasksPath)) {
      return await fs.readJson(tasksPath);
    }
  } catch (err) {
    console.error('Error reading tasks:', err);
  }
  
  return {
    version: 1,
    columns: [
      { id: 'todo', title: 'To Do', tasks: [] },
      { id: 'inprogress', title: 'In Progress', tasks: [] },
      { id: 'done', title: 'Done', tasks: [] }
    ],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
}

async function saveModuleTasks(projectPath, moduleId, tasksData, saveHistory = true) {
  const modulePath = getModulePath(projectPath, moduleId);
  const tasksPath = path.join(modulePath, 'tasks.json');
  
  // Save to history before updating
  if (saveHistory && await fs.pathExists(tasksPath)) {
    const historyPath = path.join(modulePath, 'history', `${Date.now()}_tasks.json`);
    const oldData = await fs.readJson(tasksPath);
    await fs.writeJson(historyPath, oldData, { spaces: 2 });
  }
  
  await fs.writeJson(tasksPath, { ...tasksData, updatedAt: nowIso() }, { spaces: 2 });
  await updateModule(projectPath, moduleId, {});
  return true;
}

async function addTask(projectPath, moduleId, columnId, taskData) {
  const tasks = await getModuleTasks(projectPath, moduleId);
  
  const column = tasks.columns.find(c => c.id === columnId);
  if (!column) {
    throw new Error(`Column ${columnId} not found`);
  }
  
  const newTask = {
    id: generateId(),
    title: taskData.title || 'New Task',
    description: taskData.description || '',
    priority: taskData.priority || 'medium',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    labels: taskData.labels || [],
    dueDate: taskData.dueDate || null
  };
  
  column.tasks.push(newTask);
  await saveModuleTasks(projectPath, moduleId, tasks, false);
  return newTask;
}

async function updateTask(projectPath, moduleId, taskId, updates) {
  const tasks = await getModuleTasks(projectPath, moduleId);
  
  for (const column of tasks.columns) {
    const taskIndex = column.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      column.tasks[taskIndex] = {
        ...column.tasks[taskIndex],
        ...updates,
        updatedAt: nowIso()
      };
      await saveModuleTasks(projectPath, moduleId, tasks, false);
      return column.tasks[taskIndex];
    }
  }
  
  throw new Error(`Task ${taskId} not found`);
}

async function moveTask(projectPath, moduleId, taskId, toColumnId, toIndex) {
  const tasks = await getModuleTasks(projectPath, moduleId);
  
  let task = null;
  let fromColumnIndex = -1;
  let fromTaskIndex = -1;
  
  // Find and remove task from source column
  for (let i = 0; i < tasks.columns.length; i++) {
    const taskIndex = tasks.columns[i].tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      task = tasks.columns[i].tasks[taskIndex];
      fromColumnIndex = i;
      fromTaskIndex = taskIndex;
      tasks.columns[i].tasks.splice(taskIndex, 1);
      break;
    }
  }
  
  if (!task) {
    throw new Error(`Task ${taskId} not found`);
  }
  
  // Add to destination column
  const toColumn = tasks.columns.find(c => c.id === toColumnId);
  if (!toColumn) {
    throw new Error(`Column ${toColumnId} not found`);
  }
  
  task.updatedAt = nowIso();
  toColumn.tasks.splice(toIndex, 0, task);
  
  await saveModuleTasks(projectPath, moduleId, tasks);
  return task;
}

async function deleteTask(projectPath, moduleId, taskId) {
  const tasks = await getModuleTasks(projectPath, moduleId);
  
  for (const column of tasks.columns) {
    const taskIndex = column.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      column.tasks.splice(taskIndex, 1);
      await saveModuleTasks(projectPath, moduleId, tasks, false);
      return true;
    }
  }
  
  return false;
}

// ========================================
// Canvas Operations
// ========================================

async function getModuleCanvas(projectPath, moduleId) {
  const modulePath = getModulePath(projectPath, moduleId);
  const canvasPath = path.join(modulePath, 'canvas.json');
  
  try {
    if (await fs.pathExists(canvasPath)) {
      return await fs.readJson(canvasPath);
    }
  } catch (err) {
    console.error('Error reading canvas:', err);
  }
  
  return {
    version: 1,
    elements: [],
    appState: {},
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
}

async function saveModuleCanvas(projectPath, moduleId, canvasData, saveHistory = true) {
  const modulePath = getModulePath(projectPath, moduleId);
  const canvasPath = path.join(modulePath, 'canvas.json');
  
  // Save to history before updating (limit history saves for canvas to reduce noise)
  if (saveHistory && await fs.pathExists(canvasPath)) {
    const historyPath = path.join(modulePath, 'history', `${Date.now()}_canvas.json`);
    const oldData = await fs.readJson(canvasPath);
    await fs.writeJson(historyPath, oldData, { spaces: 2 });
  }
  
  await fs.writeJson(canvasPath, { ...canvasData, updatedAt: nowIso() }, { spaces: 2 });
  await updateModule(projectPath, moduleId, {});
  return true;
}

// ========================================
// Resources Operations
// ========================================

async function getModuleResources(projectPath, moduleId) {
  const modulePath = getModulePath(projectPath, moduleId);
  const resourcesPath = path.join(modulePath, 'resources.json');
  
  try {
    if (await fs.pathExists(resourcesPath)) {
      return await fs.readJson(resourcesPath);
    }
  } catch (err) {
    console.error('Error reading resources:', err);
  }
  
  return {
    version: 1,
    links: [],
    files: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
}

async function saveModuleResources(projectPath, moduleId, resourcesData) {
  const modulePath = getModulePath(projectPath, moduleId);
  const resourcesPath = path.join(modulePath, 'resources.json');
  
  await fs.writeJson(resourcesPath, { ...resourcesData, updatedAt: nowIso() }, { spaces: 2 });
  await updateModule(projectPath, moduleId, {});
  return true;
}

async function addLink(projectPath, moduleId, linkData) {
  const resources = await getModuleResources(projectPath, moduleId);
  
  const newLink = {
    id: generateId(),
    url: linkData.url || '',
    title: linkData.title || '',
    description: linkData.description || '',
    type: linkData.type || 'external', // 'external', 'figma', 'api', 'docs'
    createdAt: nowIso()
  };
  
  resources.links.push(newLink);
  await saveModuleResources(projectPath, moduleId, resources);
  return newLink;
}

async function addFileReference(projectPath, moduleId, fileData) {
  const resources = await getModuleResources(projectPath, moduleId);
  
  const newFile = {
    id: generateId(),
    path: fileData.path || '',
    name: fileData.name || path.basename(fileData.path || ''),
    description: fileData.description || '',
    createdAt: nowIso()
  };
  
  resources.files.push(newFile);
  await saveModuleResources(projectPath, moduleId, resources);
  return newFile;
}

async function removeResource(projectPath, moduleId, resourceId, type = 'link') {
  const resources = await getModuleResources(projectPath, moduleId);
  
  if (type === 'link') {
    resources.links = resources.links.filter(l => l.id !== resourceId);
  } else {
    resources.files = resources.files.filter(f => f.id !== resourceId);
  }
  
  await saveModuleResources(projectPath, moduleId, resources);
  return true;
}

// ========================================
// Search Operations
// ========================================

async function searchModules(projectPath, query) {
  if (!query || !query.trim()) return [];
  
  const blueprints = await loadBlueprints(projectPath);
  const results = [];
  const searchTerm = query.toLowerCase().trim();
  
  for (const module of blueprints.modules) {
    const moduleResults = {
      module,
      matches: []
    };
    
    // Search module title and description
    if (module.title.toLowerCase().includes(searchTerm) || 
        module.description.toLowerCase().includes(searchTerm)) {
      moduleResults.matches.push({ type: 'module', text: module.title });
    }
    
    // Search goal content
    try {
      const goal = await getModuleGoal(projectPath, module.id);
      if (goal.toLowerCase().includes(searchTerm)) {
        const lines = goal.split('\n');
        for (const line of lines) {
          if (line.toLowerCase().includes(searchTerm)) {
            moduleResults.matches.push({ 
              type: 'goal', 
              text: line.substring(0, 100) 
            });
            break;
          }
        }
      }
    } catch {}
    
    // Search tasks
    try {
      const tasks = await getModuleTasks(projectPath, module.id);
      for (const column of tasks.columns) {
        for (const task of column.tasks) {
          if (task.title.toLowerCase().includes(searchTerm) ||
              (task.description && task.description.toLowerCase().includes(searchTerm))) {
            moduleResults.matches.push({ 
              type: 'task', 
              text: task.title,
              column: column.title
            });
          }
        }
      }
    } catch {}
    
    // Search resources
    try {
      const resources = await getModuleResources(projectPath, module.id);
      for (const link of resources.links) {
        if (link.title.toLowerCase().includes(searchTerm) ||
            link.url.toLowerCase().includes(searchTerm)) {
          moduleResults.matches.push({ 
            type: 'link', 
            text: link.title || link.url 
          });
        }
      }
      for (const file of resources.files) {
        if (file.name.toLowerCase().includes(searchTerm) ||
            file.path.toLowerCase().includes(searchTerm)) {
          moduleResults.matches.push({ 
            type: 'file', 
            text: file.name 
          });
        }
      }
    } catch {}
    
    if (moduleResults.matches.length > 0) {
      results.push(moduleResults);
    }
  }
  
  return results;
}

// ========================================
// History Operations
// ========================================

async function getModuleHistory(projectPath, moduleId, type = 'goal') {
  const modulePath = getModulePath(projectPath, moduleId);
  const historyPath = path.join(modulePath, 'history');
  
  try {
    if (!await fs.pathExists(historyPath)) return [];
    
    const files = await fs.readdir(historyPath);
    const prefix = `_${type}.`;
    
    const historyFiles = files
      .filter(f => f.includes(prefix))
      .sort((a, b) => b.localeCompare(a)) // Sort descending by timestamp
      .slice(0, 20); // Limit to 20 entries
    
    const history = [];
    for (const file of historyFiles) {
      const timestamp = parseInt(file.split('_')[0], 10);
      history.push({
        filename: file,
        timestamp,
        date: new Date(timestamp).toISOString()
      });
    }
    
    return history;
  } catch (err) {
    console.error('Error reading history:', err);
    return [];
  }
}

async function restoreFromHistory(projectPath, moduleId, filename) {
  const modulePath = getModulePath(projectPath, moduleId);
  const historyPath = path.join(modulePath, 'history', filename);
  
  if (!await fs.pathExists(historyPath)) {
    throw new Error('History file not found');
  }
  
  if (filename.endsWith('.md')) {
    const content = await fs.readFile(historyPath, 'utf-8');
    await saveModuleGoal(projectPath, moduleId, content, true);
    return { type: 'goal', content };
  } else if (filename.includes('_editor.')) {
    const content = await fs.readFile(historyPath, 'utf-8');
    await saveModuleEditor(projectPath, moduleId, content, true);
    return { type: 'editor', content };
  } else if (filename.includes('_tasks.')) {
    const data = await fs.readJson(historyPath);
    await saveModuleTasks(projectPath, moduleId, data, true);
    return { type: 'tasks', data };
  } else if (filename.includes('_canvas.')) {
    const data = await fs.readJson(historyPath);
    await saveModuleCanvas(projectPath, moduleId, data, true);
    return { type: 'canvas', data };
  }
  
  throw new Error('Unknown history file type');
}

// ========================================
// Export / Import
// ========================================

async function exportModule(projectPath, moduleId) {
  const blueprints = await loadBlueprints(projectPath);
  const module = blueprints.modules.find(m => m.id === moduleId);
  
  if (!module) {
    throw new Error(`Module ${moduleId} not found`);
  }
  
  return {
    module,
    goal: await getModuleGoal(projectPath, moduleId),
    editor: await getModuleEditor(projectPath, moduleId),
    tasks: await getModuleTasks(projectPath, moduleId),
    canvas: await getModuleCanvas(projectPath, moduleId),
    resources: await getModuleResources(projectPath, moduleId),
    exportedAt: nowIso()
  };
}

async function checkTafilExists(projectPath) {
  const tafilPath = getTafilPath(projectPath);
  return await fs.pathExists(tafilPath);
}

module.exports = {
  // Initialization
  initTafilFolder,
  checkTafilExists,
  
  // Blueprints
  loadBlueprints,
  saveBlueprints,
  
  // Modules
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  
  // Goal/Description
  getModuleGoal,
  saveModuleGoal,
  
  // Editor (Code Scratchpad)
  getModuleEditor,
  saveModuleEditor,
  
  // Tasks/Kanban
  getModuleTasks,
  saveModuleTasks,
  addTask,
  updateTask,
  moveTask,
  deleteTask,
  
  // Canvas
  getModuleCanvas,
  saveModuleCanvas,
  
  // Resources
  getModuleResources,
  saveModuleResources,
  addLink,
  addFileReference,
  removeResource,
  
  // Search
  searchModules,
  
  // History
  getModuleHistory,
  restoreFromHistory,
  
  // Export
  exportModule
};


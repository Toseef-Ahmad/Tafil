// utils/projectCreator.js
// Robust project scaffolding and bootstrapping for Tafil
const { spawn, exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { findFreePort } = require('./portFinder');

// Platform detection
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

// ========================================
// Template Definitions (Offline-First)
// ========================================
const TEMPLATES = {
  react: {
    name: 'React.js',
    icon: '⚛️',
    description: 'A JavaScript library for building user interfaces',
    defaultPort: 3000,
    command: 'create-react-app',
    npxCommand: (projectName, useTypeScript) => 
      useTypeScript 
        ? `npx create-react-app ${projectName} --template typescript`
        : `npx create-react-app ${projectName}`,
    startScript: 'start',
    devScript: 'start',
    detectFiles: ['src/App.js', 'src/App.tsx', 'public/index.html'],
    offlineTemplate: true,
  },
  nextjs: {
    name: 'Next.js',
    icon: '▲',
    description: 'The React Framework for the Web',
    defaultPort: 3000,
    command: 'create-next-app',
    npxCommand: (projectName, useTypeScript) => 
      useTypeScript 
        ? `npx create-next-app@latest ${projectName} --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm`
        : `npx create-next-app@latest ${projectName} --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm`,
    startScript: 'dev',
    devScript: 'dev',
    detectFiles: ['next.config.js', 'next.config.mjs', 'pages', 'app'],
    offlineTemplate: true,
  },
  express: {
    name: 'Express.js',
    icon: '🚂',
    description: 'Fast, unopinionated, minimalist web framework for Node.js',
    defaultPort: 3001,
    command: 'express-generator',
    npxCommand: (projectName, useTypeScript) => 
      `npx express-generator ${projectName} --view=ejs`,
    startScript: 'start',
    devScript: 'start',
    detectFiles: ['app.js', 'routes/index.js'],
    offlineTemplate: true,
    postSetup: async (projectPath) => {
      // Add nodemon for development
      const pkgPath = path.join(projectPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.dev = 'nodemon ./bin/www';
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies.nodemon = '^3.0.0';
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      }
    },
  },
  nestjs: {
    name: 'NestJS',
    icon: '🐱',
    description: 'A progressive Node.js framework for building efficient server-side applications',
    defaultPort: 3000,
    command: '@nestjs/cli',
    npxCommand: (projectName, useTypeScript) => 
      `npx @nestjs/cli new ${projectName} --package-manager npm --skip-git`,
    startScript: 'start:dev',
    devScript: 'start:dev',
    detectFiles: ['nest-cli.json', 'src/main.ts', 'src/app.module.ts'],
    offlineTemplate: false, // NestJS always needs network
  },
  vite: {
    name: 'Vite + React',
    icon: '⚡',
    description: 'Next Generation Frontend Tooling with React',
    defaultPort: 5173,
    command: 'create-vite',
    npxCommand: (projectName, useTypeScript) => 
      useTypeScript
        ? `npm create vite@latest ${projectName} -- --template react-ts`
        : `npm create vite@latest ${projectName} -- --template react`,
    startScript: 'dev',
    devScript: 'dev',
    detectFiles: ['vite.config.js', 'vite.config.ts'],
    offlineTemplate: true,
  },
  vue: {
    name: 'Vue.js',
    icon: '💚',
    description: 'The Progressive JavaScript Framework',
    defaultPort: 5173,
    command: 'create-vue',
    npxCommand: (projectName, useTypeScript) => 
      `npm create vue@latest ${projectName}`,
    startScript: 'dev',
    devScript: 'dev',
    detectFiles: ['vite.config.js', 'src/App.vue'],
    offlineTemplate: true,
  },
};

// ========================================
// Pre-configured Template Library
// ========================================
const TEMPLATE_LIBRARY = {
  'react-tailwind': {
    name: 'React + Tailwind CSS',
    base: 'react',
    description: 'React with Tailwind CSS for styling',
    additionalDeps: ['tailwindcss', 'postcss', 'autoprefixer'],
    postSetup: async (projectPath) => {
      // Initialize Tailwind
      await runCommand('npx tailwindcss init -p', projectPath);
      
      // Update tailwind.config.js
      const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
      await fsPromises.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);
      
      // Update index.css
      const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
      const cssPath = path.join(projectPath, 'src', 'index.css');
      await fsPromises.writeFile(cssPath, indexCss);
    },
  },
  'nextjs-typescript': {
    name: 'Next.js + TypeScript',
    base: 'nextjs',
    description: 'Next.js with TypeScript and Tailwind CSS',
    useTypeScript: true,
    additionalDeps: [],
  },
  'express-jwt': {
    name: 'Express + JWT Auth',
    base: 'express',
    description: 'Express.js with JWT authentication setup',
    additionalDeps: ['jsonwebtoken', 'bcryptjs', 'dotenv', 'cors'],
    postSetup: async (projectPath) => {
      // Create auth middleware
      const authDir = path.join(projectPath, 'middleware');
      await fsPromises.mkdir(authDir, { recursive: true });
      
      const authMiddleware = `const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
`;
      await fsPromises.writeFile(path.join(authDir, 'auth.js'), authMiddleware);
      
      // Create .env template
      const envTemplate = `# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Database (if needed)
# DATABASE_URL=mongodb://localhost:27017/myapp
`;
      await fsPromises.writeFile(path.join(projectPath, '.env.example'), envTemplate);
    },
  },
  'nestjs-rest-api': {
    name: 'NestJS REST API',
    base: 'nestjs',
    description: 'NestJS with a pre-configured REST API structure',
    additionalDeps: ['@nestjs/swagger', '@nestjs/config', 'class-validator', 'class-transformer'],
    postSetup: async (projectPath) => {
      // Add Swagger setup to main.ts
      const mainPath = path.join(projectPath, 'src', 'main.ts');
      if (fs.existsSync(mainPath)) {
        let mainContent = await fsPromises.readFile(mainPath, 'utf-8');
        if (!mainContent.includes('SwaggerModule')) {
          mainContent = mainContent.replace(
            "import { NestFactory } from '@nestjs/core';",
            `import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';`
          );
          mainContent = mainContent.replace(
            'await app.listen',
            `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen`
          );
          await fsPromises.writeFile(mainPath, mainContent);
        }
      }
    },
  },
};

// ========================================
// Utility Functions
// ========================================

/**
 * Run a shell command with promise support
 */
function runCommand(command, cwd, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command} in ${cwd}`);
    
    const env = {
      ...process.env,
      ...options.env,
      CI: 'true', // Avoid interactive prompts
      FORCE_COLOR: '0', // Disable colors for cleaner output
    };
    
    const child = exec(command, {
      cwd,
      env,
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer
      timeout: options.timeout || 600000, // 10 minute timeout
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout?.on('data', (data) => {
      stdout += data;
      if (options.onProgress) {
        options.onProgress({ type: 'stdout', data: data.toString() });
      }
    });
    
    child.stderr?.on('data', (data) => {
      stderr += data;
      if (options.onProgress) {
        options.onProgress({ type: 'stderr', data: data.toString() });
      }
    });
    
    child.on('error', (error) => {
      reject({ error, stdout, stderr });
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject({ code, stdout, stderr, error: new Error(`Command failed with code ${code}`) });
      }
    });
  });
}

/**
 * Validate project name
 */
function validateProjectName(name) {
  const errors = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('Project name is required');
    return { valid: false, errors, sanitized: null };
  }
  
  // Trim and convert to lowercase
  let sanitized = name.trim().toLowerCase();
  
  // Replace spaces with hyphens
  sanitized = sanitized.replace(/\s+/g, '-');
  
  // Remove forbidden characters
  sanitized = sanitized.replace(/[<>:"/\\|?*]/g, '');
  
  // Check length
  if (sanitized.length < 1) {
    errors.push('Project name must be at least 1 character');
  }
  if (sanitized.length > 214) {
    errors.push('Project name must be less than 214 characters');
  }
  
  // Check for npm package name validity
  if (!/^[a-z0-9]/.test(sanitized)) {
    sanitized = 'project-' + sanitized;
  }
  
  // Check for reserved names
  const reserved = ['node_modules', 'favicon.ico', 'npm-debug.log', 'package.json', 'package-lock.json'];
  if (reserved.includes(sanitized)) {
    errors.push(`"${sanitized}" is a reserved name`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Check if path is writable
 */
async function isPathWritable(dirPath) {
  try {
    await fsPromises.access(dirPath, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check disk space (basic check)
 */
async function checkDiskSpace(dirPath) {
  try {
    // Create a test file to verify we can write
    const testFile = path.join(dirPath, `.tafil-test-${Date.now()}`);
    await fsPromises.writeFile(testFile, 'test');
    await fsPromises.unlink(testFile);
    return { hasSpace: true };
  } catch (error) {
    if (error.code === 'ENOSPC') {
      return { hasSpace: false, error: 'Disk is full' };
    }
    return { hasSpace: true }; // Assume it's fine if we can't check
  }
}

/**
 * Generate .gitignore based on stack
 */
function generateGitignore(stack) {
  const common = `# Dependencies
node_modules/
.pnp/
.pnp.js

# Testing
coverage/

# Production
build/
dist/
out/

# Misc
.DS_Store
*.pem
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.idea/
.vscode/
*.swp
*.swo

# Tafil
.tafil/
`;

  const stackSpecific = {
    react: `
# React specific
.env.local
.env.development.local
.env.test.local
.env.production.local
`,
    nextjs: `
# Next.js specific
.next/
out/
.vercel

# Sentry
.sentryclirc
`,
    express: `
# Express specific
logs/
*.log
pids/
*.pid
*.seed
`,
    nestjs: `
# NestJS specific
.nest/
.turbo/

# Testing
.nyc_output/
test-results/
`,
    vite: `
# Vite specific
.vite/
*.local
`,
    vue: `
# Vue specific
.vite/
*.local
`,
  };
  
  return common + (stackSpecific[stack] || '');
}

/**
 * Generate default .env file
 */
function generateEnvFile(stack, port) {
  const envVars = {
    common: `# Environment
NODE_ENV=development
PORT=${port}
`,
    react: `
# React
REACT_APP_API_URL=http://localhost:3001/api
`,
    nextjs: `
# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001/api
`,
    express: `
# Express
DATABASE_URL=
JWT_SECRET=your-secret-key-here
`,
    nestjs: `
# NestJS
DATABASE_URL=
JWT_SECRET=your-secret-key-here
`,
    vite: `
# Vite
VITE_API_URL=http://localhost:3001/api
`,
    vue: `
# Vue
VITE_API_URL=http://localhost:3001/api
`,
  };
  
  return envVars.common + (envVars[stack] || '');
}

// ========================================
// Offline Template Generation
// ========================================

/**
 * Generate offline-first React template
 */
async function generateOfflineReactTemplate(projectPath, projectName, useTypeScript) {
  const ext = useTypeScript ? 'tsx' : 'jsx';
  const jsExt = useTypeScript ? 'ts' : 'js';
  
  // Create directory structure
  const dirs = ['src', 'src/components', 'src/hooks', 'src/utils', 'public'];
  for (const dir of dirs) {
    await fsPromises.mkdir(path.join(projectPath, dir), { recursive: true });
  }
  
  // package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'react-scripts': '5.0.1',
    },
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
      eject: 'react-scripts eject',
    },
    browserslist: {
      production: ['>0.2%', 'not dead', 'not op_mini all'],
      development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
    },
  };
  
  if (useTypeScript) {
    packageJson.dependencies['typescript'] = '^5.0.0';
    packageJson.dependencies['@types/react'] = '^18.2.0';
    packageJson.dependencies['@types/react-dom'] = '^18.2.0';
  }
  
  await fsPromises.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // public/index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Created with Tafil" />
    <title>${projectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;
  await fsPromises.writeFile(path.join(projectPath, 'public', 'index.html'), indexHtml);
  
  // src/index.js or tsx
  const indexContent = useTypeScript ? `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);` : `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  await fsPromises.writeFile(path.join(projectPath, 'src', `index.${ext}`), indexContent);
  
  // src/App.jsx or tsx
  const appContent = `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ${projectName}</h1>
        <p>Created with Tafil 🚀</p>
        <p>Edit <code>src/App.${ext}</code> and save to reload.</p>
      </header>
    </div>
  );
}

export default App;`;
  await fsPromises.writeFile(path.join(projectPath, 'src', `App.${ext}`), appContent);
  
  // src/index.css
  const indexCss = `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}`;
  await fsPromises.writeFile(path.join(projectPath, 'src', 'index.css'), indexCss);
  
  // src/App.css
  const appCss = `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-header h1 {
  margin-bottom: 0.5em;
}

.App-header code {
  background: rgba(255,255,255,0.1);
  padding: 4px 8px;
  border-radius: 4px;
}`;
  await fsPromises.writeFile(path.join(projectPath, 'src', 'App.css'), appCss);
  
  // TypeScript config if needed
  if (useTypeScript) {
    const tsConfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noFallthroughCasesInSwitch: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
      },
      include: ['src'],
    };
    await fsPromises.writeFile(
      path.join(projectPath, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
  }
}

/**
 * Generate offline-first Express template
 */
async function generateOfflineExpressTemplate(projectPath, projectName) {
  // Create directory structure
  const dirs = ['routes', 'middleware', 'controllers', 'models', 'public', 'views', 'bin'];
  for (const dir of dirs) {
    await fsPromises.mkdir(path.join(projectPath, dir), { recursive: true });
  }
  
  // package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      start: 'node ./bin/www',
      dev: 'nodemon ./bin/www',
    },
    dependencies: {
      'express': '^4.18.2',
      'cors': '^2.8.5',
      'dotenv': '^16.3.1',
      'morgan': '^1.10.0',
    },
    devDependencies: {
      'nodemon': '^3.0.0',
    },
  };
  await fsPromises.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // bin/www
  const wwwContent = `#!/usr/bin/env node
require('dotenv').config();
const app = require('../app');
const http = require('http');

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('🚀 Server running on ' + bind);
}`;
  await fsPromises.writeFile(path.join(projectPath, 'bin', 'www'), wwwContent);
  
  // app.js
  const appContent = `const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/api', apiRouter);

// Error handling
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
  });
});

module.exports = app;`;
  await fsPromises.writeFile(path.join(projectPath, 'app.js'), appContent);
  
  // routes/index.js
  const indexRoute = `const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ${projectName}!',
    version: '0.1.0',
    createdWith: 'Tafil',
  });
});

module.exports = router;`;
  await fsPromises.writeFile(path.join(projectPath, 'routes', 'index.js'), indexRoute);
  
  // routes/api.js
  const apiRoute = `const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/example
router.get('/example', (req, res) => {
  res.json({
    message: 'This is an example API endpoint',
    data: [1, 2, 3, 4, 5],
  });
});

// POST /api/example
router.post('/example', (req, res) => {
  const { name } = req.body;
  res.json({
    message: 'Data received',
    received: { name },
  });
});

module.exports = router;`;
  await fsPromises.writeFile(path.join(projectPath, 'routes', 'api.js'), apiRoute);
  
  // middleware/auth.js (placeholder)
  const authMiddleware = `// Authentication middleware placeholder
const authenticate = (req, res, next) => {
  // Add your authentication logic here
  next();
};

module.exports = { authenticate };`;
  await fsPromises.writeFile(path.join(projectPath, 'middleware', 'auth.js'), authMiddleware);
}

// ========================================
// Main Project Creator
// ========================================

/**
 * Create a new project
 */
async function createProject(options) {
  const {
    projectName,
    parentDirectory,
    stack,
    packageManager = 'npm',
    useTypeScript = false,
    gitRepoUrl = null,
    envVariables = {},
    template = null, // Pre-configured template from library
    onProgress = () => {},
  } = options;
  
  // Validate project name
  const validation = validateProjectName(projectName);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join(', '),
      phase: 'validation',
    };
  }
  const sanitizedName = validation.sanitized;
  
  // Check parent directory
  if (!fs.existsSync(parentDirectory)) {
    return {
      success: false,
      error: `Parent directory does not exist: ${parentDirectory}`,
      phase: 'validation',
    };
  }
  
  if (!(await isPathWritable(parentDirectory))) {
    return {
      success: false,
      error: `Cannot write to directory: ${parentDirectory}`,
      phase: 'validation',
    };
  }
  
  // Check disk space
  const spaceCheck = await checkDiskSpace(parentDirectory);
  if (!spaceCheck.hasSpace) {
    return {
      success: false,
      error: spaceCheck.error || 'Insufficient disk space',
      phase: 'validation',
    };
  }
  
  const projectPath = path.join(parentDirectory, sanitizedName);
  
  // Check if project already exists
  if (fs.existsSync(projectPath)) {
    return {
      success: false,
      error: `A folder named "${sanitizedName}" already exists in this location`,
      phase: 'validation',
    };
  }
  
  try {
    // Phase 1: Create project directory
    onProgress({ phase: 'creating', message: 'Creating project directory...' });
    await fsPromises.mkdir(projectPath, { recursive: true });
    
    // Phase 2: Clone or scaffold
    if (gitRepoUrl) {
      // Clone from Git
      onProgress({ phase: 'cloning', message: `Cloning from ${gitRepoUrl}...` });
      try {
        await runCommand(`git clone ${gitRepoUrl} .`, projectPath, {
          timeout: 300000, // 5 minute timeout for clone
          onProgress,
        });
      } catch (cloneError) {
        // Clean up on failure
        await fsPromises.rm(projectPath, { recursive: true, force: true });
        return {
          success: false,
          error: `Failed to clone repository: ${cloneError.stderr || cloneError.error?.message || 'Unknown error'}`,
          phase: 'cloning',
        };
      }
    } else {
      // Scaffold new project
      const templateConfig = TEMPLATES[stack];
      if (!templateConfig) {
        await fsPromises.rm(projectPath, { recursive: true, force: true });
        return {
          success: false,
          error: `Unknown stack: ${stack}`,
          phase: 'scaffolding',
        };
      }
      
      onProgress({ phase: 'scaffolding', message: `Creating ${templateConfig.name} project...` });
      
      // Try offline template first if available
      const useOffline = templateConfig.offlineTemplate && (stack === 'react' || stack === 'express');
      
      if (useOffline && stack === 'react') {
        try {
          await generateOfflineReactTemplate(projectPath, sanitizedName, useTypeScript);
        } catch (offlineError) {
          console.warn('Offline template failed, trying npx:', offlineError);
          // Fall through to npx
        }
      } else if (useOffline && stack === 'express') {
        try {
          await generateOfflineExpressTemplate(projectPath, sanitizedName);
        } catch (offlineError) {
          console.warn('Offline template failed, trying npx:', offlineError);
          // Fall through to npx
        }
      } else {
        // Use npx to create project
        const scaffoldCommand = templateConfig.npxCommand(sanitizedName, useTypeScript);
        
        try {
          // For commands that create the directory themselves, run from parent
          await runCommand(scaffoldCommand, parentDirectory, {
            timeout: 600000, // 10 minute timeout
            onProgress,
          });
        } catch (scaffoldError) {
          await fsPromises.rm(projectPath, { recursive: true, force: true });
          return {
            success: false,
            error: `Failed to scaffold project: ${scaffoldError.stderr || scaffoldError.error?.message || 'Unknown error'}`,
            phase: 'scaffolding',
          };
        }
      }
    }
    
    // Phase 3: Post-setup for templates
    if (template && TEMPLATE_LIBRARY[template]) {
      const libTemplate = TEMPLATE_LIBRARY[template];
      onProgress({ phase: 'configuring', message: 'Applying template configuration...' });
      
      // Install additional dependencies
      if (libTemplate.additionalDeps && libTemplate.additionalDeps.length > 0) {
        const depsCmd = packageManager === 'yarn'
          ? `yarn add ${libTemplate.additionalDeps.join(' ')}`
          : `npm install ${libTemplate.additionalDeps.join(' ')}`;
        await runCommand(depsCmd, projectPath, { onProgress });
      }
      
      // Run post-setup
      if (libTemplate.postSetup) {
        await libTemplate.postSetup(projectPath);
      }
    }
    
    // Phase 4: Create .gitignore
    onProgress({ phase: 'configuring', message: 'Creating configuration files...' });
    const gitignoreContent = generateGitignore(stack);
    await fsPromises.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);
    
    // Phase 5: Create .env file
    const port = await findFreePort(TEMPLATES[stack]?.defaultPort || 3000, 3100);
    const envContent = generateEnvFile(stack, port);
    await fsPromises.writeFile(path.join(projectPath, '.env'), envContent);
    
    // Add custom env variables
    if (Object.keys(envVariables).length > 0) {
      let customEnv = '\n# Custom Environment Variables\n';
      for (const [key, value] of Object.entries(envVariables)) {
        customEnv += `${key}=${value}\n`;
      }
      await fsPromises.appendFile(path.join(projectPath, '.env'), customEnv);
    }
    
    // Phase 6: Initialize Git if not cloned
    if (!gitRepoUrl) {
      onProgress({ phase: 'git', message: 'Initializing Git repository...' });
      try {
        await runCommand('git init', projectPath, { onProgress });
        await runCommand('git add .', projectPath, { onProgress });
        await runCommand('git commit -m "Initial commit - Created with Tafil"', projectPath, { onProgress });
      } catch (gitError) {
        // Git init is optional, don't fail the whole process
        console.warn('Git initialization failed:', gitError);
      }
    }
    
    // Phase 7: Install dependencies
    onProgress({ phase: 'installing', message: 'Installing dependencies...' });
    const installCmd = packageManager === 'yarn' ? 'yarn install' : 'npm install';
    try {
      await runCommand(installCmd, projectPath, {
        timeout: 600000, // 10 minute timeout
        onProgress,
      });
    } catch (installError) {
      // Dependencies failed but project is created
      return {
        success: true,
        warning: 'Project created but dependency installation failed. You can install manually.',
        projectPath,
        projectName: sanitizedName,
        stack,
        port,
        phase: 'complete',
      };
    }
    
    // Phase 8: Complete
    onProgress({ phase: 'complete', message: 'Project created successfully!' });
    
    return {
      success: true,
      projectPath,
      projectName: sanitizedName,
      stack,
      port,
      framework: TEMPLATES[stack]?.name,
      startScript: TEMPLATES[stack]?.startScript || 'start',
      devScript: TEMPLATES[stack]?.devScript || 'dev',
      phase: 'complete',
    };
    
  } catch (error) {
    // Clean up on any error
    try {
      if (fs.existsSync(projectPath)) {
        await fsPromises.rm(projectPath, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.error('Failed to clean up after error:', cleanupError);
    }
    
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      phase: 'unknown',
    };
  }
}

/**
 * Get available templates (serializable for IPC)
 */
function getTemplates() {
  const serializableTemplates = {};
  for (const [key, template] of Object.entries(TEMPLATES)) {
    serializableTemplates[key] = {
      name: template.name,
      icon: template.icon,
      description: template.description,
      defaultPort: template.defaultPort,
      startScript: template.startScript,
      devScript: template.devScript,
      offlineTemplate: template.offlineTemplate,
    };
  }
  return serializableTemplates;
}

/**
 * Get template library (serializable for IPC)
 */
function getTemplateLibrary() {
  const serializableLibrary = {};
  for (const [key, template] of Object.entries(TEMPLATE_LIBRARY)) {
    serializableLibrary[key] = {
      name: template.name,
      base: template.base,
      description: template.description,
      useTypeScript: template.useTypeScript || false,
      additionalDeps: template.additionalDeps || [],
    };
  }
  return serializableLibrary;
}

/**
 * Detect project stack from existing project
 */
function detectProjectStack(projectPath) {
  const pkgPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return null;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    if (deps['next']) return 'nextjs';
    if (deps['@nestjs/core']) return 'nestjs';
    if (deps['vue']) return 'vue';
    if (deps['vite'] && deps['react']) return 'vite';
    if (deps['react']) return 'react';
    if (deps['express']) return 'express';
    
    return 'node';
  } catch {
    return null;
  }
}

module.exports = {
  createProject,
  getTemplates,
  getTemplateLibrary,
  validateProjectName,
  detectProjectStack,
  TEMPLATES,
  TEMPLATE_LIBRARY,
};


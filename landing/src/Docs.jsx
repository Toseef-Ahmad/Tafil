import { useState } from 'react';

// ============================================================================
// TAFIL Docs - Documentation Page (Redesigned to match new landing page)
// ============================================================================

const CONFIG = {
  GITHUB_USERNAME: "Toseef-Ahmad",
  REPO_NAME: "Tafil",
  CONTACT_EMAIL: "tafil.help@gmail.com",
};

// Logo Component (matching new landing page)
function Logo({ size = 32, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        background: '#8b5cf6',
        borderRadius: 8,
      }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    </div>
  );
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      subsections: ['installation', 'first-steps', 'scanning-projects']
    },
    {
      id: 'features',
      title: 'Core Features',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      subsections: ['project-management', 'collections', 'command-palette', 'insights']
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      subsections: ['blueprints', 'playground', 'ssh-terminal', 'environment-snapshot']
    },
    {
      id: 'reference',
      title: 'Reference',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      subsections: ['keyboard-shortcuts', 'frameworks', 'settings', 'troubleshooting']
    }
  ];

  const documentation = {
    'getting-started': {
      title: 'Getting Started with TAFIL',
      content: [
        {
          heading: 'Welcome to TAFIL',
          text: 'TAFIL is your project command center — a desktop app that helps you manage, run, and organize all your Node.js projects from one beautiful interface.'
        },
        {
          heading: 'What TAFIL Does',
          list: [
            'Scans and discovers all Node.js projects on your machine',
            'Runs dev servers with one click',
            'Manages dependencies and ports automatically',
            'Organizes projects into collections',
            'Provides a JavaScript playground for quick experiments',
            'Includes SSH terminal for remote server management',
            'Creates project blueprints with Kanban boards and diagrams'
          ]
        },
        {
          heading: 'System Requirements',
          list: [
            'macOS 10.13+, Windows 10/11, or Linux',
            'Node.js 16+ (for project management)',
            '200MB free disk space',
            '4GB RAM recommended'
          ]
        }
      ]
    },
    'installation': {
      title: 'Installation Guide',
      content: [
        {
          heading: 'Download TAFIL',
          text: 'Get the latest release from GitHub:'
        },
        {
          heading: 'macOS Installation',
          code: `# Download the .dmg file
open Tafil-1.0.0-darwin-universal.dmg

# Drag TAFIL to Applications folder
# If you see "unidentified developer" warning:
# Right-click the app → Open → Open`,
          list: [
            'Download Tafil-1.0.0-darwin-universal.dmg',
            'Open the DMG file',
            'Drag TAFIL to Applications',
            'Right-click → Open (first launch only)'
          ]
        },
        {
          heading: 'Windows Installation',
          code: `# Download and run the installer
Tafil-1.0.0-portable.exe

# Or use portable version (no installation needed)`,
          list: [
            'Download Tafil-1.0.0-portable.exe',
            'Run the installer',
            'Follow the installation wizard',
            'Launch from Start Menu'
          ]
        },
        {
          heading: 'Linux Installation',
          code: `# Download AppImage
chmod +x Tafil-1.0.0-x86_64.AppImage
./Tafil-1.0.0-x86_64.AppImage

# Or install DEB package
sudo dpkg -i tafil_1.0.0_amd64.deb`,
          list: [
            'Download the AppImage for your architecture',
            'Make it executable with chmod +x',
            'Run the AppImage',
            'Optionally, move to /usr/local/bin for system-wide access'
          ]
        }
      ]
    },
    'first-steps': {
      title: 'Your First Steps',
      content: [
        {
          heading: '1. Launch TAFIL',
          text: 'Open TAFIL from your Applications folder (macOS), Start Menu (Windows), or application launcher (Linux).'
        },
        {
          heading: '2. Scan for Projects',
          text: 'Click "Scan Home" to automatically discover all Node.js projects in your home directory. TAFIL will recursively scan and detect any folder containing a package.json file.',
          list: [
            'Click "Scan Home" button in the toolbar',
            'Or press ⌘K (Ctrl+K) and type "scan"',
            'Wait for scanning to complete (usually 5-10 seconds)'
          ]
        },
        {
          heading: '3. Run Your First Project',
          text: 'Once scanning is complete, you\'ll see all your projects displayed as cards.',
          code: `# TAFIL automatically detects and runs:
npm run dev    # or
yarn dev       # or
pnpm dev       # or
npm start`,
          list: [
            'Find a project card',
            'Click the green "Run" button',
            'TAFIL will detect the right command and port',
            'Click "Browser" to open in your web browser'
          ]
        },
        {
          heading: '4. Organize with Collections',
          text: 'Create collections to organize your projects by client, framework, or priority.',
          list: [
            'Click the "+ Collection" button in the sidebar',
            'Give it a name (e.g., "Work", "Personal", "Next.js Apps")',
            'Click the folder icon on any project card to add it to collections'
          ]
        }
      ]
    },
    'scanning-projects': {
      title: 'Scanning Projects',
      content: [
        {
          heading: 'How Scanning Works',
          text: 'TAFIL scans your filesystem to discover Node.js projects by looking for package.json files. It intelligently skips unnecessary directories for fast results.'
        },
        {
          heading: 'Scan Methods',
          list: [
            'Scan Home: Scans your entire home directory (~5-8 levels deep)',
            'Scan Folder: Choose a specific folder to scan',
            'Refresh: Re-scan previously found projects'
          ]
        },
        {
          heading: 'What Gets Scanned',
          text: 'TAFIL looks for:',
          list: [
            'Any directory with a package.json file',
            'Projects with dependencies or devDependencies',
            'Git repositories (to show branch and commit info)'
          ]
        },
        {
          heading: 'What Gets Skipped',
          text: 'TAFIL automatically skips:',
          list: [
            'node_modules directories',
            '.git directories',
            'Hidden folders (starting with .)',
            'System directories (Library, AppData)',
            'Permission-restricted folders'
          ]
        },
        {
          heading: 'Framework Detection',
          text: 'TAFIL automatically detects 20+ frameworks including:',
          list: [
            'React (CRA, Vite)',
            'Next.js',
            'Vue.js',
            'Angular',
            'Svelte',
            'Express.js',
            'Nest.js',
            'Gatsby',
            'Remix',
            'Nuxt.js',
            'And many more...'
          ]
        }
      ]
    },
    'project-management': {
      title: 'Project Management',
      content: [
        {
          heading: 'Running Projects',
          text: 'TAFIL makes it effortless to start and stop your development servers.',
          list: [
            'Click "Run" to start the dev server',
            'TAFIL auto-detects the correct npm/yarn/pnpm command',
            'Automatically finds an available port',
            'Shows running status with pulse animation',
            'Click "Stop" to gracefully shut down'
          ]
        },
        {
          heading: 'Port Management',
          text: 'TAFIL handles ports intelligently:',
          list: [
            'Auto-detects available ports (3000-4000 range)',
            'Resolves port conflicts automatically',
            'Shows which port each project is using',
            'Allows custom port selection',
            'Detects and offers to kill conflicting processes'
          ]
        },
        {
          heading: 'Dependency Management',
          text: 'Manage your node_modules with ease:',
          code: `# Install dependencies
npm install    # or yarn/pnpm install

# Clean up space
rm -rf node_modules`,
          list: [
            'One-click "Install" to run npm install',
            'Remove node_modules to free disk space',
            'Visual indicators for missing dependencies',
            'Auto-prompt to install before running'
          ]
        },
        {
          heading: 'IDE Integration',
          text: 'Open projects in your favorite editor:',
          list: [
            'Auto-detects VS Code, WebStorm, Sublime, and 10+ more',
            'Set default IDE in settings',
            'Click "Editor" to open project',
            'Works with VS Code Insiders, Cursor, Zed'
          ]
        },
        {
          heading: 'Terminal Integration',
          text: 'Quick access to your terminal:',
          list: [
            'Supports iTerm, Warp, Hyper, Kitty (macOS)',
            'PowerShell, Windows Terminal (Windows)',
            'gnome-terminal, konsole, xterm (Linux)',
            'Opens directly in project directory'
          ]
        }
      ]
    },
    'collections': {
      title: 'Collections System',
      content: [
        {
          heading: 'What Are Collections?',
          text: 'Collections help you organize projects into custom groups. Think of them as folders or tags for your projects.'
        },
        {
          heading: 'Creating Collections',
          list: [
            'Click "+ Collection" in the sidebar',
            'Enter a name (e.g., "Work Projects", "Client: Acme")',
            'Click Create',
            'Your collection appears in the sidebar'
          ]
        },
        {
          heading: 'Adding Projects to Collections',
          list: [
            'Click the folder icon 📁 on any project card',
            'Check the collections you want to add it to',
            'Projects can belong to multiple collections',
            'Collection badges appear on the project card'
          ]
        },
        {
          heading: 'Built-in Collections',
          list: [
            'All Projects: Shows every scanned project',
            'Running: Shows only running projects',
            'Uncategorized: Projects not in any collection'
          ]
        },
        {
          heading: 'Collection Management',
          list: [
            'Rename: Right-click → Rename',
            'Delete: Right-click → Delete (projects remain)',
            'Reorder: Drag to reorder in sidebar',
            'Count: Shows project count per collection'
          ]
        },
        {
          heading: 'Use Cases',
          list: [
            'Organize by client ("Acme Corp", "Startup XYZ")',
            'Group by framework ("Next.js Apps", "Express APIs")',
            'Prioritize ("Active", "Archived", "Learning")',
            'Team organization ("Frontend", "Backend", "DevOps")'
          ]
        }
      ]
    },
    'command-palette': {
      title: 'Command Palette',
      content: [
        {
          heading: 'Quick Access',
          text: 'Press ⌘K (macOS) or Ctrl+K (Windows/Linux) to open the command palette.',
          code: `# Keyboard Shortcuts
⌘K / Ctrl+K    # Open command palette
↑ ↓            # Navigate commands
Enter          # Execute command
Esc            # Close palette`
        },
        {
          heading: 'Available Commands',
          list: [
            'Search Projects: Find projects by name or path',
            'Scan Home: Scan home directory for projects',
            'Scan Folder: Choose a folder to scan',
            'Refresh Projects: Re-scan existing projects',
            'View Insights: Open project insights panel',
            'Open Settings: Configure preferences',
            'Jump to Collection: Navigate to any collection'
          ]
        },
        {
          heading: 'Search Functionality',
          text: 'The command palette includes powerful search:',
          list: [
            'Fuzzy matching for project names',
            'Search by project path',
            'Instant results as you type',
            'Keyboard navigation with arrow keys',
            'Highlighting of matching text'
          ]
        }
      ]
    },
    'insights': {
      title: 'Project Insights',
      content: [
        {
          heading: 'Overview',
          text: 'Project Insights provides detailed information about each project, including dependencies, Git status, running state, and historical data.'
        },
        {
          heading: 'Accessing Insights',
          list: [
            'Click the chart icon 📊 on any project card',
            'Or use the command palette: ⌘K → "insights"',
            'View comprehensive project details'
          ]
        },
        {
          heading: 'Project Memory (Brain)',
          text: 'TAFIL remembers everything about your projects:',
          list: [
            'Last 20 run attempts',
            'Success and error counts',
            'Last detected port',
            'Crash summaries and diagnostics',
            'Error messages and recovery steps',
            'Run history with timestamps'
          ]
        },
        {
          heading: 'Project Details',
          list: [
            'Dependencies: Installed or missing status',
            'Git Info: Current branch, last commit',
            'Framework: Auto-detected framework',
            'Location: Full path to project',
            'Running Status: Active port or stopped',
            'Last Modified: Filesystem modification time'
          ]
        },
        {
          heading: 'Error Notes',
          text: 'Add notes about errors you encounter:',
          list: [
            'Document error solutions',
            'Track recurring issues',
            'Search through notes',
            'Last 10 notes per project'
          ]
        }
      ]
    },
    'blueprints': {
      title: 'Blueprints & Modules',
      content: [
        {
          heading: 'What Are Blueprints?',
          text: 'Blueprints is a comprehensive project organization system that breaks your projects into modules with multiple views: goals, code, tasks, canvas, and resources.'
        },
        {
          heading: 'Module Structure',
          text: 'Each module contains:',
          list: [
            'Goal: Markdown content for planning and documentation',
            'Editor: JavaScript code scratchpad',
            'Tasks: Kanban board (To Do, In Progress, Done)',
            'Canvas: Excalidraw drawing canvas for diagrams',
            'Resources: Links and file references'
          ]
        },
        {
          heading: 'Creating Modules',
          list: [
            'Open any project',
            'Click "Blueprints" tab',
            'Click "+ New Module"',
            'Give it a title and description',
            'Choose an icon and color'
          ]
        },
        {
          heading: 'Goal View',
          text: 'Write goals and documentation in Markdown:',
          list: [
            'Full Markdown editor',
            'Auto-save functionality',
            'Version history',
            'Rich formatting support'
          ]
        },
        {
          heading: 'Editor View',
          text: 'Code scratchpad for each module:',
          list: [
            'Monaco editor with IntelliSense',
            'JavaScript syntax highlighting',
            'Auto-save',
            'Can execute code via Playground'
          ]
        },
        {
          heading: 'Tasks View (Kanban)',
          text: 'Organize work with Kanban boards:',
          list: [
            'Three columns: To Do, In Progress, Done',
            'Drag and drop tasks',
            'Set priorities and labels',
            'Add due dates',
            'Track progress per module'
          ]
        },
        {
          heading: 'Canvas View',
          text: 'Draw diagrams and architecture:',
          list: [
            'Full Excalidraw integration',
            'All drawing tools available',
            'Export drawings',
            'Version history',
            'Collaboration-ready format'
          ]
        },
        {
          heading: 'Storage',
          text: 'Blueprints are stored in your project:',
          code: `your-project/
  .tafil/
    modules/
      module-1.json
      module-2.json
    goals/
      module-1.md
    tasks/
      module-1.json`,
          list: [
            'Stored in .tafil/ folder',
            'Can be committed to Git',
            'Portable JSON format',
            'Per-project storage'
          ]
        }
      ]
    },
    'playground': {
      title: 'JavaScript Playground',
      content: [
        {
          heading: 'Quick Code Experiments',
          text: 'The Playground lets you test JavaScript code instantly without creating new files or projects.'
        },
        {
          heading: 'Features',
          list: [
            'Monaco Editor with IntelliSense',
            'Full JavaScript syntax highlighting',
            'Auto-run mode (500ms debounce)',
            'Manual run with Cmd/Ctrl + Enter',
            'Console output capture',
            'Error display',
            'Execution time tracking'
          ]
        },
        {
          heading: 'Usage',
          code: `// Test code instantly
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log(fibonacci(10)); // Output: 55`,
          list: [
            'Click "Playground" tab',
            'Type or paste JavaScript code',
            'See results instantly (auto-run mode)',
            'Or press Cmd/Ctrl + Enter to run manually'
          ]
        },
        {
          heading: 'Keyboard Shortcuts',
          code: `Cmd/Ctrl + Enter     # Run code
Cmd/Ctrl + Shift + R # Toggle auto-run`,
          list: [
            'Run Code: Cmd/Ctrl + Enter',
            'Toggle Auto-run: Cmd/Ctrl + Shift + R',
            'All standard Monaco shortcuts work'
          ]
        },
        {
          heading: 'Use Cases',
          list: [
            'Test API calls',
            'Experiment with new libraries',
            'Debug algorithms',
            'Learn JavaScript',
            'Prototype ideas quickly',
            'Try code snippets from docs'
          ]
        }
      ]
    },
    'ssh-terminal': {
      title: 'SSH Terminal',
      content: [
        {
          heading: 'Remote Server Access',
          text: 'Connect to remote servers via SSH directly from TAFIL. Full terminal emulator powered by xterm.js.'
        },
        {
          heading: 'Adding SSH Hosts',
          list: [
            'Click "SSH" tab',
            'Click "+ Add Host"',
            'Enter hostname, port, and username',
            'Choose authentication: SSH key or password',
            'Save the host configuration'
          ]
        },
        {
          heading: 'Connecting to Servers',
          list: [
            'Click "Connect" next to a saved host',
            'Enter password if needed',
            'Terminal opens with active session',
            'Green pulse indicator shows connection',
            'Type commands interactively'
          ]
        },
        {
          heading: 'SSH Features',
          list: [
            'Full terminal emulator',
            'SSH key authentication',
            'Password authentication',
            'Multiple concurrent sessions',
            'Clickable links in terminal',
            'Auto-resize terminal',
            'Session management'
          ]
        },
        {
          heading: 'Managing Hosts',
          list: [
            'Save unlimited SSH hosts',
            'Delete hosts you no longer use',
            'Edit host configurations',
            'Quick connect from saved list'
          ]
        }
      ]
    },
    'environment-snapshot': {
      title: 'Environment Snapshot (Pro)',
      content: [
        {
          heading: 'What Is Environment Snapshot?',
          text: 'Environment Snapshot captures your project\'s entire setup — Node version, dependencies, environment variables — so you can restore it later or on another machine.'
        },
        {
          heading: 'What Gets Captured',
          list: [
            'Node.js version (from .nvmrc, package.json, etc.)',
            'Package manager and version',
            'Environment variable keys (not values)',
            'Startup commands',
            'Platform information'
          ]
        },
        {
          heading: 'Creating a Snapshot',
          list: [
            'Open Project Insights',
            'Click "Create Environment Snapshot"',
            'Snapshot is saved in .tafil/snapshot.json',
            'Can be committed to Git'
          ]
        },
        {
          heading: 'Restoring a Project',
          text: 'Use the Restore Everything feature to set up a project:',
          list: [
            'Validates Node.js installation',
            'Checks Node version compatibility',
            'Installs dependencies if needed',
            'Creates .env file from template',
            'Provides manual instructions if needed'
          ]
        },
        {
          heading: 'Security',
          text: 'Environment Snapshot is secure:',
          list: [
            'Never captures actual .env file content',
            'Only captures template files (.env.example)',
            'No secrets stored',
            'Optional content exclusion'
          ]
        }
      ]
    },
    'keyboard-shortcuts': {
      title: 'Keyboard Shortcuts',
      content: [
        {
          heading: 'Global Shortcuts',
          code: `⌘K / Ctrl+K         # Open Command Palette
⌘R / Ctrl+R         # Refresh Projects
⌘O / Ctrl+O         # Open in Editor
Esc                 # Close Modals/Dialogs`,
          list: [
            'Command Palette: ⌘K (Mac) or Ctrl+K (Win/Linux)',
            'Refresh Projects: ⌘R / Ctrl+R',
            'Open in Editor: ⌘O / Ctrl+O',
            'Close Modals: Esc'
          ]
        },
        {
          heading: 'Navigation',
          code: `↑ ↓                 # Navigate Lists
Enter               # Select/Execute
Tab                 # Switch Focus`,
          list: [
            'Arrow keys to navigate',
            'Enter to select',
            'Tab to switch focus'
          ]
        },
        {
          heading: 'Playground Shortcuts',
          code: `Cmd/Ctrl + Enter    # Run Code
Cmd/Ctrl + Shift + R # Toggle Auto-run`,
          list: [
            'Run Code: Cmd/Ctrl + Enter',
            'Toggle Auto-run: Cmd/Ctrl + Shift + R'
          ]
        }
      ]
    },
    'frameworks': {
      title: 'Supported Frameworks',
      content: [
        {
          heading: 'Auto-Detected Frameworks',
          text: 'TAFIL automatically detects 20+ frameworks:'
        },
        {
          heading: 'Frontend Frameworks',
          list: [
            'React (Create React App, Vite)',
            'Next.js',
            'Vue.js',
            'Nuxt.js',
            'Angular',
            'Svelte',
            'SvelteKit',
            'Solid.js',
            'Preact'
          ]
        },
        {
          heading: 'Backend Frameworks',
          list: [
            'Express.js',
            'Nest.js',
            'Fastify',
            'Koa',
            'Hapi',
            'Adonis.js'
          ]
        },
        {
          heading: 'Static Site Generators',
          list: [
            'Gatsby',
            'Astro',
            'Docusaurus',
            'VuePress',
            'Eleventy'
          ]
        },
        {
          heading: 'Full-Stack Frameworks',
          list: [
            'Remix',
            'RedwoodJS',
            'Blitz.js',
            'Meteor'
          ]
        }
      ]
    },
    'settings': {
      title: 'Settings & Configuration',
      content: [
        {
          heading: 'Accessing Settings',
          list: [
            'Click the gear icon in the toolbar',
            'Or press ⌘K → "settings"',
            'Configure your preferences'
          ]
        },
        {
          heading: 'Available Settings',
          list: [
            'Default IDE: Choose preferred code editor',
            'Default Terminal: Set default terminal app',
            'Theme: Switch between Light and Dark mode',
            'Scan Depth: Configure how deep to scan folders',
            'Auto-refresh: Enable/disable automatic project refresh'
          ]
        },
        {
          heading: 'Theme Settings',
          list: [
            'Dark Mode (default): Premium dark theme',
            'Light Mode: High-contrast light theme',
            'Auto-switch: Match system theme',
            'Theme persists across sessions'
          ]
        },
        {
          heading: 'IDE Preferences',
          text: 'Set your default IDE to skip selection:',
          list: [
            'VS Code',
            'VS Code Insiders',
            'WebStorm',
            'Cursor',
            'Zed',
            'Sublime Text',
            'And 10+ more'
          ]
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      content: [
        {
          heading: 'Common Issues',
          text: 'Solutions to frequently encountered problems:'
        },
        {
          heading: 'Projects Won\'t Run',
          list: [
            'Check if dependencies are installed (click "Install")',
            'Verify Node.js is installed on your system',
            'Check if port is already in use',
            'Look at the error message in Fix It modal',
            'Try running manually in terminal to see full error'
          ]
        },
        {
          heading: 'Port Already in Use',
          text: 'TAFIL\'s Fix It modal will help:',
          list: [
            'Stop conflicting TAFIL project',
            'Kill external process using the port',
            'Run on a custom port instead',
            'View process details to identify conflict'
          ]
        },
        {
          heading: 'Missing Dependencies',
          list: [
            'Click "Install" button on project card',
            'Wait for installation to complete',
            'Check for errors in installation log',
            'Try running npm install manually if issues persist'
          ]
        },
        {
          heading: 'Scanning Doesn\'t Find Projects',
          list: [
            'Ensure projects have package.json files',
            'Check if projects have dependencies listed',
            'Try "Scan Folder" to target specific directory',
            'Increase scan depth in settings',
            'Check folder permissions'
          ]
        },
        {
          heading: 'macOS: "Unidentified Developer" Warning',
          code: `# Right-click the app → Open → Open
# Or use terminal:
xattr -cr /Applications/Tafil.app`,
          list: [
            'Right-click Tafil.app → Open',
            'Click "Open" in the warning dialog',
            'Or run: xattr -cr /Applications/Tafil.app'
          ]
        },
        {
          heading: 'Windows: SmartScreen Warning',
          list: [
            'Click "More info"',
            'Click "Run anyway"',
            'This is normal for unsigned apps'
          ]
        },
        {
          heading: 'IDE Won\'t Open',
          list: [
            'Verify IDE is installed',
            'Check IDE path in system PATH',
            'Try selecting "System" to open in file manager',
            'Set default IDE in settings'
          ]
        }
      ]
    }
  };

  const renderContent = (section) => {
    const doc = documentation[section];
    if (!doc) return null;

    return (
      <div className="max-w-none">
        <h1 className="text-3xl font-bold mb-8 text-[#fafafa]">{doc.title}</h1>
        
        {doc.content.map((item, index) => (
          <div key={index} className="mb-8">
            {item.heading && (
              <h2 className="text-xl font-semibold mb-3 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                {item.heading}
              </h2>
            )}
            
            {item.text && (
              <p className="text-[#a1a1aa] leading-relaxed mb-4">{item.text}</p>
            )}
            
            {item.list && (
              <ul className="space-y-2 mb-4">
                {item.list.map((listItem, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#a1a1aa]">
                    <span className="text-[#8b5cf6] mt-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    </span>
                    <span>{listItem}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {item.code && (
              <pre className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 mb-4 overflow-x-auto">
                <code className="text-sm text-[#d4d4d8] font-mono">{item.code}</code>
              </pre>
            )}
          </div>
        ))}
      </div>
    );
  };

  const filteredSections = searchQuery
    ? sections.map(s => ({
        ...s,
        subsections: s.subsections.filter(sub =>
          sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (documentation[sub]?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(s => s.subsections.length > 0)
    : sections;

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white antialiased">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#1f1f23] bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="font-bold text-lg text-[#fafafa]">TAFIL</span>
              <span className="text-[#52525b] text-lg font-normal">/</span>
              <span className="text-[#a1a1aa] text-lg">Docs</span>
            </a>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-sm text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#8b5cf6] w-56 transition-colors"
                />
              </div>
              <a href="/" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Home</a>
              <a href="/blog" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Blog</a>
              <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="text-[#a1a1aa] hover:text-white text-sm transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                GitHub
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#71717a] hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
          {/* Sidebar */}
          <aside className={`w-64 flex-shrink-0 ${mobileMenuOpen ? 'block fixed inset-0 z-40 bg-[#0c0c0e] pt-20 px-6' : 'hidden md:block'}`}>
            <nav className="space-y-6 sticky top-24">
              {filteredSections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-xs font-semibold text-[#52525b] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-[#8b5cf6]">{section.icon}</span>
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.subsections.map((subsection) => (
                      <li key={subsection}>
                        <button
                          onClick={() => {
                            setActiveSection(subsection);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            activeSection === subsection
                              ? 'bg-[#8b5cf6]/10 text-[#a78bfa] font-medium border-l-2 border-[#8b5cf6]'
                              : 'text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b]'
                          }`}
                        >
                          {subsection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Quick Links */}
              <div className="pt-6 border-t border-[#1f1f23]">
                <h3 className="text-xs font-semibold text-[#52525b] uppercase tracking-wider mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/#download" className="text-[#71717a] hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download TAFIL
                    </a>
                  </li>
                  <li>
                    <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}/issues`} target="_blank" rel="noopener noreferrer" className="text-[#71717a] hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Report Issue
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="text-[#71717a] hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Support
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8">
              {renderContent(activeSection)}
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button className="flex items-center gap-2 text-[#71717a] hover:text-[#a78bfa] transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Previous
              </button>
              <button className="flex items-center gap-2 text-[#71717a] hover:text-[#a78bfa] transition-colors text-sm">
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Feedback */}
            <div className="mt-8 p-6 bg-[#18181b] border border-[#27272a] rounded-xl text-center">
              <p className="text-[#71717a] text-sm mb-3">Was this page helpful?</p>
              <div className="flex items-center justify-center gap-3">
                <button className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Yes
                </button>
                <button className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  No
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#1f1f23] py-12 px-6 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2.5">
                <Logo size={24} />
                <span className="font-bold text-[#fafafa]">TAFIL</span>
              </div>
              <p className="text-sm text-[#52525b]">
                © 2024 TAFIL. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
                <a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

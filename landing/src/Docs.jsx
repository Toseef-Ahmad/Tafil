import { useState } from 'react';

// Logo Component
function Logo({ size = 32, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
      <path 
        d="M10 12L14 16L10 20" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M17 20H22" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      subsections: ['installation', 'first-steps', 'scanning-projects']
    },
    {
      id: 'features',
      title: 'Core Features',
      icon: '⚡',
      subsections: ['project-management', 'collections', 'command-palette', 'insights']
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: '🎯',
      subsections: ['blueprints', 'playground', 'ssh-terminal', 'environment-snapshot']
    },
    {
      id: 'reference',
      title: 'Reference',
      icon: '📚',
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
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8 text-white">{doc.title}</h1>
        
        {doc.content.map((item, index) => (
          <div key={index} className="mb-8">
            {item.heading && (
              <h2 className="text-2xl font-semibold mb-4 text-white">{item.heading}</h2>
            )}
            
            {item.text && (
              <p className="text-zinc-300 leading-relaxed mb-4">{item.text}</p>
            )}
            
            {item.list && (
              <ul className="space-y-2 mb-4">
                {item.list.map((listItem, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300">
                    <span className="text-indigo-400 mt-1">•</span>
                    <span>{listItem}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {item.code && (
              <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto">
                <code className="text-sm text-zinc-300 font-mono">{item.code}</code>
              </pre>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/60 sticky top-0 bg-[#09090b]/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 font-semibold text-lg">
            <Logo size={32} />
            <span>TAFIL Docs</span>
          </a>
          
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-64"
            />
            <a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 sticky top-24 h-fit">
          <nav className="space-y-6">
            {sections.map((section) => (
              <div key={section.id}>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2 flex items-center gap-2">
                  <span>{section.icon}</span>
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.subsections.map((subsection) => (
                    <li key={subsection}>
                      <button
                        onClick={() => setActiveSection(subsection)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                          activeSection === subsection
                            ? 'bg-indigo-500/15 text-indigo-400 font-medium'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                      >
                        {subsection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8">
            {renderContent(activeSection)}
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 flex items-center justify-between text-sm">
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <span>←</span> Previous
            </button>
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              Next <span>→</span>
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center text-sm text-zinc-500">
          <p>© 2025 Touseef Ahmad • TAFIL Documentation</p>
        </div>
      </footer>
    </div>
  );
}


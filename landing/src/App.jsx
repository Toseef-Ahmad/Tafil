import { useEffect, useState } from "react";

// ============================================================================
// TAFIL - RunJS-Inspired Landing Page
// Clean, minimal, developer-focused design
// ============================================================================

const CONFIG = {
  GITHUB_USERNAME: "Toseef-Ahmad",
  REPO_NAME: "Tafil",
  VERSION: "v2.0.0",
  CONTACT_EMAIL: "tafil.help@gmail.com",
  GUMROAD_URL: "https://tafil.gumroad.com/l/tafil-license",
};

const RELEASE_BASE = `https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}/releases/download/${CONFIG.VERSION}`;
const DOWNLOADS = {
  mac: `${RELEASE_BASE}/Tafil-2.0.0-darwin-universal.dmg`,
  windows: `${RELEASE_BASE}/Tafil-2.0.0-portable.exe`,
  linux_x64: `${RELEASE_BASE}/Tafil-2.0.0-x86_64.AppImage`,
  linux_arm64: `${RELEASE_BASE}/Tafil-2.0.0-arm64.AppImage`,
};

// ============================================================================
// COMPONENTS
// ============================================================================

function Logo({ size = 32 }) {
  return (
    <div 
      className="rounded-lg flex items-center justify-center"
      style={{ 
        width: size, 
        height: size, 
        background: '#8b5cf6'
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 11 2-2-2-2"/>
        <path d="M11 13h4"/>
      </svg>
    </div>
  );
}

// Full Interactive App Demo
function InteractiveAppDemo() {
  const [activeModule, setActiveModule] = useState('playground');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [runningProjects, setRunningProjects] = useState(['api-server']);

  const projects = [
    { id: 'api-server', name: 'api-server', framework: 'Express.js', port: 3001 },
    { id: 'dashboard', name: 'dashboard', framework: 'Next.js', port: 3000 },
    { id: 'mobile-app', name: 'mobile-app', framework: 'React Native', port: 8081 },
    { id: 'landing', name: 'landing-page', framework: 'Vite + React', port: 5173 },
  ];

  const sshHosts = [
    { name: 'Production', host: 'prod.example.com', connected: true },
    { name: 'Staging', host: 'staging.example.com', connected: false },
    { name: 'Dev Server', host: 'dev.internal.io', connected: true },
  ];

  const toggleProject = (id) => {
    setRunningProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 800);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0a0a0c] shadow-2xl shadow-black/50">
      {/* Window Chrome */}
      <div className="flex items-center px-4 py-3 bg-[#111113] border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>
        <span className="flex-1 text-center text-xs text-zinc-500 font-medium">Tafil — Developer Command Center</span>
        <div className="w-12"></div>
      </div>

      {/* App Content */}
      <div className="flex min-h-[420px]">
        {/* Sidebar */}
        <div className="w-52 bg-[#111113] border-r border-zinc-800 flex flex-col">
          <div className="p-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="m7 11 2-2-2-2"/><path d="M11 13h4"/></svg>
              </div>
              <span className="font-medium text-white text-sm">Tafil</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-medium">PRO</span>
            </div>
          </div>

          {/* Module Tabs */}
          <div className="p-2">
            <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-lg">
              {[
                { id: 'projects', icon: '📁', label: 'Projects' },
                { id: 'playground', icon: '⚡', label: 'Playground' },
                { id: 'ssh', icon: '🖥️', label: 'SSH' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModule(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md text-[10px] font-medium transition-all ${
                    activeModule === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Module-specific Navigation */}
          <div className="flex-1 p-2 overflow-y-auto">
            {activeModule === 'projects' && (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-purple-500/15 text-purple-400 text-xs font-medium">
                  <span>📁</span> All Projects
                  <span className="ml-auto text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">4</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-zinc-400 text-xs hover:bg-zinc-800/50 cursor-pointer">
                  <span>▶️</span> Running
                  <span className="ml-auto flex items-center gap-1 text-green-400 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {runningProjects.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-zinc-400 text-xs hover:bg-zinc-800/50 cursor-pointer">
                  <span>📊</span> Insights
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs cursor-pointer hover:bg-purple-500/15">
                    <span>➕</span> Create Project
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'playground' && (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-purple-500/15 text-purple-400 text-xs font-medium">
                  <span>➕</span> New Snippet
                </div>
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-zinc-400 text-xs hover:bg-zinc-800/50 cursor-pointer">
                  <span>💾</span> Save Snippet
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <div className="text-[10px] text-zinc-600 px-2 mb-2">Saved Snippets</div>
                  {['API Helper', 'Date Utils', 'Fetch Wrapper'].map((name) => (
                    <div key={name} className="flex items-center gap-2 px-2 py-1.5 rounded text-zinc-500 text-xs hover:bg-zinc-800/50 cursor-pointer">
                      <span className="text-[10px]">📄</span> {name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModule === 'ssh' && (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-purple-500/15 text-purple-400 text-xs font-medium">
                  <span>🖥️</span> All Hosts
                  <span className="ml-auto text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">3</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-zinc-400 text-xs hover:bg-zinc-800/50 cursor-pointer">
                  <span>➕</span> Add Host
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <div className="text-[10px] text-zinc-600 px-2 mb-2">Active Sessions</div>
                  {sshHosts.filter(h => h.connected).map((host) => (
                    <div key={host.name} className="flex items-center gap-2 px-2 py-1.5 rounded text-zinc-400 text-xs hover:bg-zinc-800/50 cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {host.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-zinc-800">
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-zinc-400 text-xs hover:bg-zinc-800/50 cursor-pointer">
              <span>⚙️</span> Settings
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#0a0a0c] flex flex-col">
          {activeModule === 'projects' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-white">All Projects</h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Click to start/stop dev servers</p>
                </div>
                <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors">
                  + Add Project
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {projects.map((project) => {
                  const isRunning = runningProjects.includes(project.id);
                  return (
                    <button 
                      key={project.id}
                      onClick={() => toggleProject(project.id)}
                      className={`bg-zinc-900/80 border rounded-lg p-3 text-left transition-all ${
                        isRunning ? 'border-green-500/40 bg-green-500/5' : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-white text-sm">{project.name}</span>
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500">{project.framework}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isRunning ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                          {isRunning ? `:${project.port}` : 'stopped'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeModule === 'playground' && (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-[#0d0d0f]">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">snippet.js</span>
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-400 cursor-pointer"
                  >
                    <option>JavaScript</option>
                    <option>TypeScript</option>
                    <option>Python</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Auto-run
                  </span>
                  <button 
                    onClick={handleRun}
                    className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${
                      isRunning ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {isRunning ? '● Running' : '▶ Run'}
                  </button>
                </div>
              </div>

              {/* Editor + Output */}
              <div className="flex flex-1">
                {/* Code Panel */}
                <div className="flex-1 p-3 font-mono text-xs border-r border-zinc-800 overflow-auto">
                  <div className="flex items-baseline">
                    <span className="text-zinc-700 w-6 text-right mr-3 select-none">1</span>
                    <span className="text-purple-400">const</span>
                    <span className="text-zinc-300 ml-1">users</span>
                    <span className="text-zinc-500 ml-1">=</span>
                    <span className="text-zinc-300 ml-1">[</span>
                    <span className="text-amber-400">"Alice"</span>
                    <span className="text-zinc-500">,</span>
                    <span className="text-amber-400 ml-1">"Bob"</span>
                    <span className="text-zinc-500">,</span>
                    <span className="text-amber-400 ml-1">"Charlie"</span>
                    <span className="text-zinc-300">];</span>
                    <span className="ml-3 text-zinc-600 text-[10px]">∷ ["Alice", "Bob", "Charlie"]</span>
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-zinc-700 w-6 text-right mr-3 select-none">2</span>
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-zinc-700 w-6 text-right mr-3 select-none">3</span>
                    <span className="text-purple-400">const</span>
                    <span className="text-zinc-300 ml-1">count</span>
                    <span className="text-zinc-500 ml-1">=</span>
                    <span className="text-zinc-300 ml-1">users.</span>
                    <span className="text-cyan-400">length</span>
                    <span className="text-zinc-300">;</span>
                    <span className="ml-3 text-zinc-600 text-[10px]">∷ 3</span>
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-zinc-700 w-6 text-right mr-3 select-none">4</span>
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-zinc-700 w-6 text-right mr-3 select-none">5</span>
                    <span className="text-zinc-300">users.</span>
                    <span className="text-cyan-400">forEach</span>
                    <span className="text-zinc-300">((</span>
                    <span className="text-orange-400">user</span>
                    <span className="text-zinc-300">,</span>
                    <span className="text-orange-400 ml-1">i</span>
                    <span className="text-zinc-300">)</span>
                    <span className="text-purple-400 ml-1">=&gt;</span>
                    <span className="text-zinc-300 ml-1">{"{"}</span>
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-zinc-700 w-6 text-right mr-3 select-none">6</span>
                    <span className="text-zinc-300 ml-3">console.</span>
                    <span className="text-cyan-400">log</span>
                    <span className="text-zinc-300">(user);</span>
                    <span className="ml-3 text-zinc-600 text-[10px]">∷ <span className="text-purple-400 cursor-pointer hover:underline">(3×)</span></span>
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-zinc-700 w-6 text-right mr-3 select-none">7</span>
                    <span className="text-zinc-300">{"}"})</span>
                    <span className="text-zinc-300">;</span>
                  </div>
                </div>

                {/* Output Panel */}
                <div className="w-52 p-3 bg-[#08080a]">
                  <div className="text-[10px] text-zinc-600 mb-2">Console Output</div>
                  <div className="font-mono text-[11px] space-y-1">
                    <div className="text-zinc-400 hover:bg-zinc-800/50 px-1.5 py-1 rounded cursor-pointer transition-colors">Alice</div>
                    <div className="text-zinc-400 hover:bg-zinc-800/50 px-1.5 py-1 rounded cursor-pointer transition-colors">Bob</div>
                    <div className="text-zinc-400 hover:bg-zinc-800/50 px-1.5 py-1 rounded cursor-pointer transition-colors">Charlie</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeModule === 'ssh' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-white">SSH Connections</h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Manage your server connections</p>
                </div>
                <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors">
                  + Add Host
                </button>
              </div>

              <div className="space-y-2">
                {sshHosts.map((host) => (
                  <div 
                    key={host.name} 
                    className={`bg-zinc-900/80 border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-all ${
                      host.connected ? 'border-green-500/30' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${host.connected ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`}></div>
                      <div>
                        <h3 className="font-medium text-white text-sm">{host.name}</h3>
                        <p className="text-[11px] text-zinc-500">{host.host}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${host.connected ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {host.connected ? 'Connected' : 'Connect'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Feature with Icon
function Feature({ icon, title, description, tag }) {
  return (
    <div className="group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-lg flex-shrink-0 group-hover:border-purple-500/30 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            {title}
            {tag && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-medium">{tag}</span>}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Download Button
function DownloadButton({ icon, label, subtitle, href, primary }) {
  return (
    <a 
      href={href}
      className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
        primary 
          ? 'bg-purple-600 hover:bg-purple-500 text-white' 
          : 'bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-white'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="font-semibold">{label}</div>
        <div className={`text-xs ${primary ? 'text-purple-200' : 'text-zinc-500'}`}>{subtitle}</div>
      </div>
    </a>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [detectedOS, setDetectedOS] = useState('mac');
  
  useEffect(() => {
    const ua = window.navigator.userAgent;
    if (ua.includes('Win')) setDetectedOS('windows');
    else if (ua.includes('Linux')) setDetectedOS('linux');
    else setDetectedOS('mac');
  }, []);
  
  const getDownloadURL = () => {
    if (detectedOS === 'windows') return DOWNLOADS.windows;
    if (detectedOS === 'linux') return DOWNLOADS.linux_x64;
    return DOWNLOADS.mac;
  };
  
  const getOSLabel = () => {
    if (detectedOS === 'windows') return 'Windows';
    if (detectedOS === 'linux') return 'Linux';
    return 'macOS';
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/[0.03] rounded-full blur-[100px]"></div>
      </div>
      
      <div className="relative">
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}
        <header className="border-b border-zinc-800/50 sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80">
          <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="font-semibold text-white">Tafil</span>
            </a>
            
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
              <a href="#download" className="text-zinc-400 hover:text-white transition-colors">Download</a>
              <a href="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</a>
              <a href="/blog" className="text-zinc-400 hover:text-white transition-colors">Blog</a>
            </div>
            
            <div className="flex items-center gap-3">
              <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href={getDownloadURL()} className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Download
              </a>
            </div>
          </nav>
        </header>

        <main>
          {/* ================================================================ */}
          {/* HERO */}
          {/* ================================================================ */}
          <section className="pt-20 pb-16 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Version 2.0 — Now with TypeScript & Python
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight text-white">
                  The developer's
                  <br />
                  <span className="text-zinc-500">second brain</span>
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl">
                  A powerful desktop app for managing Node.js projects, testing code snippets, 
                  and connecting to servers. Works alongside your IDE.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <a href={getDownloadURL()} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download for {getOSLabel()}
                  </a>
                  <a href={CONFIG.GUMROAD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors border border-zinc-800 hover:border-zinc-700">
                    Get Pro — $49
                  </a>
                </div>

                <p className="text-xs text-zinc-600 mt-4">
                  macOS · Windows · Linux · No account required
                </p>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* INTERACTIVE APP DEMO */}
          {/* ================================================================ */}
          <section className="py-12 px-6">
            <div className="max-w-5xl mx-auto">
              <InteractiveAppDemo />
              <p className="text-center text-xs text-zinc-600 mt-4">
                ↑ Interactive preview — click tabs and items to explore
              </p>
            </div>
          </section>

          {/* ================================================================ */}
          {/* FEATURES GRID */}
          {/* ================================================================ */}
          <section id="features" className="py-20 px-6 border-t border-zinc-800/50">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-3">Everything you need</h2>
                <p className="text-zinc-500 text-lg">A focused toolkit built for developers</p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <Feature 
                  icon="⚡" 
                  title="Pro Code Playground" 
                  tag="NEW"
                  description="Ghost text inline results like RunJS. See values as you type. Time Travel to view variable history. Supports JavaScript, TypeScript, and Python."
                />
                <Feature 
                  icon="📁" 
                  title="Project Management" 
                  description="Scan folders, organize into collections, launch dev servers with one click. Auto-detects Next.js, Express, React, Vue, and 20+ frameworks."
                />
                <Feature 
                  icon="📐" 
                  title="Blueprint Editor" 
                  tag="NEW"
                  description="Plan your project architecture with a powerful code editor. Same Pro features as the playground — inline results, auto-run, and more."
                />
                <Feature 
                  icon="🖥️" 
                  title="SSH Manager" 
                  tag="PRO"
                  description="Connect to remote servers with saved credentials. Active session indicators visible even in collapsed sidebar. Full terminal support."
                />
                <Feature 
                  icon="🎨" 
                  title="Multiple Themes" 
                  description="10+ beautiful themes including Catppuccin, Solarized, GitHub Light/Dark. Consistent styling across editor, terminal, and UI."
                />
                <Feature 
                  icon="📊" 
                  title="Resizable Layout" 
                  description="Side-by-side or stacked layout. Draggable dividers to adjust panel sizes. Your layout preferences are saved automatically."
                />
                <Feature 
                  icon="🔍" 
                  title="Object Inspector" 
                  description="Collapsible tree view for objects and arrays like Chrome DevTools. Click any output line to highlight the source code."
                />
                <Feature 
                  icon="⚙️" 
                  title="Pro Settings" 
                  tag="NEW"
                  description="Tabbed settings panel with appearance, editor, and terminal configuration. Clean, native-feeling interface."
                />
              </div>
            </div>
          </section>


          {/* ================================================================ */}
          {/* PRICING */}
          {/* ================================================================ */}
          <section id="pricing" className="py-20 px-6 border-t border-zinc-800/50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-3">Simple pricing</h2>
                <p className="text-zinc-500">Free forever, or unlock everything with Pro</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Free */}
                <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1 text-white">Free</h3>
                    <div className="text-4xl font-bold text-white">$0</div>
                    <p className="text-sm text-zinc-500 mt-1">Forever</p>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    {['Unlimited projects', 'Basic code playground', 'Markdown notes', 'Project collections', 'Offline mode'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-zinc-400">
                        <svg className="w-4 h-4 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a href="#download" className="block w-full text-center py-3 border border-zinc-700 hover:border-zinc-600 text-white rounded-lg font-medium transition-colors">
                    Download Free
                  </a>
                </div>

                {/* Pro */}
                <div className="border-2 border-purple-500/30 bg-purple-500/5 rounded-xl p-8 relative">
                  <div className="absolute -top-3 left-6 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1 text-white">Pro</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">$49</span>
                      <span className="text-zinc-500 line-through">$79</span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">One-time payment</p>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    {[
                      'Everything in Free',
                      'Pro Playground (inline results)',
                      'TypeScript & Python support',
                      'Time Travel debugging',
                      'SSH Manager',
                      '10+ themes',
                      '3 device activations',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-zinc-300">
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a href={CONFIG.GUMROAD_URL} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors">
                    Get Pro License
                  </a>
                  
                  <p className="text-center text-xs text-zinc-500 mt-3">30-day money-back guarantee</p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* DOWNLOAD */}
          {/* ================================================================ */}
          <section id="download" className="py-20 px-6 border-t border-zinc-800/50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-3">Download Tafil</h2>
                <p className="text-zinc-500">Free download. No account required. Works offline.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <DownloadButton icon="🍎" label="macOS" subtitle="Intel & Apple Silicon" href={DOWNLOADS.mac} primary={detectedOS === 'mac'} />
                <DownloadButton icon="🪟" label="Windows" subtitle="Windows 10/11" href={DOWNLOADS.windows} primary={detectedOS === 'windows'} />
                <DownloadButton icon="🐧" label="Linux" subtitle="AppImage (x64)" href={DOWNLOADS.linux_x64} primary={detectedOS === 'linux'} />
              </div>

              <p className="text-center text-xs text-zinc-600 mt-6">
                Need ARM64 Linux? <a href={DOWNLOADS.linux_arm64} className="text-purple-400 hover:underline">Download here</a>
              </p>
            </div>
          </section>

          {/* ================================================================ */}
          {/* FINAL CTA */}
          {/* ================================================================ */}
          <section className="py-20 px-6 border-t border-zinc-800/50">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to organize your dev workflow?
              </h2>
              <p className="text-zinc-400 mb-8">
                Join thousands of developers using Tafil to manage projects, 
                test code, and work more efficiently.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href={getDownloadURL()} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Download for {getOSLabel()}
                </a>
                <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors border border-zinc-800 hover:border-zinc-700">
                  View on GitHub
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* ================================================================ */}
        {/* FOOTER */}
        {/* ================================================================ */}
        <footer className="border-t border-zinc-800/50 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Logo size={24} />
                <span className="font-semibold text-white">Tafil</span>
                <span className="text-xs text-zinc-600 ml-2">{CONFIG.VERSION}</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
                <a href="/docs" className="hover:text-white transition-colors">Docs</a>
                <a href="/blog" className="hover:text-white transition-colors">Blog</a>
                <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                <a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="hover:text-white transition-colors">Contact</a>
                <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
            
            <div className="text-center text-xs text-zinc-600 mt-8">
              © 2024 Tafil. Built by <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Touseef Ahmad</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

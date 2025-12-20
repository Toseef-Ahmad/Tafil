import { useEffect, useState } from "react";

// ============================================================================
// TAFIL - Professional Landing Page
// A high-end, developer-focused landing page inspired by Linear, Raycast, Vercel
// ============================================================================

// Configuration
const CONFIG = {
  GITHUB_USERNAME: "Toseef-Ahmad",
  REPO_NAME: "Tafil",
  VERSION: "v1.0.0",
  CONTACT_EMAIL: "ahmadtouseef946@gmail.com",
  GUMROAD_URL: "https://tafil.gumroad.com/l/tafil-license",
};

const RELEASE_BASE = `https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}/releases/download/${CONFIG.VERSION}`;
const DOWNLOADS = {
  mac: `${RELEASE_BASE}/Tafil-1.0.0-darwin-universal.dmg`,
  windows: `${RELEASE_BASE}/Tafil-1.0.0-portable.exe`,
  linux_x64: `${RELEASE_BASE}/Tafil-1.0.0-x86_64.AppImage`,
  linux_arm64: `${RELEASE_BASE}/Tafil-1.0.0-arm64.AppImage`,
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Logo Component
function Logo({ size = 32, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
      <path d="M10 12L14 16L10 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333ea" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Feature Card
function FeatureCard({ icon, title, description }) {
  return (
    <div className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-500/20 rounded-xl p-7 transition-all duration-300">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

// Platform Download Card
function PlatformCard({ icon, name, subtitle, downloadUrl, secondaryUrl, secondaryLabel }) {
  return (
    <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-500/20 rounded-xl p-8 text-center transition-all duration-300">
      <div className="text-5xl mb-5">{icon}</div>
      <h3 className="font-bold text-xl text-white mb-2">{name}</h3>
      <p className="text-sm text-zinc-500 mb-6">{subtitle}</p>
      <a href={downloadUrl} className="block w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl text-sm font-semibold transition-all">
        Download
      </a>
      {secondaryUrl && (
        <a href={secondaryUrl} className="block w-full py-2.5 mt-3 border-2 border-white/10 hover:border-purple-500/30 text-white rounded-xl text-sm font-semibold transition-all">
          {secondaryLabel}
        </a>
      )}
    </div>
  );
}

// FAQ Item
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors">
        <span className="font-semibold text-white pr-4">{question}</span>
        <span className={`text-zinc-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0 text-zinc-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

// Interactive Demo
function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState('projects');
  const [runningProjects, setRunningProjects] = useState(['api-server']);

  const projects = [
    { id: 'api-server', name: 'api-server', framework: 'Express.js', port: 3001 },
    { id: 'dashboard', name: 'dashboard', framework: 'Next.js', port: 3000 },
    { id: 'mobile-app', name: 'mobile-app', framework: 'React Native', port: 8081 },
    { id: 'landing', name: 'landing-page', framework: 'Vite + React', port: 5173 },
  ];

  const toggleProject = (id) => {
    setRunningProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <figure className="max-w-5xl mx-auto" aria-label="TAFIL application demo">
      <div className="rounded-xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-md shadow-2xl shadow-black/50">
        {/* Window Chrome */}
        <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-zinc-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
          </div>
          <span className="flex-1 text-center text-xs text-zinc-500 font-medium">TAFIL — Project Command Center</span>
          <div className="w-12"></div>
        </div>

        {/* App Content */}
        <div className="flex min-h-[400px]">
          {/* Sidebar */}
          <nav className="w-52 bg-[#111113] border-r border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Logo size={24} />
                <span className="font-semibold text-white text-sm">TAFIL</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-medium">PRO</span>
              </div>
            </div>

            <div className="flex-1 p-2 space-y-0.5">
              {[
                { id: 'projects', icon: '📁', label: 'Projects', count: 4 },
                { id: 'playground', icon: '⚡', label: 'Playground' },
                { id: 'blueprints', icon: '📐', label: 'Blueprints' },
                { id: 'notes', icon: '📝', label: 'Notes' },
                { id: 'ssh', icon: '🖥️', label: 'SSH' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === item.id 
                      ? 'bg-purple-500/15 text-purple-400' 
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.count && (
                    <span className="ml-auto text-xs bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">{item.count}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>{runningProjects.length} running</span>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 bg-[#0c0c0e] overflow-hidden">
            {activeTab === 'projects' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white">All Projects</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Click to start/stop servers</p>
                  </div>
                  <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg text-xs font-semibold">
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
                        className={`bg-zinc-900/80 border rounded-lg p-4 text-left transition-all ${
                          isRunning ? 'border-green-500/30' : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white text-sm">{project.name}</span>
                          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">{project.framework}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${isRunning ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                            {isRunning ? `:${project.port}` : 'stopped'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'playground' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <span className="text-sm font-medium text-white">JavaScript Playground</span>
                  <button className="px-3 py-1 bg-green-600 rounded text-xs font-medium">▶ Run</button>
                </div>
                <div className="flex-1 flex">
                  <div className="flex-1 p-4 font-mono text-sm bg-[#0a0a0c]">
                    <pre className="text-zinc-300">{`// Test your code here
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log(fibonacci(10));`}</pre>
                  </div>
                  <div className="w-48 p-4 bg-[#080809] border-l border-zinc-800">
                    <div className="text-xs text-zinc-500 mb-2">Output</div>
                    <pre className="text-sm text-green-400 font-mono">55</pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'blueprints' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Project Blueprint</h2>
                <div className="grid grid-cols-3 gap-3">
                  {['Authentication', 'API Layer', 'Database'].map((module) => (
                    <div key={module} className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4">
                      <h3 className="font-medium text-white text-sm mb-2">{module}</h3>
                      <span className="text-xs bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded">3 tasks</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Notes</h2>
                <div className="space-y-2">
                  {['Architecture decisions', 'API documentation', 'Meeting notes'].map((note) => (
                    <div key={note} className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 cursor-pointer">
                      <h3 className="font-medium text-white text-sm">{note}</h3>
                      <p className="text-xs text-zinc-500 mt-1">Last edited 2 days ago</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ssh' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">SSH Connections</h2>
                <div className="space-y-2">
                  {[
                    { name: 'Production', host: 'prod.example.com', connected: true },
                    { name: 'Staging', host: 'staging.example.com', connected: false },
                  ].map((server) => (
                    <div key={server.name} className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white text-sm">{server.name}</h3>
                        <p className="text-xs text-zinc-500">{server.host}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${server.connected ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        {server.connected ? 'connected' : 'disconnected'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <figcaption className="text-center text-xs text-zinc-500 mt-4">
        ↑ Interactive preview — click tabs and projects to explore
      </figcaption>
    </figure>
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
    <div className="min-h-screen bg-[#0a0a0f] text-white antialiased">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/[0.08] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/[0.06] rounded-full blur-[120px]"></div>
      </div>
      
      <div className="relative z-10">
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-black/30 sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" aria-label="Main navigation">
            <a href="/" className="flex items-center gap-2.5 font-bold text-lg" aria-label="TAFIL home">
              <Logo size={32} />
              <span className="text-white">TAFIL</span>
            </a>
            
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#what-is-tafil" className="text-zinc-400 hover:text-white transition-colors">What is TAFIL?</a>
              <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
              <a href="#download" className="text-zinc-400 hover:text-white transition-colors">Download</a>
              <a href="/blog" className="text-zinc-400 hover:text-white transition-colors">Blog</a>
              <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">GitHub</a>
            </div>
            
            <a href="#download" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">
              Download Free
            </a>
          </nav>
        </header>

        <main id="main-content">
          {/* ================================================================ */}
          {/* HERO SECTION */}
          {/* ================================================================ */}
          <section className="py-24 md:py-32 px-6" aria-labelledby="hero-heading">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300 mb-8">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Free Download · Works Offline · No Account Required
              </div>
              
              <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Your second brain
                </span>
                <br />
                <span className="text-zinc-500">for development</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Manage projects, write documentation, plan features, and experiment with code — 
                all in one desktop app that works alongside your IDE.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a href={getDownloadURL()} className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/25">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download for {getOSLabel()}
                </a>

                <a href={CONFIG.GUMROAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border-2 border-white/20 hover:border-purple-500/50 hover:bg-white/5 text-white px-8 py-4 rounded-xl font-semibold transition-all">
                  Get Pro — $49
                </a>
              </div>

              <p className="text-sm text-zinc-500">
                macOS (Intel & Apple Silicon) · Windows 10/11 · Linux
              </p>
            </div>
          </section>

          {/* ================================================================ */}
          {/* INTERACTIVE DEMO */}
          {/* ================================================================ */}
          <section className="px-6 pb-24" aria-label="Application demo">
            <InteractiveDemo />
          </section>

          {/* ================================================================ */}
          {/* WHAT IS TAFIL */}
          {/* ================================================================ */}
          <section id="what-is-tafil" className="py-24 px-6 border-t border-white/5" aria-labelledby="what-heading">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 id="what-heading" className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  What is TAFIL?
                </h2>
                <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                  TAFIL is a desktop application that helps developers organize their work. 
                  It's not an IDE — it works <em>alongside</em> your favorite editor as a 
                  command center for all your projects.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">🧠</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your Dev Brain</h3>
                  <p className="text-zinc-400 text-sm">
                    Keep project notes, architecture decisions, and documentation in one searchable place.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🚀</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Project Launcher</h3>
                  <p className="text-zinc-400 text-sm">
                    Scan your machine, detect frameworks, and start dev servers with one click.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="text-lg font-semibold text-white mb-2">100% Offline</h3>
                  <p className="text-zinc-400 text-sm">
                    All data stays on your machine. No cloud sync, no tracking, no subscriptions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* WHO IT'S FOR */}
          {/* ================================================================ */}
          <section className="py-24 px-6 border-t border-white/5" aria-labelledby="audience-heading">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 id="audience-heading" className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Who is TAFIL for?
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-8">
                  <div className="text-4xl mb-4">👨‍💻</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Professional Developers</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Juggling multiple client projects? TAFIL helps you switch context instantly 
                    and keep track of where you left off.
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-8">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Students & Learners</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Keep all your course projects organized. Take notes while coding. 
                    The free version has everything you need.
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-8">
                  <div className="text-4xl mb-4">🏴‍☠️</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Indie Hackers</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Building your own products? Use blueprints to plan features, 
                    track progress with Kanban, and document everything.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* FEATURES */}
          {/* ================================================================ */}
          <section id="features" className="py-24 px-6 border-t border-white/5" aria-labelledby="features-heading">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Everything you need
                </h2>
                <p className="text-zinc-400 text-lg">A focused toolkit for your development workflow</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard icon="📁" title="Project Management" description="Scan folders, organize into collections, launch with one click. Auto-detects Next.js, Express, React, Vue, and more." />
                <FeatureCard icon="⚡" title="Code Playground" description="Test JavaScript snippets, experiment with APIs, prototype ideas. No need to create throwaway projects." />
                <FeatureCard icon="📐" title="Blueprint Planning" description="Plan architecture with visual modules. Document decisions. Track progress from idea to implementation." />
                <FeatureCard icon="📝" title="Markdown Notes" description="Write docs with full Markdown. Link notes together like Obsidian. Full-text search across everything." />
                <FeatureCard icon="📊" title="Kanban Boards" description="Track tasks per project. Move cards between columns. See progress at a glance without leaving TAFIL." />
                <FeatureCard icon="🖥️" title="SSH Integration" description="Connect to remote servers. Save multiple connections. Quick access to your infrastructure. (Pro)" />
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* PRICING */}
          {/* ================================================================ */}
          <section id="pricing" className="py-24 px-6 border-t border-white/5" aria-labelledby="pricing-heading">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 id="pricing-heading" className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Simple, honest pricing
                </h2>
                <p className="text-zinc-400 text-lg">Free forever, or unlock Pro with a one-time purchase</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <div className="border border-white/10 bg-white/[0.02] rounded-xl p-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-white">Free</h3>
                    <div className="text-5xl font-bold text-white">$0</div>
                    <p className="text-sm text-zinc-500 mt-1">Forever</p>
                  </div>

                  <ul className="space-y-4 mb-10 text-sm">
                    {['Unlimited projects', 'Basic code playground', 'Markdown notes', 'Kanban boards', 'Offline mode', 'No account required'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-zinc-300">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a href="#download" className="block w-full text-center py-4 border-2 border-white/20 hover:border-purple-500/50 hover:bg-white/5 text-white rounded-xl font-semibold transition-all">
                    Download Free
                  </a>
                </div>

                {/* Pro Tier */}
                <div className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 rounded-xl p-10 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-wide">
                    Recommended
                  </div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-bold text-white">$49</span>
                      <span className="text-lg text-zinc-500 line-through">$79</span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">One-time payment</p>
                  </div>

                  <ul className="space-y-4 mb-10 text-sm">
                    {[
                      'Everything in Free',
                      'Advanced playground with npm',
                      'SSH integration',
                      'Excalidraw canvas',
                      'Wiki-style note linking',
                      'Unlimited blueprint modules',
                      '3 device activations',
                      'Priority email support',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-zinc-300">
                        <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a href={CONFIG.GUMROAD_URL} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all">
                    Get Pro License
                  </a>
                  
                  <p className="text-center text-xs text-zinc-500 mt-4">30-day money-back guarantee</p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* HOW LICENSING WORKS */}
          {/* ================================================================ */}
          <section className="py-24 px-6 border-t border-white/5" aria-labelledby="licensing-heading">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 id="licensing-heading" className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  How licensing works
                </h2>
                <p className="text-zinc-400 text-lg">Simple steps, no hassle</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: '1', title: 'Purchase', desc: 'Buy a Pro license through Gumroad' },
                  { step: '2', title: 'Receive Key', desc: 'Get your license key via email' },
                  { step: '3', title: 'Activate', desc: 'Enter the key in TAFIL (once)' },
                  { step: '4', title: 'Done!', desc: 'All Pro features unlocked forever' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* DOWNLOAD */}
          {/* ================================================================ */}
          <section id="download" className="py-24 px-6 border-t border-white/5" aria-labelledby="download-heading">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 id="download-heading" className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Download TAFIL
                </h2>
                <p className="text-zinc-400 text-lg">Free download. No account required.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <PlatformCard icon="🍎" name="macOS" subtitle="Intel & Apple Silicon" downloadUrl={DOWNLOADS.mac} />
                <PlatformCard icon="🪟" name="Windows" subtitle="Windows 10/11" downloadUrl={DOWNLOADS.windows} />
                <PlatformCard icon="🐧" name="Linux" subtitle="Ubuntu, Fedora, Debian" downloadUrl={DOWNLOADS.linux_x64} secondaryUrl={DOWNLOADS.linux_arm64} secondaryLabel="ARM64" />
              </div>

              <div className="mt-10 p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <p className="text-sm text-zinc-400 text-center">
                  <strong className="text-white">macOS tip:</strong> If you see "unidentified developer", right-click the app and select "Open"
                </p>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* FAQ */}
          {/* ================================================================ */}
          <section id="faq" className="py-24 px-6 border-t border-white/5" aria-labelledby="faq-heading">
            <div className="max-w-4xl mx-auto">
              <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">
                Frequently asked questions
              </h2>
              
              <div className="space-y-4">
                <FAQItem question="Is TAFIL really free?" answer="Yes. The free version includes unlimited projects, markdown notes, Kanban boards, and works 100% offline. Pro is optional and unlocks advanced features like SSH integration, advanced playground, and wiki-style linking." />
                <FAQItem question="Does TAFIL require internet?" answer="No. TAFIL works completely offline. All your data stays on your machine. License activation needs internet once, then works forever offline with a 30-day grace period for re-verification." />
                <FAQItem question="What platforms are supported?" answer="TAFIL runs on macOS (Intel & Apple Silicon), Windows 10/11, and Linux (via AppImage). We provide native builds for all major platforms." />
                <FAQItem question="Is this an IDE?" answer="No. TAFIL works alongside your favorite IDE (VS Code, Cursor, WebStorm, etc.) as a project command center. It helps you manage, organize, and document projects — not edit code." />
                <FAQItem question="What's the difference between Free and Pro?" answer="Free includes unlimited projects, notes, Kanban boards, and basic playground. Pro ($49 one-time) adds SSH integration, advanced code playground with npm packages, Excalidraw canvas, wiki-style note linking, and priority support." />
                <FAQItem question="Can I use Pro on multiple devices?" answer="Yes! The Pro license includes 3 device activations. You can use it on your work laptop, home desktop, and another machine. Need more? Contact us." />
                <FAQItem question="What if I change my device?" answer="If your device fingerprint changes (new hardware, reinstall), you can re-enter your license key. If you've hit the device limit, you can deactivate an old device from the app or contact support." />
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* FINAL CTA */}
          {/* ================================================================ */}
          <section className="py-24 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/5 border border-purple-500/20 rounded-2xl p-12 md:p-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Ready to get organized?
                </h2>
                <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
                  Download TAFIL for free and take control of your development workflow. 
                  Your projects, notes, and plans — all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={getDownloadURL()} className="inline-flex items-center justify-center gap-2 px-10 py-4 text-lg rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25 font-semibold transition-all">
                    Download for {getOSLabel()}
                  </a>
                  <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-10 py-4 text-lg rounded-xl border-2 border-white/20 hover:border-white/30 hover:bg-white/5 transition-all">
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ================================================================ */}
        {/* FOOTER */}
        {/* ================================================================ */}
        <footer className="border-t border-white/5 py-16 px-6" role="contentinfo">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Logo size={24} />
                  <span className="font-bold text-lg text-white">TAFIL</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  The project command center for developers. Manage, document, and ship faster.
                </p>
                <p className="text-xs text-zinc-600 mt-4">Version {CONFIG.VERSION}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#download" className="text-zinc-400 hover:text-white transition-colors">Download</a></li>
                  <li><a href="#faq" className="text-zinc-400 hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/blog" className="text-zinc-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">GitHub</a></li>
                  <li><a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}/issues`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Report Issues</a></li>
                  <li><a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}/releases`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Changelog</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="text-zinc-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
              <p>© 2024 TAFIL. Built by <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Touseef Ahmad</a></p>
              <p>MIT License · Made with ❤️ for developers</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

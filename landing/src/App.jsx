import { useEffect, useState, useRef } from "react";

// =====================================================
// Interactive App Demo Component
// =====================================================
function InteractiveAppDemo() {
  const [activeScreen, setActiveScreen] = useState('projects');
  const [isTyping, setIsTyping] = useState(false);
  const [typedCode, setTypedCode] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [runningProject, setRunningProject] = useState(null);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Sample code for playground demo
  const sampleCode = `// Calculate Fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log("Fibonacci(10) =", result);`;

  const sampleOutput = `→ Fibonacci(10) = 55
✓ Executed in 2ms`;

  // Sample projects
  const projects = [
    { name: 'tafil-landing', framework: 'React + Vite', status: 'stopped', port: null },
    { name: 'api-server', framework: 'Express.js', status: 'running', port: 3001 },
    { name: 'mobile-app', framework: 'React Native', status: 'stopped', port: null },
    { name: 'dashboard', framework: 'Next.js', status: 'stopped', port: null },
  ];

  // Auto-cycle through screens
  useEffect(() => {
    if (!autoPlay) return;
    
    const screens = ['projects', 'playground', 'blueprints', 'ssh'];
    let currentIndex = screens.indexOf(activeScreen);
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % screens.length;
      setActiveScreen(screens[currentIndex]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoPlay, activeScreen]);

  // Typing animation for playground
  useEffect(() => {
    if (activeScreen === 'playground' && typedCode.length < sampleCode.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setTypedCode(sampleCode.slice(0, typedCode.length + 1));
      }, 30);
      return () => clearTimeout(timeout);
    } else if (activeScreen === 'playground' && typedCode.length === sampleCode.length) {
      setIsTyping(false);
      setTimeout(() => setPlaygroundOutput(sampleOutput), 500);
    }
  }, [activeScreen, typedCode]);

  // Reset playground when switching away
  useEffect(() => {
    if (activeScreen !== 'playground') {
      setTypedCode('');
      setPlaygroundOutput('');
    }
  }, [activeScreen]);

  const handleScreenChange = (screen) => {
    setAutoPlay(false); // Stop auto-play when user interacts
    setActiveScreen(screen);
  };

  const toggleProject = (projectName) => {
    setAutoPlay(false);
    setRunningProject(runningProject === projectName ? null : projectName);
  };

  return (
    <div 
      className="relative mx-auto max-w-5xl"
      onMouseEnter={() => setAutoPlay(false)}
    >
      {/* macOS Window Frame */}
      <div className="rounded-xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-zinc-700/50">
        {/* Title Bar */}
        <div className="bg-[#1a1a1f] px-4 py-3 flex items-center gap-3 border-b border-zinc-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer transition-colors"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-zinc-500 font-medium">TAFIL — Project Command Center</span>
          </div>
          <div className="w-16"></div>
        </div>

        {/* App Content */}
        <div className="flex bg-[#0f0f12] min-h-[480px]">
          {/* Sidebar */}
          <div className="w-56 bg-[#141418] border-r border-zinc-800/50 flex flex-col">
            {/* Logo */}
            <div className="p-4 border-b border-zinc-800/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-lg">⚡</div>
                <span className="font-bold text-white">TAFIL</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded font-medium">PRO</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-2 space-y-1">
              <button
                onClick={() => handleScreenChange('projects')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeScreen === 'projects' 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <span className="text-lg">📁</span>
                <span>Projects</span>
                <span className="ml-auto text-xs bg-zinc-800 px-1.5 py-0.5 rounded">4</span>
              </button>

              <button
                onClick={() => handleScreenChange('playground')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeScreen === 'playground' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <span className="text-lg">⚡</span>
                <span>Playground</span>
              </button>

              <button
                onClick={() => handleScreenChange('blueprints')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeScreen === 'blueprints' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <span className="text-lg">📐</span>
                <span>Blueprints</span>
              </button>

              <button
                onClick={() => handleScreenChange('ssh')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeScreen === 'ssh' 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <span className="text-lg">🖥️</span>
                <span>SSH</span>
              </button>
            </div>

            {/* Running indicator */}
            <div className="p-3 border-t border-zinc-800/50">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>1 project running</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {/* Projects Screen */}
            {activeScreen === 'projects' && (
              <div className="p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">All Projects</h2>
                    <p className="text-sm text-zinc-500">4 projects found</p>
                  </div>
                  <button className="px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-lg text-sm font-medium transition-colors">
                    + New Project
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div 
                      key={project.name}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all cursor-pointer group"
                      onClick={() => toggleProject(project.name)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{project.name}</h3>
                          <p className="text-xs text-zinc-500">{project.framework}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'running' || runningProject === project.name
                            ? 'bg-green-500 animate-pulse' 
                            : 'bg-zinc-600'
                        }`}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${
                          project.status === 'running' || runningProject === project.name
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {project.status === 'running' || runningProject === project.name ? `Running :${project.port || '3000'}` : 'Stopped'}
                        </span>
                        <button className={`p-1.5 rounded-lg transition-all ${
                          project.status === 'running' || runningProject === project.name
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}>
                          {project.status === 'running' || runningProject === project.name ? '⏹' : '▶'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playground Screen */}
            {activeScreen === 'playground' && (
              <div className="h-full flex flex-col animate-fadeIn">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <span className="font-medium text-white">JavaScript Playground</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Auto-run</span>
                    <div className="w-8 h-4 bg-purple-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex">
                  {/* Code Editor */}
                  <div className="flex-1 bg-[#1e1e24] p-4 font-mono text-sm border-r border-zinc-800">
                    <pre className="text-zinc-300 whitespace-pre-wrap">
                      {typedCode}
                      {isTyping && <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-0.5"></span>}
                    </pre>
                  </div>

                  {/* Output */}
                  <div className="w-64 bg-[#0a0a0d] p-4">
                    <div className="text-xs text-zinc-500 mb-2">Output</div>
                    {playgroundOutput ? (
                      <pre className="text-sm text-green-400 font-mono animate-fadeIn">{playgroundOutput}</pre>
                    ) : (
                      <div className="text-zinc-600 text-xs">Waiting for execution...</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Blueprints Screen */}
            {activeScreen === 'blueprints' && (
              <div className="p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Project Blueprints</h2>
                    <p className="text-sm text-zinc-500">tafil-landing</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {['Authentication', 'API Routes', 'Database'].map((module, i) => (
                    <div key={module} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-emerald-500/50 transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{['🔐', '🔌', '🗄️'][i]}</span>
                        <h3 className="font-medium text-white">{module}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">3 tasks</span>
                        <span>5 notes</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kanban Preview */}
                <div className="bg-zinc-900/30 rounded-xl p-4 border border-zinc-800">
                  <div className="flex gap-4">
                    {['To Do', 'In Progress', 'Done'].map((col, i) => (
                      <div key={col} className="flex-1">
                        <div className="text-xs font-medium text-zinc-400 mb-2">{col}</div>
                        <div className="space-y-2">
                          {[1, 2].map(j => (
                            <div key={j} className="bg-zinc-800/50 rounded-lg p-2 text-xs text-zinc-400">
                              Task item {j}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SSH Screen */}
            {activeScreen === 'ssh' && (
              <div className="p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">SSH Connections</h2>
                    <p className="text-sm text-zinc-500">Manage remote servers</p>
                  </div>
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-lg text-sm font-medium transition-colors">
                    + Add Host
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Production Server', host: 'prod.example.com', status: 'connected' },
                    { name: 'Staging', host: 'staging.example.com', status: 'disconnected' },
                    { name: 'Database Server', host: 'db.example.com', status: 'disconnected' },
                  ].map((server) => (
                    <div key={server.name} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-orange-500/50 transition-all cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          server.status === 'connected' ? 'bg-green-500/20' : 'bg-zinc-800'
                        }`}>
                          🖥️
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{server.name}</h3>
                          <p className="text-xs text-zinc-500">{server.host}</p>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        server.status === 'connected' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {server.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive hint */}
      <div className="text-center mt-4">
        <span className="text-xs text-zinc-500 inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          Click the sidebar tabs to explore • Auto-cycles every 4 seconds
        </span>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  // Download URLs (Cloudflare R2 - direct downloads)
  const DOWNLOAD_MAC_URL = `https://download.tafil.app/TAFIL-1.0.0-mac-universal.dmg`;
  const DOWNLOAD_WINDOWS_URL = `https://download.tafil.app/TAFIL-1.0.0-windows.exe`;
  const DOWNLOAD_LINUX_URL = `https://download.tafil.app/TAFIL-1.0.0-linux.AppImage`;
  
  // Other URLs
  const GUMROAD_URL = `https://tafil.gumroad.com/l/tafil-license`;
  const GITHUB_URL = `https://github.com/Toseef-Ahmad/Tafil`;
  const CONTACT_EMAIL = `ahmadtouseef946@gmail.com`;

  const [activeTab, setActiveTab] = useState('free');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  // Detect OS
  const getOS = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('Mac') !== -1) return 'mac';
    if (userAgent.indexOf('Win') !== -1) return 'windows';
    if (userAgent.indexOf('Linux') !== -1) return 'linux';
    return 'mac';
  };
  
  const [detectedOS, setDetectedOS] = useState('mac');
  
  useEffect(() => {
    setDetectedOS(getOS());
  }, []);
  
  const getDownloadURL = () => {
    switch (detectedOS) {
      case 'windows': return DOWNLOAD_WINDOWS_URL;
      case 'linux': return DOWNLOAD_LINUX_URL;
      default: return DOWNLOAD_MAC_URL;
    }
  };
  
  const getOSLabel = () => {
    switch (detectedOS) {
      case 'windows': return 'Windows';
      case 'linux': return 'Linux';
      default: return 'macOS';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[520px] h-[520px] bg-purple-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-blue-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 font-bold text-xl group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TAFIL
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          
          <a 
            href="#download"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-6 py-2.5 rounded-full text-sm shadow-lg transition-all"
          >
            Download Free
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 text-zinc-300 px-5 py-2.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Free Download · No Account Required · Works Offline</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            The Second Brain for
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Developer Projects
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Plan, brainstorm, code, document, and experiment — all in one powerful desktop app.
            <br className="hidden md:block" />
            <span className="text-zinc-500">Works with your IDE. Not instead of it.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a
              href={getDownloadURL()}
              className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download for {getOSLabel()}
              <span className="opacity-60 group-hover:translate-x-1 transition-transform">→</span>
            </a>

            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-2 border-zinc-700 hover:border-purple-500 bg-zinc-900/50 backdrop-blur px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-zinc-800/50 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Buy Pro License - $29
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              macOS, Windows, Linux
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              100% Offline
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              No Account Needed
            </span>
          </div>
        </div>
      </section>

      {/* Interactive App Demo */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              See TAFIL in Action
            </h2>
            <p className="text-zinc-400">
              Interactive preview — click the tabs to explore
            </p>
          </div>
          
          <InteractiveAppDemo />
        </div>
      </section>

      {/* How It Works - Simple Flow */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How TAFIL Works</h2>
            <p className="text-xl text-zinc-400">Download free. Try it. Upgrade when ready.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                1️⃣
              </div>
              <h3 className="text-xl font-bold mb-3">Download Free</h3>
              <p className="text-zinc-400 text-sm">
                Get TAFIL for macOS, Windows, or Linux. No payment, no sign-up, no strings attached.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                2️⃣
              </div>
              <h3 className="text-xl font-bold mb-3">Install & Try</h3>
              <p className="text-zinc-400 text-sm">
                Use all basic features FREE. Manage projects, take notes, organize your work.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                3️⃣
              </div>
              <h3 className="text-xl font-bold mb-3">Upgrade (Optional)</h3>
              <p className="text-zinc-400 text-sm">
                Need advanced features? Buy a Pro license ($29) — one-time payment, lifetime access.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                4️⃣
              </div>
              <h3 className="text-xl font-bold mb-3">Paste & Unlock</h3>
              <p className="text-zinc-400 text-sm">
                Receive license key via email. Paste it in TAFIL. All Pro features unlock forever.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-zinc-800/50 border border-zinc-700 rounded-xl px-8 py-4">
              <p className="text-zinc-300">
                <strong className="text-purple-400">No tricks.</strong> Download is always free.
                Pay only if you want Pro features. Cancel anytime (it's not a subscription anyway).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison - Free vs Pro */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Free vs Pro</h2>
            <p className="text-xl text-zinc-400">Try TAFIL free. Upgrade when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Column */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-2 border-zinc-800 p-8 hover:border-zinc-700 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">TAFIL Free</h3>
                <div className="text-4xl font-bold text-zinc-400 mb-2">$0</div>
                <p className="text-zinc-500">Forever free</p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Unlimited Projects</div>
                    <div className="text-sm text-zinc-400">Manage as many as you need</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Blueprint & Modules</div>
                    <div className="text-sm text-zinc-400">Basic project documentation</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Markdown Notes</div>
                    <div className="text-sm text-zinc-400">Write and organize notes</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Todo & Kanban</div>
                    <div className="text-sm text-zinc-400">Track tasks and progress</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Basic Playground</div>
                    <div className="text-sm text-zinc-400">Test JavaScript snippets</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Fully Offline</div>
                    <div className="text-sm text-zinc-400">No internet required</div>
                  </div>
                </li>
              </ul>

              <button className="w-full mt-8 py-4 border-2 border-zinc-700 rounded-xl font-semibold hover:border-zinc-600 transition-colors">
                Forever Free
              </button>
            </div>

            {/* Pro Column */}
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-3xl border-2 border-purple-500/30 p-8 hover:border-purple-500/50 transition-colors relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                MOST POPULAR
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">TAFIL Pro</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">$29</span>
                  <span className="text-zinc-500 line-through text-xl">$49</span>
                </div>
                <p className="text-zinc-400">One-time payment · Lifetime license</p>
              </div>

              <div className="text-sm text-purple-300 mb-4 font-semibold">Everything in Free, plus:</div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Advanced Playground</div>
                    <div className="text-sm text-zinc-400">Full REPL with history & snippets</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Unlimited Modules</div>
                    <div className="text-sm text-zinc-400">No limits on blueprints</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Excalidraw Canvas</div>
                    <div className="text-sm text-zinc-400">Draw architecture diagrams</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Cross-Linking [[Wiki-Style]]</div>
                    <div className="text-sm text-zinc-400">Like Obsidian, for code projects</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">SSH Integration</div>
                    <div className="text-sm text-zinc-400">Connect to remote servers</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Priority Support</div>
                    <div className="text-sm text-zinc-400">Email support within 24h</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Commercial Usage</div>
                    <div className="text-sm text-zinc-400">Use in your business</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">3 Device Activations</div>
                    <div className="text-sm text-zinc-400">Mac, Windows, Linux</div>
                  </div>
                </li>
              </ul>

              <a
                href={GUMROAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-bold text-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
              >
                Buy Pro License - $29
              </a>

              <p className="text-center text-xs text-zinc-500 mt-4">
                ✓ 30-day money-back guarantee
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-lg">
              <strong className="text-white">Not sure?</strong> Download free and try it first.
              Upgrade to Pro later if you need advanced features.
            </p>
          </div>
        </div>
      </section>

      {/* What TAFIL IS / IS NOT */}
      <section className="relative z-10 py-20 px-6 bg-zinc-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              TAFIL is NOT an IDE
            </h2>
            <p className="text-xl text-zinc-400">
              It works <span className="text-purple-400 font-semibold">WITH</span> your IDE, not instead of it
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-2xl p-8">
              <div className="text-emerald-400 text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-3xl">✅</span> TAFIL IS:
              </div>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>A <strong>second brain</strong> for your development projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>A <strong>project orchestrator</strong> that manages your workflow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span>A <strong>planning & documentation</strong> tool with context</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span><strong>Works WITH</strong> VS Code, Cursor, WebStorm, etc.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span><strong>100% offline</strong> - no cloud dependency</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-500/5 border-2 border-red-500/20 rounded-2xl p-8">
              <div className="text-red-400 text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-3xl">❌</span> TAFIL IS NOT:
              </div>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">×</span>
                  <span>Not an IDE (keep using your favorite editor)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">×</span>
                  <span>Not a code editor (write code elsewhere)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">×</span>
                  <span>Not cloud-based (your data stays local)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">×</span>
                  <span>Not a subscription (one-time $29 for Pro)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">×</span>
                  <span>Not trying to replace your workflow</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-zinc-800/50 border border-zinc-700 rounded-xl px-8 py-4">
              <p className="text-lg text-zinc-300">
                <strong className="text-purple-400">Think:</strong> Obsidian for code projects.
                A layer <em>above</em> your IDE that connects everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3">Do I need to pay to download TAFIL?</h3>
              <p className="text-zinc-400">
                <strong className="text-white">No!</strong> Download is completely free. You can use TAFIL Free forever.
                Pay only if you want Pro features ($29 one-time).
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3">How does the Pro license work?</h3>
              <p className="text-zinc-400">
                After buying Pro on Gumroad, you'll receive a license key via email. Paste it in TAFIL → all Pro features unlock.
                Works on 3 devices, lifetime access, no subscription.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3">Can I try Pro features before buying?</h3>
              <p className="text-zinc-400">
                Free version gives you a feel for TAFIL. Pro features are clearly marked in the app.
                We offer a <strong className="text-emerald-400">30-day money-back guarantee</strong> if Pro doesn't meet your needs.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3">Do I need internet to use TAFIL?</h3>
              <p className="text-zinc-400">
                <strong className="text-white">No.</strong> TAFIL works 100% offline after installation.
                License activation needs internet once, then works offline for 30+ days.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3">Is TAFIL an IDE or code editor?</h3>
              <p className="text-zinc-400">
                No. TAFIL is a <strong className="text-white">second brain</strong> for your projects.
                Think Obsidian + Notion, but for developers. You still code in VS Code/Cursor/WebStorm.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
              <h3 className="text-xl font-bold text-white mb-3">What platforms are supported?</h3>
              <p className="text-zinc-400">
                macOS (10.13+, Intel & Apple Silicon), Windows (10/11), and Linux (Ubuntu, Fedora, etc.).
                One license works on all platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="relative z-10 py-20 px-6 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Download TAFIL</h2>
            <p className="text-xl text-zinc-400">Free download. No account required. Works offline.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* macOS */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 text-center hover:border-purple-500/50 transition-all group">
              <div className="text-5xl mb-4">🍎</div>
              <h3 className="text-xl font-bold mb-2">macOS</h3>
              <p className="text-sm text-zinc-400 mb-6">Intel & Apple Silicon</p>
              <a
                href={DOWNLOAD_MAC_URL}
                className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-sm transition-all group-hover:shadow-lg group-hover:shadow-purple-500/20"
              >
                Download DMG
              </a>
              <p className="text-xs text-zinc-500 mt-3">macOS 10.13+</p>
            </div>

            {/* Windows */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 text-center hover:border-blue-500/50 transition-all group">
              <div className="text-5xl mb-4">🪟</div>
              <h3 className="text-xl font-bold mb-2">Windows</h3>
              <p className="text-sm text-zinc-400 mb-6">Windows 10/11</p>
              <a
                href={DOWNLOAD_WINDOWS_URL}
                className="block w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-semibold text-sm transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20"
              >
                Download EXE
              </a>
              <p className="text-xs text-zinc-500 mt-3">Windows 10+</p>
            </div>

            {/* Linux */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 text-center hover:border-emerald-500/50 transition-all group">
              <div className="text-5xl mb-4">🐧</div>
              <h3 className="text-xl font-bold mb-2">Linux</h3>
              <p className="text-sm text-zinc-400 mb-6">Ubuntu, Fedora, Debian</p>
              <a
                href={DOWNLOAD_LINUX_URL}
                className="block w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl font-semibold text-sm transition-all group-hover:shadow-lg group-hover:shadow-emerald-500/20"
              >
                Download AppImage
              </a>
              <p className="text-xs text-zinc-500 mt-3">Ubuntu 18.04+</p>
            </div>
          </div>

          {/* Quick Install Instructions */}
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">
            <h4 className="font-bold text-lg mb-4 text-center">Quick Installation</h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
              <div>
                <div className="font-semibold text-white mb-2">🍎 macOS</div>
                <ol className="space-y-1">
                  <li>1. Open the DMG file</li>
                  <li>2. Drag TAFIL to Applications</li>
                  <li>3. Launch from Applications</li>
                </ol>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">🪟 Windows</div>
                <ol className="space-y-1">
                  <li>1. Run the installer</li>
                  <li>2. Follow the wizard</li>
                  <li>3. Launch from Start Menu</li>
                </ol>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">🐧 Linux</div>
                <ol className="space-y-1">
                  <li>1. Make executable: <code className="bg-zinc-800 px-1 rounded">chmod +x *.AppImage</code></li>
                  <li>2. Double-click to run</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Pro License CTA */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl px-8 py-6">
              <p className="text-lg text-zinc-300 mb-4">
                <strong className="text-purple-400">Want Pro features?</strong> Get unlimited everything for a one-time payment.
              </p>
              <a
                href={GUMROAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
              >
                Buy Pro License - $29
                <span className="text-xs opacity-70">(one-time)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Try TAFIL Today — Free
          </h2>
          <p className="text-xl text-zinc-400 mb-12">
            No payment. No account. No tricks. Just download and use.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={getDownloadURL()}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xl px-12 py-5 rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download for {getOSLabel()}
            </a>

            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-2 border-zinc-700 hover:border-purple-500 bg-zinc-900/50 backdrop-blur text-white font-semibold text-lg px-10 py-5 rounded-2xl hover:bg-zinc-800/50 transition-all"
            >
              Buy Pro License - $29
            </a>
          </div>

          <p className="text-sm text-zinc-500 mt-8">
            macOS • Windows • Linux • One-time payment • 30-day guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">TAFIL</span>
              <span>·</span>
              <span>© 2025 Touseef Ahmad</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href={GITHUB_URL} className="hover:text-white transition-colors">GitHub</a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">Support</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


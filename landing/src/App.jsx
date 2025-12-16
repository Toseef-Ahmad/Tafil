import { useState, useEffect } from 'react';

export default function App() {
  const GITHUB_USERNAME = "Toseef-Ahmad";
  const REPO_NAME = "Tafil";
  const RELEASES_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases`;
  const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`;
  const DOCS_URL = `/Tafil/docs/`;
  const BUY_URL = RELEASES_URL; // Replace with your payment link when ready

  const screenshots = [
    { src: "/Tafil/screenshots/dashboard.png", label: "Dashboard", desc: "All projects at a glance with real-time status" },
    { src: "/Tafil/screenshots/collections.png", label: "Collections", desc: "Organize by client, framework, or priority" },
    { src: "/Tafil/screenshots/insights.png", label: "Insights", desc: "Project Brain memory & health monitoring" },
  ];

  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveScreenshot(prev => (prev + 1) % screenshots.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Core features organized by category
  const featureCategories = [
    {
      name: "Project Management",
      icon: "📂",
      features: [
    { icon: "🔍", title: "Auto-Discovery", desc: "Scans your folders and finds every Node.js project automatically. React, Vue, Next.js, Express—detected instantly." },
        { icon: "📂", title: "Smart Collections", desc: "Organize projects into collections. Group by client, priority, or framework. Drag and drop to organize." },
    { icon: "▶️", title: "One-Click Start", desc: "Start any project with one click. Port detection, conflict resolution, and error handling built-in." },
        { icon: "🔄", title: "External Process Detection", desc: "See projects running outside Tafil. Stop them or open in browser—full visibility of all Node processes." },
      ]
    },
    {
      name: "Developer Tools",
      icon: "🛠️",
      features: [
        { icon: "🖥️", title: "IDE Integration", desc: "Open in VS Code, Cursor, WebStorm, Sublime, Zed, or any editor. Configure your default with one click." },
    { icon: "⌨️", title: "Command Palette", desc: "Press ⌘K for instant search. Find and launch any project in seconds. Keyboard-first workflow." },
        { icon: "🧪", title: "JavaScript Playground", desc: "Built-in code playground with Monaco editor, IntelliSense, and auto-run. Like RunJS built into your manager." },
        { icon: "🔌", title: "SSH Terminal", desc: "Full terminal emulator with xterm.js. Connect to SSH hosts, manage keys, and run commands." },
      ]
    },
    {
      name: "Intelligence",
      icon: "🧠",
      features: [
        { icon: "🧠", title: "Project Brain", desc: "Remembers run history, success rates, detected ports, and crash summaries. Your project's memory system." },
        { icon: "🔧", title: "Fix It Recovery", desc: "When projects fail, get actionable fixes: port conflicts, missing env vars, Node version mismatches—solved." },
        { icon: "📊", title: "Project Insights", desc: "Health dashboard showing dependencies, git info, running status, and complete run history." },
        { icon: "📝", title: "Live Logs", desc: "Real-time stdout/stderr capture. Full log viewer, auto-scroll, and persistent log history." },
      ]
    },
    {
      name: "System Integration",
      icon: "💻",
      features: [
        { icon: "🔗", title: "Git Integration", desc: "See current branch, last commit message, and timestamp for every project. Full git context." },
        { icon: "📡", title: "Port Management", desc: "Smart port detection, conflict resolution, and custom port selection. Never lose track of ports." },
        { icon: "🖱️", title: "System Tray", desc: "Quick access from menu bar. Open browser, editor, or stop projects without opening the main window." },
        { icon: "🌓", title: "Dark & Light Mode", desc: "Beautiful themes for day and night. Persistent preference with smooth transitions." },
      ]
    }
  ];

  const stats = [
    { value: "50+", label: "Features" },
    { value: "20+", label: "Frameworks" },
    { value: "11+", label: "IDE Support" },
    { value: "3", label: "Platforms" },
  ];

  const painPoints = [
    { before: "Searching for projects in Terminal", after: "All projects in one dashboard" },
    { before: "Forgetting which port is which", after: "Automatic port tracking" },
    { before: "cd, npm install, npm run dev...", after: "One click to start" },
    { before: "Opening wrong project in IDE", after: "Context menu → Open in Editor" },
    { before: "Is that server still running?", after: "Running indicator + easy stop" },
    { before: "Project crashed, why?", after: "Project Brain remembers & Fix It helps" },
  ];

  const frameworks = [
    "React", "Vue", "Next.js", "Nuxt", "Vite", "Angular", 
    "Express", "NestJS", "Remix", "Gatsby", "Svelte", "Astro",
    "Electron", "T3", "RedwoodJS", "Blitz.js", "SolidJS", "Qwik"
  ];

  const keyboardShortcuts = [
    { keys: "⌘K", action: "Command Palette" },
    { keys: "⌘↵", action: "Run Playground" },
    { keys: "⌘⇧R", action: "Toggle Auto-run" },
    { keys: "↑↓", action: "Navigate" },
  ];

  const testimonials = [
    { quote: "Finally, a tool that understands how developers actually work.", author: "Senior Developer", company: "Tech Startup" },
    { quote: "Saved me hours every week. The Project Brain feature is game-changing.", author: "Full-stack Engineer", company: "SaaS Company" },
    { quote: "Worth every penny. The best investment for my development workflow.", author: "Freelance Developer", company: "Independent" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/6 rounded-full blur-[80px]"></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 font-bold text-xl group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 11 2-2-2-2"/>
                <path d="M11 13h4"/>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Tafil</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#screenshots" className="hover:text-amber-400 transition-colors">Screenshots</a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a>
            <a href={DOCS_URL} className="hover:text-amber-400 transition-colors">Docs</a>
          </nav>
          
          <a 
            href={BUY_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold px-5 py-2.5 rounded-full text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
          >
            Get Tafil Pro
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className={`relative z-10 py-20 md:py-32 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-5xl mx-auto text-center">
          {/* Pro Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 px-5 py-2.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Pro Developer Tool • One-time Purchase • Lifetime Updates
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-white">The Node.js project</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              manager you deserve
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Scan, organize, and launch all your projects from one beautiful dashboard. 
            <span className="text-zinc-300"> With Project Brain memory, Fix It recovery, built-in playground, and 50+ premium features.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a 
              href={BUY_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-8 py-4 rounded-2xl font-bold shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Buy Tafil Pro — $29
              <span className="opacity-60 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            
            <a 
              href={RELEASES_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 border border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 backdrop-blur px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-800/50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
              Try Free Trial
            </a>
          </div>

          <p className="text-sm text-zinc-500 mb-8">
            ✓ One-time payment &nbsp;•&nbsp; ✓ Lifetime updates &nbsp;•&nbsp; ✓ 30-day money-back guarantee
          </p>
          
          {/* Platform badges */}
          <div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
            <span className="flex items-center gap-2 hover:text-zinc-300 transition-colors">
              <span className="text-lg">🍎</span> macOS
            </span>
            <span className="flex items-center gap-2 hover:text-zinc-300 transition-colors">
              <span className="text-lg">⊞</span> Windows
            </span>
            <span className="flex items-center gap-2 hover:text-zinc-300 transition-colors">
              <span className="text-lg">🐧</span> Linux
            </span>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative z-10 py-8 border-y border-white/5 bg-zinc-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Showcase */}
      <section id="screenshots" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See it in action</h2>
            <p className="text-zinc-400 text-lg">Beautiful, intuitive, and blazing fast</p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="ml-4 text-sm text-zinc-500 font-medium font-mono">Tafil Pro — {screenshots[activeScreenshot].label}</span>
            </div>
            
            {/* Screenshot with animation */}
            <div className="relative bg-zinc-950">
              <img 
                src={screenshots[activeScreenshot].src} 
                alt={screenshots[activeScreenshot].label}
                className="w-full transition-opacity duration-500"
              />
              
              {/* Overlay label */}
              <div className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-zinc-700">
                <div className="font-semibold text-sm text-white">{screenshots[activeScreenshot].label}</div>
                <div className="text-xs text-zinc-400">{screenshots[activeScreenshot].desc}</div>
              </div>
            </div>
          </div>
          
          {/* Screenshot navigation */}
          <div className="flex justify-center gap-3 mt-8">
            {screenshots.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveScreenshot(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeScreenshot === i 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20' 
                    : 'bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points - Before/After */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Sound familiar?</h2>
          <p className="text-center text-zinc-400 mb-12">Every developer's daily struggle, solved.</p>
          
          <div className="space-y-3">
            {painPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-red-400/80 text-lg">✗</span>
                  <span className="text-zinc-500 line-through">{point.before}</span>
                </div>
                <div className="text-zinc-700">→</div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-amber-400 text-lg">✓</span>
                  <span className="text-zinc-200 font-medium">{point.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Tabs */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Packed with power features</h2>
            <p className="text-zinc-400 text-lg">Everything you need, nothing you don't</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {featureCategories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveFeatureTab(i)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeFeatureTab === i
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400'
                    : 'bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {featureCategories[activeFeatureTab].features.map((f, i) => (
              <div 
                key={i} 
                className="group bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{f.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-amber-400 transition-colors">{f.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Features */}
      <section className="relative z-10 py-20 px-6 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Project Brain */}
            <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 rounded-3xl p-8 border border-violet-500/20">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-3 text-violet-300">Project Brain</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Your projects have memory now. Tafil remembers run history, success rates, detected ports, crash summaries, and more.
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Last 20 runs tracked</li>
                <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Success/error counts</li>
                <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Crash summaries</li>
                <li className="flex items-center gap-2"><span className="text-violet-400">✓</span> Offline-first storage</li>
              </ul>
            </div>

            {/* Fix It */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-3xl p-8 border border-amber-500/20">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold mb-3 text-amber-300">Fix It Recovery</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                When projects fail, get intelligent recovery actions. Port conflicts, missing env vars, Node mismatches—solved.
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Port conflict resolution</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Missing env detection</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> NVM command suggestions</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> One-click fixes</li>
              </ul>
            </div>

            {/* Playground */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-3xl p-8 border border-cyan-500/20">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">JS Playground</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Built-in JavaScript playground with Monaco editor. IntelliSense, auto-run, execution time tracking. Like RunJS, built-in.
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Monaco Editor</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Auto-run (500ms)</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> TypeScript types</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Error highlighting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-zinc-500 mb-6 uppercase tracking-wider font-medium">Keyboard-first workflow</p>
          <div className="flex flex-wrap justify-center gap-4">
            {keyboardShortcuts.map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-zinc-900/50 px-5 py-3 rounded-xl border border-zinc-800">
                <kbd className="bg-zinc-800 px-3 py-1 rounded-lg text-sm font-mono text-amber-400 border border-zinc-700">{s.keys}</kbd>
                <span className="text-zinc-400 text-sm">{s.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Support */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-zinc-500 mb-6 uppercase tracking-wider font-medium">Auto-detects all major frameworks</p>
          <div className="flex flex-wrap justify-center gap-2">
            {frameworks.map(fw => (
              <span key={fw} className="bg-zinc-900/50 px-4 py-2 rounded-full text-sm border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-colors cursor-default">
                {fw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by developers</h2>
            <p className="text-zinc-400 text-lg">Join thousands of developers who've upgraded their workflow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
                <div className="text-amber-400 text-2xl mb-4">★★★★★</div>
                <p className="text-zinc-300 mb-4 italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{t.author}</div>
                  <div className="text-sm text-zinc-500">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, honest pricing</h2>
            <p className="text-zinc-400 text-lg">One-time purchase. Lifetime access. No subscriptions.</p>
          </div>

          <div className="bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-rose-600/20 rounded-3xl p-8 md:p-12 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  ⚡ LAUNCH SPECIAL
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">Tafil Pro</h3>
                <p className="text-zinc-400 mb-6">Everything you need. Forever.</p>
                
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> All 50+ features
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> macOS, Windows, Linux
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> Lifetime updates
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> Priority support
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> 30-day money-back guarantee
                  </li>
                </ul>
              </div>

              <div className="flex-shrink-0 text-center">
                <div className="mb-4">
                  <span className="text-zinc-500 line-through text-xl">$49</span>
                  <div className="text-6xl font-bold text-white">$29</div>
                  <div className="text-zinc-400">one-time payment</div>
                </div>
                
                <a 
                  href={BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold px-10 py-4 rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all"
                >
                  Buy Now
                  <span className="opacity-60">→</span>
                </a>
                
                <p className="text-xs text-zinc-500 mt-4">Secure payment via Gumroad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-10 md:p-16 text-center border border-zinc-800">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to take control?</h2>
            <p className="text-zinc-400 mb-10 text-lg">Download now. Try free for 14 days.</p>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                { os: "macOS", note: "Apple Silicon & Intel", icon: "🍎", formats: "DMG, ZIP" },
                { os: "Windows", note: "64-bit & 32-bit", icon: "⊞", formats: "EXE, Portable" },
                { os: "Linux", note: "Universal packages", icon: "🐧", formats: "AppImage, DEB, RPM" },
              ].map((item, i) => (
                <a 
                  key={i}
                  href={RELEASES_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 transition-all hover:scale-105"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="font-bold text-lg mb-1">{item.os}</div>
                  <div className="text-sm text-zinc-400 mb-2">{item.note}</div>
                  <div className="text-xs text-zinc-600">{item.formats}</div>
                </a>
              ))}
            </div>
            
            <p className="text-sm text-zinc-500">
              💡 First launch: macOS → Right-click, Open. Windows → "More info" → "Run anyway"
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 11 2-2-2-2"/>
                <rect width="18" height="18" x="3" y="3" rx="2"/>
              </svg>
            </div>
              <span className="font-semibold text-zinc-300">Tafil Pro</span>
              <span className="text-zinc-600">© 2025</span>
          </div>
          
          <div className="flex items-center gap-8">
              <a href={DOCS_URL} className="hover:text-amber-400 transition-colors">Documentation</a>
              <a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a>
              <a href={`mailto:ahmadtouseef946@gmail.com`} className="hover:text-amber-400 transition-colors">Support</a>
              <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Download</a>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-amber-500">●</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
            Made with 🔥 by <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-amber-400 transition-colors">Touseef Ahmad</a>
            <span className="mx-2">•</span>
            Built with Electron, React, and Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}

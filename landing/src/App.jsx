import { useState, useEffect } from 'react';

export default function App() {
  const GITHUB_USERNAME = "Toseef-Ahmad";
  const REPO_NAME = "Tafil";
  const RELEASES_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases`;
  const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`;
  const DOCS_URL = `/Tafil/docs/`;

  const screenshots = [
    { src: "/Tafil/screenshots/dashboard.png", label: "Dashboard", desc: "See all projects at a glance" },
    { src: "/Tafil/screenshots/collections.png", label: "Collections", desc: "Organize by client or type" },
    { src: "/Tafil/screenshots/insights.png", label: "Insights", desc: "Project health & details" },
  ];

  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveScreenshot(prev => (prev + 1) % screenshots.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: "🔍", title: "Auto-Discovery", desc: "Scans your folders and finds every Node.js project automatically. React, Vue, Next.js, Express—detected instantly." },
    { icon: "📂", title: "Collections", desc: "Organize projects into collections. Group by client, priority, or however you work. Drag and drop to organize." },
    { icon: "▶️", title: "One-Click Start", desc: "Start any project with one click. Port detection, conflict resolution, and error handling built-in." },
    { icon: "🖥️", title: "IDE Integration", desc: "Open in VS Code, Cursor, WebStorm, Sublime, or any editor. Configure your default with one click." },
    { icon: "⌨️", title: "Command Palette", desc: "Press ⌘K for instant search. Find and launch any project in seconds. Keyboard-first workflow." },
    { icon: "🔄", title: "External Process Detection", desc: "See projects running outside Tafil. Stop them or open in browser—full visibility." },
  ];

  const painPoints = [
    { before: "Searching for projects in Terminal", after: "All projects in one dashboard" },
    { before: "Forgetting which port is which", after: "Automatic port tracking" },
    { before: "cd, npm install, npm run dev...", after: "One click to start" },
    { before: "Opening wrong project in IDE", after: "Context menu → Open in Editor" },
    { before: "Is that server still running?", after: "Running indicator + easy stop" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF0] text-[#1a1a2e] font-sans overflow-x-hidden">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#FFE4D6] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#D6E4FF] rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#E4FFD6] rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#e5e0d5]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 11 2-2-2-2"/>
                <path d="M11 13h4"/>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Tafil</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4a4a5a]">
            <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
            <a href="#screenshots" className="hover:text-violet-600 transition-colors">Screenshots</a>
            <a href={DOCS_URL} className="hover:text-violet-600 transition-colors">Docs</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">GitHub</a>
          </nav>
          
          <a 
            href={RELEASES_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-violet-200 hover:shadow-xl transition-all"
          >
            Download Free
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className={`relative z-10 py-20 md:py-28 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Open Source • Free Forever
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#1a1a2e]">Stop hunting for projects.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Start building.
            </span>
          </h1>
          
          <p className="text-xl text-[#5a5a6a] mb-10 max-w-2xl mx-auto leading-relaxed">
            Every Node.js project. Every framework. One dashboard.
            <br className="hidden md:block" />
            The missing project manager for developers who juggle multiple apps.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={RELEASES_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-violet-200 hover:shadow-2xl hover:scale-105 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
              Download for Free
              <span className="text-violet-200 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            
            <a 
              href={GITHUB_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 border-2 border-[#e5e0d5] hover:border-violet-300 bg-white/50 backdrop-blur px-8 py-4 rounded-2xl font-semibold hover:bg-white transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Source
            </a>
          </div>
          
          {/* Platform badges */}
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-[#7a7a8a]">
            <span className="flex items-center gap-2">🍎 macOS</span>
            <span className="flex items-center gap-2">⊞ Windows</span>
            <span className="flex items-center gap-2">🐧 Linux</span>
          </div>
        </div>
      </section>

      {/* Screenshot Showcase */}
      <section id="screenshots" className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#e5e0d5] shadow-2xl shadow-violet-100/50 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#f0ebe0] bg-gradient-to-r from-[#faf8f3] to-white">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
              <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
              <span className="ml-4 text-sm text-[#9a9aaa] font-medium">Tafil — {screenshots[activeScreenshot].label}</span>
            </div>
            
            {/* Screenshot with animation */}
            <div className="relative">
              <img 
                src={screenshots[activeScreenshot].src} 
                alt={screenshots[activeScreenshot].label}
                className="w-full transition-opacity duration-500"
              />
              
              {/* Overlay label */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                <div className="font-semibold text-sm">{screenshots[activeScreenshot].label}</div>
                <div className="text-xs text-[#7a7a8a]">{screenshots[activeScreenshot].desc}</div>
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
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200' 
                    : 'bg-white border border-[#e5e0d5] text-[#5a5a6a] hover:border-violet-300 hover:text-violet-600'
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
          <h2 className="text-3xl font-bold text-center mb-4">Sound familiar?</h2>
          <p className="text-center text-[#5a5a6a] mb-12">Every developer's daily struggle, solved.</p>
          
          <div className="space-y-4">
            {painPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-[#e5e0d5] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-red-400">✗</span>
                  <span className="text-[#7a7a8a] line-through">{point.before}</span>
                </div>
                <div className="text-[#c0c0c0]">→</div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-[#1a1a2e] font-medium">{point.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-violet-50/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-[#5a5a6a] text-lg">Built for developers who work with multiple projects daily</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="group bg-white rounded-2xl p-6 border border-[#e5e0d5] hover:border-violet-200 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-violet-600 transition-colors">{f.title}</h3>
                <p className="text-[#5a5a6a] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Support */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#7a7a8a] mb-6 uppercase tracking-wider font-medium">Auto-detects all major frameworks</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["React", "Vue", "Next.js", "Nuxt", "Vite", "Angular", "Express", "NestJS", "Remix", "Gatsby", "Svelte", "Astro"].map(fw => (
              <span key={fw} className="bg-white px-4 py-2 rounded-full text-sm border border-[#e5e0d5] text-[#4a4a5a] font-medium">
                {fw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-violet-300/50">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to take control?</h2>
            <p className="text-violet-100 mb-8 text-lg">Free download. No signup. Open source forever.</p>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { os: "macOS", note: "Apple Silicon & Intel", icon: "🍎" },
                { os: "Windows", note: "64-bit installer", icon: "⊞" },
                { os: "Linux", note: "AppImage, DEB, RPM", icon: "🐧" },
              ].map((item, i) => (
                <a 
                  key={i}
                  href={RELEASES_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-2xl p-4 transition-all hover:scale-105"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-semibold">{item.os}</div>
                  <div className="text-sm text-violet-200">{item.note}</div>
                </a>
              ))}
            </div>
            
            <p className="text-sm text-violet-200">
              💡 First launch: macOS → Right-click, Open. Windows → "More info" → "Run anyway"
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#e5e0d5] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#7a7a8a]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 11 2-2-2-2"/>
                <rect width="18" height="18" x="3" y="3" rx="2"/>
              </svg>
            </div>
            <span className="font-semibold text-[#4a4a5a]">Tafil</span>
            <span>© 2025</span>
          </div>
          
          <div className="flex items-center gap-8">
            <a href={DOCS_URL} className="hover:text-violet-600 transition-colors">Documentation</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">GitHub</a>
            <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">Issues</a>
            <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">Releases</a>
          </div>
          
          <span className="text-[#a0a0b0]">MIT License</span>
        </div>
      </footer>
    </div>
  );
}

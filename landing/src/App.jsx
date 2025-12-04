import { useState } from 'react';

export default function App() {
  const GITHUB_USERNAME = "Toseef-Ahmad";
  const REPO_NAME = "Tafil";
  const RELEASES_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases`;
  const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`;

  const screenshots = [
    { src: "/Tafil/screenshots/dashboard.png", label: "Dashboard" },
    { src: "/Tafil/screenshots/collections.png", label: "Collections" },
    { src: "/Tafil/screenshots/insights.png", label: "Insights" },
    { src: "/Tafil/screenshots/empty-state.png", label: "Empty State" },
  ];

  const [activeScreenshot, setActiveScreenshot] = useState(0);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#cccccc] font-sans">
      {/* Header */}
      <header className="border-b border-[#333]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4EC9B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 11 2-2-2-2"/>
              <path d="M11 13h4"/>
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            </svg>
            Tafil
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#screenshots" className="hover:text-white transition-colors">Screenshots</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer" className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-2 rounded text-sm transition-colors">
              Download
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Manage all your Node.js projects<br />in one place
          </h1>
          <p className="text-lg text-[#9d9d9d] mb-10 max-w-2xl mx-auto leading-relaxed">
            A free, open-source desktop app that scans, organizes, and launches your Node.js projects. 
            Available for macOS, Windows, and Linux.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer" className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-6 py-3 rounded font-medium transition-colors">
              Download for Free
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="border border-[#444] hover:border-[#666] px-6 py-3 rounded font-medium transition-colors hover:text-white">
              View Source
            </a>
          </div>
        </div>
      </section>

      {/* Main Screenshot */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#252526] rounded-lg border border-[#333] shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333] bg-[#2d2d2d]">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
              <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
              <span className="ml-4 text-xs text-[#666]">Tafil — {screenshots[activeScreenshot].label}</span>
            </div>
            <img 
              src={screenshots[activeScreenshot].src} 
              alt={screenshots[activeScreenshot].label}
              className="w-full"
            />
          </div>
          
          {/* Thumbnail Navigation */}
          <div className="flex justify-center gap-3 mt-6">
            {screenshots.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveScreenshot(i)}
                className={`px-4 py-2 text-sm rounded transition-all ${
                  activeScreenshot === i 
                    ? 'bg-[#0e639c] text-white' 
                    : 'bg-[#333] text-[#888] hover:bg-[#444] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-[#252526]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-12 text-center">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Smart Scanning", desc: "Auto-detect all Node.js projects in any directory. Recognizes React, Vue, Next.js, Vite, Express, and more." },
              { title: "Collections", desc: "Organize projects into custom groups. Filter by client, framework, or priority." },
              { title: "One-Click Launch", desc: "Start dev servers instantly with automatic port detection and conflict resolution." },
              { title: "IDE Integration", desc: "Open projects in VS Code, Cursor, WebStorm, Sublime Text, or any editor." },
              { title: "Command Palette", desc: "Press ⌘K for quick search and actions. Keyboard-first navigation." },
              { title: "Cross-Platform", desc: "Native apps for macOS, Windows, and Linux. No Electron overhead visible." },
            ].map((f, i) => (
              <div key={i}>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[#9d9d9d] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Gallery */}
      <section id="screenshots" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-12 text-center">Screenshots</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {screenshots.map((s, i) => (
              <div 
                key={i} 
                className="bg-[#252526] rounded-lg border border-[#333] overflow-hidden hover:border-[#444] transition-colors cursor-pointer"
                onClick={() => setActiveScreenshot(i)}
              >
                <img src={s.src} alt={s.label} className="w-full" />
                <div className="px-4 py-3 border-t border-[#333]">
                  <p className="text-sm text-[#888]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="py-20 px-6 bg-[#252526]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Download</h2>
          <p className="text-center text-[#9d9d9d] mb-10">Free and open source. MIT License.</p>
          
          <div className="space-y-3">
            {[
              { os: "macOS", note: "Apple Silicon & Intel", icon: "🍎" },
              { os: "Windows", note: "64-bit installer & portable", icon: "⊞" },
              { os: "Linux", note: "AppImage, DEB, RPM", icon: "🐧" },
            ].map((item, i) => (
              <a 
                key={i}
                href={RELEASES_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-[#1e1e1e] border border-[#333] rounded hover:border-[#444] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-white font-medium">{item.os}</div>
                    <div className="text-sm text-[#666]">{item.note}</div>
                  </div>
                </div>
                <span className="text-[#0e639c] group-hover:text-[#1177bb] text-sm font-medium">Download →</span>
              </a>
            ))}
          </div>

          <p className="text-xs text-[#666] mt-6 text-center">
            macOS: Right-click → Open on first launch. Windows: Click "More info" → "Run anyway".
          </p>
        </div>
      </section>

      {/* Supported */}
      <section className="py-16 px-6 border-t border-[#333]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-[#666] mb-4">Works with</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-[#888]">
            {["React", "Vue", "Next.js", "Nuxt", "Vite", "Angular", "Express", "NestJS", "Remix", "Gatsby"].map(fw => (
              <span key={fw}>{fw}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#333] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#666]">
          <div className="flex items-center gap-6">
            <span>© 2025 Tafil</span>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Issues</a>
            <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Releases</a>
          </div>
          <span>GPL 2.0 License</span>
        </div>
      </footer>
    </div>
  );
}

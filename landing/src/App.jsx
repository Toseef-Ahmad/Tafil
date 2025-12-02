import { useState, useEffect } from "react";

// Premium hand-crafted landing page emphasizing problem-solution with Node.js green theme
export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Update these with your actual GitHub username
  const GITHUB_USERNAME = "Toseef-Ahmad";
  const REPO_NAME = "Tafil";
  const RELEASES_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/releases`;
  const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`;

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-green-600/40 to-green-400/40 blur-[150px] animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-green-500/30 to-green-300/30 blur-[140px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-green-400/20 to-green-200/20 blur-[120px] animate-pulse" style={{ animationDuration: "12s", animationDelay: "4s" }} />
        </div>
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-green-500/10 to-green-300/10 blur-[100px] pointer-events-none transition-all duration-200"
          style={{ left: mousePosition.x - 250, top: mousePosition.y - 250 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-6 md:px-10 py-4 relative z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 11 2-2-2-2"/>
                <path d="M11 13h4"/>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-green-400 to-white bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform">
              Tafil
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {['Features', 'Download', 'Docs', 'GitHub'].map(item => (
              <a 
                key={item} 
                href={item === 'GitHub' ? GITHUB_URL : `#${item.toLowerCase()}`}
                target={item === 'GitHub' ? '_blank' : undefined}
                rel={item === 'GitHub' ? 'noopener noreferrer' : undefined}
                className="text-neutral-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-green-500 to-green-300 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
        </div>
        <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
          <button className="bg-green-600 hover:bg-green-500 text-black rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
            Download
          </button>
        </a>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 mt-16 md:mt-24">
        {/* Pain Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-400/50 text-red-400 mb-6 text-sm animate-pulse">
          🔥 Spending hours juggling Node.js projects? Tafil fixes that.
        </div>

        {/* Hero Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] max-w-5xl">
          <span className="inline-block bg-gradient-to-br from-white via-white to-neutral-400 bg-clip-text text-transparent">Tired of juggling</span><br />
          <span className="inline-block bg-gradient-to-br from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">dozens of Node.js projects?</span><br />
          <span className="inline-block bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">Tafil organizes, launches, and monitors them all instantly.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mt-8 leading-relaxed">
          Stop wasting time switching folders, terminals, and IDEs. <span className="text-white font-semibold">Tafil</span> scans, groups, launches, and monitors all your Node.js projects from a single, clean, and lightning‑fast interface.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <div className="relative group" onMouseEnter={() => setIsHoveringCTA(true)} onMouseLeave={() => setIsHoveringCTA(false)}>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
            <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
              <button className="relative px-10 py-6 text-lg rounded-2xl bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 shadow-2xl border border-white/10 font-semibold hover:scale-105 active:scale-95 transition-all duration-300 text-black">
                Get Organized Now
                <span className={`ml-2 inline-block transition-transform ${isHoveringCTA ? 'translate-x-1' : ''}`}>→</span>
              </button>
            </a>
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <button className="px-10 py-6 text-lg rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              View on GitHub
            </button>
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full">
          {[
            { value: "10x", label: "Faster Project Access" },
            { value: "100%", label: "Cross-Platform" },
            { value: "0", label: "Dependencies" },
            { value: "∞", label: "Projects Managed" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 px-6 mt-32 md:mt-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-400/50 text-red-400 mb-4 text-sm">
              ❌ The Problem
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                Managing Node.js projects is a mess
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🤯", title: "Too Many Terminals", desc: "Dozens of terminal tabs, forgotten ports, lost processes" },
              { icon: "⏰", title: "Time Wasted", desc: "cd-ing into folders, checking ports, finding the right IDE" },
              { icon: "😵", title: "Total Chaos", desc: "No overview of what's running, which ports are used, or where projects are" }
            ].map((problem, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-neutral-900/50 border border-red-500/20 hover:border-red-500/40 backdrop-blur-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-3">{problem.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-red-400">{problem.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative z-10 px-6 mt-32 md:mt-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 border border-green-400/50 text-green-400 mb-4 text-sm">
              ✅ The Solution
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                One interface to rule them all
              </span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Tafil gives you a bird's-eye view of all your projects with instant access to everything
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🔍", title: "Smart Project Scanning", description: "Instantly find all Node.js projects in your system. Auto-detects React, Vite, Next.js, and more.", gradient: "from-emerald-500 to-green-600" },
              { icon: "📁", title: "Collections & Organization", description: "Group projects by client, framework, or priority. Drag & drop for instant organization.", gradient: "from-violet-500 to-purple-600" },
              { icon: "⚡", title: "One-Click Launch", description: "Run dev servers, open in your IDE, or launch terminals with a single click.", gradient: "from-blue-500 to-cyan-600" },
              { icon: "🎯", title: "Intelligent Port Management", description: "Auto-detects ports, handles conflicts, and manages multiple running projects seamlessly.", gradient: "from-amber-500 to-orange-600" }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-neutral-900/50 border border-white/10 hover:border-green-500/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className={`text-5xl mb-4 inline-block p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-10`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section id="features" className="relative z-10 px-6 mt-32 md:mt-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                Everything you need, nothing you don't
              </span>
            </h2>
          </div>
          
          <div className="space-y-6">
            {[
              { title: "Command Palette", shortcut: "⌘K", desc: "Lightning-fast search and actions. Find any project, run commands, switch views instantly." },
              { title: "Collections System", shortcut: "📁", desc: "Organize projects by client, framework, or any custom group. Drag & drop for instant categorization." },
              { title: "Running Projects Panel", shortcut: "▶️", desc: "See all active dev servers at a glance. Port numbers, frameworks, quick stop/open actions." },
              { title: "Project Insights", shortcut: "📊", desc: "Dependency status, git info, project health. Know everything about your projects instantly." },
              { title: "IDE Integration", shortcut: "💻", desc: "Auto-detects VS Code, Cursor, WebStorm, and more. Open projects with one click." },
              { title: "Smart Port Management", shortcut: "🔌", desc: "Auto-detects conflicts, suggests alternatives. No more 'port already in use' headaches." }
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-6 p-6 rounded-xl bg-neutral-900/30 border border-white/5 hover:border-green-500/30 backdrop-blur-xl transition-all duration-300 group hover:bg-neutral-900/50">
                <div className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-600/20 to-green-400/20 border border-green-500/20 group-hover:scale-110 transition-transform">
                  {feat.shortcut}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">{feat.title}</h3>
                  <p className="text-neutral-400">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Preview */}
      <section className="relative z-10 px-6 mt-32 md:mt-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                Beautiful. Fast. Powerful.
              </span>
            </h2>
            <p className="text-xl text-neutral-400">Designed to match the tools you love</p>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-green-400/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-neutral-900/50">
              <div className="aspect-video flex items-center justify-center text-neutral-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p>Screenshot coming soon</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-neutral-500 mt-6">
            Inspired by Linear, Raycast, Arc Browser, and Vercel
          </p>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="relative z-10 px-6 mt-32 md:mt-40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                Download for your platform
              </span>
            </h2>
            <p className="text-xl text-neutral-400">Free. Open source. No sign-up required.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { platform: "macOS", icon: "🍎", subtitle: "Apple Silicon & Intel" },
              { platform: "Windows", icon: "🪟", subtitle: "64-bit & Portable" },
              { platform: "Linux", icon: "🐧", subtitle: "AppImage, DEB, RPM" }
            ].map((os, i) => (
              <a key={i} href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
                <div className="group p-8 rounded-2xl bg-neutral-900/50 border border-white/10 hover:border-green-500/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 text-center cursor-pointer">
                  <div className="text-6xl mb-4">{os.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{os.platform}</h3>
                  <p className="text-sm text-neutral-400 mb-4">{os.subtitle}</p>
                  <div className="inline-flex items-center gap-2 text-green-400 text-sm font-medium group-hover:gap-3 transition-all">
                    Download <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-12 p-6 rounded-xl bg-amber-600/10 border border-amber-400/30">
            <p className="text-center text-amber-400/90 text-sm">
              ⚠️ First launch on macOS: Right-click → Open (unsigned app). This is normal for open-source projects.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative z-10 px-6 mt-32 md:mt-40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                Before vs. After Tafil
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="p-8 rounded-2xl bg-red-900/10 border border-red-500/20 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-6 text-red-400 flex items-center gap-2">
                <span>❌</span> Without Tafil
              </h3>
              <ul className="space-y-3">
                {[
                  "15 terminal tabs open",
                  "Manually cd into each project",
                  "Remember which port each runs on",
                  "Hunt for the IDE launcher",
                  "Forget which projects are running",
                  "Kill processes manually"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* After */}
            <div className="p-8 rounded-2xl bg-green-900/10 border border-green-500/30 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                <span>✓</span> With Tafil
              </h3>
              <ul className="space-y-3">
                {[
                  "One beautiful dashboard",
                  "Click to launch instantly",
                  "Auto port detection & handling",
                  "One click to open in VS Code",
                  "See all running projects live",
                  "Stop with one click"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-300">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 px-6 mt-32 md:mt-40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-12">
            <span className="bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
              Built with modern tools
            </span>
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              { name: "Electron", color: "#47848F" },
              { name: "React", color: "#61DAFB" },
              { name: "Tailwind CSS", color: "#06B6D4" },
              { name: "Node.js", color: "#339933" },
              { name: "Vite", color: "#646CFF" }
            ].map((tech, i) => (
              <div key={i} className="px-6 py-3 rounded-lg bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-all hover:scale-110">
                <span className="font-semibold" style={{ color: tech.color }}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 mt-32 md:mt-40 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative p-12 md:p-16 rounded-3xl bg-neutral-900/80 border border-green-500/30 backdrop-blur-xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-br from-white to-neutral-300 bg-clip-text text-transparent">
                  Stop juggling. Start building.
                </span>
              </h2>
              <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
                Join developers who've eliminated project management chaos and reclaimed hours every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
                  <button className="px-10 py-5 text-lg rounded-2xl bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 shadow-2xl font-semibold hover:scale-105 active:scale-95 transition-all duration-300 text-black">
                    Download Tafil Now
                  </button>
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  <button className="px-10 py-5 text-lg rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95">
                    View Source Code
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m7 11 2-2-2-2"/>
                    <path d="M11 13h4"/>
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  </svg>
                </div>
                <span className="font-bold text-lg">Tafil</span>
              </div>
              <p className="text-sm text-neutral-500">Modern project management for Node.js developers.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-sm text-neutral-400">Product</h4>
              <ul className="space-y-2 text-sm">
                {['Features', 'Download', 'Docs', 'Changelog'].map(item => (
                  <li key={item}><a href={`#${item.toLowerCase()}`} className="text-neutral-500 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-sm text-neutral-400">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">GitHub</a></li>
                <li><a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">Issues</a></li>
                <li><a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">Discussions</a></li>
                <li><a href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">Contributing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-sm text-neutral-400">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="mailto:ahmadtouseef946@gmail.com" className="text-neutral-500 hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
            <p>© 2024 Tafil. Built by <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">Touseef Ahmad</a></p>
            <p>MIT License • Open Source</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

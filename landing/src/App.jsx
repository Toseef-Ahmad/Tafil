import { useEffect, useState } from "react";

export default function App() {
  const GITHUB_USERNAME = "Toseef-Ahmad";
  const REPO_NAME = "Tafil";

  // Download page - hosted on Vercel
  const DOWNLOAD_URL = `https://download.tafil.app`; // Will be tafil-downloads.vercel.app initially
  
  const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`;
  const DOCS_URL = `https://tafil.app/docs/`;

  // Gumroad product URL - UPDATE THIS WITH YOUR ACTUAL PRODUCT URL
  const GUMROAD_URL = `https://toseefahmad.gumroad.com/l/tafil`;

  const PRIVACY_URL = `${GITHUB_URL}/blob/main/docs/reference/privacy.md`;
  const CONTACT_EMAIL = `ahmadtouseef946@gmail.com`;

  const screenshots = [
    {
      src: "/Tafil/screenshots/dashboard.png",
      label: "Dashboard",
      desc: "Every project on your machine — location, status, and state",
    },
    {
      src: "/Tafil/screenshots/collections.png",
      label: "Collections",
      desc: "Group projects by client, stack, or priority (without reorganizing folders)",
    },
    {
      src: "/Tafil/screenshots/insights.png",
      label: "Project Blueprint",
      desc: "Notes, tasks, diagrams, and context — stored with the project",
    },
  ];

  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveScreenshot((prev) => (prev + 1) % screenshots.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [screenshots.length]);

  const painBullets = [
    "How do I run this project again?",
    "Which port was this using?",
    "Which Node version did this need?",
    "Why is this project not starting anymore?",
    "Where did I write the notes for this?",
    "Which server did I deploy this to?",
    "Can I safely delete node_modules?",
  ];

  const pillars = [
    {
      number: "1",
      title: "Automatic Project Discovery",
      bullets: [
        "Scans your entire machine",
        "Detects Node.js, Next.js, and other projects",
        "No manual setup",
      ],
      example: "Tafil finds your projects even if you forgot where they live.",
    },
    {
      number: "2",
      title: "One-Click Run (No Guessing)",
      bullets: [
        "Auto-detects how to start a project",
        "Handles npm run dev / npm start automatically",
        "Resolves port conflicts automatically",
      ],
      example: "Click Run. Tafil figures out the rest.",
    },
    {
      number: "3",
      title: "Project Blueprint (The Missing Brain)",
      bullets: [
        "Modules",
        "Notes",
        "Tasks",
        "Diagrams (Excalidraw)",
        "Resources",
        "Editor & terminal inside project context",
      ],
      example: "Your project finally has memory.",
    },
    {
      number: "4",
      title: "Environment Awareness",
      bullets: [
        "Project location",
        "Dependency status",
        "Running status",
        "Node version",
        "Last Git commit",
      ],
      example: "No more guessing what state a project is in.",
    },
    {
      number: "5",
      title: "Dependency Control (Fear-Free)",
      bullets: [
        "Install missing dependencies automatically",
        "Safely remove dependencies to save disk space",
        "Restore anytime",
      ],
      example: "Delete dependencies without fear.",
    },
  ];

  const toolCompare = [
    { tool: "VS Code", does: "writes code", note: "Your editor stays your editor." },
    { tool: "Terminal", does: "runs commands", note: "You still have full control." },
    { tool: "GitHub", does: "stores repositories", note: "Remote is still remote." },
    {
      tool: "Tafil",
      does: "understands projects",
      note: "State, run, memory, and context — in one place.",
    },
  ];

  const audience = [
    "Freelancers",
    "Indie hackers",
    "Startup devs",
    "Solo founders",
    "Anyone with 5+ projects",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[520px] h-[520px] bg-amber-500/6 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 font-bold text-xl group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m7 11 2-2-2-2" />
                <path d="M11 13h4" />
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Tafil
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#screenshots" className="hover:text-amber-400 transition-colors">
              Screenshots
            </a>
            <a href="#pain" className="hover:text-amber-400 transition-colors">
              Pain
            </a>
            <a href="#what-it-does" className="hover:text-amber-400 transition-colors">
              What it does
            </a>
            <a href="#ssh" className="hover:text-amber-400 transition-colors">
              SSH
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              Pricing
            </a>
            <a href={DOCS_URL} className="hover:text-amber-400 transition-colors">
              Docs
            </a>
          </nav>
          
          <a 
            href={DOWNLOAD_URL}
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold px-5 py-2.5 rounded-full text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
          >
            Download Tafil
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        className={`relative z-10 py-20 md:py-32 px-6 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 text-zinc-300 px-5 py-2.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="font-mono text-amber-400">Tafil</span>
            <span className="text-zinc-600">•</span>
            <span>Project Command Center for Developers</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-white">All Your Projects.</span>{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              One Brain.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 mb-6 max-w-3xl mx-auto leading-relaxed">
            Tafil scans your entire computer, detects every project, and lets you run (or auto-run),
            document, clean, and manage them — fully offline.
          </p>

          <p className="text-base md:text-lg text-zinc-300 mb-10 max-w-3xl mx-auto">
            Tafil helps you manage, run, clean, and understand ALL your projects from one place — without replacing your IDE.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <a
                href={DOWNLOAD_URL}
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-8 py-4 rounded-2xl font-bold shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all"
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
                Download Tafil
                <span className="opacity-60 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
              <div className="text-xs text-zinc-500 mt-3">
                One-time purchase • Works offline • No subscription
              </div>
            </div>

            <a
              href="#what-it-does"
              className="flex items-center gap-3 border border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 backdrop-blur px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-800/50 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              See what it does
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-zinc-500">
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

      {/* Screenshots */}
      <section id="screenshots" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Screenshots</h2>
            <p className="text-zinc-400 text-lg">A command center view — not another editor.</p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="ml-4 text-sm text-zinc-500 font-medium font-mono">
                Tafil — {screenshots[activeScreenshot].label}
              </span>
            </div>
            
            <div className="relative bg-zinc-950">
              <img 
                src={screenshots[activeScreenshot].src} 
                alt={screenshots[activeScreenshot].label}
                className="w-full transition-opacity duration-500"
              />
              
              <div className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-zinc-700">
                <div className="font-semibold text-sm text-white">
                  {screenshots[activeScreenshot].label}
                </div>
                <div className="text-xs text-zinc-400">
                  {screenshots[activeScreenshot].desc}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-3 mt-8">
            {screenshots.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setActiveScreenshot(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeScreenshot === i 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20"
                    : "bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Pain */}
      <section id="pain" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Every Developer Knows This Pain
            </h2>
            <p className="text-zinc-400 text-lg">
              Not hard problems. Just constant context loss.
            </p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 p-8 md:p-10">
            <ul className="space-y-3 text-zinc-300">
              {painBullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-1 text-amber-400 font-mono">›</span>
                  <span className="text-lg md:text-xl">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-6 border-t border-zinc-800 text-center">
              <p className="text-zinc-400 text-lg italic">
                “Tafil exists because developers lose context — not code.”
              </p>
              </div>
          </div>
        </div>
      </section>

      {/* Section 2: What it does */}
      <section id="what-it-does" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tafil Understands Your Projects
            </h2>
            <p className="text-zinc-400 text-lg">
              Tafil helps you manage, run, clean, and understand ALL your projects from one
              place — without replacing your IDE.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {pillars.map((p) => (
              <div
                key={p.number}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400 font-mono flex items-center justify-center">
                    {p.number}
                  </span>
                  <h3 className="text-xl font-bold text-white">{p.title}</h3>
          </div>
          
                <ul className="space-y-2 text-zinc-300">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-1 text-zinc-600">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-zinc-800">
                  <p className="text-zinc-400 italic">“{p.example}”</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: SSH */}
      <section id="ssh" className="relative z-10 py-20 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Servers, Always One Click Away
            </h2>
            <p className="text-zinc-400 text-lg">
              SSH lives with your projects, not in random notes.
            </p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-white mb-3">Save SSH hosts</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-amber-400 font-mono">✓</span>
                    <span>Store host + username</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-amber-400 font-mono">✓</span>
                    <span>Store PEM key securely</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-amber-400 font-mono">✓</span>
                    <span>One-click connect</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-amber-400 font-mono">✓</span>
                    <span>Integrated terminal</span>
                  </li>
              </ul>
            </div>

              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 font-mono text-sm text-zinc-300">
                <div className="text-zinc-500 mb-2">$ ssh</div>
                <div>tafil ssh production-api</div>
                <div className="text-zinc-500 mt-4">
                  # No more copying SSH commands from old notes.
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
              <p className="text-zinc-400 italic">
                “No more copying SSH commands from old notes.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: What it is not */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tafil Does Not Replace Your Tools
            </h2>
            <p className="text-zinc-400 text-lg">
              It lives above them — so your projects stop leaking context.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {toolCompare.map((t) => (
              <div
                key={t.tool}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6"
              >
                <div className="text-white font-bold text-lg">{t.tool}</div>
                <div className="text-amber-400 font-mono mt-2">→ {t.does}</div>
                <div className="text-zinc-400 text-sm mt-3">{t.note}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-zinc-300 text-lg italic">
              “Tafil lives above your tools, not instead of them.”
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Who it's for */}
      <section className="relative z-10 py-20 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built For Developers Who Handle Many Projects
            </h2>
            <p className="text-zinc-400 text-lg">
              Freelance work. Side projects. Startup repos. Old client code. Experiments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {audience.map((a) => (
              <div
                key={a}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-mono">✓</span>
                  <span className="text-zinc-200 text-lg font-semibold">{a}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-zinc-400 text-lg italic">
              “If you only work on one project, you probably don’t need Tafil.”
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Offline & Privacy */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Local-First. Offline. Yours.
            </h2>
            <p className="text-zinc-400 text-lg">
              No cloud required. No tracking. No accounts.
            </p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 p-8 md:p-10">
            <ul className="grid md:grid-cols-2 gap-4 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-amber-400 font-mono">✓</span>
                <span>Works fully offline</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-amber-400 font-mono">✓</span>
                <span>No cloud required</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-amber-400 font-mono">✓</span>
                <span>No tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-amber-400 font-mono">✓</span>
                <span>No accounts</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
              <p className="text-zinc-300 text-lg italic">
                “Your projects never leave your machine.”
              </p>
              </div>
          </div>
        </div>
      </section>

      {/* Section 7: Pricing */}
      <section id="pricing" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">One-Time Purchase</h2>
            <p className="text-zinc-400 text-lg">
              Single license. Lifetime use. No subscription.
            </p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-zinc-800 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-bold mb-2">Tafil License</h3>
                <p className="text-zinc-400 mb-6">Buy once. Keep it. Use it offline.</p>
                
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> Single license
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> Lifetime use
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> Updates included while actively maintained
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> No subscription
                  </li>
                  <li className="flex items-center gap-3 text-zinc-300">
                    <span className="text-amber-400">✓</span> Works fully offline
                  </li>
                </ul>
              </div>

              <div className="flex-shrink-0 text-center">
                <a
                  href={GUMROAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold px-10 py-4 rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all"
                >
                  Buy on Gumroad
                  <span className="opacity-60">→</span>
                </a>
                
                <p className="text-xs text-zinc-500 mt-4">Secure checkout.</p>

                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  Download builds →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Realistic proof */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">No Hype. Just a Real Tool.</h2>
            <p className="text-zinc-400 text-lg">Built from day-to-day pain, not a pitch deck.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-7">
              <div className="text-amber-400 font-mono mb-2">FACT</div>
              <div className="text-zinc-200 text-lg font-semibold">
                Built by a developer frustrated with project chaos
              </div>
              <p className="text-zinc-400 mt-3">
                Tafil started as a personal command center for keeping many projects runnable
                and understandable.
              </p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-7">
              <div className="text-amber-400 font-mono mb-2">FACT</div>
              <div className="text-zinc-200 text-lg font-semibold">
                Used daily to manage dozens of real-world projects
              </div>
              <p className="text-zinc-400 mt-3">
                The goal is boring reliability: less setup archaeology, fewer broken runs,
                more shipped work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7 11 2-2-2-2" />
                  <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
            </div>
              <span className="font-semibold text-zinc-300">Tafil</span>
              <span className="text-zinc-600">© 2025</span>
          </div>
          
          <div className="flex items-center gap-8">
              <a href={DOCS_URL} className="hover:text-amber-400 transition-colors">
                Documentation
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-amber-400 transition-colors"
              >
                Contact
              </a>
              <a
                href={PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href={GUMROAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                Gumroad
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-amber-500">●</span>
              <span>Local-first</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
            Built by{" "}
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-amber-400 transition-colors"
            >
              a developer
            </a>
            <span className="mx-2">•</span>
            Runs on your machine. Works offline.
          </div>
        </div>
      </footer>
    </div>
  );
}



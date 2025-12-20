import { useEffect, useState } from "react";

export default function App() {
  const DOWNLOAD_URL = `https://download.tafil.app`;
  const GUMROAD_URL = `https://toseefahmad.gumroad.com/l/tafil`;
  const GITHUB_URL = `https://github.com/Toseef-Ahmad/Tafil`;
  const CONTACT_EMAIL = `ahmadtouseef946@gmail.com`;

  const [activeTab, setActiveTab] = useState('free');

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
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          
          <a 
            href={DOWNLOAD_URL}
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
              href={DOWNLOAD_URL}
              className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Free
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
              Buy Pro License - $49
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
                Need advanced features? Buy a Pro license ($49) — one-time payment, lifetime access.
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
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">$49</span>
                  <span className="text-zinc-500 line-through text-xl">$99</span>
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
                Buy Pro License - $49
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
                  <span>Not a subscription (one-time $49 for Pro)</span>
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
                Pay only if you want Pro features ($49 one-time).
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
              href={DOWNLOAD_URL}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xl px-12 py-5 rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Free
            </a>

            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-2 border-zinc-700 hover:border-purple-500 bg-zinc-900/50 backdrop-blur text-white font-semibold text-lg px-10 py-5 rounded-2xl hover:bg-zinc-800/50 transition-all"
            >
              Buy Pro License - $49
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


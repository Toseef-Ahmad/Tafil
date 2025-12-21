/**
 * TAFIL Privacy Policy Page (Redesigned to match new landing page)
 */

const CONFIG = {
  GITHUB_USERNAME: "Toseef-Ahmad",
  CONTACT_EMAIL: "tafil.help@gmail.com",
};

// Logo Component (matching new landing page)
function Logo({ size = 32, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        background: '#8b5cf6',
        borderRadius: 8,
      }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    </div>
  );
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white antialiased">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#1f1f23] bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-50">
          <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="font-bold text-lg text-[#fafafa]">TAFIL</span>
            </a>
            
            <a href="/" className="text-[#a1a1aa] hover:text-white text-sm transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
          </nav>
        </header>
        
        <main className="max-w-4xl mx-auto px-6 py-16">
          <article className="max-w-none">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-full text-sm text-[#a78bfa] mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Legal
              </div>
              <h1 className="text-4xl font-bold text-[#fafafa] mb-3">Privacy Policy</h1>
              <p className="text-[#71717a]">Last updated: December 20, 2024</p>
            </div>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                Our Commitment to Privacy
              </h2>
              <p className="text-[#a1a1aa] mb-4 leading-relaxed">
                TAFIL is built with privacy as a core principle. We believe your development workflow 
                and project data belong to you — not us, not the cloud.
              </p>
              <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-xl p-6">
                <p className="text-[#a78bfa] font-medium flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>The short version: TAFIL stores all your data locally on your machine. 
                  We don't collect, transmit, or store your project data, notes, or code.</span>
                </p>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                What Data Stays on Your Device
              </h2>
              <ul className="space-y-2 mb-4">
                {[
                  'All projects and project metadata',
                  'Markdown notes and documentation',
                  'Kanban boards and task lists',
                  'Blueprint diagrams and canvas data',
                  'Code playground snippets',
                  'SSH connection configurations (passwords/keys stored securely)',
                  'Application preferences and settings'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#a1a1aa]">
                    <span className="text-[#10b981] mt-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#a1a1aa] leading-relaxed">
                This data is stored in your system's application data directory and never leaves your machine.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                What We Collect (Minimal)
              </h2>
              <p className="text-[#a1a1aa] mb-4 leading-relaxed">
                When you purchase and activate a Pro license, we collect only what's necessary:
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  { label: 'Email address', desc: 'To deliver your license key and provide support' },
                  { label: 'License key', desc: 'To verify your Pro license status' },
                  { label: 'Device identifier', desc: "A hashed, anonymized ID to enforce device limits (not linked to personal info)" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#a1a1aa]">
                    <span className="text-[#8b5cf6] mt-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    </span>
                    <span><strong className="text-[#fafafa]">{item.label}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#a1a1aa] mb-4 leading-relaxed">
                We do <strong className="text-[#fafafa]">not</strong> collect:
              </p>
              <ul className="space-y-2">
                {[
                  'Your name (unless you voluntarily provide it)',
                  'Your IP address for tracking',
                  'Analytics or usage telemetry',
                  'Any content from your projects, notes, or code'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#a1a1aa]">
                    <span className="text-[#ef4444] mt-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                License Verification
              </h2>
              <p className="text-[#a1a1aa] mb-4 leading-relaxed">
                When you activate a Pro license, TAFIL makes a one-time connection to our license server:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'To verify your license key is valid',
                  'To register your device (anonymized device ID only)',
                  'To download a signed license certificate'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#a1a1aa]">
                    <span className="text-[#8b5cf6] mt-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#a1a1aa] leading-relaxed">
                After activation, TAFIL works completely offline. Periodic verification (every 14 days 
                if online) ensures your license hasn't been revoked, but failure to verify doesn't 
                block your work — you have a 30-day grace period.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                Third-Party Services
              </h2>
              <p className="text-[#a1a1aa] mb-4 leading-relaxed">We use the following third-party services:</p>
              <ul className="space-y-2">
                {[
                  { label: 'Gumroad', desc: 'Payment processing for Pro licenses. Their privacy policy applies to payment data.' },
                  { label: 'GitHub', desc: 'Software distribution and issue tracking.' },
                  { label: 'Vercel', desc: 'Hosting for our website and license server.' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#a1a1aa]">
                    <span className="text-[#8b5cf6] mt-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    </span>
                    <span><strong className="text-[#fafafa]">{item.label}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                Your Rights
              </h2>
              <p className="text-[#a1a1aa] mb-4 leading-relaxed">You have the right to:</p>
              <ul className="space-y-2 mb-4">
                {[
                  'Request access to the data we hold about you',
                  'Request deletion of your license data',
                  'Request a copy of your data in a portable format',
                  'Deactivate your license and remove device registrations'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#a1a1aa]">
                    <span className="text-[#8b5cf6] mt-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#a1a1aa] leading-relaxed">
                Contact us at{' '}
                <a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
                  {CONFIG.CONTACT_EMAIL}
                </a>{' '}
                for any privacy-related requests.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                Security
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                We use industry-standard security practices including RSA-4096 signature verification 
                for licenses, encrypted storage for sensitive local data, and HTTPS for all network 
                communications.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                Changes to This Policy
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                If we make significant changes to this policy, we'll notify users through the application 
                or via email. Minor clarifications may be made without notice.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                Contact
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                Questions about this privacy policy? Contact us at{' '}
                <a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
                  {CONFIG.CONTACT_EMAIL}
                </a>
              </p>
            </section>
          </article>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-[#1f1f23] py-8">
          <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Logo size={24} />
              <span className="font-bold text-[#fafafa]">TAFIL</span>
            </div>
            <p className="text-[#52525b] text-sm">© 2024 TAFIL. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm">
              <a href="/terms" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Terms</a>
              <a href="/privacy" className="text-[#a78bfa]">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

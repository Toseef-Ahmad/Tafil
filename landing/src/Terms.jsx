/**
 * TAFIL Terms of Service Page (Redesigned to match new landing page)
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

export default function Terms() {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Legal
              </div>
              <h1 className="text-4xl font-bold text-[#fafafa] mb-3">Terms of Service</h1>
              <p className="text-[#71717a]">Last updated: December 20, 2024</p>
            </div>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                1. Acceptance of Terms
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                By downloading, installing, or using TAFIL ("the Software"), you agree to be bound by 
                these Terms of Service. If you don't agree, don't use the Software.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                2. License Grant
              </h2>
              
              <h3 className="text-lg font-medium mt-6 mb-3 text-[#fafafa]">Free Version</h3>
              <p className="text-[#a1a1aa] leading-relaxed">
                The free version of TAFIL is provided under the MIT License. You may use, modify, 
                and distribute it according to that license.
              </p>
              
              <h3 className="text-lg font-medium mt-6 mb-3 text-[#fafafa]">Pro Version</h3>
              <p className="text-[#a1a1aa] mb-4 leading-relaxed">
                The Pro version requires a valid license key. When you purchase a Pro license:
              </p>
              <ul className="space-y-2">
                {[
                  'You receive a personal, non-transferable license',
                  'You may use the Software on up to 3 devices you own',
                  'The license is perpetual (no expiration) for the current major version',
                  'You receive all updates within the same major version',
                  'You may not share, resell, or sublicense your license key'
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
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                3. Restrictions
              </h2>
              <p className="text-[#a1a1aa] mb-4 leading-relaxed">You may not:</p>
              <ul className="space-y-2">
                {[
                  'Share, sell, or distribute license keys',
                  'Attempt to bypass license verification',
                  'Use the Software for illegal purposes',
                  'Reverse engineer the license verification system',
                  'Use the Software in a way that harms our infrastructure or other users'
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
                4. Refund Policy
              </h2>
              <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-6">
                <p className="text-[#6ee7b7] font-medium flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>We offer a <strong>30-day money-back guarantee</strong>. If TAFIL doesn't work for you, 
                  email us within 30 days of purchase for a full refund. No questions asked.</span>
                </p>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                5. Disclaimer of Warranties
              </h2>
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <p className="text-[#a1a1aa] text-sm leading-relaxed uppercase">
                  THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DO NOT WARRANT THAT 
                  THE SOFTWARE WILL BE ERROR-FREE, UNINTERRUPTED, OR MEET YOUR SPECIFIC REQUIREMENTS.
                </p>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                6. Limitation of Liability
              </h2>
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <p className="text-[#a1a1aa] text-sm leading-relaxed uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF 
                  THE SOFTWARE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                7. Your Data
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                You retain full ownership of all data you create with TAFIL. We do not claim any 
                rights to your projects, notes, code, or other content. Your data stays on your 
                device — we never have access to it.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                8. Support
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                Pro license holders receive priority email support. Free users can get help through 
                GitHub issues. We aim to respond within 48 hours for Pro users.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                9. Termination
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                We may revoke your license if you violate these terms. If your license is revoked 
                due to our decision (not a terms violation), you'll receive a full refund.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                10. Changes to Terms
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                We may update these terms. Continued use after changes means you accept the new terms. 
                We'll notify Pro users of significant changes via email.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-[#fafafa] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full"></span>
                11. Contact
              </h2>
              <p className="text-[#a1a1aa] leading-relaxed">
                Questions? Contact us at{' '}
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
              <a href="/terms" className="text-[#a78bfa]">Terms</a>
              <a href="/privacy" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

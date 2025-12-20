/**
 * TAFIL Terms of Service Page
 */

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/5 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
            ← Back to TAFIL
          </a>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <article className="prose prose-invert prose-zinc max-w-none">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-zinc-400 mb-8">Last updated: December 20, 2024</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-300">
              By downloading, installing, or using TAFIL ("the Software"), you agree to be bound by 
              these Terms of Service. If you don't agree, don't use the Software.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">2. License Grant</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Free Version</h3>
            <p className="text-zinc-300">
              The free version of TAFIL is provided under the MIT License. You may use, modify, 
              and distribute it according to that license.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Pro Version</h3>
            <p className="text-zinc-300 mb-4">
              The Pro version requires a valid license key. When you purchase a Pro license:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>You receive a personal, non-transferable license</li>
              <li>You may use the Software on up to 3 devices you own</li>
              <li>The license is perpetual (no expiration) for the current major version</li>
              <li>You receive all updates within the same major version</li>
              <li>You may not share, resell, or sublicense your license key</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">3. Restrictions</h2>
            <p className="text-zinc-300 mb-4">You may not:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Share, sell, or distribute license keys</li>
              <li>Attempt to bypass license verification</li>
              <li>Use the Software for illegal purposes</li>
              <li>Reverse engineer the license verification system</li>
              <li>Use the Software in a way that harms our infrastructure or other users</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">4. Refund Policy</h2>
            <p className="text-zinc-300">
              We offer a <strong>30-day money-back guarantee</strong>. If TAFIL doesn't work for you, 
              email us within 30 days of purchase for a full refund. No questions asked.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
            <p className="text-zinc-300">
              THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DO NOT WARRANT THAT 
              THE SOFTWARE WILL BE ERROR-FREE, UNINTERRUPTED, OR MEET YOUR SPECIFIC REQUIREMENTS.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-zinc-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF 
              THE SOFTWARE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">7. Your Data</h2>
            <p className="text-zinc-300">
              You retain full ownership of all data you create with TAFIL. We do not claim any 
              rights to your projects, notes, code, or other content. Your data stays on your 
              device — we never have access to it.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">8. Support</h2>
            <p className="text-zinc-300">
              Pro license holders receive priority email support. Free users can get help through 
              GitHub issues. We aim to respond within 48 hours for Pro users.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-zinc-300">
              We may revoke your license if you violate these terms. If your license is revoked 
              due to our decision (not a terms violation), you'll receive a full refund.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-zinc-300">
              We may update these terms. Continued use after changes means you accept the new terms. 
              We'll notify Pro users of significant changes via email.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
            <p className="text-zinc-300">
              Questions? Contact us at{' '}
              <a href="mailto:ahmadtouseef946@gmail.com" className="text-purple-400 hover:text-purple-300">
                ahmadtouseef946@gmail.com
              </a>
            </p>
          </section>
        </article>
      </main>
      
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>© 2024 TAFIL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


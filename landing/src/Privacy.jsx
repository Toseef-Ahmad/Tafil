/**
 * TAFIL Privacy Policy Page
 */

export default function Privacy() {
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-zinc-400 mb-8">Last updated: December 20, 2024</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment to Privacy</h2>
            <p className="text-zinc-300 mb-4">
              TAFIL is built with privacy as a core principle. We believe your development workflow 
              and project data belong to you — not us, not the cloud.
            </p>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
              <p className="text-purple-300 font-medium">
                📌 The short version: TAFIL stores all your data locally on your machine. 
                We don't collect, transmit, or store your project data, notes, or code.
              </p>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">What Data Stays on Your Device</h2>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>All projects and project metadata</li>
              <li>Markdown notes and documentation</li>
              <li>Kanban boards and task lists</li>
              <li>Blueprint diagrams and canvas data</li>
              <li>Code playground snippets</li>
              <li>SSH connection configurations (passwords/keys stored securely)</li>
              <li>Application preferences and settings</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              This data is stored in your system's application data directory and never leaves your machine.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">What We Collect (Minimal)</h2>
            <p className="text-zinc-300 mb-4">
              When you purchase and activate a Pro license, we collect only what's necessary:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong>Email address:</strong> To deliver your license key and provide support</li>
              <li><strong>License key:</strong> To verify your Pro license status</li>
              <li><strong>Device identifier:</strong> A hashed, anonymized ID to enforce device limits (not linked to personal info)</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              We do <strong>not</strong> collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Your name (unless you voluntarily provide it)</li>
              <li>Your IP address for tracking</li>
              <li>Analytics or usage telemetry</li>
              <li>Any content from your projects, notes, or code</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">License Verification</h2>
            <p className="text-zinc-300 mb-4">
              When you activate a Pro license, TAFIL makes a one-time connection to our license server:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>To verify your license key is valid</li>
              <li>To register your device (anonymized device ID only)</li>
              <li>To download a signed license certificate</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              After activation, TAFIL works completely offline. Periodic verification (every 14 days 
              if online) ensures your license hasn't been revoked, but failure to verify doesn't 
              block your work — you have a 30-day grace period.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-zinc-300 mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong>Gumroad:</strong> Payment processing for Pro licenses. Their privacy policy applies to payment data.</li>
              <li><strong>GitHub:</strong> Software distribution and issue tracking.</li>
              <li><strong>Vercel:</strong> Hosting for our website and license server.</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-zinc-300 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Request access to the data we hold about you</li>
              <li>Request deletion of your license data</li>
              <li>Request a copy of your data in a portable format</li>
              <li>Deactivate your license and remove device registrations</li>
            </ul>
            <p className="text-zinc-300 mt-4">
              Contact us at <a href="mailto:ahmadtouseef946@gmail.com" className="text-purple-400 hover:text-purple-300">ahmadtouseef946@gmail.com</a> for any privacy-related requests.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            <p className="text-zinc-300">
              We use industry-standard security practices including RSA-4096 signature verification 
              for licenses, encrypted storage for sensitive local data, and HTTPS for all network 
              communications.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-zinc-300">
              If we make significant changes to this policy, we'll notify users through the application 
              or via email. Minor clarifications may be made without notice.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-zinc-300">
              Questions about this privacy policy? Contact us at{' '}
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


import { useState, useEffect } from "react";

// ============================================================================
// TAFIL Blog - Individual Post Page (Redesigned to match new landing page)
// ============================================================================

// Configuration
const API_URL = "https://api.tafil.app";
const SITE_URL = "https://tafil.app";

const CONFIG = {
  GITHUB_USERNAME: "Toseef-Ahmad",
  REPO_NAME: "Tafil",
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

// Markdown Renderer (XSS Safe)
function MarkdownContent({ content }) {
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // Escape HTML to prevent XSS
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="language-${lang || 'text'}"><code>${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Blockquotes
    html = html.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)\n(?=<li>)/g, '$1');
    html = html.replace(/(<li>[\s\S]*?<\/li>)(?!\n<li>)/g, '<ul>$1</ul>');

    // Paragraphs
    html = html
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        if (/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div|table|p)/.test(para)) {
          return para;
        }
        return `<p>${para.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n');

    return html;
  };

  return (
    <div 
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}

export default function BlogPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get slug from URL
  const getSlug = () => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/blog/');
    return parts[1]?.replace(/\/$/, '') || '';
  };

  const slug = getSlug();

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) {
      setError('Post not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/blog/posts/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Post not found');
        } else {
          setError('Failed to load post');
        }
        return;
      }
      
      const data = await response.json();
      setPost(data);
      
      // Update page title
      document.title = `${data.title} | TAFIL Blog`;
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#71717a]">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">Loading post...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#fafafa] mb-2">{error}</h1>
          <p className="text-[#71717a] text-sm mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white antialiased">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#1f1f23] bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="font-bold text-lg text-[#fafafa]">TAFIL</span>
            </a>
            
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="/#features" className="text-[#a1a1aa] hover:text-white transition-colors">Features</a>
              <a href="/#pricing" className="text-[#a1a1aa] hover:text-white transition-colors">Pricing</a>
              <a href="/blog" className="text-[#8b5cf6] font-medium">Blog</a>
              <a href="/docs" className="text-[#a1a1aa] hover:text-white transition-colors">Docs</a>
              <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                GitHub
              </a>
            </div>
            
            <a href="/#download" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              Download
            </a>
          </nav>
        </header>

        <article>
          {/* Header */}
          <header className="pt-12 pb-8 px-6">
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-[#52525b] mb-6">
                <a href="/" className="hover:text-[#a1a1aa] transition-colors">Home</a>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <a href="/blog" className="hover:text-[#a1a1aa] transition-colors">Blog</a>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[#71717a] truncate max-w-[200px]">{post.title}</span>
              </nav>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <a
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-2.5 py-1 bg-[#8b5cf6]/10 text-[#a78bfa] text-xs font-medium rounded-md border border-[#8b5cf6]/20 hover:bg-[#8b5cf6]/20 transition-colors"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#fafafa] mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#71717a]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white text-sm font-semibold">
                    {post.author?.charAt(0) || 'T'}
                  </div>
                  <span className="text-[#a1a1aa]">{post.author}</span>
                </div>
                <span className="w-1 h-1 bg-[#3f3f46] rounded-full"></span>
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                <span className="w-1 h-1 bg-[#3f3f46] rounded-full"></span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.reading_time} min read
                </span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="px-6 pb-10">
              <div className="max-w-4xl mx-auto">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full rounded-xl border border-[#27272a]"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <MarkdownContent content={post.content} />
            </div>
          </div>

          {/* Footer */}
          <footer className="px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <div className="border-t border-[#1f1f23] pt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <a
                    href="/blog"
                    className="inline-flex items-center gap-2 text-[#a78bfa] hover:text-[#c4b5fd] font-medium text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Blog
                  </a>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[#52525b] text-sm">Share:</span>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#71717a] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#71717a] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${SITE_URL}/blog/${post.slug}`);
                      }}
                      className="p-2 text-[#71717a] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                      aria-label="Copy link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {/* CTA Section */}
          <section className="px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center">
                <div className="w-12 h-12 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#fafafa] mb-2">Ready to boost your productivity?</h2>
                <p className="text-[#a1a1aa] text-sm mb-6">Download TAFIL and experience the ultimate developer workspace.</p>
                <a
                  href="/#download"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Download Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </article>

        {/* Footer */}
        <footer className="border-t border-[#1f1f23] py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="md:col-span-1">
                <a href="/" className="flex items-center gap-2.5 mb-4">
                  <Logo size={28} />
                  <span className="font-bold text-[#fafafa]">TAFIL</span>
                </a>
                <p className="text-sm text-[#71717a] leading-relaxed">
                  The complete developer workspace for modern teams.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold text-[#fafafa] text-sm mb-4">Product</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="/#features" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Features</a></li>
                  <li><a href="/#pricing" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Pricing</a></li>
                  <li><a href="/#download" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Download</a></li>
                  <li><a href="/changelog" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Changelog</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-[#fafafa] text-sm mb-4">Resources</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="/docs" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Documentation</a></li>
                  <li><a href="/blog" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Blog</a></li>
                  <li><a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">GitHub</a></li>
                  <li><a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Support</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold text-[#fafafa] text-sm mb-4">Legal</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="/privacy" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Privacy</a></li>
                  <li><a href="/terms" className="text-[#71717a] hover:text-[#a1a1aa] transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#1f1f23]">
              <p className="text-sm text-[#52525b]">
                © 2024 TAFIL. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
                <a href={`mailto:${CONFIG.CONTACT_EMAIL}`} className="text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        /* Blog Content Styles - Updated to match new design */
        .blog-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #fafafa;
          margin-bottom: 1.25rem;
          margin-top: 2rem;
        }
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fafafa;
          margin-bottom: 1rem;
          margin-top: 1.75rem;
        }
        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #fafafa;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
        }
        .blog-content p {
          color: #a1a1aa;
          margin-bottom: 1.25rem;
          line-height: 1.75;
          font-size: 1rem;
        }
        .blog-content ul, .blog-content ol {
          color: #a1a1aa;
          margin-bottom: 1.25rem;
          margin-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }
        .blog-content code {
          background: #27272a;
          color: #a78bfa;
          padding: 0.125rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          border: 1px solid #3f3f46;
        }
        .blog-content pre {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          overflow-x: auto;
        }
        .blog-content pre code {
          background: transparent;
          padding: 0;
          color: #d4d4d8;
          border: none;
        }
        .blog-content blockquote {
          border-left: 3px solid #8b5cf6;
          padding-left: 1.25rem;
          font-style: italic;
          color: #71717a;
          margin: 1.25rem 0;
          background: #18181b;
          padding: 1rem 1.25rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .blog-content a {
          color: #a78bfa;
          text-decoration: underline;
          text-underline-offset: 2px;
          text-decoration-color: #8b5cf6/40;
        }
        .blog-content a:hover {
          color: #c4b5fd;
          text-decoration-color: #a78bfa;
        }
        .blog-content img {
          border-radius: 0.75rem;
          max-width: 100%;
          margin: 1.5rem 0;
          border: 1px solid #27272a;
        }
        .blog-content hr {
          border-color: #27272a;
          margin: 2rem 0;
        }
        .blog-content strong {
          color: #fafafa;
          font-weight: 600;
        }
        .blog-content em {
          color: #d4d4d8;
        }
      `}</style>
    </div>
  );
}

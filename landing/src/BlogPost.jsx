import { useState, useEffect } from "react";

// ============================================================================
// TAFIL Blog - Individual Post Page
// ============================================================================

// Configuration
const API_URL = "https://api.tafil.app";
const SITE_URL = "https://tafil.app";

const CONFIG = {
  GITHUB_USERNAME: "Toseef-Ahmad",
  REPO_NAME: "Tafil",
  CONTACT_EMAIL: "ahmadtouseef946@gmail.com",
};

// Logo Component
function Logo({ size = 32, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
      <path d="M10 12L14 16L10 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333ea" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
    </svg>
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
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-white mb-2">{error}</h1>
          <p className="text-zinc-400 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold"
          >
            ← Back to Blog
          </a>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white antialiased">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/[0.08] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/[0.06] rounded-full blur-[120px]"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-black/30 sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 font-bold text-lg">
              <Logo size={32} />
              <span className="text-white">TAFIL</span>
            </a>
            
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="/#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="/#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
              <a href="/blog" className="text-white">Blog</a>
              <a href="/#download" className="text-zinc-400 hover:text-white transition-colors">Download</a>
              <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.REPO_NAME}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">GitHub</a>
            </div>
            
            <a href="/#download" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">
              Download Free
            </a>
          </nav>
        </header>

        <article>
          {/* Header */}
          <header className="py-16 px-6">
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
                <a href="/" className="hover:text-white transition-colors">Home</a>
                <span>/</span>
                <a href="/blog" className="hover:text-white transition-colors">Blog</a>
                <span>/</span>
                <span className="text-zinc-400 truncate">{post.title}</span>
              </nav>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <a
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-500/20 transition-colors"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                    {post.author?.charAt(0) || 'T'}
                  </div>
                  <span>{post.author}</span>
                </div>
                <span className="text-zinc-600">•</span>
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                <span className="text-zinc-600">•</span>
                <span>{post.reading_time} min read</span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="px-6 pb-12">
              <div className="max-w-4xl mx-auto">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <MarkdownContent content={post.content} />
            </div>
          </div>

          {/* Footer */}
          <footer className="px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center justify-between">
                  <a
                    href="/blog"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    ← Back to Blog
                  </a>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-sm">Share:</span>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {/* CTA Section */}
          <section className="px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/5 border border-purple-500/20 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Ready to organize your dev workflow?</h2>
                <p className="text-zinc-400 mb-6">Get TAFIL and experience the ultimate developer command center.</p>
                <a
                  href="/#download"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold"
                >
                  Download Free
                </a>
              </div>
            </div>
          </section>
        </article>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Logo size={20} />
                <span className="font-bold text-white">TAFIL</span>
              </div>
              <p>© 2024 TAFIL. Built by <a href={`https://github.com/${CONFIG.GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Touseef Ahmad</a></p>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        /* Blog Content Styles */
        .blog-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          margin-top: 2.5rem;
        }
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          margin-top: 2rem;
        }
        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
        }
        .blog-content p {
          color: #a1a1aa;
          margin-bottom: 1.5rem;
          line-height: 1.75;
          font-size: 1.125rem;
        }
        .blog-content ul, .blog-content ol {
          color: #a1a1aa;
          margin-bottom: 1.5rem;
          margin-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }
        .blog-content code {
          background: #27272a;
          color: #a78bfa;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: 'JetBrains Mono', monospace;
        }
        .blog-content pre {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }
        .blog-content pre code {
          background: transparent;
          padding: 0;
          color: #d4d4d8;
        }
        .blog-content blockquote {
          border-left: 4px solid #a78bfa;
          padding-left: 1.5rem;
          font-style: italic;
          color: #71717a;
          margin: 1.5rem 0;
        }
        .blog-content a {
          color: #a78bfa;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .blog-content a:hover {
          color: #c4b5fd;
        }
        .blog-content img {
          border-radius: 0.75rem;
          max-width: 100%;
          margin: 2rem 0;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .blog-content hr {
          border-color: #27272a;
          margin: 2.5rem 0;
        }
        .blog-content strong {
          color: white;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}


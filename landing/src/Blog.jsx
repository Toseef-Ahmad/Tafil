import { useState, useEffect } from "react";

// ============================================================================
// TAFIL Blog - Listing Page
// ============================================================================

// Configuration
const API_URL = "https://api.tafil.app";

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

// Blog Post Card
function BlogCard({ post }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <a href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-500/20 rounded-xl overflow-hidden transition-all duration-300">
        {/* Cover Image */}
        {post.cover_image && (
          <div className="aspect-video bg-zinc-900 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          {/* Excerpt */}
          <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>{formatDate(post.published_at)}</span>
            <span>{post.reading_time} min read</span>
          </div>
        </div>
      </article>
    </a>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const POSTS_PER_PAGE = 12;

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [selectedTag, page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const tagParam = selectedTag ? `&tag=${encodeURIComponent(selectedTag)}` : '';
      const response = await fetch(
        `${API_URL}/api/blog/posts?limit=${POSTS_PER_PAGE}&offset=${page * POSTS_PER_PAGE}${tagParam}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setPosts(prev => page === 0 ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog/tags`);
      if (!response.ok) return;
      const data = await response.json();
      setTags(data.tags || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setPage(0);
  };

  // Set page title
  useEffect(() => {
    document.title = 'Blog | TAFIL - Developer Productivity & Project Management';
  }, []);

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

        <main>
          {/* Hero Section */}
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  The TAFIL Blog
                </span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Insights on developer productivity, project management, knowledge systems, and building your second brain.
              </p>
            </div>
          </section>

          {/* Tags Filter */}
          {tags.length > 0 && (
            <section className="px-6 pb-8">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleTagClick(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !selectedTag
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                        : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                    }`}
                  >
                    All Posts
                  </button>
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTag === tag
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                          : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Blog Posts Grid */}
          <section className="px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              {loading && posts.length === 0 ? (
                <div className="flex justify-center py-20">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading posts...
                  </div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="text-2xl font-bold text-white mb-2">No posts yet</h2>
                  <p className="text-zinc-400 mb-6">Check back soon for new content!</p>
                  <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold">
                    ← Back to Home
                  </a>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="flex justify-center mt-12">
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading}
                        className="px-8 py-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Load More Posts'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-6 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/5 border border-purple-500/20 rounded-2xl p-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to organize your dev workflow?</h2>
                <p className="text-zinc-400 mb-8">Download TAFIL and take control of your projects, notes, and plans.</p>
                <a href="/#download" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold">
                  Download Free
                </a>
              </div>
            </div>
          </section>
        </main>

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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}


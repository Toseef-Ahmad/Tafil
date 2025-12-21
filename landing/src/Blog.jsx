import { useState, useEffect } from "react";

// ============================================================================
// TAFIL Blog - Listing Page (Redesigned to match new landing page)
// ============================================================================

// Configuration
const API_URL = "https://api.tafil.app";

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

// Blog Post Card
function BlogCard({ post }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <a href={`/blog/${post.slug}`} className="group block">
      <article className="h-full bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#8b5cf6]/40 hover:shadow-lg hover:shadow-purple-500/5">
        {/* Cover Image */}
        {post.cover_image && (
          <div className="aspect-video bg-[#0c0c0e] overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="p-5">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-[#8b5cf6]/10 text-[#a78bfa] text-xs font-medium rounded-md border border-[#8b5cf6]/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h2 className="text-lg font-semibold text-[#fafafa] mb-2 group-hover:text-[#a78bfa] transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          {/* Excerpt */}
          <p className="text-[#71717a] text-sm mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          
          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-[#52525b]">
            <span>{formatDate(post.published_at)}</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.reading_time} min
            </span>
          </div>
        </div>
      </article>
    </a>
  );
}

// Featured Post Card (larger for first post)
function FeaturedCard({ post }) {
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
      <article className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#8b5cf6]/40 hover:shadow-xl hover:shadow-purple-500/10">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Cover Image */}
          {post.cover_image && (
            <div className="aspect-video md:aspect-auto bg-[#0c0c0e] overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )}
          
          <div className="p-8 flex flex-col justify-center">
            {/* Featured Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8b5cf6] text-white text-xs font-semibold rounded-md">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-[#8b5cf6]/10 text-[#a78bfa] text-xs font-medium rounded-md border border-[#8b5cf6]/20">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-[#fafafa] mb-3 group-hover:text-[#a78bfa] transition-colors line-clamp-2">
              {post.title}
            </h2>
            
            {/* Excerpt */}
            <p className="text-[#a1a1aa] text-base mb-6 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-[#71717a]">
              <span>{formatDate(post.published_at)}</span>
              <span className="w-1 h-1 bg-[#3f3f46] rounded-full"></span>
              <span>{post.reading_time} min read</span>
            </div>
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

  const featuredPost = posts.length > 0 && !selectedTag ? posts[0] : null;
  const regularPosts = featuredPost ? posts.slice(1) : posts;

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

        <main>
          {/* Hero Section */}
          <section className="pt-16 pb-12 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-full text-sm text-[#a78bfa] mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Developer Blog
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
                Insights & Updates
              </h1>
              <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
                Discover tips on developer productivity, project management best practices, and the latest TAFIL updates.
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      !selectedTag
                        ? 'bg-[#8b5cf6] text-white'
                        : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#3f3f46]'
                    }`}
                  >
                    All Posts
                  </button>
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTag === tag
                          ? 'bg-[#8b5cf6] text-white'
                          : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#3f3f46]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Blog Posts */}
          <section className="px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              {loading && posts.length === 0 ? (
                <div className="flex justify-center py-20">
                  <div className="flex items-center gap-3 text-[#71717a]">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm">Loading posts...</span>
                  </div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-[#fafafa] mb-2">No posts yet</h2>
                  <p className="text-[#71717a] mb-6 text-sm">Check back soon for new content!</p>
                  <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-medium text-sm transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                  </a>
                </div>
              ) : (
                <>
                  {/* Featured Post */}
                  {featuredPost && (
                    <div className="mb-10">
                      <FeaturedCard post={featuredPost} />
                    </div>
                  )}

                  {/* Regular Posts Grid */}
                  {regularPosts.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regularPosts.map(post => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}

                  {/* Load More */}
                  {hasMore && (
                    <div className="flex justify-center mt-12">
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading}
                        className="px-6 py-3 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#fafafa] rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Newsletter / CTA Section */}
          <section className="px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-10 text-center">
                <div className="w-12 h-12 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#fafafa] mb-2">Stay Updated</h2>
                <p className="text-[#a1a1aa] mb-6 text-sm max-w-md mx-auto">
                  Get the latest TAFIL updates, tips, and resources delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-[#0c0c0e] border border-[#27272a] rounded-lg text-[#fafafa] placeholder-[#52525b] text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
                  />
                  <button className="px-6 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

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

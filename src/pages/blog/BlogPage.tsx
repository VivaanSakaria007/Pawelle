import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { Search, Clock, ArrowRight, BookOpen, X, CheckCircle2, ArrowUpDown } from 'lucide-react';

type JournalSort = 'newest' | 'quickest';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<JournalSort>('newest');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const posts = dbStore.getBlogPosts(true);

  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category_id === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q) ||
        post.author_name.toLowerCase().includes(q) ||
        Boolean(post.category_name?.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'quickest') return a.read_time_minutes - b.read_time_minutes;
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const categories = [
    { id: 'all', label: 'All Chronicles' },
    { id: 'bcat-1', label: 'Coat Health & Science' },
    { id: 'bcat-2', label: 'Sensory Care & Welfare' }
  ];

  const handleGazetteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div>
      {/* Journal Header */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(56px, 7vw, 96px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>Atelier Chronicles &amp; Welfare Essays</div>
          <h1 className="editorial-headline" style={{ marginBottom: '20px' }}>
            The PAWELLE Journal: <em>Knowledge &amp; Craft</em>
          </h1>
          <p className="lead" style={{ marginInline: 'auto', maxWidth: '640px', color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
            Evidence-based perspectives on canine dermatology, low-stress behavioural handling, feline tranquility, and holistic botanical care from our Mayfair practitioners.
          </p>
        </div>
      </section>

      {/* Filter, Search & Editorial Controls Bar */}
      <section
        className="atelier-sticky-bar"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          paddingBlock: '20px',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }} role="group" aria-label="Journal category filters">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={isActive}
                  className={`filter-chip ${isActive ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input & Article Order */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '250px', flex: '1 1 250px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineStart: '16px',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                aria-label="Search journal topics"
                placeholder="Search journal topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-control"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    insetInlineEnd: '10px',
                    width: '24px',
                    height: '24px',
                    background: 'var(--color-bg-subtle)',
                    border: 'none',
                    borderRadius: '50%',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              <select
                aria-label="Order journal chronicles"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as JournalSort)}
                className="sort-select"
              >
                <option value="newest">Order: Latest Essays</option>
                <option value="quickest">Order: Quickest Read</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <BookOpen size={40} style={{ color: 'var(--color-sand)', marginBottom: '16px', marginInline: 'auto' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>No essays found matching your criteria</h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', marginInline: 'auto' }}>
                We could not locate chronicles matching your keyword. Please consider clearing your search or selecting all topics.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '20px' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div>
              {/* Featured Lead Article */}
              {featuredPost && (
                <div style={{ marginBottom: '64px' }}>
                  <div className="editorial-eyebrow" style={{ marginBottom: '16px' }}>Featured Atelier Chronicle</div>
                  <article
                    className="editorial-row"
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      padding: 'clamp(24px, 4vw, 48px)',
                      gap: 'clamp(32px, 5vw, 64px)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ flex: '1 1 440px' }}>
                      <div className="editorial-media-frame" style={{ borderRadius: 'var(--radius-md)', maxHeight: '420px', overflow: 'hidden' }}>
                        <img
                          src={featuredPost.cover_image_url}
                          alt={featuredPost.title}
                          style={{ width: '100%', height: '100%', maxHeight: '420px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="editorial-caption" style={{ marginTop: '12px' }}>
                        Plate IX &bull; Documentary Chronicle &bull; Mayfair Atelier
                      </div>
                    </div>

                    <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <span className="editorial-tag">{featuredPost.category_name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {featuredPost.read_time_minutes} min read
                        </span>
                      </div>

                      <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontFamily: 'var(--font-heading)', lineHeight: 1.25, marginBottom: '16px' }}>
                        <Link to={`/blog/${featuredPost.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                        {featuredPost.excerpt}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{featuredPost.author_name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{featuredPost.author_role}</div>
                        </div>

                        <Link
                          to={`/blog/${featuredPost.slug}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Read Full Essay <ArrowRight size={14} className="arrow-icon" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Remaining Articles */}
              {remainingPosts.length > 0 && (
                <div>
                  <div className="editorial-eyebrow" style={{ marginBottom: '24px' }}>Archive &amp; Further Reading</div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
                      gap: 'clamp(28px, 4vw, 40px)'
                    }}
                  >
                    {remainingPosts.map(post => (
                      <article
                        key={post.id}
                        className="card-surface"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--color-border)',
                          overflow: 'hidden',
                          padding: 0,
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <Link to={`/blog/${post.slug}`} style={{ height: '260px', overflow: 'hidden', display: 'block' }}>
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                          />
                        </Link>

                        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <span className="editorial-tag">{post.category_name}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={13} /> {post.read_time_minutes} min read
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-heading)', lineHeight: 1.3, marginBottom: '12px' }}>
                            <Link to={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {post.title}
                            </Link>
                          </h3>

                          <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                            {post.excerpt}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
                            <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                              By <strong>{post.author_name}</strong>
                            </div>
                            <Link
                              to={`/blog/${post.slug}`}
                              className="editorial-link"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}
                            >
                              Read Essay <ArrowRight size={14} className="arrow-icon" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Literary Newsletter Invitation */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>The Mayfair Gazette</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Receive Our Quarterly Seasonal Essays
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '520px', marginInline: 'auto', marginBottom: '28px', lineHeight: 1.6 }}>
            Subscribers receive unhurried musings on seasonal coat transitions, fear-free companion care techniques, and private invitations to atelier workshops.
          </p>
          {subscribed ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.925rem',
                fontWeight: 500
              }}
            >
              <CheckCircle2 size={18} /> Thank you for subscribing to The Mayfair Gazette.
            </div>
          ) : (
            <form
              onSubmit={handleGazetteSubmit}
              style={{
                display: 'flex',
                maxWidth: '460px',
                marginInline: 'auto',
                gap: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <input
                type="email"
                required
                aria-label="Email address for Mayfair Gazette"
                placeholder="Enter your personal email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="form-input"
                style={{ flex: '1 1 240px', borderRadius: 'var(--radius-pill)', paddingInline: '20px' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap' }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

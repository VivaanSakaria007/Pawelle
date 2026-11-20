import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const posts = dbStore.getBlogPosts(true);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category_id === selectedCategory;
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Journal Header */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(48px, 6vw, 72px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="section-kicker">Knowledge &amp; Craft</div>
          <h1 style={{ marginBottom: '20px' }}>The PAWELLE Pet Care Journal</h1>
          <p className="lead" style={{ marginInline: 'auto' }}>
            Evidence-based perspectives on canine dermatology, low-stress handling, feline wellness, and holistic coat care from our resident stylists.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ backgroundColor: 'var(--color-bg-surface)', paddingBlock: '20px', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            >
              All Articles
            </button>
            <button
              onClick={() => setSelectedCategory('bcat-1')}
              className={`btn btn-sm ${selectedCategory === 'bcat-1' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Coat Health
            </button>
            <button
              onClick={() => setSelectedCategory('bcat-2')}
              className={`btn btn-sm ${selectedCategory === 'bcat-2' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Seasonal Care
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search journal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingInlineStart: '38px', paddingBlock: '8px', fontSize: '0.875rem' }}
            />
            <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <BookOpen size={40} style={{ color: 'var(--color-sand)', marginBottom: '16px' }} />
              <h3>No articles found matching your criteria</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your search keywords or clearing your category filter.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '32px'
              }}
            >
              {filteredPosts.map(post => (
                <article
                  key={post.id}
                  className="card-surface"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    padding: 0
                  }}
                >
                  <div style={{ height: '240px', overflow: 'hidden' }}>
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span className="badge badge-sand">{post.category_name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {post.read_time_minutes} min read
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
                      <Link to={`/blog/${post.slug}`} style={{ color: 'inherit' }}>
                        {post.title}
                      </Link>
                    </h2>

                    <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', marginBottom: '20px', flex: 1 }}>
                      {post.excerpt}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
                      <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                        By <strong>{post.author_name}</strong>
                      </div>
                      <Link to={`/blog/${post.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 600 }}>
                        Read Article <ArrowRight size={14} className="arrow-icon" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

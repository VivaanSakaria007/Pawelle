import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = dbStore.getBlogPostBySlug(slug || '');

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = dbStore.getBlogPosts(true).filter(p => p.id !== post.id).slice(0, 2);

  return (
    <div>
      {/* Breadcrumb Bar */}
      <div style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', paddingBlock: '16px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
          <Link to="/blog" className="editorial-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Return to Atelier Journal
          </Link>
          <span style={{ color: 'var(--color-border-strong)' }}>/</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <article className="section" style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(48px, 6vw, 84px)' }}>
        <div className="container-narrow">
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span className="editorial-tag">{post.category_name}</span>
              <span style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {post.read_time_minutes} min read
              </span>
            </div>

            <h1 className="editorial-headline" style={{ marginBottom: '24px', lineHeight: 1.15 }}>
              {post.title}
            </h1>

            <p className="lead" style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '1.15rem', lineHeight: 1.65 }}>
              {post.excerpt}
            </p>

            {/* Author Byline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBlock: '20px', borderBlock: '1px solid var(--color-border)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-forest)',
                  color: 'var(--color-sand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1rem',
                  fontFamily: 'var(--font-serif)',
                  flexShrink: 0
                }}
              >
                {post.author_name.charAt(0)}
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: '0.975rem' }}>{post.author_name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontWeight: 500 }}>{post.author_role}</div>
              </div>

              <div style={{ marginInlineStart: 'auto', fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Cover Photo */}
          <div style={{ marginBottom: '48px' }}>
            <div className="editorial-media-frame" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <img
                src={post.cover_image_url}
                alt={post.title}
                style={{ width: '100%', maxHeight: '540px', objectFit: 'cover' }}
              />
            </div>
            <div className="editorial-caption">
              Plate XII • Mayfair Documentary Archive • Photographic Study of Companion Coat Physiology
            </div>
          </div>

          {/* Article Text */}
          <div
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.85,
              color: 'var(--color-text-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px'
            }}
          >
            {post.body.split('\n\n').map((paragraph, idx) => {
              if (idx === 1) {
                return (
                  <React.Fragment key={idx}>
                    <div className="editorial-quote">
                      "{paragraph.length > 160 ? paragraph.slice(0, 150) + '...' : paragraph}"
                    </div>
                    <p style={{ maxWidth: '100%', margin: 0 }}>{paragraph}</p>
                  </React.Fragment>
                );
              }
              return (
                <p key={idx} style={{ maxWidth: '100%', margin: 0 }}>
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Author Bio Box */}
          <div
            style={{
              marginTop: '56px',
              padding: '36px',
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div className="editorial-eyebrow">Resident Practitioner Profile</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', margin: 0 }}>{post.author_name}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: 500 }}>{post.author_role}</span>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
              Specialises in canine dermatological physiology, fear-free behavioural rehabilitation, and precision scissor sculpture. Trained across London and Tokyo ateliers; oversees ongoing practitioner education at PAWELLE Mayfair.
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/customer/booking" className="btn btn-secondary btn-sm">
                Reserve Appointment with {post.author_name.split(' ')[0]}
              </Link>
              <Link to="/contact" className="btn btn-ghost btn-sm">
                Request Coat Consultation
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
          <div className="container">
            <div className="editorial-eyebrow">Further Reading</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontFamily: 'var(--font-serif)', marginBottom: '32px' }}>
              From the PAWELLE Archive
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))', gap: '32px' }}>
              {relatedPosts.map(rel => (
                <article
                  key={rel.id}
                  className="card-surface"
                  style={{
                    padding: 0,
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '220px', overflow: 'hidden' }}>
                    <img
                      src={rel.cover_image_url}
                      alt={rel.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span className="editorial-tag" style={{ width: 'fit-content', marginBottom: '14px' }}>{rel.category_name}</span>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', marginBottom: '12px', lineHeight: 1.3 }}>
                      <Link to={`/blog/${rel.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {rel.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '20px', flex: 1, lineHeight: 1.6 }}>
                      {rel.excerpt}
                    </p>
                    <Link to={`/blog/${rel.slug}`} className="editorial-link" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Read chronicle &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

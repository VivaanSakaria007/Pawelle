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
      <div style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', paddingBlock: '14px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={14} /> Back to Journal
          </Link>
          <span style={{ color: 'var(--color-border-strong)' }}>/</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <article className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container-narrow">
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="badge badge-sand">{post.category_name}</span>
              <span style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {post.read_time_minutes} min read
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', marginBottom: '20px', lineHeight: 1.2 }}>
              {post.title}
            </h1>

            <p className="lead" style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              {post.excerpt}
            </p>

            {/* Author Byline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBlock: '16px', borderBlock: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{post.author_name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)' }}>{post.author_role}</div>
              </div>
              <div style={{ marginInlineStart: 'auto', fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Cover Photo */}
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '40px', boxShadow: 'var(--shadow-md)' }}>
            <img
              src={post.cover_image_url}
              alt={post.title}
              style={{ width: '100%', maxHeight: '520px', objectFit: 'cover' }}
            />
          </div>

          {/* Article Text */}
          <div
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--color-text-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {post.body.split('\n\n').map((paragraph, idx) => (
              <p key={idx} style={{ maxWidth: '100%', margin: 0 }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Author Bio Box */}
          <div
            style={{
              marginTop: '48px',
              padding: '32px',
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
              About the Author
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{post.author_name}</h3>
            <p style={{ fontSize: '0.925rem', margin: 0 }}>
              Specialises in canine dermatological health and fearful dog rehabilitation. Oversees training across PAWELLE’s London studios and advocates for compassionate pet care standards nationwide.
            </p>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '32px' }}>Related Journal Articles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {relatedPosts.map(rel => (
                <article key={rel.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <span className="badge badge-sand" style={{ width: 'fit-content', marginBottom: '12px' }}>{rel.category_name}</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                    <Link to={`/blog/${rel.slug}`} style={{ color: 'inherit' }}>
                      {rel.title}
                    </Link>
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '16px', flex: 1 }}>
                    {rel.excerpt}
                  </p>
                  <Link to={`/blog/${rel.slug}`} style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    Read article &rarr;
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { BlogPost } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, FileText, X } from 'lucide-react';

export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(() => dbStore.getBlogPosts(false));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('Clara Vance');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle('');
    setExcerpt('');
    setBody('');
    setAuthorName('Clara Vance');
    setCoverImageUrl('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80');
    setStatus('published');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: BlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setExcerpt(p.excerpt);
    setBody(p.body);
    setAuthorName(p.author_name);
    setCoverImageUrl(p.cover_image_url);
    setStatus(p.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingPost) {
      dbStore.updateBlogPost(editingPost.id, {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        body: body.trim(),
        author_name: authorName,
        cover_image_url: coverImageUrl,
        status
      });
      showToast(`Updated article: ${title}`);
    } else {
      dbStore.createBlogPost({
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        body: body.trim(),
        cover_image_url: coverImageUrl,
        author_name: authorName,
        author_role: 'Master Stylist',
        category_id: 'bcat-1',
        category_name: 'Coat Health',
        read_time_minutes: 5,
        status,
        published_at: new Date().toISOString()
      });
      showToast(`Published article: ${title}`);
    }

    setPosts(dbStore.getBlogPosts(false));
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    dbStore.deleteBlogPost(id);
    setPosts(dbStore.getBlogPosts(false));
    showToast('Article deleted.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Journal Articles Management</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Draft, edit, and publish clinical pet care advice, coat guides, and salon updates.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Write New Article
        </button>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {posts.map(post => (
          <div key={post.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-sand">{post.category_name}</span>
              <span className={`badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                {post.status.toUpperCase()}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{post.title}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0, flex: 1 }}>
              {post.excerpt}
            </p>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Author: <strong>{post.author_name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
              <button onClick={() => handleOpenEdit(post)} className="btn btn-secondary btn-sm">
                <Edit2 size={13} /> Edit
              </button>
              <button onClick={() => handleDelete(post.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 25, 22, 0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card-surface" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
                {editingPost ? `Edit "${editingPost.title}"` : 'Write Journal Article'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Article Body *</label>
                <textarea
                  rows={6}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Author Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

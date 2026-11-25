import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { useStoreSync } from '../../hooks/useStoreSync';
import { Star, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  useStoreSync();
  const reviews = dbStore.getReviews(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleApproval = (id: string, currentApproval: boolean) => {
    dbStore.setReviewApproved(id, !currentApproval);
    showToast(`Review ${!currentApproval ? 'approved and published' : 'unapproved'}.`);
  };

  const handleDelete = (id: string) => {
    dbStore.deleteReview(id);
    showToast('Review deleted.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Customer Reviews Moderation</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Moderate testimonials submitted by verified clients before displaying on the public homepage.
        </p>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
        {reviews.map(rev => (
          <div key={rev.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#B87A1E' }}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#B87A1E" />
                ))}
              </div>
              <span className={`badge ${rev.is_approved ? 'badge-success' : 'badge-warning'}`}>
                {rev.is_approved ? 'PUBLISHED' : 'PENDING APPROVAL'}
              </span>
            </div>

            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--color-text-primary)', margin: 0, flex: 1 }}>
              &ldquo;{rev.review_text}&rdquo;
            </p>

            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Client: <strong>{rev.customer_name}</strong> &bull; Pet: {rev.pet_name}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={() => handleToggleApproval(rev.id, rev.is_approved)}
                className={`btn ${rev.is_approved ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              >
                {rev.is_approved ? 'Unpublish' : 'Approve for Homepage'}
              </button>
              <button
                onClick={() => handleDelete(rev.id)}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-danger)' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

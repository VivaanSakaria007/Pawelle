import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { useAuth } from '../../features/authentication/AuthContext';
import { useStoreSync } from '../../hooks/useStoreSync';
import { ContactMessage } from '../../types';
import { MessageSquare, CheckCircle2, Archive, Reply, Send, Mail } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const { user } = useAuth();
  useStoreSync();
  const messages = dbStore.getContactMessages();
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateStatus = (id: string, newStatus: ContactMessage['status']) => {
    dbStore.updateContactMessageStatus(id, newStatus);
    showToast(`Inquiry marked as ${newStatus.toUpperCase()}`);
  };

  const handleOpenReply = (msg: ContactMessage) => {
    setReplyingId(msg.id);
    setReplyDraft(msg.reply_text || '');
  };

  const handleSendReply = (e: React.FormEvent, msg: ContactMessage) => {
    e.preventDefault();
    if (!replyDraft.trim()) return;
    dbStore.replyToContactMessage(msg.id, replyDraft, user?.full_name || 'Alexander Hawthorne');
    setReplyingId(null);
    setReplyDraft('');
    showToast(`Reply sent to ${msg.name}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Client Inquiries &amp; Messages</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Inbound communications received from the studio contact form.
        </p>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="card-surface" style={{ textAlign: 'center', padding: '48px' }}>
          <MessageSquare size={36} style={{ color: 'var(--color-sand)', marginBottom: '16px', marginInline: 'auto' }} />
          <h3>No Inquiries in Queue</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginInline: 'auto' }}>Customer inquiries from the contact form will arrive here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => {
            const isReplying = replyingId === msg.id;
            const badgeClass =
              msg.status === 'new'
                ? 'badge-terracotta'
                : msg.status === 'replied'
                  ? 'badge-success'
                  : msg.status === 'read'
                    ? 'badge-forest'
                    : 'badge-sand';

            return (
              <div
                key={msg.id}
                data-testid={`inquiry-card-${msg.id}`}
                className="card-surface"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ minWidth: 0, flex: '1 1 260px' }}>
                    <span className={`badge ${badgeClass}`} style={{ marginBottom: '8px' }}>
                      {msg.status.toUpperCase()}
                    </span>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{msg.subject}</h2>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px', overflowWrap: 'anywhere' }}>
                      From: <strong>{msg.name}</strong> ({msg.email}) {msg.phone ? `• ${msg.phone}` : ''}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => (isReplying ? setReplyingId(null) : handleOpenReply(msg))}
                      className="btn btn-primary btn-sm"
                    >
                      <Reply size={14} /> {msg.reply_text ? 'Edit Reply' : 'Reply'}
                    </button>
                    {msg.status === 'new' && (
                      <button type="button" onClick={() => handleUpdateStatus(msg.id, 'read')} className="btn btn-secondary btn-sm">
                        Mark as Read
                      </button>
                    )}
                    {msg.status !== 'archived' && (
                      <button type="button" onClick={() => handleUpdateStatus(msg.id, 'archived')} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <Archive size={14} /> Archive
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ backgroundColor: 'var(--color-bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', margin: 0, maxWidth: 'none' }}>
                  {msg.message}
                </p>

                {msg.reply_text && !isReplying && (
                  <div
                    data-testid={`inquiry-reply-${msg.id}`}
                    style={{
                      backgroundColor: 'var(--color-forest-soft)',
                      borderInlineStart: '3px solid var(--color-forest)',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                      <span>Replied by {msg.replied_by || 'PAWELLE Concierge'}</span>
                      {msg.replied_at && (
                        <span>{new Date(msg.replied_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text-primary)', maxWidth: 'none' }}>
                      {msg.reply_text}
                    </p>
                  </div>
                )}

                {isReplying && (
                  <form
                    onSubmit={(e) => handleSendReply(e, msg)}
                    style={{
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <label className="form-label" style={{ margin: 0 }}>
                      Reply to {msg.name} ({msg.email})
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      placeholder="Write your studio response regarding availability, coat care, or suite accommodations..."
                      className="form-textarea"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject}`)}&body=${encodeURIComponent(replyDraft)}`}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-forest)' }}
                      >
                        <Mail size={14} /> Open Email App
                      </a>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => setReplyingId(null)} className="btn btn-secondary btn-sm">
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          <Send size={14} /> Send Reply
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

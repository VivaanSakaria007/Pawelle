import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { ContactMessage } from '../../types';
import { MessageSquare, Mail, Phone, CheckCircle2, Archive } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(() => dbStore.getContactMessages());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateStatus = (id: string, newStatus: ContactMessage['status']) => {
    dbStore.updateContactMessageStatus(id, newStatus);
    setMessages(dbStore.getContactMessages());
    showToast(`Inquiry marked as ${newStatus.toUpperCase()}`);
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
          <MessageSquare size={36} style={{ color: 'var(--color-sand)', marginBottom: '16px' }} />
          <h3>No Inquiries in Queue</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Customer inquiries from the contact form will arrive here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => (
            <div key={msg.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span className={`badge ${msg.status === 'new' ? 'badge-terracotta' : msg.status === 'read' ? 'badge-forest' : 'badge-sand'}`} style={{ marginBottom: '6px' }}>
                    {msg.status.toUpperCase()}
                  </span>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{msg.subject}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    From: <strong>{msg.name}</strong> ({msg.email}) {msg.phone ? `&bull; ${msg.phone}` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {msg.status === 'new' && (
                    <button onClick={() => handleUpdateStatus(msg.id, 'read')} className="btn btn-secondary btn-sm">
                      Mark as Read
                    </button>
                  )}
                  {msg.status !== 'archived' && (
                    <button onClick={() => handleUpdateStatus(msg.id, 'archived')} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      <Archive size={14} /> Archive
                    </button>
                  )}
                </div>
              </div>

              <p style={{ backgroundColor: 'var(--color-bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', margin: 0 }}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

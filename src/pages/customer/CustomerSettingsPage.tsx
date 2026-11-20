import React, { useState } from 'react';
import { useAuth } from '../../features/authentication/AuthContext';
import { User, Phone, Mail, Lock, CheckCircle2 } from 'lucide-react';

export const CustomerSettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ full_name: fullName, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '640px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Account Settings</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Manage your personal details, concierge contact numbers, and notifications.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> Profile settings updated successfully.
        </div>
      )}

      {/* Profile Form */}
      <div className="card-surface" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Personal Information</h2>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || 'customer@pawelle.com'}
              className="form-input"
              style={{ opacity: 0.7, backgroundColor: 'rgba(0,0,0,0.03)' }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Mobile Phone (For booking SMS alerts)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              placeholder="+44 7946 0991"
            />
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Sanctuary Notification Preferences</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <span>Receive 24-hour appointment reminder emails</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
              />
              <span>Receive SMS confirmation when pet is ready for pickup</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', alignSelf: 'flex-start' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

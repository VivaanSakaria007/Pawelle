import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { SiteSettings } from '../../types';
import { Settings, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => dbStore.getSettings());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dbStore.updateSettings(settings);
    showToast('Studio operational settings updated.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '680px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Studio Configuration &amp; Policies</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Configure business coordinates, opening schedules, cancellation policies, and concierge links.
        </p>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      <div className="card-surface" style={{ padding: '32px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Brand Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Concierge Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Telephone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Flagship Studio Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Opening Hours</label>
            <input
              type="text"
              value={settings.opening_hours}
              onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">WhatsApp Concierge Link (digits only with country code)</label>
            <input
              type="text"
              value={settings.whatsapp_number || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="form-input"
              placeholder="+447946081200"
            />
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Booking Policies</div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Cancellation Policy Window (Hours)</label>
              <input
                type="number"
                min={0}
                value={settings.cancellation_window_hours}
                onChange={(e) => setSettings({ ...settings, cancellation_window_hours: Number(e.target.value) })}
                className="form-input"
                style={{ maxWidth: '200px' }}
              />
              <span className="form-hint">Clients can cancel without penalty up to this many hours prior.</span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              />
              <span>Activate Studio Maintenance Mode (Redirects public visitors to maintenance notice)</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '12px', alignSelf: 'flex-start' }}>
            Save Studio Settings
          </button>
        </form>
      </div>
    </div>
  );
};

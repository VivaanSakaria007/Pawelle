import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail } from 'lucide-react';
import { PawelleLogo } from '../../components/common/PawelleLogo';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <PawelleLogo height="48px" />
        </div>
        <span className="badge badge-sand" style={{ marginBottom: '16px' }}>
          Scheduled Sanctuary Enhancement
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>System Maintenance in Progress</h1>
        <p className="lead" style={{ marginInline: 'auto', marginBottom: '32px' }}>
          We are conducting scheduled infrastructure upgrades to ensure the highest security and speed for client records and bookings. We will return shortly.
        </p>

        <div className="card-surface" style={{ maxWidth: '440px', marginInline: 'auto', textAlign: 'start', padding: '24px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>Need immediate concierge assistance?</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            <Phone size={15} style={{ color: 'var(--color-forest)' }} />
            <span>Call +44 20 7946 0812</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            <Mail size={15} style={{ color: 'var(--color-forest)' }} />
            <span>Email concierge@pawelle.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

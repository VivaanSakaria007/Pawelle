import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ArrowLeft } from 'lucide-react';

export const ComingSoonPage: React.FC = () => {
  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <div className="section-kicker">
          <Sparkles size={16} /> Expanding Our Sanctuaries
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', marginBottom: '20px' }}>
          PAWELLE Kensington &amp; Marylebone Coming Soon
        </h1>
        <p className="lead" style={{ marginInline: 'auto', marginBottom: '32px' }}>
          We are currently handcrafting two new tranquil atelier studios in Kensington and Marylebone, complete with soundproof canine suites and dedicated feline quiet wings.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)', marginBottom: '36px' }}>
          <MapPin size={18} style={{ color: 'var(--color-terracotta)' }} />
          <span>Opening Autumn 2027 &bull; VIP Register Now Open</span>
        </div>

        <div>
          <Link to="/" className="btn btn-primary btn-lg">
            <ArrowLeft size={16} /> Return to Current London Studios
          </Link>
        </div>
      </div>
    </div>
  );
};

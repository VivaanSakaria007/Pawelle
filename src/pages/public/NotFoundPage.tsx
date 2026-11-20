import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-forest-soft)',
          color: 'var(--color-forest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginInline: 'auto',
          marginBottom: '20px'
        }}>
          <Compass size={36} />
        </div>
        <span className="badge badge-sand" style={{ marginBottom: '12px' }}>
          Error 404
        </span>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', marginBottom: '16px' }}>
          Page Not Found
        </h1>
        <p className="lead" style={{ marginInline: 'auto', marginBottom: '32px' }}>
          The path you are seeking seems to have wandered off like a curious puppy. Let us guide you back to familiar grounds.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <ArrowLeft size={16} /> Return to Home
          </Link>
          <Link to="/services" className="btn btn-secondary btn-lg">
            Browse Grooming Rituals
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PawelleLogo } from '../common/PawelleLogo';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-footer-bg)',
        color: 'var(--color-footer-text)',
        paddingTop: 'clamp(64px, 8vw, 96px)',
        paddingBottom: '36px',
        borderTop: '1px solid var(--color-footer-border)',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        {/* Main Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            marginBottom: '64px'
          }}
        >
          {/* Brand & Philosophy Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/" style={{ display: 'inline-block' }}>
              <PawelleLogo variant="dark" height="46px" />
            </Link>
            <p style={{ color: 'var(--color-footer-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              PAWELLE is a luxury pet grooming atelier and wellness sanctuary. We blend certified canine and feline behavioral science with artisanal styling and organic botanical therapies.
            </p>
          </div>

          {/* Quick Links Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-footer-text)', fontSize: '1.2rem', margin: 0 }}>
              The Sanctuary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/about" style={{ color: 'var(--color-footer-text-secondary)', fontSize: '0.925rem' }}>
                Our Story &amp; Philosophy
              </Link>
              <Link to="/services" style={{ color: 'var(--color-footer-text-secondary)', fontSize: '0.925rem' }}>
                Services
              </Link>
              <Link to="/pricing" style={{ color: 'var(--color-footer-text-secondary)', fontSize: '0.925rem' }}>
                Pricing &amp; Spa Memberships
              </Link>
              <Link to="/shop" style={{ color: 'var(--color-footer-text-secondary)', fontSize: '0.925rem' }}>
                Apothecary &amp; Organic Salves
              </Link>
              <Link to="/blog" style={{ color: 'var(--color-footer-text-secondary)', fontSize: '0.925rem' }}>
                The Pet Care Journal
              </Link>
              <Link to="/customer/booking" style={{ color: 'var(--color-footer-text-secondary)', fontSize: '0.925rem' }}>
                Reserve a Private Session
              </Link>
            </div>
          </div>

          {/* Flagship Locations & Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-footer-text)', fontSize: '1.2rem', margin: 0 }}>
              Studios &amp; Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.925rem', color: 'var(--color-footer-text-secondary)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} style={{ color: 'var(--color-terracotta)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-footer-text-secondary)', fontWeight: 600 }}>Mayfair Flagship</strong><br />
                  42 South Audley Street, London W1K 2PS
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Clock size={18} style={{ color: 'var(--color-footer-text-muted)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  Mon–Sat: 08:30 – 18:30<br />
                  Sunday: 10:00 – 16:00
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Phone size={18} style={{ color: 'var(--color-footer-text-muted)', flexShrink: 0, marginTop: '2px' }} />
                <div>+44 20 7946 0812</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Mail size={18} style={{ color: 'var(--color-footer-text-muted)', flexShrink: 0, marginTop: '2px' }} />
                <div>concierge@pawelle.com</div>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-footer-text)', fontSize: '1.2rem', margin: 0 }}>
              The PAWELLE Gazette
            </h4>
            <p style={{ color: 'var(--color-footer-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              Receive seasonal coat care wisdom, invitations to wellness events, and early booking notifications.
            </p>
            {subscribed ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'rgba(75, 168, 115, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-footer-text)',
                fontSize: '0.9rem'
              }}>
                <CheckCircle2 size={18} style={{ color: '#4BA873' }} />
                Thank you for subscribing to our Gazette.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      paddingInlineEnd: '48px',
                      backgroundColor: 'var(--color-footer-input-bg)',
                      border: '1px solid var(--color-footer-border)',
                      borderRadius: 'var(--radius-pill)',
                      color: 'var(--color-footer-text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      insetInlineEnd: '4px',
                      bottom: '4px',
                      width: '36px',
                      backgroundColor: 'var(--color-terracotta)',
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-footer-text-muted)' }}>
                  We respect your privacy. No spam, ever.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid var(--color-footer-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.825rem',
            color: 'var(--color-footer-text-muted)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} PAWELLE Pet Grooming &amp; Spa Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/about" style={{ color: 'var(--color-footer-text-muted)' }}>Privacy Policy</Link>
            <Link to="/about" style={{ color: 'var(--color-footer-text-muted)' }}>Terms of Service</Link>
            <Link to="/pricing" style={{ color: 'var(--color-footer-text-muted)' }}>Cancellation Policy</Link>
            <Link to="/coming-soon" style={{ color: 'var(--color-footer-text-muted)' }}>Locations Expansion</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Check,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Droplets,
  Heart
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const services = dbStore.getServices(true);

  const memberships = [
    {
      title: 'The Silver Paws Club',
      price: '£79',
      period: 'per month',
      desc: 'Designed for short-to-medium coat companions needing regular sensory and hygienic upkeep.',
      perks: [
        '1x Royal Botanical Bath & Fluff Blow-Dry per month',
        'Unlimited complimentary claw clipping & smooth electric filing',
        '10% boutique apothecary discount on all organic salves',
        'Priority access to weekend and holiday reservation slots'
      ]
    },
    {
      title: 'The Haute Atelier Circle',
      price: '£145',
      badge: 'Bespoke Luxury',
      period: 'per month',
      desc: 'Comprehensive monthly full scissor styling, hydrotherapy, and skin microbiome conditioning.',
      perks: [
        '1x Full Artisanal Scissor Haircut & Spa Ritual per month',
        'Complimentary mid-month bath & facial hydrosol touch-up',
        'Free Dead Sea mineral mud therapy upgrade every quarter',
        '15% boutique apothecary discount across all botanical tools',
        'Dedicated master stylist reservation guarantee'
      ]
    }
  ];

  return (
    <div>
      {/* 1. Page Header Banner */}
      <section
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          paddingTop: 'clamp(56px, 7vw, 92px)',
          paddingBottom: 'clamp(48px, 6vw, 76px)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '16px' }}>
            Transparent Investment &bull; Zero Hidden Add-Ons
          </div>

          <h1 className="editorial-headline" style={{ marginBottom: '20px' }}>
            Pricing &amp; Spa <br />
            <span className="font-serif-italic">Club Memberships.</span>
          </h1>

          <p className="lead" style={{ marginInline: 'auto', color: 'var(--color-text-secondary)', maxWidth: '60ch' }}>
            We believe in complete pricing transparency. Our session rates include unhurried one-on-one attention, organic British botanicals, ear hygiene, and claw filing &mdash; with zero hidden upcharges.
          </p>
        </div>
      </section>

      {/* 2. Spa Memberships Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Continuous Sanctuary
            </div>
            <h2>The PAWELLE Club Memberships</h2>
            <p style={{ marginInline: 'auto', color: 'var(--color-text-secondary)' }}>
              For devoted pet parents seeking to maintain optimal coat health, skin comfort, and emotional tranquility through scheduled regular visits.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: '36px',
              maxWidth: '920px',
              marginInline: 'auto'
            }}
          >
            {memberships.map((m, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: m.badge ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                  padding: '40px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {m.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      insetInlineEnd: '24px',
                      backgroundColor: 'var(--color-terracotta)',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '4px 14px',
                      borderRadius: 'var(--radius-pill)'
                    }}
                  >
                    {m.badge}
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{m.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-forest)' }}>
                      {m.price}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{m.period}</span>
                  </div>
                  <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', marginTop: '10px', marginBottom: 0, lineHeight: 1.6 }}>
                    {m.desc}
                  </p>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '20px' }} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                    Club Entitlements:
                  </div>
                  {m.perks.map((perk, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem' }}>
                      <Check size={16} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/customer/booking"
                  className={`btn ${m.badge ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Apply for Club Membership
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Complete A La Carte Service Menu */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', marginInline: 'auto', textAlign: 'center', marginBottom: '48px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Individual Menu
            </div>
            <h2>Full A La Carte Treatment Ledger</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Standard rates calibrated for standard breed weight brackets. Transparent price confirmation is always established prior to the start of each session.
            </p>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ritual / Treatment</th>
                  <th>Classification</th>
                  <th>Duration</th>
                  <th>Suitable Companions</th>
                  <th>Starting Investment</th>
                  <th style={{ textAlign: 'end' }}>Reserve</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/services/${s.slug}`} style={{ color: 'inherit' }}>
                        {s.name}
                      </Link>
                    </td>
                    <td>
                      <span className="editorial-tag" style={{ fontSize: '0.72rem' }}>{s.category_name}</span>
                    </td>
                    <td>{s.duration_minutes} mins</td>
                    <td>{s.eligible_pet_types.join(' & ')}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-forest)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>
                      &pound;{s.base_price}
                    </td>
                    <td style={{ textAlign: 'end' }}>
                      <Link
                        to={`/customer/booking?service=${s.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '5px 14px', fontSize: '0.775rem' }}
                      >
                        Book
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. The PAWELLE Pricing Creed */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Our Pricing Creed
            </div>
            <h2>What is always included in every PAWELLE session</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '32px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', borderLeft: '1px solid var(--color-border)' }}>
              <ShieldCheck size={24} style={{ color: 'var(--color-forest)' }} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Zero Surcharges for Premium Wash</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Every companion receives our highest-grade organic chamomile and colloidal oat formulation. We never charge extra for &ldquo;upgraded&rdquo; shampoo.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', borderLeft: '1px solid var(--color-border)' }}>
              <Heart size={24} style={{ color: 'var(--color-terracotta)' }} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Hygienic Care Always Standard</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Claw clipping, electric smoothing, ear canal hydrosol cleansing, and paw pad moisturising are integral to our treatments &mdash; never billed as add-ons.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', borderLeft: '1px solid var(--color-border)' }}>
              <Clock size={24} style={{ color: 'var(--color-forest)' }} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Unbroken Stylist Dedication</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Your pet receives the devoted, uninterrupted focus of a master practitioner. No waiting in crates, no simultaneous juggling of multiple animals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Reservation CTA */}
      <section
        style={{
          backgroundColor: 'var(--color-cta-bg)',
          color: 'var(--color-cta-text)',
          borderTop: '1px solid var(--color-cta-border)',
          borderBottom: '1px solid var(--color-cta-border)',
          paddingBlock: 'clamp(64px, 8vw, 96px)',
          textAlign: 'center'
        }}
      >
        <div className="container-narrow">
          <div className="editorial-eyebrow" style={{ color: 'var(--color-terracotta)', marginBottom: '16px' }}>
            Book Your Session
          </div>
          <h2 style={{ color: 'var(--color-cta-text)', fontSize: 'clamp(2.1rem, 4vw, 3.2rem)', marginBottom: '20px' }}>
            Ready to schedule a sanctuary visit?
          </h2>
          <p style={{ color: 'var(--color-cta-text-muted)', marginInline: 'auto', marginBottom: '32px', fontSize: '1.15rem', maxWidth: '58ch' }}>
            Our Mayfair and Chelsea salons reserve strictly limited daily slots. Choose your preferred service and receive instant booking confirmation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/customer/booking" className="btn btn-terracotta btn-lg">
              <Calendar size={18} /> Reserve an Appointment
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ color: 'var(--color-cta-text)', borderColor: 'var(--color-cta-border)' }}>
              Contact Atelier Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

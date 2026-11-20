import React from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Check,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const services = dbStore.getServices(true);

  const memberships = [
    {
      title: 'The Silver Paws Club',
      price: '£79',
      period: 'per month',
      desc: 'Designed for short-to-medium coat breeds needing monthly hygiene refreshes.',
      perks: [
        '1x Royal Botanical Bath & Fluff Blow-Dry per month',
        'Unlimited complimentary claw clipping & filing',
        '10% boutique apothecary discount on all salves',
        'Priority weekend booking slots'
      ]
    },
    {
      title: 'The Haute Atelier Circle',
      price: '£145',
      badge: 'Bespoke Luxury',
      period: 'per month',
      desc: 'Comprehensive monthly full scissor styling and skin conditioning.',
      perks: [
        '1x Full Artisanal Scissor Haircut & Spa Ritual per month',
        'Complimentary mid-month bath & facial touch-up',
        'Free Dead Sea mineral mud upgrade each quarter',
        '15% boutique apothecary discount',
        'Dedicated master stylist reservation guarantee'
      ]
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(48px, 6vw, 72px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="section-kicker">Transparent Investment</div>
          <h1 style={{ marginBottom: '20px' }}>Pricing &amp; Spa Memberships</h1>
          <p className="lead" style={{ marginInline: 'auto' }}>
            We believe in complete pricing transparency. Our session fees include unhurried one-on-one attention, organic British botanicals, ear hygiene, and claw filing with zero hidden add-on surprises.
          </p>
        </div>
      </section>

      {/* Spa Memberships Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-kicker">Continuous Wellness</div>
            <h2>The PAWELLE Sanctuary Memberships</h2>
            <p style={{ marginInline: 'auto' }}>
              For pet parents who wish to maintain peak coat health and emotional calm with regular, scheduled rituals.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              maxWidth: '900px',
              marginInline: 'auto'
            }}
          >
            {memberships.map((m, i) => (
              <div
                key={i}
                className="card-surface"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: m.badge ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                  position: 'relative'
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
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)'
                    }}
                  >
                    {m.badge}
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{m.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', minHeight: '44px' }}>
                    {m.desc}
                  </p>
                  <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-forest)' }}>
                    {m.price}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{m.period}</div>
                </div>

                <div style={{ flex: 1, marginBottom: '28px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '12px' }}>
                    Membership Privileges:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {m.perks.map((perk, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
                        <Check size={16} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/booking" className={`btn ${m.badge ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  Inquire for Membership
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Service Menu & Table */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-kicker">Individual Menu</div>
            <h2>Full A La Carte Service Menu</h2>
            <p style={{ marginInline: 'auto' }}>
              Base rates calibrated for standard breed weight classes. Detailed price confirmations are provided prior to the start of each session.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'start' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'start' }}>
                    Ritual / Treatment
                  </th>
                  <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'start' }}>
                    Duration
                  </th>
                  <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'start' }}>
                    Suitable For
                  </th>
                  <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'start' }}>
                    Starting Rate
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'end' }}></th>
                </tr>
              </thead>
              <tbody>
                {services.map((s, idx) => (
                  <tr key={s.id} style={{ borderBottom: idx < services.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                        <Link to={`/services/${s.slug}`} style={{ color: 'inherit' }}>
                          {s.name}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                        {s.short_description || s.description.substring(0, 70) + '...'}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {s.duration_minutes} min
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span className="badge badge-sand">{s.eligible_pet_types.join(' & ')}</span>
                    </td>
                    <td style={{ padding: '20px 24px', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-forest)' }}>
                      £{s.base_price}
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'end' }}>
                      <Link to={`/booking?service=${s.id}`} className="btn btn-primary btn-sm">
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
    </div>
  );
};

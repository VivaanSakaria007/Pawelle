import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Check,
  Heart,
  Droplets,
  Star,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';

export const Homepage2: React.FC = () => {
  const staff = dbStore.getStaff();
  const [activeTab, setActiveTab] = useState<'all' | 'dog' | 'cat'>('all');

  const packages = [
    {
      name: 'Essential Refresh',
      price: '£85',
      tagline: 'Ideal for frequent maintenance between major seasonal trims',
      inclusions: [
        'Wild chamomile hydro-bath',
        'Warm gentle fluff dry',
        'Full hygienic brush out',
        'Ear cleansing with herbal hydrosols',
        'Paw pad moisture treatment'
      ],
      exclusions: ['Scissor haircut shaping', 'Mineral mud treatment'],
      recommendedFor: 'Short to medium coats, monthly upkeep'
    },
    {
      name: 'Signature Atelier Spa',
      price: '£130',
      badge: 'Most Popular',
      tagline: 'Comprehensive aesthetic sculpting with restorative coat conditioning',
      inclusions: [
        'Everything in Essential Refresh',
        'Custom hand-scissor silhouette sculpt',
        'Sanitary area precision trim',
        'Smooth electric claw filing',
        'Face & muzzle styling'
      ],
      exclusions: ['Sedation (never used)'],
      recommendedFor: 'Doodles, Poodles, Cocker Spaniels, Bichons'
    },
    {
      name: 'Holistic Skin & Fur Detox',
      price: '£165',
      tagline: 'Therapeutic dermatological immersion for sensitive or seasonal shedding pets',
      inclusions: [
        'Everything in Signature Atelier',
        'Dead Sea mineral mud wrap (26 minerals)',
        'Hydro-ozone bubble massage',
        'Deep deshedding undercoat release',
        'Protective nose & paw pad salve'
      ],
      exclusions: [],
      recommendedFor: 'Double-coated breeds, allergy-prone skin'
    }
  ];

  return (
    <div>
      {/* 1. Distinct Niche Hero Composition: Full-width editorial banner with split dual-focus */}
      <section
        style={{
          backgroundColor: 'var(--color-sand-soft)',
          paddingBlock: 'clamp(56px, 8vw, 100px)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px', marginInline: 'auto', textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge badge-forest" style={{ marginBottom: '16px' }}>
              Specialized Feline &amp; Canine Wellness Sanctuary
            </span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', marginBottom: '24px' }}>
              Dedicated sanctuary suites tailored for canine and feline needs.
            </h1>
            <p className="lead" style={{ marginInline: 'auto', marginBottom: '32px' }}>
              Unlike mixed-species salons that generate anxiety, PAWELLE features soundproofed canine suites and a strictly isolated feline sanctuary where gentle hands bring peace.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-primary btn-lg">
                <Calendar size={18} /> Reserve a Suite
              </Link>
              <Link to="/pricing" className="btn btn-secondary btn-lg">
                Compare Packages
              </Link>
            </div>
          </div>

          {/* Dual Category Spotlight Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px'
            }}
          >
            {/* Dog Grooming Atelier */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1000&q=80"
                  alt="Canine hydrotherapy bath"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span className="badge badge-terracotta" style={{ width: 'fit-content', marginBottom: '12px' }}>
                  Canine Atelier
                </span>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Precision Canine Styling &amp; Mud Therapy</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', flex: 1 }}>
                  From meticulous breed-standard scissor cuts to therapeutic Dead Sea mineral soaks, our dog suites provide ergonomic care with zero cage drying.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>From £85 per session</span>
                  <Link to="/booking?species=dog" className="btn btn-primary btn-sm">
                    Book Dog Suite
                  </Link>
                </div>
              </div>
            </div>

            {/* Cat Grooming Sanctuary */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80"
                  alt="Quiet cat grooming sanctuary"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span className="badge badge-forest" style={{ width: 'fit-content', marginBottom: '12px' }}>
                  Feline Quiet Room
                </span>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>The Feline Serenity Ritual</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', flex: 1 }}>
                  Housed in a private, scent-isolated wing away from dogs. Handled exclusively by certified feline stylists using calming valerian hydrosols and gentle comb-outs.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>From £115 per session</span>
                  <Link to="/booking?species=cat" className="btn btn-primary btn-sm">
                    Book Cat Suite
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The 4-Step Low-Stress Grooming Process */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-kicker">Our Ritual</div>
            <h2>The 4-Step Tranquil Care Process</h2>
            <p style={{ marginInline: 'auto' }}>Every appointment follows a mindful sequence structured around emotional wellness.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px'
            }}
          >
            {[
              {
                step: '01',
                title: 'Sensory Greeting & Acclimatisation',
                desc: 'An unhurried 10-minute relaxation interval with organic aromatherapy, gentle chin scratches, and coat evaluation.'
              },
              {
                step: '02',
                title: 'Botanical Hydrotherapy',
                desc: 'Warm ozone-infused hydro-rinse paired with organic colloidal oatmeal and wild chamomile to cleanse without irritation.'
              },
              {
                step: '03',
                title: 'Low-Decibel Hand Fluff Dry',
                desc: 'We never use cage dryers. A quiet hand-held drying wand is paired with soft microfibre towels for maximum warmth.'
              },
              {
                step: '04',
                title: 'Artisanal Scissor Sculpting',
                desc: 'Ergonomic hand-scissor styling tailored to breed body proportions, finished with soothing paw balm.'
              }
            ].map(item => (
              <div
                key={item.step}
                className="card-surface"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{
                  fontSize: '3rem',
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-sand)',
                  fontWeight: 600,
                  lineHeight: 1,
                  marginBottom: '16px'
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Professionals & Master Stylists */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)', borderBlock: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="section-kicker">Certified Stylists</div>
              <h2>Meet our resident pet care masters</h2>
              <p style={{ margin: 0 }}>Certified professionals dedicated to humane handling and breed excellence.</p>
            </div>
            <Link to="/about" className="btn btn-secondary">
              View All Master Stylists <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px'
            }}
          >
            {staff.map(person => (
              <div key={person.id} className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ height: '320px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img
                    src={person.avatar_url}
                    alt={person.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '4px' }}>{person.name}</h3>
                  <div style={{ color: 'var(--color-terracotta)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '12px' }}>
                    {person.role_title}
                  </div>
                  <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                    {person.bio}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {person.specialties.map((spec, i) => (
                      <span key={i} className="badge badge-sand">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Package Comparison Table */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-kicker">Transparent Inclusions</div>
            <h2>Compare Spa &amp; Grooming Tiers</h2>
            <p style={{ marginInline: 'auto' }}>All pricing is upfront. No hidden surcharges for standard deshedding or ear care.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              alignItems: 'stretch'
            }}
          >
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className="card-surface"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: pkg.badge ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                  backgroundColor: pkg.badge ? 'var(--color-bg-primary)' : 'var(--color-bg-surface)'
                }}
              >
                {pkg.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    insetInlineEnd: '24px',
                    backgroundColor: 'var(--color-terracotta)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)'
                  }}>
                    {pkg.badge}
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>{pkg.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', minHeight: '40px' }}>
                    {pkg.tagline}
                  </p>
                  <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-forest)' }}>
                    {pkg.price}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>per scheduled appointment</div>
                </div>

                <div style={{ flex: 1, marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '12px' }}>
                    What is included:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
                        <Check size={16} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>

                  {pkg.exclusions.length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                        Excludes: {pkg.exclusions.join(', ')}
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/booking" className={`btn ${pkg.badge ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  Select Package
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Booking Invitation */}
      <section style={{ backgroundColor: 'var(--color-forest)', color: 'white', paddingBlock: '80px', textAlign: 'center' }}>
        <div className="container-narrow">
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Ready to give your companion the sanctuary experience?</h2>
          <p style={{ color: 'var(--color-sand-light)', marginInline: 'auto', marginBottom: '28px' }}>
            Book online in just a few minutes. Choose your studio location, pick your stylist, and select the ritual that honors your pet.
          </p>
          <Link to="/booking" className="btn btn-terracotta btn-lg">
            <Calendar size={18} /> Schedule Your Visit Now
          </Link>
        </div>
      </section>
    </div>
  );
};

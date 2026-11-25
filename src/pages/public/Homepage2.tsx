import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Check,
  Heart,
  Droplets,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';

export const Homepage2: React.FC = () => {
  const staff = dbStore.getStaff();
  const [activeSpeciesTab, setActiveSpeciesTab] = useState<'all' | 'dog' | 'cat'>('all');

  const packages = [
    {
      name: 'Essential Refresh',
      price: '£85',
      species: 'Canine & Feline',
      tagline: 'Ideal for frequent maintenance between major seasonal trims',
      inclusions: [
        'Wild chamomile hydro-bath',
        'Warm gentle fluff dry (zero cage dryers)',
        'Full hygienic brush out & dead coat release',
        'Ear cleansing with organic herbal hydrosols',
        'Shea butter paw pad moisture treatment'
      ],
      exclusions: ['Full scissor silhouette haircut', 'Mineral mud treatment'],
      recommendedFor: 'Short to medium coats, monthly upkeep'
    },
    {
      name: 'Signature Atelier Spa',
      price: '£130',
      badge: 'Atelier Favorite',
      species: 'Canine',
      tagline: 'Comprehensive aesthetic sculpting with restorative coat conditioning',
      inclusions: [
        'Everything in Essential Refresh',
        'Custom hand-scissor silhouette sculpt',
        'Sanitary area precision trim',
        'Smooth electric claw filing to velvety softness',
        'Face & muzzle styling tailored to breed anatomy'
      ],
      exclusions: ['Sedation (strictly prohibited at PAWELLE)'],
      recommendedFor: 'Doodles, Poodles, Cocker Spaniels, Bichons'
    },
    {
      name: 'Holistic Skin & Fur Detox',
      price: '£165',
      species: 'Canine & Feline',
      tagline: 'Therapeutic dermatological immersion for sensitive or seasonal shedding pets',
      inclusions: [
        'Everything in Signature Atelier',
        'Dead Sea mineral mud wrap (26 natural minerals)',
        'Hydro-ozone microbubble gentle massage',
        'Deep deshedding undercoat lift',
        'Protective cold-pressed nose & paw pad salve'
      ],
      exclusions: [],
      recommendedFor: 'Double-coated breeds, allergy-prone or irritated dermis'
    }
  ];

  const filteredPackages = packages.filter(pkg => {
    if (activeSpeciesTab === 'dog') return pkg.species.includes('Canine');
    if (activeSpeciesTab === 'cat') return pkg.species.includes('Feline');
    return true;
  });

  return (
    <div>
      {/* 1. Distinct Niche Hero Composition: Editorial Split Retreat Banner */}
      <section
        style={{
          backgroundColor: 'var(--color-hero-accent-bg)',
          paddingTop: 'clamp(56px, 7vw, 92px)',
          paddingBottom: 'clamp(64px, 8vw, 104px)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px', marginInline: 'auto', textAlign: 'center', marginBottom: '56px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '16px' }}>
              Specialized Wellness Retreat &bull; London
            </div>

            <h1 className="editorial-headline" style={{ marginBottom: '24px' }}>
              Two scent-isolated wings. <br />
              <span className="font-serif-italic">One shared sanctuary of stillness.</span>
            </h1>

            <p className="lead" style={{ marginInline: 'auto', marginBottom: '36px', color: 'var(--color-text-secondary)', maxWidth: '64ch' }}>
              Unlike commercial multi-species salons that trigger severe sensory stress, PAWELLE features two completely isolated wings: an acoustic canine atelier and an ultra-quiet feline quiet retreat where calm hands and herbal mists bring deep comfort.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <Link to="/customer/booking" className="btn btn-primary btn-lg">
                <Calendar size={18} /> Reserve a Suite
              </Link>
              <Link to="/pricing" className="btn btn-secondary btn-lg">
                Compare Retreat Sequences
              </Link>
            </div>
          </div>

          {/* Dual Category Spotlight: Asymmetric Architectural Wing Showcase */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: 'clamp(28px, 4vw, 44px)'
            }}
          >
            {/* Dog Grooming Atelier */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="editorial-media-frame" style={{ height: '340px', borderRadius: 0, border: 'none' }}>
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&q=80"
                  alt="Canine styling in peaceful private suite"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="editorial-tag" style={{ color: 'var(--color-forest)', borderColor: 'var(--color-forest)' }}>
                    Canine Wing
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Suite A &bull; Acoustic Dampened
                  </span>
                </div>

                <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.9rem)', marginBottom: '12px' }}>
                  The Canine Atelier &amp; Hydro-Spa
                </h3>

                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', flex: 1, lineHeight: 1.65 }}>
                  From meticulous hand-scissor silhouette sculpts to therapeutic Dead Sea mineral mud soaks, our dog suites eliminate cage dryers completely in favor of warm, quiet hand-held wands.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>From</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: 'var(--color-forest)' }}>£85</div>
                  </div>
                  <Link to="/customer/booking?species=dog" className="btn btn-primary btn-sm">
                    Book Canine Suite
                  </Link>
                </div>
              </div>
            </div>

            {/* Cat Grooming Sanctuary */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="editorial-media-frame" style={{ height: '340px', borderRadius: 0, border: 'none' }}>
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80"
                  alt="Cat relaxing in quiet sanctuary room"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="editorial-tag" style={{ color: 'var(--color-terracotta)', borderColor: 'var(--color-terracotta)' }}>
                    Feline Wing
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Suite B &bull; Strictly Cat-Only
                  </span>
                </div>

                <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.9rem)', marginBottom: '12px' }}>
                  The Feline Quiet Sanctuary
                </h3>

                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', flex: 1, lineHeight: 1.65 }}>
                  Housed in a private, scent-isolated wing completely partitioned away from canine areas. Handled exclusively by certified feline master stylists using calming valerian hydrosols and silent comb-outs.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>From</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: 'var(--color-forest)' }}>£115</div>
                  </div>
                  <Link to="/customer/booking?species=cat" className="btn btn-primary btn-sm">
                    Book Feline Suite
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The 4-Step Mindful Care Sequence — Architectural Roadmap */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              The Mindful Cadence
            </div>
            <h2>The 4-Step Tranquil Care Sequence</h2>
            <p style={{ marginInline: 'auto', color: 'var(--color-text-secondary)' }}>
              Every appointment follows a mindful sequence structured around nervous system regulation and positive emotional reinforcement.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'clamp(24px, 3vw, 40px)'
            }}
          >
            {[
              {
                numeral: '01',
                title: 'Sensory Acclimatisation',
                desc: 'An unhurried 10-minute relaxation interval with organic Roman chamomile aromatherapy, gentle chin scratches, and ambient coat evaluation.'
              },
              {
                numeral: '02',
                title: 'Botanical Hydrotherapy',
                desc: 'Warm ozone-infused hydro-rinse paired with small-batch colloidal oat flour to cleanse dermal layers without stripping protective sebum.'
              },
              {
                numeral: '03',
                title: 'Low-Decibel Hand Fluff',
                desc: 'We never use cage dryers. A quiet handheld drying wand is paired with soft Egyptian cotton microfibre towels for soothing warmth.'
              },
              {
                numeral: '04',
                title: 'Artisanal Scissor Sculpt',
                desc: 'Ergonomic hand-scissor styling tailored to companion body proportions, finished with cold-pressed sea buckthorn paw balm.'
              }
            ].map(item => (
              <div
                key={item.numeral}
                style={{
                  padding: '28px',
                  borderTop: '2px solid var(--color-sand)',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <span className="editorial-numeral">{item.numeral}</span>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Package Comparison Table with Species Filter */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', marginInline: 'auto', textAlign: 'center', marginBottom: '44px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Transparent Investment
            </div>
            <h2>Curated Sanctuary Packages</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Transparent rates for standard appointments. All packages include ear hygiene, claw filing, and bespoke botanical washes.
            </p>

            {/* Species Filter Tabs */}
            <div style={{ display: 'inline-flex', gap: '8px', padding: '4px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)', marginTop: '16px' }}>
              <button
                onClick={() => setActiveSpeciesTab('all')}
                className={`btn btn-sm ${activeSpeciesTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              >
                All Companions
              </button>
              <button
                onClick={() => setActiveSpeciesTab('dog')}
                className={`btn btn-sm ${activeSpeciesTab === 'dog' ? 'btn-primary' : 'btn-ghost'}`}
              >
                Canine Only
              </button>
              <button
                onClick={() => setActiveSpeciesTab('cat')}
                className={`btn btn-sm ${activeSpeciesTab === 'cat' ? 'btn-primary' : 'btn-ghost'}`}
              >
                Feline Only
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: '32px',
              maxWidth: '1100px',
              marginInline: 'auto'
            }}
          >
            {filteredPackages.map((pkg, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: pkg.badge ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {pkg.badge && (
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
                    {pkg.badge}
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                    {pkg.species}
                  </div>
                  <h3 style={{ fontSize: '1.45rem', marginTop: '6px', marginBottom: '8px' }}>{pkg.name}</h3>
                  <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-forest)' }}>
                    {pkg.price}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '8px 0 0' }}>
                    {pkg.tagline}
                  </p>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBlock: '12px' }} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
                    Sequence Inclusions:
                  </div>
                  {pkg.inclusions.map((inc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem' }}>
                      <Check size={16} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/customer/booking"
                  className={`btn ${pkg.badge ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Reserve This Package
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Resident Master Specialists Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Atelier Artisans
            </div>
            <h2>Meet our dedicated fear-free practitioners</h2>
            <p style={{ marginInline: 'auto', color: 'var(--color-text-secondary)' }}>
              Each stylist is certified in low-stress behavioral pacing, breed ergonomics, and holistic feline handling.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '40px',
              maxWidth: '920px',
              marginInline: 'auto'
            }}
          >
            {staff.map(person => (
              <div
                key={person.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div className="editorial-media-frame" style={{ height: '360px' }}>
                  <img
                    src={person.avatar_url}
                    alt={person.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '4px' }}>{person.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: 600, marginBottom: '10px' }}>
                    {person.role_title}
                  </div>
                  <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {person.bio}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {person.specialties.map((s, idx) => (
                      <span key={idx} className="editorial-tag" style={{ fontSize: '0.7rem' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Calming Retreat CTA */}
      <section
        style={{
          backgroundColor: 'var(--color-cta-bg)',
          color: 'var(--color-cta-text)',
          borderTop: '1px solid var(--color-cta-border)',
          borderBottom: '1px solid var(--color-cta-border)',
          paddingBlock: 'clamp(72px, 8vw, 104px)',
          textAlign: 'center'
        }}
      >
        <div className="container-narrow">
          <div className="editorial-eyebrow" style={{ color: 'var(--color-terracotta)', marginBottom: '16px' }}>
            London Sanctuary
          </div>
          <h2 style={{ color: 'var(--color-cta-text)', fontSize: 'clamp(2.1rem, 4vw, 3.2rem)', marginBottom: '20px' }}>
            A calmer grooming journey begins here.
          </h2>
          <p style={{ color: 'var(--color-cta-text-muted)', marginInline: 'auto', marginBottom: '32px', fontSize: '1.15rem', maxWidth: '58ch' }}>
            Whether your pet requires specialized feline quiet care or low-stress canine hydrotherapy, our doors are open to provide peaceful, loving attention.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/customer/booking" className="btn btn-terracotta btn-lg">
              <Calendar size={18} /> Reserve a Sanctuary Visit
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ color: 'var(--color-cta-text)', borderColor: 'var(--color-cta-border)' }}>
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

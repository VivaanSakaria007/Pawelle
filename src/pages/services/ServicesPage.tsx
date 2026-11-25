import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Filter,
  Sparkles,
  ShieldCheck,
  Heart,
  Droplets
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat'>('all');

  const services = dbStore.getServices(true);

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category_id === selectedCategory;
    const matchesSpecies = selectedSpecies === 'all' || service.eligible_pet_types.includes(selectedSpecies);
    return matchesCategory && matchesSpecies;
  });

  return (
    <div>
      {/* 1. Editorial Header Banner */}
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
            Mayfair &bull; Chelsea &bull; Atelier Catalog
          </div>

          <h1 className="editorial-headline" style={{ marginBottom: '20px' }}>
            The Grooming &amp; Spa <br />
            <span className="font-serif-italic">Rituals Collection.</span>
          </h1>

          <p className="lead" style={{ marginInline: 'auto', color: 'var(--color-text-secondary)', maxWidth: '62ch' }}>
            Every session at PAWELLE is an unbroken one-on-one journey. Delivered in private, acoustically dampened suites with certified fear-free handling, warm ozone hydro-rinses, and pure British botanicals.
          </p>
        </div>
      </section>

      {/* 2. Typographic Filter & Curation Bar */}
      <section
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          paddingBlock: '18px',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }} role="group" aria-label="Service category filters">
            <span style={{ fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginInlineEnd: '4px' }}>
              Filter By:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              aria-pressed={selectedCategory === 'all'}
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.825rem', padding: '7px 15px' }}
            >
              All Rituals ({services.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('cat-1')}
              aria-pressed={selectedCategory === 'cat-1'}
              className={`btn btn-sm ${selectedCategory === 'cat-1' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.825rem', padding: '7px 15px' }}
            >
              Signature Styling
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('cat-2')}
              aria-pressed={selectedCategory === 'cat-2'}
              className={`btn btn-sm ${selectedCategory === 'cat-2' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.825rem', padding: '7px 15px' }}
            >
              Spa &amp; Hydrotherapy
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('cat-3')}
              aria-pressed={selectedCategory === 'cat-3'}
              className={`btn btn-sm ${selectedCategory === 'cat-3' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.825rem', padding: '7px 15px' }}
            >
              Essential Wellness
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('cat-4')}
              aria-pressed={selectedCategory === 'cat-4'}
              className={`btn btn-sm ${selectedCategory === 'cat-4' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.825rem', padding: '7px 15px' }}
            >
              Puppy &amp; Senior
            </button>
          </div>

          {/* Pet Species Selection */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Companion:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value as any)}
              className="form-select"
              style={{ padding: '7px 38px 7px 14px', fontSize: '0.85rem', width: 'auto', borderRadius: 'var(--radius-pill)' }}
            >
              <option value="all">All Pets (Canine &amp; Feline)</option>
              <option value="dog">Dogs Exclusively</option>
              <option value="cat">Cats Exclusively</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. The Editorial Alternating Treatment Ledger (No repetitive card grids!) */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          {filteredServices.length === 0 ? (
            <div style={{ textAlign: 'center', paddingBlock: '64px' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                No treatment rituals match your current filter combination.
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedSpecies('all'); }}
                className="btn btn-secondary"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredServices.map((service, index) => {
                const isEven = index % 2 === 1;
                const numeral = index < 9 ? `0${index + 1}` : `${index + 1}`;

                return (
                  <article
                    key={service.id}
                    className={`editorial-row ${isEven ? 'reverse' : ''}`}
                    style={{ paddingBlock: 'clamp(44px, 6vw, 76px)' }}
                  >
                    {/* Media Column */}
                    <div className="editorial-media">
                      <div className="editorial-media-frame" style={{ height: '420px' }}>
                        <img
                          src={service.image_url}
                          alt={service.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="editorial-caption">Atelier Treatment {numeral}</span>
                        <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Suitable for: {service.eligible_pet_types.join(' & ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="editorial-content" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <span className="editorial-numeral">{numeral}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className="editorial-tag">{service.category_name}</span>
                          <span className="duration-pill">
                            <Clock size={12} /> {service.duration_minutes} mins
                          </span>
                        </div>
                      </div>

                      <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.3rem)', margin: 0, lineHeight: 1.25 }}>
                        <Link to={`/services/${service.slug}`} style={{ color: 'inherit' }}>
                          {service.name}
                        </Link>
                      </h2>

                      <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
                        {service.description}
                      </p>

                      {/* Ritual Inclusions */}
                      <div style={{ marginBlock: '6px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '10px' }}>
                          Ritual Inclusions:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                          {service.inclusions.map((inc, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                              <CheckCircle2 size={15} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Booking Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                            Starting Rate
                          </div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: 'var(--color-forest)' }}>
                            &pound;{service.base_price}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <Link to={`/services/${service.slug}`} className="editorial-link">
                            Treatment Notes &rarr;
                          </Link>
                          <Link to={`/customer/booking?service=${service.id}`} className="btn btn-primary btn-sm">
                            Reserve This Session
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Complete A La Carte Directory Table */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ maxWidth: '780px', marginInline: 'auto', textAlign: 'center', marginBottom: '44px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Atelier Ledger
            </div>
            <h2>Full Treatment Index &amp; Pricing</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              All appointments include one-on-one dedicated stylist attention, organic botanical infusions, and claw filing.
            </p>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ritual Name</th>
                  <th>Classification</th>
                  <th>Duration</th>
                  <th>Suitable For</th>
                  <th>Starting Rate</th>
                  <th style={{ textAlign: 'end' }}>Action</th>
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
                    <td style={{ fontWeight: 600, color: 'var(--color-forest)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
                      &pound;{s.base_price}
                    </td>
                    <td style={{ textAlign: 'end' }}>
                      <Link to={`/customer/booking?service=${s.id}`} className="btn btn-primary btn-sm" style={{ padding: '4px 12px', fontSize: '0.775rem' }}>
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

      {/* 5. Companion Preparation Guide */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Preparation Notes
            </div>
            <h2>Preparing your companion for their sanctuary visit</h2>
            <p style={{ marginInline: 'auto', color: 'var(--color-text-secondary)' }}>
              A little mindful care prior to arrival ensures your pet transitions effortlessly into their session.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(24px, 4vw, 40px)'
            }}
          >
            <div style={{ padding: '28px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <span className="editorial-numeral">I</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px', marginBottom: '10px' }}>A Relaxed Pre-Visit Stroll</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                We recommend taking dogs for a gentle, slow walk around Mount Street Gardens or Berkeley Square prior to your appointment so they can relieve themselves and release excess energy.
              </p>
            </div>

            <div style={{ padding: '28px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <span className="editorial-numeral">II</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px', marginBottom: '10px' }}>Light Meals Only</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Please avoid feeding large meals within two hours of their session. Warm water and quiet rest beforehand ensure optimal digestion during hydrotherapy soaks.
              </p>
            </div>

            <div style={{ padding: '28px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <span className="editorial-numeral">III</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px', marginBottom: '10px' }}>Scent &amp; Comfort Items</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                For feline companions and sensitive puppies, bringing a familiar small blanket or plush toy with home scents provides grounding familiarity in our relaxation rooms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Concierge & Reservation CTA */}
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
            Bespoke Consultation
          </div>
          <h2 style={{ color: 'var(--color-cta-text)', fontSize: 'clamp(2.1rem, 4vw, 3.2rem)', marginBottom: '20px' }}>
            Unsure which ritual suits your companion best?
          </h2>
          <p style={{ color: 'var(--color-cta-text-muted)', marginInline: 'auto', marginBottom: '32px', fontSize: '1.15rem', maxWidth: '58ch' }}>
            Our Mayfair concierge and master stylists are available to assess coat texture, skin sensitivities, and behavioral pacing before you book.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/customer/booking" className="btn btn-terracotta btn-lg">
              <Calendar size={18} /> Reserve a Session
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ color: 'var(--color-cta-text)', borderColor: 'var(--color-cta-border)' }}>
              Inquire with Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

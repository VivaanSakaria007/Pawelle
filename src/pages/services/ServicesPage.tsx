import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter
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
      {/* Header Banner */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(48px, 6vw, 72px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="section-kicker">Atelier Offerings</div>
          <h1 style={{ marginBottom: '20px' }}>Artisanal Grooming &amp; Spa Rituals</h1>
          <p className="lead" style={{ marginInline: 'auto' }}>
            From precision breed-sculpting and holistic bath hydrotherapy to our silent feline sanctuary, every experience is crafted with uncompromising affection.
          </p>
        </div>
      </section>

      {/* Filter Controls Bar */}
      <section style={{ backgroundColor: 'var(--color-bg-surface)', paddingBlock: '20px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: '80px', zIndex: 40 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} /> Service:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              All Rituals
            </button>
            <button
              onClick={() => setSelectedCategory('cat-1')}
              className={`btn btn-sm ${selectedCategory === 'cat-1' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              Signature Styling
            </button>
            <button
              onClick={() => setSelectedCategory('cat-2')}
              className={`btn btn-sm ${selectedCategory === 'cat-2' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              Spa &amp; Hydrotherapy
            </button>
            <button
              onClick={() => setSelectedCategory('cat-3')}
              className={`btn btn-sm ${selectedCategory === 'cat-3' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              Essential Wellness
            </button>
            <button
              onClick={() => setSelectedCategory('cat-4')}
              className={`btn btn-sm ${selectedCategory === 'cat-4' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              Puppy &amp; Senior
            </button>
          </div>

          {/* Pet Type Filter */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Pet:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value as any)}
              className="form-select"
              style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="all">All Pets (Canine &amp; Feline)</option>
              <option value="dog">Dogs Only</option>
              <option value="cat">Cats Only</option>
            </select>
          </div>
        </div>
      </section>

      {/* Services List / Cards */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '32px'
            }}
          >
            {filteredServices.map(service => (
              <article
                key={service.id}
                className="card-surface"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0
                }}
              >
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={service.image_url}
                    alt={service.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      insetInlineEnd: '16px',
                      backgroundColor: 'var(--color-forest)',
                      color: 'white',
                      fontWeight: 600,
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.9rem'
                    }}
                  >
                    £{service.base_price}
                  </div>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-sand">{service.category_name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {service.duration_minutes} mins
                    </span>
                    <span className="badge badge-forest" style={{ marginInlineStart: 'auto' }}>
                      {service.eligible_pet_types.join(' & ')}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>
                    <Link to={`/services/${service.slug}`} style={{ color: 'inherit' }}>
                      {service.name}
                    </Link>
                  </h2>

                  <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', marginBottom: '18px', flex: 1 }}>
                    {service.description}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '6px' }}>
                      Inclusions:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {service.inclusions.map((inc, i) => (
                        <li key={i} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-primary)' }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                    <Link to={`/booking?service=${service.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      <Calendar size={14} /> Book Session
                    </Link>
                    <Link to={`/services/${service.slug}`} className="btn btn-secondary btn-sm">
                      Full Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

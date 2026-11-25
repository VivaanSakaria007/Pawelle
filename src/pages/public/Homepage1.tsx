import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Heart,
  Droplets,
  Star,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';

export const Homepage1: React.FC = () => {
  const services = dbStore.getServices(true);
  const reviews = dbStore.getReviews(true);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
      title: 'Artisanal Scissor Silhouette',
      subtitle: 'Golden companion following full botanical immersion'
    },
    {
      url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=1000&q=80',
      title: 'Warm Botanical Hydrotherapy',
      subtitle: 'Restorative bath with wild chamomile & colloidal oats'
    },
    {
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&q=80',
      title: 'Hand-Scissored Precision',
      subtitle: 'Meticulous face sculpting tailored to breed ergonomics'
    },
    {
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
      title: 'Feline Quiet Sanctuary',
      subtitle: 'Scent-isolated suite with acoustic dampening'
    },
    {
      url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80',
      title: 'Paw & Pad Therapy',
      subtitle: 'Cold-pressed sea buckthorn & raw shea butter salve'
    },
    {
      url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1000&q=80',
      title: 'The Gentle Pacing Ritual',
      subtitle: 'Unhurried one-on-one companionship throughout'
    }
  ];

  const featuredServices = services.slice(0, 3);

  return (
    <div>
      {/* 1. Visually Striking Editorial Hero Section */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-bg-primary)',
          paddingTop: 'clamp(48px, 6vw, 84px)',
          paddingBottom: 'clamp(56px, 8vw, 104px)',
          borderBottom: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: 'clamp(36px, 6vw, 72px)',
              alignItems: 'center'
            }}
          >
            {/* Left Narrative Column */}
            <div>
              <div className="editorial-eyebrow" style={{ marginBottom: '16px' }}>
                Mayfair Atelier &bull; London W1K &bull; Est. 2021
              </div>

              <h1 className="editorial-headline" style={{ marginBottom: '24px' }}>
                Where <span className="font-serif-italic">unhurried calm</span> meets the quiet art of pet styling.
              </h1>

              <p className="lead" style={{ marginBottom: '32px', color: 'var(--color-text-secondary)', maxWidth: '58ch' }}>
                PAWELLE redefines grooming as a calming sensory ritual. Within private acoustic suites lined with wild British botanical infusions, our fear-free practitioners work with undivided attention. No cages, no blasters &mdash; only gentle hands, warm water, and restorative peace.
              </p>

              {/* Action Links */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
                <Link to="/customer/booking" className="btn btn-primary btn-lg">
                  <Calendar size={18} /> Reserve a Suite
                </Link>
                <Link to="/services" className="editorial-link">
                  Explore the 6 Rituals <ArrowRight size={16} className="arrow-icon" />
                </Link>
              </div>

              {/* Subtle Atelier Metadata & Trust Details */}
              <div
                style={{
                  paddingTop: '24px',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  gap: '24px',
                  flexWrap: 'wrap',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-terracotta)', flexShrink: 0 }} />
                  <span>Certified Fear-Free Practitioners</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplets size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                  <span>Microbiome-Safe British Botanicals</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} style={{ color: 'var(--color-terracotta)', flexShrink: 0 }} />
                  <span>Strictly 8 Appointments Daily</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Photographic Composition */}
            <div style={{ position: 'relative' }}>
              <div className="editorial-media-frame" style={{ height: '560px' }}>
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80"
                  alt="Companion pet in peaceful natural window light at PAWELLE atelier"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Museum-style Plate Attribution Note */}
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="editorial-caption">Plate I &mdash; The Private Suite</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Mayfair Flagship &bull; South Audley St</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Philosophy & Editorial Narrative */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: 'clamp(32px, 6vw, 64px)',
              alignItems: 'center'
            }}
          >
            <div>
              <div className="editorial-eyebrow" style={{ marginBottom: '14px' }}>
                Our Living Creed
              </div>
              <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.25, marginBottom: '24px' }}>
                Never rushed. Never caged. <br />Always held with profound gentleness.
              </h2>
              <blockquote className="editorial-quote">
                &ldquo;We do not groom against a ticking clock. We listen to the rhythm of breathing, the posture of paws, and the gentle sigh of release.&rdquo;
              </blockquote>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                &mdash; Clara Vance, Master Stylist &amp; Head of Atelier
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p>
                Conventional high-street salons often treat pet grooming as an industrial production line &mdash; crowded holding pens, distressing high-velocity blasters, and hurried scissoring. We founded PAWELLE in Mayfair to prove there is a gentler, more dignified way.
              </p>
              <p>
                Every companion enters a soundproofed acoustic room saturated with organic Roman chamomile hydrosols. We take time to sit on the floor, offer warm chin scratches, and let your pet set the pace.
              </p>
              <div style={{ paddingTop: '12px' }}>
                <Link to="/about" className="editorial-link">
                  Read Our Full Atelier Heritage &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Completely Redesigned Signature Rituals — Editorial Alternating Showcase */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
                Atelier Catalog
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0 }}>
                Signature Studio Rituals
              </h2>
              <p style={{ marginTop: '10px', marginBottom: 0, color: 'var(--color-text-secondary)' }}>
                Each sequence is individually calibrated to your companion&rsquo;s coat architecture, dermal sensitivity, and nervous system.
              </p>
            </div>
            <Link to="/services" className="editorial-link">
              View All 6 Studio Rituals <ArrowRight size={15} className="arrow-icon" />
            </Link>
          </div>

          {/* Alternating Showcase Rows (No Repetitive Cards!) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {featuredServices.map((service, idx) => {
              const isEven = idx % 2 === 1;
              const numeral = `0${idx + 1}`;

              return (
                <article
                  key={service.id}
                  className={`editorial-row ${isEven ? 'reverse' : ''}`}
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
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="editorial-caption">Ritual Archive {numeral}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {service.eligible_pet_types.join(' & ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="editorial-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <span className="editorial-numeral">{numeral}</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="editorial-tag">{service.category_name}</span>
                        <span className="duration-pill">
                          <Clock size={12} /> {service.duration_minutes} mins
                        </span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', margin: 0 }}>
                      <Link to={`/services/${service.slug}`} style={{ color: 'inherit' }}>
                        {service.name}
                      </Link>
                    </h3>

                    <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
                      {service.description}
                    </p>

                    {/* Key Cadences */}
                    <div style={{ marginBlock: '8px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '10px' }}>
                        Sequence Inclusions:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                        {service.inclusions.slice(0, 4).map((inc, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                            <CheckCircle2 size={15} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Booking Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                          Starting Rate
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 600, fontFamily: 'var(--font-heading)', color: 'var(--color-forest)' }}>
                          &pound;{service.base_price}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <Link to={`/services/${service.slug}`} className="editorial-link">
                          Experience Notes &rarr;
                        </Link>
                        <Link to={`/customer/booking?service=${service.id}`} className="btn btn-primary btn-sm">
                          Reserve This Ritual
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Invitation to explore full directory */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/services" className="editorial-link" style={{ fontSize: '1rem' }}>
              Explore the Complete 6-Treatment Atelier Directory &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. The PAWELLE Standards — Architectural Ledger */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              The Mayfair Benchmarks
            </div>
            <h2>Why discerning pet parents entrust their companions to our care.</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(28px, 4vw, 48px)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', borderLeft: '1px solid var(--color-border)' }}>
              <span className="editorial-numeral">I</span>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Fear-Free Certified Pacing</h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                Every stylist is rigorously trained in low-stress behavioral observation. We watch heart rates, eye dilation, and tail carriage, pausing whenever a companion indicates sensory fatigue.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', borderLeft: '1px solid var(--color-border)' }}>
              <span className="editorial-numeral">II</span>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Microbiome Dermal Formulations</h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                We blend small batches in England using colloidal oat flour, organic Roman chamomile, and cold-pressed sea buckthorn. No sulfates, synthetic perfumes, or parabens ever touch their skin.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', borderLeft: '1px solid var(--color-border)' }}>
              <span className="editorial-numeral">III</span>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Unbroken One-on-One Care</h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                From the moment your companion steps into the salon until pickup, they are accompanied exclusively by their assigned stylist. Zero cage dryers, zero holding crates, zero multitasking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Authentic Live Photography Gallery */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="editorial-eyebrow" style={{ marginBottom: '10px' }}>
                Documentary Archive
              </div>
              <h2 style={{ margin: 0 }}>Captured Moments in Mayfair</h2>
              <p style={{ margin: '8px 0 0', color: 'var(--color-text-secondary)' }}>
                Authentic companion sessions captured in natural north-facing window light.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '24px'
            }}
          >
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryImg(img.url)}
                className="editorial-media-frame"
                style={{
                  height: '300px',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={img.url}
                  alt={img.title}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(20, 26, 22, 0.75) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                    color: '#FFFEFB'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>{img.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-sand-light)', opacity: 0.9 }}>{img.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedGalleryImg && (
        <div
          onClick={() => setSelectedGalleryImg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(18, 24, 21, 0.92)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '920px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedGalleryImg(null)}
              aria-label="Close photo view"
              style={{
                position: 'absolute',
                top: '-44px',
                insetInlineEnd: 0,
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <X size={28} />
            </button>
            <img
              src={selectedGalleryImg}
              alt="Enlarged gallery view"
              style={{ width: '100%', maxHeight: '82vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
            />
          </div>
        </div>
      )}

      {/* 6. Guest Words / Editorial Reviews */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Companion Families
            </div>
            <h2>Reflections from our Mayfair patrons</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: '32px'
            }}
          >
            {reviews.map(rev => (
              <div
                key={rev.id}
                style={{
                  padding: '32px',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', gap: '3px', color: 'var(--color-terracotta)' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>

                <p style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--color-text-primary)', margin: 0, flex: 1, lineHeight: 1.5 }}>
                  &ldquo;{rev.review_text}&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-forest-soft)',
                    color: 'var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {rev.customer_name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{rev.customer_name}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                      {rev.pet_name} &bull; {rev.service_name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Boutique Atelier Sanctuary Invitation CTA */}
      <section
        style={{
          backgroundColor: 'var(--color-cta-bg)',
          color: 'var(--color-cta-text)',
          borderTop: '1px solid var(--color-cta-border)',
          borderBottom: '1px solid var(--color-cta-border)',
          paddingBlock: 'clamp(72px, 9vw, 112px)',
          textAlign: 'center'
        }}
      >
        <div className="container-narrow">
          <div className="editorial-eyebrow" style={{ color: 'var(--color-terracotta)', marginBottom: '16px' }}>
            Suite Reservations
          </div>
          <h2 style={{ color: 'var(--color-cta-text)', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', lineHeight: 1.2, marginBottom: '24px' }}>
            Entrust your companion to a <br /><span className="font-serif-italic">sanctuary of genuine care.</span>
          </h2>
          <p style={{ color: 'var(--color-cta-text-muted)', marginInline: 'auto', marginBottom: '36px', fontSize: '1.15rem', maxWidth: '58ch' }}>
            Appointments at our Mayfair and Chelsea salons are intentionally capped each day to ensure uninterrupted calmness. Secure your preferred date with instant reservation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <Link to="/customer/booking" className="btn btn-terracotta btn-lg">
              <Calendar size={18} /> Reserve a Treatment Suite
            </Link>
            <Link
              to="/contact"
              className="btn btn-secondary btn-lg"
              style={{ color: 'var(--color-cta-text)', borderColor: 'var(--color-cta-border)' }}
            >
              Consult with Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

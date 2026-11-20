import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Droplets,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';

export const Homepage1: React.FC = () => {
  const services = dbStore.getServices(true);
  const reviews = dbStore.getReviews(true);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
      title: 'Artisanal Scissor Finish',
      subtitle: 'Golden Cocker Spaniel after full botanical treatment'
    },
    {
      url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=1200&q=80',
      title: 'Ozone Hydro-Massage',
      subtitle: 'Warm restorative bath and lavender rinse'
    },
    {
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
      title: 'Precision Face Scissoring',
      subtitle: 'Hand-sculpted Teddy Bear silhouette'
    },
    {
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
      title: 'Cat Sanctuary Suite',
      subtitle: 'Stress-free feline hygiene and coat detangling'
    },
    {
      url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
      title: 'Paw & Claws Therapy',
      subtitle: 'Shea butter pad massage and smooth filing'
    },
    {
      url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
      title: 'Dead Sea Mineral Wrap',
      subtitle: 'Therapeutic dermatological mud pack'
    }
  ];

  return (
    <div>
      {/* 1. Large Photographic Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '84vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-bg-primary)',
          overflow: 'hidden',
          paddingBlock: 'clamp(48px, 6vw, 80px)'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 6vw, 64px)',
              alignItems: 'center'
            }}
          >
            {/* Left Narrative Column */}
            <div>
              <div className="section-kicker">
                <Sparkles size={16} /> Haute Pet Grooming &amp; Spa Atelier
              </div>
              <h1 style={{ marginBottom: '24px' }}>
                Where tranquil care meets artisanal pet styling.
              </h1>
              <p className="lead" style={{ marginBottom: '32px' }}>
                PAWELLE redefines grooming as a calming sensory ritual. In private acoustic suites with certified fear-free stylists and wild botanical soaks, your pet experiences true sanctuary.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/booking" className="btn btn-primary btn-lg">
                  <Calendar size={18} /> Reserve a Session
                </Link>
                <Link to="/services" className="btn btn-secondary btn-lg">
                  Explore Rituals <ArrowRight size={18} className="arrow-icon" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '1px solid var(--color-border)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-terracotta)' }} />
                  <span>100% Certified Fear-Free</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                  <Droplets size={18} style={{ color: 'var(--color-forest)' }} />
                  <span>Organic British Botanicals</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                  <Heart size={18} style={{ color: 'var(--color-terracotta)' }} />
                  <span>One-on-One Unhurried Care</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Composition with Editorial Offset */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80"
                  alt="Freshly groomed dog with radiant coat at PAWELLE atelier"
                  style={{ width: '100%', height: '520px', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    insetInlineStart: '20px',
                    backgroundColor: 'rgba(255, 254, 251, 0.92)',
                    backdropFilter: 'blur(8px)',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    maxWidth: '300px'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-terracotta)', textTransform: 'uppercase' }}>
                    Mayfair Flagship
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Bespoke One-on-One Suite
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Introduction */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="section-kicker">Our Philosophy</div>
          <h2 className="section-title">
            Never rushed. Never caged. Always held with profound gentleness.
          </h2>
          <p className="section-subtitle" style={{ marginInline: 'auto' }}>
            Conventional grooming salons often subject animals to chaotic waiting rooms, frightening high-velocity blasters, and hurried production lines. At PAWELLE, we intentionally schedule limited appointments each day, creating a serene environment where dogs and cats feel genuinely safe, pampered, and loved.
          </p>
          <Link to="/about" className="btn btn-secondary">
            Read Our Atelier Story <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* 3. Editorial Grooming Services Presentation */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="section-kicker">Signature Services</div>
              <h2>Artisanal Grooming Rituals</h2>
              <p style={{ margin: 0 }}>Every treatment is tailored to your pet's unique anatomy, coat density, and temperament.</p>
            </div>
            <Link to="/services" className="btn btn-secondary">
              View All 8 Services <ArrowRight size={16} className="arrow-icon" />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px'
            }}
          >
            {services.slice(0, 3).map(service => (
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
                <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={service.image_url}
                    alt={service.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }}
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
                      fontSize: '0.85rem'
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
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
                    <Link to={`/services/${service.slug}`} style={{ color: 'inherit' }}>
                      {service.name}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: '20px', flex: 1 }}>
                    {service.short_description || service.description}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
                      Key Inclusions:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {service.inclusions.slice(0, 3).map((inc, i) => (
                        <li key={i} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-primary)' }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <Link to={`/booking?service=${service.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      Book Session
                    </Link>
                    <Link to={`/services/${service.slug}`} className="btn btn-ghost btn-sm">
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose PAWELLE */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderBlock: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-kicker">The PAWELLE Standard</div>
            <h2>Why discerning pet parents entrust their companions to us.</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px'
            }}
          >
            <div className="card-surface">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-forest-soft)',
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Fear-Free Certified Methodology</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Our stylists are certified in low-stress handling protocols. We observe autonomic pet cues, calibrate noise levels, and avoid forceful restraints.
              </p>
            </div>

            <div className="card-surface">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(166, 91, 70, 0.12)',
                color: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Droplets size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Microbiome-Friendly Botanicals</h3>
              <p style={{ fontSize: '0.95rem' }}>
                We use small-batch botanical infusions made with colloidal oatmeal, wild chamomile, and pure aloe vera. Zero parabens, phthalates, or harsh sulfates.
              </p>
            </div>

            <div className="card-surface">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(214, 199, 173, 0.3)',
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>One-on-One Unbroken Dedication</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Your pet receives the undivided attention of a dedicated master stylist from arrival to departure. No waiting in holding pens or cage dryers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Real Photography Gallery */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="section-kicker">Live Gallery</div>
            <h2>Captured Moments of Calm &amp; Craftsmanship</h2>
            <p style={{ marginInline: 'auto' }}>All imagery represents real grooming sessions and authentic pet companions.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryImg(img.url)}
                style={{
                  position: 'relative',
                  height: '280px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--color-border)'
                }}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(40, 59, 50, 0.4)',
                    opacity: 0,
                    transition: 'opacity var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{img.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-sand-light)' }}>{img.subtitle}</div>
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
            backgroundColor: 'rgba(20, 25, 22, 0.9)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '900px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedGalleryImg(null)}
              aria-label="Close photo view"
              style={{
                position: 'absolute',
                top: '-40px',
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
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
            />
          </div>
        </div>
      )}

      {/* 6. Customer Testimonials */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-kicker">Guest Words</div>
            <h2>What devoted pet parents say about PAWELLE</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px'
            }}
          >
            {reviews.map(rev => (
              <div key={rev.id} className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '4px', color: '#B87A1E' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#B87A1E" />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--color-text-primary)', margin: 0, flex: 1 }}>
                  &ldquo;{rev.review_text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-forest-soft)',
                    color: 'var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600
                  }}>
                    {rev.customer_name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rev.customer_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {rev.pet_name} &bull; {rev.service_name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Booking Invitation Call to Action */}
      <section
        style={{
          backgroundColor: 'var(--color-forest)',
          color: 'var(--color-text-inverse)',
          paddingBlock: 'clamp(64px, 8vw, 96px)',
          textAlign: 'center'
        }}
      >
        <div className="container-narrow">
          <div className="section-kicker" style={{ color: 'var(--color-sand)' }}>
            Reserve Your Pet's Sanctuary Visit
          </div>
          <h2 style={{ color: 'var(--color-text-inverse)', marginBottom: '20px' }}>
            Elevate your pet's health, coat, and emotional serenity.
          </h2>
          <p style={{ color: 'var(--color-sand-light)', marginInline: 'auto', marginBottom: '32px', fontSize: '1.15rem' }}>
            Sessions at our Mayfair and Chelsea ateliers are strictly limited to ensure unhurried, one-on-one attention. Reserve your preferred slot online with instant confirmation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-terracotta btn-lg">
              <Calendar size={18} /> Book Your Appointment
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ color: 'var(--color-sand)', borderColor: 'var(--color-sand)' }}>
              Consult with Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

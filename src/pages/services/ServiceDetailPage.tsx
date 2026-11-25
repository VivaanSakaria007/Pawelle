import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Heart,
  Droplets,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = dbStore.getServiceBySlug(slug || '');

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const faqs = [
    {
      q: 'How should I prepare my companion prior to arrival?',
      a: 'We recommend a brief, unhurried walk in Mount Street Gardens or Berkeley Square prior to your appointment so your pet can relieve themselves. Please avoid heavy meals within two hours before the session.'
    },
    {
      q: 'Do you ever use sedation or tranquilizers during treatments?',
      a: 'Never. Sedation is strictly prohibited under our Fear-Free creed. We rely completely on low-stress behavioral pacing, sensory calming mists, warm hand reassurance, and gentle pauses whenever your companion needs rest.'
    },
    {
      q: 'What if my companion has severe dermal allergies or hot spots?',
      a: 'Our formulations are 100% hypoallergenic, pH-balanced for pet epidermis, and crafted with organic colloidal oats and wild Roman chamomile. You may discuss specific veterinary guidelines directly with your assigned stylist upon arrival.'
    },
    {
      q: 'Can I wait or watch my companion during their treatment?',
      a: 'While we encourage pets to bond directly with their stylist for emotional calmness, our Mayfair tea salon allows you to relax with organic botanical teas or return promptly at the exact confirmed pickup time.'
    }
  ];

  return (
    <div>
      {/* 1. Breadcrumb & Navigation */}
      <div style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', paddingBlock: '14px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Atelier Directory
          </Link>
          <span style={{ color: 'var(--color-border-strong)' }}>/</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{service.name}</span>
        </div>
      </div>

      {/* 2. Main Immersive Editorial Spread */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: 'clamp(36px, 6vw, 72px)',
              alignItems: 'start'
            }}
          >
            {/* Left: Detailed Editorial Narrative & Imagery */}
            <div>
              {/* Category & Species Kicker */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="editorial-tag">{service.category_name}</span>
                <span className="editorial-tag" style={{ color: 'var(--color-forest)', borderColor: 'var(--color-forest)' }}>
                  Suitable for: {service.eligible_pet_types.join(' & ').toUpperCase()}
                </span>
                <span className="duration-pill">
                  <Clock size={12} /> {service.duration_minutes} mins
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', lineHeight: 1.15, marginBottom: '24px' }}>
                {service.name}
              </h1>

              {/* Large Atmospheric Photograph */}
              <div className="editorial-media-frame" style={{ height: '480px', marginBottom: '14px' }}>
                <img
                  src={service.image_url}
                  alt={service.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <span className="editorial-caption">Atelier Session Plate &bull; Natural Daylight</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Private Suite Sanctuary</span>
              </div>

              {/* Evocative Narrative */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                <p className="lead" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
                  {service.description}
                </p>
                <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                  Every stage of this treatment is executed with unhurried reverence. We introduce water slowly, calibrate dryer decibels to conversational volumes, and use hand-carved German beechwood pin brushes to gently stimulate the skin's natural lipid mantle without abrasion.
                </p>
              </div>

              {/* Botanical Formulations Used */}
              <div style={{ padding: '32px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '40px' }}>
                <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
                  Microbiome Formulations
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>Organic English Botanicals Used in This Ritual</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Droplets size={18} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Colloidal Oat Flour</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Soothes dermal inflammation and locks moisture.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Droplets size={18} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Roman Chamomile Extract</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Aromatherapeutic nervous system relaxant.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Droplets size={18} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Raw Fairtrade Shea Butter</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Restores velvety elasticity to nose and paw pads.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Droplets size={18} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cold-Pressed Sea Buckthorn</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Provides radiant mirror-like coat luster.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* The PAWELLE Non-Negotiables */}
              <div style={{ marginBottom: '48px' }}>
                <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
                  The PAWELLE Guarantee
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Our Uncompromising Atelier Promises</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                    <ShieldCheck size={20} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                    <span>Certified Fear-Free handling &mdash; zero cage dryers, zero high-velocity blasters</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                    <Heart size={20} style={{ color: 'var(--color-terracotta)', flexShrink: 0 }} />
                    <span>One-on-one unbroken stylist attention from greeting to departure</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                    <Droplets size={20} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                    <span>Zero sedation, zero artificial fragrances, zero harsh sulfates</span>
                  </div>
                </div>
              </div>

              {/* Frequently Asked Questions */}
              <div>
                <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
                  Questions &amp; Guidance
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Frequently Asked Questions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {faqs.map((faq, i) => (
                    <div key={i} style={{ padding: '24px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{faq.q}</h4>
                      <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sticky Atelier Reservation Card */}
            <div style={{ position: 'sticky', top: '164px' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: '36px',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                    Treatment Reservation
                  </div>
                  <h3 style={{ fontSize: '1.45rem', marginTop: '6px', marginBottom: '12px' }}>{service.name}</h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>From</span>
                    <span style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-forest)' }}>
                      &pound;{service.base_price}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>/ session</span>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

                {/* Sequence Inclusions */}
                <div>
                  <div style={{ fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    What this treatment includes:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {service.inclusions.map((inc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                        <CheckCircle2 size={16} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exclusions Note */}
                {service.exclusions && service.exclusions.length > 0 && (
                  <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                      Explicit Exclusions:
                    </div>
                    {service.exclusions.map((exc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        <XCircle size={13} style={{ color: 'var(--color-terracotta)', flexShrink: 0 }} />
                        <span>{exc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Locations Note */}
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Available At:</strong> Mayfair Flagship &bull; Chelsea Garden Retreat</div>
                  <div><strong>Duration:</strong> Approximately {service.duration_minutes} minutes</div>
                </div>

                {/* Reservation Action */}
                <Link
                  to={`/customer/booking?service=${service.id}`}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Calendar size={18} /> Reserve This Session
                </Link>

                <div style={{ textAlign: 'center' }}>
                  <Link to="/contact" className="editorial-link" style={{ fontSize: '0.85rem' }}>
                    Consult Concierge Before Booking &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

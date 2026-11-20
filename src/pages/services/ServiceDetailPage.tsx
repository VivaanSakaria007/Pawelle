import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Heart,
  Droplets
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = dbStore.getServiceBySlug(slug || '');

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const faqs = [
    {
      q: 'How should I prepare my pet prior to arrival?',
      a: 'We recommend taking your pet for a brief, relaxed walk so they can relieve themselves. Please avoid heavy meals within two hours before the appointment.'
    },
    {
      q: 'Do you ever sedate pets during grooming?',
      a: 'Never. Sedation is strictly against our Fear-Free philosophy. We rely entirely on behavioral pacing, gentle reassurance, and sensory comfort.'
    },
    {
      q: 'What if my pet has skin sensitivities or allergies?',
      a: 'Our formulations are 100% hypoallergenic, pH-balanced, and based on organic colloidal oats and chamomile. Please let our stylists know any specific veterinary recommendations during booking.'
    }
  ];

  return (
    <div>
      {/* Breadcrumb & Navigation */}
      <div style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', paddingBlock: '14px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <span style={{ color: 'var(--color-border-strong)' }}>/</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{service.name}</span>
        </div>
      </div>

      {/* Main Service Presentation */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 6vw, 64px)',
              alignItems: 'start'
            }}
          >
            {/* Left: Imagery and Highlights */}
            <div>
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: '32px' }}>
                <img
                  src={service.image_url}
                  alt={service.name}
                  style={{ width: '100%', height: '460px', objectFit: 'cover' }}
                />
              </div>

              {/* Guarantees Box */}
              <div className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.15rem' }}>The PAWELLE Guarantee</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                  <ShieldCheck size={20} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                  <span>Fear-free certified handling with zero cage dryers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                  <Droplets size={20} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                  <span>Small-batch organic British chamomile &amp; oat formulations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                  <Heart size={20} style={{ color: 'var(--color-terracotta)', flexShrink: 0 }} />
                  <span>One-on-one unbroken stylist attention throughout the session</span>
                </div>
              </div>
            </div>

            {/* Right: Service Specs & Booking Box */}
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className="badge badge-sand">{service.category_name}</span>
                <span className="badge badge-forest">Suitable for: {service.eligible_pet_types.join(' & ')}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '16px' }}>
                {service.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-forest)' }}>
                  £{service.base_price}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                  <Clock size={16} /> Approximate duration: {service.duration_minutes} minutes
                </div>
              </div>

              <p className="lead" style={{ marginBottom: '32px' }}>
                {service.description}
              </p>

              {/* Inclusions Box */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>What this ritual includes:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {service.inclusions.map((inc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions Box (if any) */}
              {service.exclusions && service.exclusions.length > 0 && (
                <div style={{ marginBottom: '36px', padding: '16px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Transparent Exclusions:
                  </div>
                  {service.exclusions.map((exc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <XCircle size={15} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Booking CTA Bar */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to={`/booking?service=${service.id}`} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                  <Calendar size={18} /> Reserve This Treatment
                </Link>
                <Link to="/contact" className="btn btn-secondary btn-lg">
                  Ask Concierge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="section-kicker">Helpful Answers</div>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card-surface" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{faq.q}</h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

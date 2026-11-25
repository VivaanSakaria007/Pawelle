import React from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Droplets,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const staff = dbStore.getStaff();

  return (
    <div>
      {/* 1. Editorial Hero */}
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
            Atelier Chronicle &bull; Mayfair W1K &bull; Established 2021
          </div>

          <h1 className="editorial-headline" style={{ marginBottom: '24px' }}>
            Elevating the quiet art and <br />
            <span className="font-serif-italic">dignity of pet care in London.</span>
          </h1>

          <p className="lead" style={{ marginInline: 'auto', color: 'var(--color-text-secondary)', maxWidth: '62ch' }}>
            PAWELLE was founded upon a singular, uncompromising principle: every dog and cat is a sentient companion who deserves soothing environments, respectful human pacing, and master-level artisanal styling.
          </p>
        </div>
      </section>

      {/* 2. Brand Story with Authentic Photography Spread */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: 'clamp(36px, 6vw, 72px)',
              alignItems: 'center'
            }}
          >
            <div className="editorial-media">
              <div className="editorial-media-frame" style={{ height: '500px' }}>
                <img
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80"
                  alt="Stylist gently caring for a companion's paws in natural light"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="editorial-caption">Archive Plate II &mdash; Mindful Touch</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>42 South Audley St Atelier</span>
              </div>
            </div>

            <div>
              <div className="editorial-eyebrow" style={{ marginBottom: '14px' }}>
                The Mayfair Genesis
              </div>
              <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.25, marginBottom: '20px' }}>
                Born from an insistence on unhurried gentleness.
              </h2>
              <p style={{ marginBottom: '16px', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                For decades, commercial pet grooming prioritized volume and throughput over emotional well-being. Animals were routinely subjected to chaotic holding pens, noisy metal cages, and distressing high-velocity blasters that induced profound anxiety.
              </p>
              <p style={{ marginBottom: '16px', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                PAWELLE opened its doors in Mayfair as a deliberate antidote: an intimate sanctuary that feels more like a private holistic spa retreat than a traditional grooming parlour.
              </p>
              <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                We engineered acoustic dampening into our suite partitions, formulated our own organic botanical balms, and eliminated cages completely. When your companion enters our care, they receive our undivided attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Core Values — Architectural Ledger */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Guiding Pillars
            </div>
            <h2>The Three Tenets of PAWELLE Sanctuary</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(28px, 4vw, 48px)'
            }}
          >
            <div style={{ padding: '28px', borderLeft: '2px solid var(--color-sand)', backgroundColor: 'var(--color-bg-surface)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
              <span className="editorial-numeral">I</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px', marginBottom: '10px' }}>Absolute Fear-Free Consent</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
                We work strictly within your companion's emotional threshold. If a pet signals apprehension, we pause, offer gentle reassurance, and resume only when their natural calm returns.
              </p>
            </div>

            <div style={{ padding: '28px', borderLeft: '2px solid var(--color-terracotta)', backgroundColor: 'var(--color-bg-surface)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
              <span className="editorial-numeral">II</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px', marginBottom: '10px' }}>Microbiome Integrity</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
                Skin is your companion's primary immune defensive barrier. We never employ chemical detergents, harsh sulfates, or alcohol-based fragrances that strip natural protective sebum.
              </p>
            </div>

            <div style={{ padding: '28px', borderLeft: '2px solid var(--color-forest)', backgroundColor: 'var(--color-bg-surface)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
              <span className="editorial-numeral">III</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '8px', marginBottom: '10px' }}>Zero-Cage Guarantee</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
                From greeting at arrival to departure into your arms, companions rest on orthopaedic velvet daybeds in our supervised relaxation suites. No cages or crates ever exist in our atelier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Facilities & Veterinary-Grade Cleanroom Protocols */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderBlock: '1px solid var(--color-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
              gap: 'clamp(36px, 6vw, 72px)',
              alignItems: 'center'
            }}
          >
            <div>
              <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
                Hygiene &amp; Safety Protocols
              </div>
              <h2 style={{ marginBottom: '20px', fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)' }}>
                Veterinary-grade sterilization standards.
              </h2>
              <p style={{ marginBottom: '24px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                Hygiene at PAWELLE matches medical cleanroom protocols. We believe physical safety and absolute cleanliness are the bedrock of peace of mind.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Hospital-grade autoclave sterilisation for all shears and combs between appointments',
                  'Fresh, individually laundered Egyptian cotton towels for every treatment sequence',
                  'HEPA air filtration and continuous UV-C light air scrubbing throughout suites',
                  'Veterinary non-toxic organic disinfectant for hydro-baths after each wash',
                  'Separate negative-pressure feline sanctuary ensuring zero canine scent drift'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.925rem' }}>
                    <CheckCircle2 size={17} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="editorial-media">
              <div className="editorial-media-frame" style={{ height: '460px' }}>
                <img
                  src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=1200&q=80"
                  alt="Spotless botanical hydrotherapy station in Mayfair studio"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="editorial-caption">Plate III &mdash; Autoclaved Hydro-Station</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sanitized Between Every Session</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Master Artisans Team Showcase */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
              Atelier Practitioners
            </div>
            <h2>The people behind the shears</h2>
            <p style={{ marginInline: 'auto', color: 'var(--color-text-secondary)' }}>
              Meet our team of licensed master stylists, canine massage therapists, and feline behaviorists.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              maxWidth: '960px',
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
                <div className="editorial-media-frame" style={{ height: '380px' }}>
                  <img
                    src={person.avatar_url}
                    alt={person.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{person.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: 600, marginBottom: '10px' }}>
                    {person.role_title}
                  </div>
                  <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {person.bio}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                    {person.specialties.map((s, idx) => (
                      <span key={idx} className="editorial-tag" style={{ fontSize: '0.72rem' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
            Sanctuary Visit
          </div>
          <h2 style={{ color: 'var(--color-cta-text)', fontSize: 'clamp(2.1rem, 4vw, 3.2rem)', marginBottom: '20px' }}>
            Experience the PAWELLE difference in Mayfair.
          </h2>
          <p style={{ color: 'var(--color-cta-text-muted)', marginInline: 'auto', marginBottom: '32px', fontSize: '1.15rem', maxWidth: '58ch' }}>
            We welcome discerning companions and their guardians to tour our suites or schedule a private consultation before their first session.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/customer/booking" className="btn btn-terracotta btn-lg">
              <Calendar size={18} /> Reserve a Suite
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

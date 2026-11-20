import React from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import {
  Heart,
  ShieldCheck,
  Droplets,
  Sparkles,
  Calendar,
  CheckCircle2,
  Users
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const staff = dbStore.getStaff();

  return (
    <div>
      {/* Editorial Hero */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(48px, 6vw, 80px)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="section-kicker">Our Heritage &amp; Ethos</div>
          <h1 style={{ marginBottom: '24px' }}>
            Elevating the art and gentleness of pet care in London.
          </h1>
          <p className="lead" style={{ marginInline: 'auto' }}>
            PAWELLE was founded on an uncompromising principle: every pet is an emotional being who deserves soothing environments, respectful human pacing, and master-level artistic care.
          </p>
        </div>
      </section>

      {/* Brand Story with Real Photography */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 6vw, 64px)',
              alignItems: 'center'
            }}
          >
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <img
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80"
                alt="Stylist gently caring for a dog's paws"
                style={{ width: '100%', height: '480px', objectFit: 'cover' }}
              />
            </div>

            <div>
              <div className="section-kicker">The PAWELLE Story</div>
              <h2 style={{ marginBottom: '20px' }}>Born from a desire for unhurried gentleness.</h2>
              <p style={{ marginBottom: '16px' }}>
                For decades, the commercial pet grooming sector prioritized throughput over comfort. Pets were subjected to continuous loud noise, steel cages, and high-velocity forced-air blasters that triggered profound distress.
              </p>
              <p style={{ marginBottom: '16px' }}>
                PAWELLE opened its doors in Mayfair to offer an alternative: a tranquil atelier that feels more like an organic spa retreat than a traditional grooming parlour.
              </p>
              <p>
                We engineered acoustic dampening into our suite walls, formulated our own botanical salves, and eliminated holding cages entirely. When your pet is with us, they have our full, devoted attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Core Values */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-kicker">Guiding Values</div>
            <h2>What defines every PAWELLE experience</h2>
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
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(40, 59, 50, 0.1)',
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Absolute Fear-Free Care</h3>
              <p style={{ fontSize: '0.925rem', margin: 0 }}>
                We work within your pet's emotional threshold. If a pet feels anxious, we stop, reassure, desensitise with treats, and resume only with their calm consent.
              </p>
            </div>

            <div className="card-surface">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(166, 91, 70, 0.12)',
                color: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Droplets size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Microbiome Respect</h3>
              <p style={{ fontSize: '0.925rem', margin: 0 }}>
                Skin is the first line of immunity. We never use chemical detergents or alcohol-based sprays that strip the natural sebum barrier.
              </p>
            </div>

            <div className="card-surface">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(214, 199, 173, 0.25)',
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Heart size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Zero-Cage Guarantee</h3>
              <p style={{ fontSize: '0.925rem', margin: 0 }}>
                From arrival to greeting their owner at departure, pets lounge comfortably on orthopaedic velvet daybeds in our supervised lounge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Hygiene Standards */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', borderBlock: '1px solid var(--color-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 6vw, 64px)',
              alignItems: 'center'
            }}
          >
            <div>
              <div className="section-kicker">Facilities &amp; Hygiene</div>
              <h2 style={{ marginBottom: '20px' }}>Veterinary-grade sterilization standards.</h2>
              <p style={{ marginBottom: '20px' }}>
                Hygiene at PAWELLE matches medical cleanroom protocols. We believe physical safety and purity are the bedrock of peace of mind.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Hospital-grade autoclave sterilisation for all scissors and clippers between pets',
                  'Fresh, individually washed Egyptian cotton towels for every session',
                  'HEPA air filtration and continuous UV-C air scrubbing',
                  'Veterinary non-toxic disinfectant for hydro-baths after each wash',
                  'Separate negative-pressure feline suite ensuring zero canine scent drift'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <img
                src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=1200&q=80"
                alt="Spotless hydrotherapy grooming station"
                style={{ width: '100%', height: '440px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Profiles */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-kicker">Master Artisans</div>
            <h2>The people behind the shears</h2>
            <p style={{ marginInline: 'auto' }}>
              Meet our team of licensed groomers, canine massage therapists, and feline behaviorists.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px'
            }}
          >
            {staff.map(person => (
              <div key={person.id} className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

      {/* Call to Action */}
      <section style={{ backgroundColor: 'var(--color-forest)', color: 'white', paddingBlock: '80px', textAlign: 'center' }}>
        <div className="container-narrow">
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Experience the PAWELLE difference firsthand.</h2>
          <p style={{ color: 'var(--color-sand-light)', marginInline: 'auto', marginBottom: '28px' }}>
            We invite you to tour our Mayfair flagship atelier or schedule your pet's introductory visit.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-terracotta btn-lg">
              <Calendar size={18} /> Book an Appointment
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ color: 'var(--color-sand)', borderColor: 'var(--color-sand)' }}>
              Contact Our Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

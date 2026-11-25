import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  CheckCircle2,
  Send,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const settings = dbStore.getSettings();
  const locations = dbStore.getLocations();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      dbStore.createContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim() || 'General Atelier Inquiry',
        message: formData.message.trim()
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while sending your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(56px, 7vw, 96px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>Concierge &amp; Private Consultations</div>
          <h1 className="editorial-headline" style={{ marginBottom: '20px' }}>
            Where Every Companion is Received with <em>Calm &amp; Discretion</em>
          </h1>
          <p className="lead" style={{ marginInline: 'auto', maxWidth: '640px', color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
            Whether you wish to arrange a private coat health consultation, enquire about nervous temperament accommodations, or reserve an unhurried sanctuary suite, our Mayfair concierge is at your service.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(36px, 6vw, 68px)',
              alignItems: 'start'
            }}
          >
            {/* Left: Contact Info & Locations */}
            <div>
              <div className="editorial-eyebrow">The Atelier Studios</div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', marginBottom: '28px', fontFamily: 'var(--font-serif)' }}>
                London Flagship Residences
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '36px' }}>
                {locations.map((loc, idx) => (
                  <div
                    key={loc.id}
                    className="card-surface"
                    style={{
                      padding: '28px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', margin: 0 }}>
                        {loc.name}
                      </h3>
                      <span className="editorial-tag" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Studio {idx === 0 ? 'I' : 'II'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.925rem', color: 'var(--color-text-secondary)' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <MapPin size={18} style={{ color: 'var(--color-terracotta)', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong style={{ color: 'var(--color-text-primary)' }}>{loc.address}</strong>
                          <div>{loc.city}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <Clock size={18} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                        <span>{loc.hours}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Phone size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                        <a href={`tel:${loc.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{loc.phone}</a>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Mail size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                        <a href={`mailto:${loc.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{loc.email}</a>
                      </div>
                    </div>

                    <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--color-border)', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                      {idx === 0
                        ? 'Private valet drop-off coordination available along South Audley Street by advance concierge notice.'
                        : 'Dedicated private garden courtyard entrance designed for calm canine acclimatisation prior to appointments.'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Concierge Line / WhatsApp */}
              {settings.whatsapp_number && (
                <div
                  style={{
                    padding: '28px',
                    backgroundColor: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div className="editorial-eyebrow" style={{ marginBottom: '8px' }}>Direct Messaging</div>
                  <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Floor Concierge Desk</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                    For immediate questions regarding appointment availability, arrival protocols, or urgent coat assessments, communicate directly with our studio floor host.
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', paddingInline: '20px' }}
                  >
                    Open Concierge WhatsApp <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            {/* Right: Functional Contact Form */}
            <div
              className="card-surface"
              style={{
                padding: 'clamp(28px, 5vw, 44px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div className="editorial-eyebrow">Personal Correspondence</div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', marginBottom: '14px', fontFamily: 'var(--font-serif)' }}>
                Send a Private Inquiry
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '28px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Every message is read personally by our senior atelier stylists and concierge coordinators. We endeavour to respond within four business hours.
              </p>

              {submitted ? (
                <div
                  style={{
                    padding: '32px',
                    backgroundColor: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-forest)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-forest)', fontWeight: 600, fontSize: '1.15rem', fontFamily: 'var(--font-serif)' }}>
                    <CheckCircle2 size={24} style={{ color: 'var(--color-forest)' }} /> Inquiry Entrusted to Our Concierge
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Thank you for writing to PAWELLE. Your message has been logged in our Mayfair atelier register. Clara Vance or a senior concierge coordinator will review your companion's details and reply directly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: 'fit-content', marginTop: '12px' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {errorMsg && (
                    <div style={{ padding: '14px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                      {errorMsg}
                    </div>
                  )}

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.02em' }}>
                      Your Full Name <span style={{ color: 'var(--color-terracotta)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Lady Victoria Wentworth"
                      className="form-input"
                      style={{ padding: '12px 16px', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.02em' }}>
                        Email Address <span style={{ color: 'var(--color-terracotta)' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="victoria@example.com"
                        className="form-input"
                        style={{ padding: '12px 16px', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.02em' }}>
                        Direct Contact Telephone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+44 7700 900123"
                        className="form-input"
                        style={{ padding: '12px 16px', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.02em' }}>
                      Subject / Nature of Inquiry
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Nervous companion acclimatisation, Coat restoration consult"
                      className="form-input"
                      style={{ padding: '12px 16px', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.02em' }}>
                      Message &amp; Companion Details <span style={{ color: 'var(--color-terracotta)' }}>*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share your companion's breed, temperament, sensitivities, or any specific requirements for our senior stylists..."
                      className="form-textarea"
                      style={{ padding: '14px 16px', fontSize: '0.95rem', lineHeight: 1.6 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ marginTop: '8px', paddingBlock: '15px', fontSize: '0.95rem', letterSpacing: '0.04em' }}
                  >
                    {isSubmitting ? 'Transmitting inquiry...' : (
                      <>
                        <Send size={16} /> Entrust Message to Concierge
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

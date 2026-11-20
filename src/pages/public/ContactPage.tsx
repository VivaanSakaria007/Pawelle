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
      <section style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(48px, 6vw, 72px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="section-kicker">Concierge &amp; Inquiries</div>
          <h1 style={{ marginBottom: '20px' }}>Connect with Our Atelier Team</h1>
          <p className="lead" style={{ marginInline: 'auto' }}>
            Whether you have questions regarding our fear-free protocols, specific coat conditions, or wish to schedule an introductory consultation, we welcome your message.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 6vw, 64px)',
              alignItems: 'start'
            }}
          >
            {/* Left: Contact Info & Locations */}
            <div>
              <div className="section-kicker">Studio Addresses</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Visit PAWELLE in London</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                {locations.map(loc => (
                  <div key={loc.id} className="card-surface" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{loc.name}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.925rem', color: 'var(--color-text-secondary)' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <MapPin size={18} style={{ color: 'var(--color-terracotta)', flexShrink: 0 }} />
                        <span>{loc.address}, {loc.city}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Clock size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                        <span>{loc.hours}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Phone size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                        <span>{loc.phone}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Mail size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                        <span>{loc.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Concierge Line / WhatsApp */}
              {settings.whatsapp_number && (
                <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Direct Concierge Messaging</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                    For same-day inquiries or quick coat consultations, connect directly with our studio floor concierge.
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    Open WhatsApp Chat <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            {/* Right: Functional Contact Form */}
            <div className="card-surface" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
              <div className="section-kicker">Direct Inquiry</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Send Us a Message</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
                Fill out the form below and our concierge team will respond within 24 business hours.
              </p>

              {submitted ? (
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--color-success-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-success)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontWeight: 600, fontSize: '1.1rem' }}>
                    <CheckCircle2 size={24} /> Inquiry Successfully Received
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>
                    Thank you for contacting PAWELLE. Your message has been logged in our system and assigned to our studio concierge. We look forward to speaking with you!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: 'fit-content', marginTop: '8px' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {errorMsg && (
                    <div style={{ padding: '12px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                      {errorMsg}
                    </div>
                  )}

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Your Full Name <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Victoria Wentworth"
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">
                        Email Address <span style={{ color: 'var(--color-danger)' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="victoria@example.com"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+44 7700 900123"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Question about nervous pet accommodation"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Message <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please tell us about your pet's breed, temperament, or specific questions..."
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ marginTop: '8px', paddingBlock: '14px' }}
                  >
                    {isSubmitting ? 'Sending inquiry...' : (
                      <>
                        <Send size={16} /> Send Concierge Inquiry
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

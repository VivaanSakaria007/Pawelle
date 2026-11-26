import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, CalendarClock, ArrowRight } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'cancellation';

interface LegalPageProps {
  docType: LegalDocType;
}

const LEGAL_CONTENT: Record<
  LegalDocType,
  {
    eyebrow: string;
    title: string;
    updated: string;
    intro: string;
    sections: { heading: string; body: string }[];
  }
> = {
  privacy: {
    eyebrow: 'Data Protection & UK GDPR',
    title: 'Privacy Policy',
    updated: 'Last updated: November 2026',
    intro:
      'PAWELLE Pet Grooming & Spa Ltd respects the privacy of both guardians and companions. This policy explains what information we collect and how it is protected.',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect contact details (full name, email address, phone number), delivery addresses for Apothecary orders, and companion care profiles (species, breed, weight, behavioral sensitivities, coat history, and optional portrait photos).'
      },
      {
        heading: '2. How Your Data Is Used',
        body: 'Your information is used strictly to schedule sanctuary appointments, tailor fear-free grooming protocols for your companion, fulfill Apothecary orders, and respond to concierge inquiries.'
      },
      {
        heading: '3. Security & Access Control',
        body: 'Account passwords are protected using cryptographic hashing, and access to client and grooming records is restricted strictly to authorized guardians, assigned stylists, and studio administrators.'
      },
      {
        heading: '4. Your Rights & Contact',
        body: 'You may update your profile and pet details at any time in your Account Center or contact concierge@pawelle.com to request data export or deletion under UK GDPR.'
      }
    ]
  },
  terms: {
    eyebrow: 'Studio Governance',
    title: 'Terms of Service',
    updated: 'Last updated: November 2026',
    intro:
      'By reserving a grooming session or purchasing Apothecary botanicals through PAWELLE, you agree to our studio care standards and service terms.',
    sections: [
      {
        heading: '1. Fear-Free Companion Welfare',
        body: 'For the safety and tranquility of every guest, PAWELLE practitioners work strictly by private appointment. Should a companion exhibit severe stress or medical discomfort, the stylist will pause treatment immediately and notify you.'
      },
      {
        heading: '2. Coat Condition & De-matting',
        body: 'Pricing reflects standard breed weights and coat maintenance. Extensive de-felting is never forced to the detriment of skin health; alternative comfort-clip recommendations will always be agreed with you prior to styling.'
      },
      {
        heading: '3. Apothecary Formulations & Orders',
        body: 'Retail apothecary products are small-batch botanical formulations. Unopened items in original condition may be returned within 14 days of delivery at our Mayfair studio or via courier concierge.'
      },
      {
        heading: '4. Studio Accounts',
        body: 'Clients are responsible for keeping companion allergy, vaccination, and emergency contact details current inside their PAWELLE Account Center.'
      }
    ]
  },
  cancellation: {
    eyebrow: 'Scheduling & Suite Holds',
    title: 'Cancellation & Rescheduling Policy',
    updated: 'Last updated: November 2026',
    intro:
      'Because each PAWELLE suite accommodates only eight private appointments daily, advance notice allows us to offer quiet time slots to companions on our concierge waitlist.',
    sections: [
      {
        heading: '1. 24-Hour Rescheduling Window',
        body: 'Appointments may be rescheduled or cancelled online through your Customer Appointments portal up to 24 hours before the reserved start time at no charge.'
      },
      {
        heading: '2. Late Cancellations & Missed Appointments',
        body: 'Cancellations within 24 hours of a scheduled ritual or missed appointments ("no-show") may incur a 50% studio suite reservation fee on future bookings.'
      },
      {
        heading: '3. Urgent Veterinary Exceptions',
        body: 'Sudden companion illness or veterinary emergencies are always exempt—please message our Mayfair Concierge on +44 20 7946 0812 as soon as possible.'
      }
    ]
  }
};

export const LegalPage: React.FC<LegalPageProps> = ({ docType }) => {
  const doc = LEGAL_CONTENT[docType];
  const Icon = docType === 'privacy' ? ShieldCheck : docType === 'terms' ? FileText : CalendarClock;

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container-narrow" style={{ maxWidth: '820px' }}>
        <div className="card-surface" style={{ padding: 'clamp(28px, 5vw, 52px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Icon size={18} style={{ color: 'var(--color-terracotta)' }} />
            <span className="editorial-eyebrow">{doc.eyebrow}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '8px' }}>{doc.title}</h1>
          <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            {doc.updated}
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: '32px' }}>
            {doc.intro}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {doc.sections.map((section) => (
              <section
                key={section.heading}
                style={{
                  paddingTop: '20px',
                  borderTop: '1px solid var(--color-border-subtle)'
                }}
              >
                <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{section.heading}</h2>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 'none' }}>
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div
            style={{
              marginTop: '36px',
              paddingTop: '24px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.875rem' }}>
              <Link to="/privacy" style={{ color: docType === 'privacy' ? 'var(--color-forest)' : 'var(--color-text-secondary)', fontWeight: docType === 'privacy' ? 600 : 400 }}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{ color: docType === 'terms' ? 'var(--color-forest)' : 'var(--color-text-secondary)', fontWeight: docType === 'terms' ? 600 : 400 }}>
                Terms of Service
              </Link>
              <Link to="/cancellation-policy" style={{ color: docType === 'cancellation' ? 'var(--color-forest)' : 'var(--color-text-secondary)', fontWeight: docType === 'cancellation' ? 600 : 400 }}>
                Cancellation Policy
              </Link>
            </div>
            <Link to="/contact" className="btn btn-secondary btn-sm">
              Contact Concierge <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;

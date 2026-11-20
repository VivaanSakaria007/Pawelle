import React from 'react';
import { dbStore } from '../../services/store';
import { Sparkles, Calendar, UserCheck, Droplets, CheckCircle2 } from 'lucide-react';

export const CustomerGroomingRecordsPage: React.FC = () => {
  const records = dbStore.getGroomingRecords();
  const pets = dbStore.getPets();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Grooming Records &amp; Coat Logs</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Detailed session reports authored by our master stylists following each completed ritual.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {records.map(record => {
          const pet = pets.find(p => p.id === record.pet_id);

          return (
            <div
              key={record.id}
              className="card-surface"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                <div>
                  <span className="badge badge-forest" style={{ marginBottom: '6px' }}>
                    Certified Atelier Record
                  </span>
                  <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                    Session for {pet?.name || 'Pet Companion'} ({pet?.breed || 'Canine'})
                  </h2>
                </div>
                <div style={{ textAlign: 'end', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <div>Date: <strong>{record.date}</strong></div>
                  <div>Stylist: <strong>{record.groomer_name}</strong></div>
                </div>
              </div>

              {/* Before and After Photos */}
              {(record.before_photo_url || record.after_photo_url) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {record.before_photo_url && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Before Session:
                      </div>
                      <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <img
                          src={record.before_photo_url}
                          alt="Before grooming session"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}

                  {record.after_photo_url && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-forest)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        After Finished Styling:
                      </div>
                      <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <img
                          src={record.after_photo_url}
                          alt="After finished styling"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Services Performed */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
                  Services Performed:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {record.services_performed.map((srv, i) => (
                    <span key={i} className="badge badge-sand">
                      <CheckCircle2 size={12} /> {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stylist Notes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--color-forest)' }}>
                    Coat &amp; Skin Assessment:
                  </div>
                  <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--color-text-primary)' }}>
                    {record.coat_notes}
                  </p>
                </div>

                <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: 'var(--color-forest)' }}>
                    Behavioral &amp; Styling Observations:
                  </div>
                  <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--color-text-primary)' }}>
                    {record.grooming_notes}
                  </p>
                </div>
              </div>

              {/* Products & Recommended Next Visit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Botanicals Used: </span>
                  <strong>{record.products_used?.join(', ') || 'Colloidal Oatmeal Shampoo'}</strong>
                </div>

                {record.next_visit_recommendation && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                    <Calendar size={15} /> Recommended Next Visit: {record.next_visit_recommendation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { StaffMember } from '../../types';
import { UserCheck, Scissors, CheckCircle2 } from 'lucide-react';

export const AdminStaffPage: React.FC = () => {
  const staff = dbStore.getStaff();
  const locations = dbStore.getLocations();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Staff &amp; Master Stylists</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Certified canine and feline groomers, credentials, and studio location assignments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {staff.map(person => {
          const loc = locations.find(l => l.id === person.location_id);

          return (
            <div key={person.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={person.avatar_url}
                  alt={person.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{person.name}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                    {person.role_title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Assigned: {loc?.name || 'Mayfair Flagship'}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                {person.bio}
              </p>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Specialties:
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {person.specialties.map((spec, i) => (
                    <span key={i} className="badge badge-sand">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <span className="badge badge-success">CERTIFIED ACTIVE</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Fear-Free Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

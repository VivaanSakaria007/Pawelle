import React from 'react';
import { dbStore } from '../../services/store';
import { Heart, AlertTriangle, ShieldCheck } from 'lucide-react';

export const StaffPetDirectoryPage: React.FC = () => {
  const pets = dbStore.getPets();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Pet Care &amp; Allergy Directory</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Restricted staff view for reviewing special handling instructions, sensitive areas, and veterinary precautions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {pets.map(pet => (
          <div key={pet.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <img
                src={pet.photo_url || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80'}
                alt={pet.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{pet.name}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {pet.breed} &bull; {pet.species} &bull; {pet.weight} kg
                </div>
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <strong>Coat Type: </strong>
                <span>{pet.coat_type || 'Standard'}</span>
              </div>
              {pet.grooming_preferences && (
                <div>
                  <strong>Styling Requests: </strong>
                  <span>{pet.grooming_preferences}</span>
                </div>
              )}
              {pet.care_notes ? (
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-xs)', color: 'var(--color-danger)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Allergies / Precautions:</strong> {pet.care_notes}</span>
                </div>
              ) : (
                <div style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> No recorded allergies
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

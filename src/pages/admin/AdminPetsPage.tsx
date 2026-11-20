import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { Search, Heart, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AdminPetsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const pets = dbStore.getPets();

  const filtered = pets.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.breed.toLowerCase().includes(search.toLowerCase()) ||
    p.coat_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Registered Pets Master List</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Overview of all animal companions registered across London studios.
        </p>
      </div>

      <div className="card-surface" style={{ padding: '16px 24px', maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by pet name, breed, or coat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingInlineStart: '38px', paddingBlock: '8px', fontSize: '0.875rem' }}
          />
          <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {filtered.map(pet => (
          <div key={pet.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <img
                src={pet.photo_url || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80'}
                alt={pet.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{pet.name}</h2>
                  <span className="badge badge-sand">{pet.species}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {pet.breed} &bull; {pet.weight} kg &bull; {pet.age_years} yrs
                </div>
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <strong>Coat Type:</strong> {pet.coat_type || 'Standard'}
              </div>
              {pet.grooming_preferences && (
                <div>
                  <strong>Preferences:</strong> {pet.grooming_preferences}
                </div>
              )}
              {pet.care_notes && (
                <div style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Allergies:</strong> {pet.care_notes}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

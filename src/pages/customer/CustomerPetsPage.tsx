import React, { useState } from 'react';
import { useAuth } from '../../features/authentication/AuthContext';
import { dbStore } from '../../services/store';
import { Pet } from '../../types';
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const CustomerPetsPage: React.FC = () => {
  const { user } = useAuth();
  const ownerId = user?.id || 'usr-demo-customer';
  const [pets, setPets] = useState<Pet[]>(() => dbStore.getPets(ownerId));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState<number>(3);
  const [weight, setWeight] = useState<number>(12);
  const [coatType, setCoatType] = useState('Standard Medium');
  const [groomingPreferences, setGroomingPreferences] = useState('');
  const [careNotes, setCareNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingPet(null);
    setName('');
    setSpecies('dog');
    setBreed('');
    setAgeYears(2);
    setWeight(10);
    setCoatType('Silky Coat');
    setGroomingPreferences('');
    setCareNotes('');
    setPhotoUrl('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80');
    setModalOpen(true);
  };

  const handleOpenEditModal = (pet: Pet) => {
    setEditingPet(pet);
    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed);
    setAgeYears(pet.age_years || 2);
    setWeight(pet.weight || 10);
    setCoatType(pet.coat_type || 'Standard');
    setGroomingPreferences(pet.grooming_preferences || '');
    setCareNotes(pet.care_notes || '');
    setPhotoUrl(pet.photo_url || '');
    setModalOpen(true);
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !breed.trim()) return;

    if (editingPet) {
      dbStore.updatePet(editingPet.id, {
        name: name.trim(),
        species,
        breed: breed.trim(),
        age_years: Number(ageYears),
        weight: Number(weight),
        coat_type: coatType,
        grooming_preferences: groomingPreferences.trim(),
        care_notes: careNotes.trim(),
        photo_url: photoUrl
      });
      showToast(`Updated profile for ${name}`);
    } else {
      dbStore.createPet({
        owner_id: ownerId,
        name: name.trim(),
        species,
        breed: breed.trim(),
        age_years: Number(ageYears),
        weight: Number(weight),
        coat_type: coatType,
        grooming_preferences: groomingPreferences.trim(),
        care_notes: careNotes.trim(),
        photo_url: photoUrl || (species === 'dog'
          ? 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80')
      });
      showToast(`Registered new pet profile: ${name}`);
    }

    setPets(dbStore.getPets(ownerId));
    setModalOpen(false);
  };

  const handleDeletePet = (id: string) => {
    dbStore.deletePet(id);
    setPets(dbStore.getPets(ownerId));
    setDeleteConfirmId(null);
    showToast('Pet profile deleted.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>My Pet Companions</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Maintain comprehensive health profiles, coat sensitivities, and grooming instructions.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} /> Add New Pet Profile
        </button>
      </div>

      {toastMessage && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Pet Profiles Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {pets.map(pet => (
          <div
            key={pet.id}
            className="card-surface"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src={pet.photo_url || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80'}
                alt={pet.name}
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-sand)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{pet.name}</h2>
                  <span className="badge badge-sand">{pet.species}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {pet.breed} &bull; {pet.age_years} yrs &bull; {pet.weight} kg
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <strong style={{ color: 'var(--color-forest)' }}>Coat Architecture: </strong>
                <span>{pet.coat_type || 'Standard'}</span>
              </div>
              {pet.grooming_preferences && (
                <div>
                  <strong style={{ color: 'var(--color-terracotta)' }}>Styling Preferences: </strong>
                  <span>{pet.grooming_preferences}</span>
                </div>
              )}
              {pet.care_notes && (
                <div>
                  <strong style={{ color: 'var(--color-danger)' }}>Care &amp; Allergy Notes: </strong>
                  <span>{pet.care_notes}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={() => handleOpenEditModal(pet)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Edit2 size={14} /> Edit Profile
              </button>

              {deleteConfirmId === pet.id ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <button onClick={() => handleDeletePet(pet.id)} className="btn btn-terracotta btn-sm">
                    Confirm Delete
                  </button>
                  <button onClick={() => setDeleteConfirmId(null)} className="btn btn-ghost btn-sm">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(pet.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Pet Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 25, 22, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="card-surface"
            style={{
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
                {editingPet ? `Edit ${editingPet.name}'s Profile` : 'Register a New Pet'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePet} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Pet Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Oliver"
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Species *</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="dog">Canine (Dog)</option>
                    <option value="cat">Feline (Cat)</option>
                    <option value="other">Other Small Pet</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Breed *</label>
                  <input
                    type="text"
                    required
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g. Golden Retriever"
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Age (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={ageYears}
                    onChange={(e) => setAgeYears(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min={1}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Coat Type &amp; Density</label>
                <input
                  type="text"
                  value={coatType}
                  onChange={(e) => setCoatType(e.target.value)}
                  placeholder="e.g. Dense Double Coat, Curly Fleece, Silky Long"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Styling &amp; Handling Preferences</label>
                <textarea
                  rows={2}
                  value={groomingPreferences}
                  onChange={(e) => setGroomingPreferences(e.target.value)}
                  placeholder="e.g. Likes teddy bear face, prefers scissor trim over clippers"
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Sensitive Care Notes &amp; Allergies</label>
                <textarea
                  rows={2}
                  value={careNotes}
                  onChange={(e) => setCareNotes(e.target.value)}
                  placeholder="e.g. Sensitive back hips, allergic to synthetic perfumes, gentle eye care"
                  className="form-textarea"
                />
                <span className="form-hint">These notes are strictly private between you and our certified stylists.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Pet Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

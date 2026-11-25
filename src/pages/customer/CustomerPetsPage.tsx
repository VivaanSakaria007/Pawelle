import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/authentication/AuthContext';
import { dbStore } from '../../services/store';
import { useStoreSync } from '../../hooks/useStoreSync';
import { PetAvatar } from '../../components/common/PetAvatar';
import { readAndCompressImageFile } from '../../utils/imageUpload';
import { Pet } from '../../types';
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Camera
} from 'lucide-react';

export const CustomerPetsPage: React.FC = () => {
  const { user } = useAuth();
  useStoreSync();
  const ownerId = user?.id || '';
  const pets = ownerId ? dbStore.getPets(ownerId) : [];

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
  const [photoUploadError, setPhotoUploadError] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setModalOpen(false);
    setEditingPet(null);
    setDeleteConfirmId(null);
  }, [ownerId]);

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
    setPhotoUrl('');
    setPhotoUploadError('');
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
    setPhotoUploadError('');
    setModalOpen(true);
  };

  const handlePetPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploadError('');
    try {
      const compressed = await readAndCompressImageFile(file);
      setPhotoUrl(compressed);
    } catch (err: any) {
      setPhotoUploadError(err?.message || 'Unable to process this image file.');
    }
    e.target.value = '';
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId || !name.trim() || !breed.trim()) return;

    const cleanPhotoUrl = photoUrl.trim() || undefined;

    if (editingPet && editingPet.owner_id === ownerId) {
      dbStore.updatePet(editingPet.id, {
        name: name.trim(),
        species,
        breed: breed.trim(),
        age_years: Number(ageYears),
        weight: Number(weight),
        coat_type: coatType,
        grooming_preferences: groomingPreferences.trim(),
        care_notes: careNotes.trim(),
        photo_url: cleanPhotoUrl
      });
      showToast(`Updated profile for ${name}`);
    } else if (!editingPet) {
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
        photo_url: cleanPhotoUrl
      });
      showToast(`Registered new pet profile: ${name}`);
    }

    setModalOpen(false);
  };

  const handleDeletePet = (id: string) => {
    const target = pets.find(p => p.id === id);
    if (!target || target.owner_id !== ownerId) return;
    dbStore.deletePet(id);
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
      {pets.length === 0 ? (
        <div className="card-surface" style={{ textAlign: 'center', padding: '56px 24px' }}>
          <Heart size={38} style={{ color: 'var(--color-sand)', marginBottom: '14px', marginInline: 'auto' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Companions Registered Yet</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', marginInline: 'auto' }}>
            Create a personal profile for your dog or cat so our stylists tailor every wash and scissor silhouette.
          </p>
          <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
            <Plus size={16} /> Register Your First Pet
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
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
              <PetAvatar photoUrl={pet.photo_url} name={pet.name} size={72} bordered />
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
      )}

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
              <div className="responsive-two-col">
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

              <div className="responsive-three-col">
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
                <label className="form-label">Companion Photo (Optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <PetAvatar photoUrl={photoUrl} name={name || 'Pet'} size={56} bordered />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <label
                        className="btn btn-secondary btn-sm"
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Camera size={14} /> Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePetPhotoFile}
                          aria-label="Upload pet photo"
                          style={{ display: 'none' }}
                        />
                      </label>
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={photoUrl.startsWith('data:') ? '' : photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder={photoUrl.startsWith('data:') ? 'Uploaded photo attached (paste URL to replace)' : 'Or paste an image URL (optional)...'}
                      className="form-input"
                      style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                    />
                    {photoUploadError && <span className="form-error">{photoUploadError}</span>}
                  </div>
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

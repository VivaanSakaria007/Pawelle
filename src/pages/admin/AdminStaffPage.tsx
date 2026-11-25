import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { useStoreSync } from '../../hooks/useStoreSync';
import { StaffMember } from '../../types';
import { PetAvatar } from '../../components/common/PetAvatar';
import { Plus, Edit2, Trash2, CheckCircle2, X, Camera } from 'lucide-react';
import { readAndCompressImageFile } from '../../utils/imageUpload';

export const AdminStaffPage: React.FC = () => {
  useStoreSync();
  const staff = dbStore.getStaff();
  const locations = dbStore.getLocations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-1');
  const [bio, setBio] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setRoleTitle('Certified Canine & Feline Stylist');
    setLocationId(locations[0]?.id || 'loc-1');
    setBio('');
    setSpecialtiesText('Scissor Styling, Hydrotherapy Baths');
    setAvatarUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingMember(member);
    setName(member.name);
    setRoleTitle(member.role_title);
    setLocationId(member.location_id);
    setBio(member.bio || '');
    setSpecialtiesText(member.specialties.join(', '));
    setAvatarUrl(member.avatar_url || '');
    setModalOpen(true);
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await readAndCompressImageFile(file);
      setAvatarUrl(compressed);
    } catch {
      // ignore invalid file
    }
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roleTitle.trim()) return;

    const specialties = specialtiesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingMember) {
      dbStore.updateStaff(editingMember.id, {
        name: name.trim(),
        role_title: roleTitle.trim(),
        location_id: locationId,
        bio: bio.trim(),
        specialties,
        avatar_url: avatarUrl.trim() || undefined
      });
      showToast(`Updated staff profile for ${name.trim()}`);
    } else {
      dbStore.createStaff({
        name: name.trim(),
        role_title: roleTitle.trim(),
        location_id: locationId,
        bio: bio.trim(),
        specialties,
        avatar_url: avatarUrl.trim() || undefined,
        is_active: true
      });
      showToast(`Added ${name.trim()} to atelier roster.`);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, staffName: string) => {
    dbStore.deleteStaff(id);
    showToast(`Removed ${staffName} from roster.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Staff &amp; Master Stylists</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Certified canine and feline groomers, credentials, and studio location assignments.
          </p>
        </div>

        <button type="button" onClick={handleOpenAdd} className="btn btn-primary" data-testid="add-staff-btn">
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))', gap: '24px' }}>
        {staff.map(person => {
          const loc = locations.find(l => l.id === person.location_id);

          return (
            <div key={person.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <PetAvatar photoUrl={person.avatar_url} name={person.name} size={64} bordered />
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{person.name}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                    {person.role_title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Assigned: {loc?.name || 'Mayfair Flagship'}
                  </div>
                </div>
              </div>

              {person.bio && (
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {person.bio}
                </p>
              )}

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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <span className="badge badge-success">CERTIFIED ACTIVE</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <button type="button" onClick={() => handleOpenEdit(person)} className="btn btn-secondary btn-sm">
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(person.id, person.name)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-danger)', width: '34px', height: '34px', padding: 0, borderRadius: '50%' }}
                    aria-label={`Remove ${person.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Staff Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 25, 22, 0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card-surface" style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                {editingMember ? `Edit ${editingMember.name}` : 'Add New Staff Member'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alistair Finch"
                  className="form-input"
                />
              </div>

              <div className="responsive-two-col">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Feline Stylist"
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Assigned Studio</label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="form-select"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Portrait Photo (Optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <PetAvatar photoUrl={avatarUrl} name={name || 'Staff'} size={48} bordered />
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={14} /> Upload Photo
                    <input type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: 'none' }} />
                  </label>
                  <input
                    type="text"
                    value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder={avatarUrl.startsWith('data:') ? 'Uploaded photo attached' : 'Or paste image URL...'}
                    className="form-input"
                    style={{ flex: '1 1 180px', fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Specialties (Comma separated)</label>
                <input
                  type="text"
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  placeholder="Scissor Styling, Hydrotherapy Baths, Fear-Free Handling"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Biography &amp; Credentials</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe practitioner training, coat expertise, and certifications..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Save Changes' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

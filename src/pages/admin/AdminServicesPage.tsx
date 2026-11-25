import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { useStoreSync } from '../../hooks/useStoreSync';
import { Service } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';

const SERVICE_CATEGORIES = [
  { id: 'cat-1', name: 'Signature Styling' },
  { id: 'cat-2', name: 'Hydrotherapy & Spa Baths' },
  { id: 'cat-3', name: 'Essential Wellness Care' },
  { id: 'cat-4', name: 'Puppy & Senior Gentle Care' }
];

export const AdminServicesPage: React.FC = () => {
  useStoreSync();
  const services = dbStore.getServices(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryName, setCategoryName] = useState('Signature Styling');
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(85);
  const [description, setDescription] = useState('');
  const [inclusions, setInclusions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setSlug('');
    setCategoryName('Signature Styling');
    setDuration(60);
    setPrice(95);
    setDescription('');
    setInclusions('Full wash, Scissor styling, Paw balm');
    setImageUrl('https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80');
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setSlug(s.slug);
    setCategoryName(s.category_name || 'Signature Styling');
    setDuration(s.duration_minutes);
    setPrice(s.base_price);
    setDescription(s.description);
    setInclusions(s.inclusions.join(', '));
    setImageUrl(s.image_url);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const inclusionsArray = inclusions.split(',').map(s => s.trim()).filter(Boolean);
    const matchedCat = SERVICE_CATEGORIES.find(c => c.name === categoryName);

    if (editingService) {
      dbStore.updateService(editingService.id, {
        name: name.trim(),
        slug: generatedSlug,
        category_id: matchedCat?.id || editingService.category_id,
        category_name: categoryName,
        duration_minutes: Number(duration),
        base_price: Number(price),
        description: description.trim(),
        inclusions: inclusionsArray,
        image_url: imageUrl
      });
      showToast(`Updated service: ${name}`);
    } else {
      dbStore.createService({
        name: name.trim(),
        slug: generatedSlug,
        category_id: matchedCat?.id || 'cat-1',
        category_name: categoryName,
        duration_minutes: Number(duration),
        base_price: Number(price),
        description: description.trim(),
        eligible_pet_types: ['dog', 'cat'],
        inclusions: inclusionsArray,
        image_url: imageUrl,
        is_active: true
      });
      showToast(`Created new service: ${name}`);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    dbStore.deleteService(id);
    showToast('Service archived.');
  };

  const visibleServices = services.filter(s =>
    selectedCategory === 'all' || s.category_name === selectedCategory
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Services &amp; Pricing Management</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Configure salon rituals, duration slots, base pricing, and public inclusions.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Category Filter Bar */}
      <div
        className="card-surface"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}
        role="group"
        aria-label="Filter services by category"
      >
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          style={{ padding: '7px 16px', fontSize: '0.825rem' }}
        >
          All Categories ({services.length})
        </button>
        {SERVICE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.name)}
            className={`filter-chip ${selectedCategory === cat.name ? 'active' : ''}`}
            style={{ padding: '7px 16px', fontSize: '0.825rem' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      <div className="card-surface" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'start', fontSize: '0.885rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '14px 18px', textAlign: 'start', whiteSpace: 'nowrap' }}>Service Name</th>
                <th style={{ padding: '14px 14px', textAlign: 'start', whiteSpace: 'nowrap' }}>Category</th>
                <th style={{ padding: '14px 12px', textAlign: 'start', whiteSpace: 'nowrap' }}>Duration</th>
                <th style={{ padding: '14px 12px', textAlign: 'start', whiteSpace: 'nowrap' }}>Base Price</th>
                <th style={{ padding: '14px 12px', textAlign: 'start', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'end', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleServices.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < visibleServices.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td style={{ padding: '16px 18px', verticalAlign: 'middle', minWidth: '180px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>{s.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>/{s.slug}</div>
                  </td>
                  <td style={{ padding: '16px 14px', verticalAlign: 'middle' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-sand-soft)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.73rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.3
                      }}
                    >
                      {s.category_name}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    {s.duration_minutes} min
                  </td>
                  <td style={{ padding: '16px 12px', verticalAlign: 'middle', fontWeight: 600, color: 'var(--color-forest)', whiteSpace: 'nowrap' }}>
                    £{s.base_price}
                  </td>
                  <td style={{ padding: '16px 12px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    <span className="badge badge-success" style={{ padding: '5px 11px' }}>ACTIVE</span>
                  </td>
                  <td style={{ padding: '16px 18px', verticalAlign: 'middle', textAlign: 'end' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', whiteSpace: 'nowrap' }}>
                      <button onClick={() => handleOpenEdit(s)} className="btn btn-secondary btn-sm" style={{ padding: '7px 13px' }}>
                        <Edit2 size={13} style={{ flexShrink: 0 }} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="btn btn-ghost btn-sm"
                        style={{
                          color: 'var(--color-danger)',
                          width: '34px',
                          height: '34px',
                          padding: 0,
                          borderRadius: '50%',
                          flexShrink: 0
                        }}
                        aria-label={`Archive ${s.name}`}
                      >
                        <Trash2 size={15} style={{ flexShrink: 0 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 25, 22, 0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card-surface" style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
                {editingService ? `Edit ${editingService.name}` : 'Create New Ritual'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Service Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Silk Protein Bath & Coat Infusion"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category *</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="form-select"
                >
                  {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="responsive-two-col">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Base Rate (£)</label>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Inclusions (Comma separated)</label>
                <input
                  type="text"
                  value={inclusions}
                  onChange={(e) => setInclusions(e.target.value)}
                  className="form-input"
                  placeholder="Hydro-rinse, Nail trim, Paw balm"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

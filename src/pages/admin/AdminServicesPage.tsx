import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { Service } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(() => dbStore.getServices(false));
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

    if (editingService) {
      dbStore.updateService(editingService.id, {
        name: name.trim(),
        slug: generatedSlug,
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
        category_id: 'cat-1',
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

    setServices(dbStore.getServices(false));
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    dbStore.deleteService(id);
    setServices(dbStore.getServices(false));
    showToast('Service archived.');
  };

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

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      <div className="card-surface" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'start', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>Service Name</th>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>Category</th>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>Duration</th>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>Base Price</th>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'end' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < services.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>/{s.slug}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span className="badge badge-sand">{s.category_name}</span>
                </td>
                <td style={{ padding: '16px 20px' }}>{s.duration_minutes} min</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--color-forest)' }}>
                  £{s.base_price}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span className="badge badge-success">ACTIVE</span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'end' }}>
                  <button onClick={() => handleOpenEdit(s)} className="btn btn-secondary btn-sm" style={{ marginInlineEnd: '8px' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

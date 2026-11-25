import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { useAuth } from '../../features/authentication/AuthContext';
import { useStoreSync } from '../../hooks/useStoreSync';
import { Sparkles, CheckCircle2, Scissors } from 'lucide-react';

export const StaffGroomingRecordCreatorPage: React.FC = () => {
  const { user } = useAuth();
  useStoreSync();
  const pets = dbStore.getPets();
  const appointments = dbStore.getAppointments();

  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [selectedApptId, setSelectedApptId] = useState(appointments[0]?.id || '');
  const [servicesPerformed, setServicesPerformed] = useState('Full Botanical Scissor Sculpt, Fluff Blow-Dry, Paw Butter');
  const [coatNotes, setCoatNotes] = useState('Coat in balanced condition. Undercoat freed using hydrotherapy.');
  const [groomingNotes, setGroomingNotes] = useState('Very calm temperament. Responded well to positive verbal cues.');
  const [productsUsed, setProductsUsed] = useState('Colloidal Oatmeal Shampoo, Paw Salve');
  const [nextVisit, setNextVisit] = useState('4–6 weeks for maintenance scissor trim');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) return;

    dbStore.createGroomingRecord({
      pet_id: selectedPetId,
      appointment_id: selectedApptId || `apt-${Date.now()}`,
      groomer_id: user?.id || 'usr-staff-1',
      groomer_name: user?.full_name || 'Clara Vance',
      date: new Date().toISOString().split('T')[0],
      services_performed: servicesPerformed.split(',').map(s => s.trim()),
      coat_notes: coatNotes.trim(),
      grooming_notes: groomingNotes.trim(),
      products_used: productsUsed.split(',').map(p => p.trim()),
      next_visit_recommendation: nextVisit.trim(),
      after_photo_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '720px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Create Grooming Record</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Document coat health, handling observations, and recommended care intervals for client transparency.
        </p>
      </div>

      {success && (
        <div style={{ padding: '16px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <CheckCircle2 size={20} /> Grooming record saved and published to client portal.
        </div>
      )}

      <div className="card-surface" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Select Pet Companion *</label>
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="form-select"
              >
                {pets.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.breed} &bull; {p.species})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Related Appointment</label>
              <select
                value={selectedApptId}
                onChange={(e) => setSelectedApptId(e.target.value)}
                className="form-select"
              >
                {appointments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.service_name} ({a.starts_at.split('T')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Services Performed (Comma separated)</label>
            <input
              type="text"
              required
              value={servicesPerformed}
              onChange={(e) => setServicesPerformed(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Coat &amp; Dermis Assessment</label>
            <textarea
              rows={3}
              required
              value={coatNotes}
              onChange={(e) => setCoatNotes(e.target.value)}
              placeholder="Detail coat texture, undercoat density, skin hydration..."
              className="form-textarea"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Behavioral &amp; Styling Observations</label>
            <textarea
              rows={3}
              required
              value={groomingNotes}
              onChange={(e) => setGroomingNotes(e.target.value)}
              placeholder="Notes on handling, pet comfort, scissoring techniques..."
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Botanicals Used</label>
              <input
                type="text"
                value={productsUsed}
                onChange={(e) => setProductsUsed(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Recommended Next Visit Interval</label>
              <input
                type="text"
                value={nextVisit}
                onChange={(e) => setNextVisit(e.target.value)}
                placeholder="e.g. 4–6 weeks"
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '12px', alignSelf: 'flex-start' }}>
            <Sparkles size={16} /> Save &amp; Publish Record
          </button>
        </form>
      </div>
    </div>
  );
};

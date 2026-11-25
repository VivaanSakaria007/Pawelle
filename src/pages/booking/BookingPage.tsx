import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { useAuth } from '../../features/authentication/AuthContext';
import { useStoreSync } from '../../hooks/useStoreSync';
import { PetAvatar } from '../../components/common/PetAvatar';
import { readAndCompressImageFile } from '../../utils/imageUpload';
import { Pet, Service, Location } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  MapPin,
  Heart,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  Scissors,
  User,
  ShieldCheck,
  Phone,
  Mail,
  Camera
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  useStoreSync();

  const services = dbStore.getServices(true);
  const locations = dbStore.getLocations();
  const userPets = user ? dbStore.getPets(user.id) : [];

  // Steps: 1: Pet & Contact, 2: Service, 3: Location & Date/Time, 4: Review & Confirm
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedPet, setSelectedPet] = useState<Pet | null>(userPets[0] || null);
  const [selectedService, setSelectedService] = useState<Service | null>(() => {
    const sId = searchParams.get('service');
    return services.find(s => s.id === sId) || services[0] || null;
  });
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);

  useEffect(() => {
    const owned = user ? dbStore.getPets(user.id) : [];
    setSelectedPet(owned[0] || null);
    setShowNewPetForm(false);
    setConfirmedApptId(null);
    setCurrentStep(1);
  }, [user?.id]);

  // Date & Time
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow);
  const [selectedTime, setSelectedTime] = useState<string>('10:30');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Inline Pet Creation Modal / Form
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'dog' | 'cat'>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState<number>(2);
  const [newPetPhotoUrl, setNewPetPhotoUrl] = useState('');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedApptId, setConfirmedApptId] = useState<string | null>(null);

  // Candidate Slot Generation
  const candidateTimeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];

  // Check slot availability dynamically
  const getSlotStatus = (time: string) => {
    const duration = selectedService?.duration_minutes || 60;
    const startIso = `${selectedDate}T${time}:00Z`;
    const endIso = new Date(new Date(startIso).getTime() + duration * 60 * 1000).toISOString();
    const isPast = new Date(startIso).getTime() <= Date.now();
    const isAvailable = !isPast && dbStore.checkSlotAvailable(selectedLocation.id, startIso, endIso);

    return {
      time,
      isAvailable,
      isPast
    };
  };

  const computedSlots = candidateTimeSlots.map(getSlotStatus);

  // If currently selected time becomes unavailable, reset to first available
  useEffect(() => {
    const currentStatus = getSlotStatus(selectedTime);
    if (!currentStatus.isAvailable) {
      const firstFree = computedSlots.find(s => s.isAvailable);
      if (firstFree) setSelectedTime(firstFree.time);
    }
  }, [selectedDate, selectedLocation.id, selectedService?.id]);

  // Handle inline pet photo file upload
  const handleInlinePetPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await readAndCompressImageFile(file);
      setNewPetPhotoUrl(compressed);
    } catch {
      // keep form clean if file unreadable
    }
    e.target.value = '';
  };

  // Handle inline pet creation
  const handleCreateInlinePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPetName.trim() || !newPetBreed.trim()) return;

    const ownerId = user.id;
    const created = dbStore.createPet({
      owner_id: ownerId,
      name: newPetName.trim(),
      species: newPetSpecies,
      breed: newPetBreed.trim(),
      age_years: newPetAge,
      coat_type: 'Standard Coat',
      photo_url: newPetPhotoUrl.trim() || undefined
    });

    setSelectedPet(created);
    setShowNewPetForm(false);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetPhotoUrl('');
  };

  const handleConfirmBooking = () => {
    setErrorMessage('');

    if (!user) {
      setErrorMessage('You must be signed in to reserve an appointment.');
      navigate('/login?redirect=/customer/booking');
      return;
    }

    if (!selectedPet) {
      setErrorMessage('Please select or register a companion pet for this session.');
      setCurrentStep(1);
      return;
    }

    if (!selectedService) {
      setErrorMessage('Please select a grooming ritual.');
      setCurrentStep(2);
      return;
    }

    const slotCheck = getSlotStatus(selectedTime);
    if (!slotCheck.isAvailable) {
      setErrorMessage('The selected time slot is no longer available. Please choose another time.');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const startsAt = `${selectedDate}T${selectedTime}:00Z`;
      const durationMs = (selectedService.duration_minutes || 60) * 60 * 1000;
      const endsAt = new Date(new Date(startsAt).getTime() + durationMs).toISOString();

      const customerId = user.id;
      const customerName = user.full_name || 'Valued Client';
      const customerPhone = user.phone?.trim() || '';

      const newAppointment = dbStore.createAppointment({
        customer_id: customerId,
        customer_name: customerName,
        customer_phone: customerPhone,
        pet_id: selectedPet.id,
        pet_name: selectedPet.name,
        pet_breed: selectedPet.breed,
        service_id: selectedService.id,
        service_name: selectedService.name,
        location_id: selectedLocation.id,
        location_name: selectedLocation.name,
        starts_at: startsAt,
        ends_at: endsAt,
        price_snapshot: selectedService.base_price, // Server-validated price
        status: 'confirmed',
        payment_status: 'pending', // Legitimate pending status until verified
        customer_notes: customerNotes.trim() || undefined
      });

      setConfirmedApptId(newAppointment.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Availability conflict encountered. Please pick another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation Success View
  if (confirmedApptId) {
    return (
      <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container-narrow">
          <div className="card-surface" style={{ padding: 'clamp(32px, 5vw, 56px)', textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginInline: 'auto',
                marginBottom: '24px'
              }}
            >
              <CheckCircle2 size={44} />
            </div>

            <span className="badge badge-success" style={{ marginBottom: '12px' }}>
              Ritual Confirmed &amp; Reserved
            </span>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>We Look Forward to Welcoming You</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px', maxWidth: '52ch', marginInline: 'auto' }}>
              Your reservation reference <strong>#{confirmedApptId.slice(-6).toUpperCase()}</strong> has been secured in our studio schedule.
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                textAlign: 'start',
                marginBottom: '32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Companion</span>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '2px' }}>{selectedPet?.name} ({selectedPet?.breed})</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Treatment</span>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '2px' }}>{selectedService?.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Studio Location</span>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '2px' }}>{selectedLocation.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Scheduled Time</span>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '2px' }}>{selectedDate} at {selectedTime} ({selectedLocation.timezone})</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Treatment Total</span>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '2px' }}>£{selectedService?.base_price.toFixed(2)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Payment Status</span>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '2px', color: 'var(--color-warning)' }}>Payable at Concierge Desk</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/customer/appointments" className="btn btn-primary">
                View in Client Appointments
              </Link>
              <Link to="/customer" className="btn btn-secondary">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', marginInline: 'auto', marginBottom: '40px' }}>
          <span className="section-kicker">
            <Sparkles size={14} /> Sanctuary Reservation
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Reserve Your Pet's Sanctuary Session</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: 0 }}>
            Choose your companion, tailored botanical treatment, and preferred Mayfair studio schedule.
          </p>
        </div>

        {/* Step Indicator */}
        <div
          role="navigation"
          aria-label="Booking Progress"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          {[
            { step: 1, label: 'Companion & Contact' },
            { step: 2, label: 'Ritual Selection' },
            { step: 3, label: 'Studio & Schedule' },
            { step: 4, label: 'Review & Reserve' }
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: currentStep === s.step ? 'var(--color-forest)' : currentStep > s.step ? 'var(--color-forest-soft)' : 'var(--color-bg-surface)',
                color: currentStep === s.step ? 'var(--color-text-inverse)' : currentStep > s.step ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                fontWeight: currentStep === s.step ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              aria-current={currentStep === s.step ? 'step' : undefined}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  backgroundColor: currentStep === s.step ? 'var(--color-text-inverse)' : 'transparent',
                  color: currentStep === s.step ? 'var(--color-forest)' : 'inherit',
                  border: currentStep !== s.step ? '1px solid currentColor' : 'none'
                }}
              >
                {s.step}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {errorMessage && (
          <div
            role="alert"
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              maxWidth: '800px',
              marginInline: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div style={{ maxWidth: '860px', marginInline: 'auto' }}>
          {/* STEP 1: Companion & Contact Information */}
          {currentStep === 1 && (
            <div className="card-surface" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>1. Select or Register Companion</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                    Select which companion will receive this ritual session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPetForm(!showNewPetForm)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Plus size={16} /> Register Another Pet
                </button>
              </div>

              {/* Inline Pet Creation Form */}
              {showNewPetForm && (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '24px',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '28px',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Register New Companion Profile</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="new-pet-name" className="form-label">Pet Name *</label>
                      <input
                        id="new-pet-name"
                        type="text"
                        required
                        value={newPetName}
                        onChange={(e) => setNewPetName(e.target.value)}
                        placeholder="e.g. Winston"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="new-pet-species" className="form-label">Species *</label>
                      <select
                        id="new-pet-species"
                        value={newPetSpecies}
                        onChange={(e) => setNewPetSpecies(e.target.value as 'dog' | 'cat')}
                        className="form-select"
                      >
                        <option value="dog">Canine (Dog)</option>
                        <option value="cat">Feline (Cat)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="new-pet-breed" className="form-label">Breed *</label>
                      <input
                        id="new-pet-breed"
                        type="text"
                        required
                        value={newPetBreed}
                        onChange={(e) => setNewPetBreed(e.target.value)}
                        placeholder="e.g. Golden Retriever"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label className="form-label">Companion Photo (Optional)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <PetAvatar photoUrl={newPetPhotoUrl} name={newPetName || 'Pet'} size={48} bordered />
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Camera size={14} /> Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleInlinePetPhotoFile}
                          aria-label="Upload companion photo"
                          style={{ display: 'none' }}
                        />
                      </label>
                      {newPetPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => setNewPetPhotoUrl('')}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                        >
                          Remove
                        </button>
                      )}
                      <input
                        type="text"
                        value={newPetPhotoUrl.startsWith('data:') ? '' : newPetPhotoUrl}
                        onChange={(e) => setNewPetPhotoUrl(e.target.value)}
                        placeholder={newPetPhotoUrl.startsWith('data:') ? 'Uploaded photo attached' : 'Or paste image URL...'}
                        className="form-input"
                        style={{ flex: '1 1 200px', fontSize: '0.85rem', padding: '8px 12px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowNewPetForm(false)} className="btn btn-ghost btn-sm">
                      Cancel
                    </button>
                    <button type="button" onClick={handleCreateInlinePet} className="btn btn-primary btn-sm">
                      Save &amp; Select Companion
                    </button>
                  </div>
                </div>
              )}

              {/* Pets Selection Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {userPets.length > 0 ? (
                  userPets.map(pet => (
                    <div
                      key={pet.id}
                      onClick={() => setSelectedPet(pet)}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedPet?.id === pet.id ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                        backgroundColor: selectedPet?.id === pet.id ? 'var(--color-forest-soft)' : 'var(--color-bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <PetAvatar photoUrl={pet.photo_url} name={pet.name} size={56} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>{pet.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{pet.breed}</div>
                        <span className="badge badge-sand" style={{ marginTop: '4px', fontSize: '0.7rem' }}>{pet.species}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <Heart size={32} style={{ color: 'var(--color-sand)', margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                      No registered companion profiles found. Please register your pet above to continue.
                    </p>
                    <button type="button" onClick={() => setShowNewPetForm(true)} className="btn btn-primary btn-sm">
                      <Plus size={16} /> Register Pet Now
                    </button>
                  </div>
                )}
              </div>

              {/* Confirmed Client Contact Details */}
              <div style={{ paddingTop: '24px', borderTop: '1px solid var(--color-border)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Confirmed Client Contact</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Reservation confirmations and stylist check-in notifications are sent to your verified profile.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
                  <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Client Name</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '4px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{user?.full_name || 'Client'}</div>
                  </div>
                  <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Email Address</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '4px', overflowWrap: 'anywhere', wordBreak: 'break-word', lineHeight: 1.4 }}>{user?.email || 'client@pawelle.com'}</div>
                  </div>
                  <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Mobile Phone</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '4px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{user?.phone || 'Not provided'}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedPet}
                  className="btn btn-primary"
                >
                  Continue to Ritual Selection <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Ritual Service Selection */}
          {currentStep === 2 && (
            <div className="card-surface" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>2. Select Grooming or Spa Ritual</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Choose a treatment tailored for {selectedPet?.name || 'your companion'}.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {services.map(srv => {
                  const isEligible = !selectedPet || (srv.eligible_pet_types as string[]).includes(selectedPet.species);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => isEligible && setSelectedService(srv)}
                      className="booking-ritual-card"
                      style={{
                        padding: '18px',
                        borderRadius: 'var(--radius-lg)',
                        border: selectedService?.id === srv.id ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                        backgroundColor: selectedService?.id === srv.id ? 'var(--color-forest-soft)' : 'var(--color-bg-surface)',
                        cursor: isEligible ? 'pointer' : 'not-allowed',
                        opacity: isEligible ? 1 : 0.45,
                        transition: 'all var(--transition-fast)',
                        minWidth: 0
                      }}
                    >
                      <img
                        src={srv.image_url}
                        alt={srv.name}
                        className="booking-ritual-img"
                        style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{srv.name}</h3>
                          {srv.featured && <span className="badge badge-sand">Signature</span>}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5, overflowWrap: 'break-word' }}>
                          {srv.short_description || srv.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                          <span className="duration-pill">
                            <Clock size={12} /> {srv.duration_minutes} mins
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Species: {srv.eligible_pet_types.join(', ')}</span>
                        </div>
                      </div>
                      <div className="booking-ritual-price">
                        <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-forest)', fontFamily: 'var(--font-heading)' }}>
                          £{srv.base_price.toFixed(2)}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>All-inclusive</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="booking-step-actions">
                <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!selectedService}
                  className="btn btn-primary"
                >
                  Continue to Schedule <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Studio Location & Date/Time Schedule */}
          {currentStep === 3 && (
            <div className="card-surface" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>3. Studio Location &amp; Appointment Time</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Select your studio and pick from guaranteed available slots calculated in real-time.
                </p>
              </div>

              {/* Studio Selection */}
              <div className="form-group">
                <label className="form-label">Studio Sanctuary Location</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {locations.map(loc => (
                    <div
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc)}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedLocation.id === loc.id ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                        backgroundColor: selectedLocation.id === loc.id ? 'var(--color-forest-soft)' : 'var(--color-bg-surface)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{loc.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{loc.address}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                        Timezone: {loc.timezone} • {loc.hours}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="form-group">
                <label htmlFor="booking-date" className="form-label">Reservation Date</label>
                <input
                  id="booking-date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input"
                  style={{ maxWidth: '280px' }}
                />
              </div>

              {/* Dynamic Available Time Slots */}
              <div className="form-group">
                <label className="form-label">Available Appointment Slots ({selectedLocation.timezone})</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                  {computedSlots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTime(slot.time)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedTime === slot.time ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                        backgroundColor: selectedTime === slot.time
                          ? 'var(--color-forest)'
                          : slot.isAvailable ? 'var(--color-bg-surface)' : 'var(--color-bg-subtle)',
                        color: selectedTime === slot.time
                          ? 'var(--color-text-inverse)'
                          : slot.isAvailable ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                        fontWeight: selectedTime === slot.time ? 600 : 500,
                        fontSize: '0.95rem',
                        textAlign: 'center',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div>{slot.time}</div>
                      <div style={{ fontSize: '0.7rem', marginTop: '2px', opacity: 0.85 }}>
                        {slot.isPast ? 'Passed' : slot.isAvailable ? 'Available' : 'Reserved'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Care & Allergies Notes */}
              <div className="form-group">
                <label htmlFor="booking-notes" className="form-label">Pet Temperament &amp; Special Care Notes (Optional)</label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Sensitive ears, slightly nervous around loud dryers, prefers hypoallergenic shampoo."
                  className="form-textarea"
                />
              </div>

              <div className="booking-step-actions" style={{ marginTop: '32px' }}>
                <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="btn btn-primary"
                >
                  Review Reservation <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Final Confirmation */}
          {currentStep === 4 && (
            <div className="card-surface" style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>4. Review &amp; Reserve Appointment</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Please verify your reservation details prior to booking confirmation.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(16px, 4vw, 24px)',
                  marginBottom: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div className="booking-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Companion:</span>
                  <strong style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{selectedPet?.name} ({selectedPet?.breed})</strong>
                </div>
                <div className="booking-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Treatment:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
                    <strong style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{selectedService?.name}</strong>
                    <span className="duration-pill">
                      <Clock size={11} /> {selectedService?.duration_minutes} mins
                    </span>
                  </div>
                </div>
                <div className="booking-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Location:</span>
                  <strong style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{selectedLocation.name}</strong>
                </div>
                <div className="booking-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Date &amp; Time:</span>
                  <strong style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{selectedDate} at {selectedTime} ({selectedLocation.timezone})</strong>
                </div>
                <div className="booking-summary-row">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Client Contact:</span>
                  <strong style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{user?.full_name || 'Client'} ({user?.phone || user?.email || 'Not provided'})</strong>
                </div>
                <div className="booking-summary-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Treatment Price:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-forest)', fontFamily: 'var(--font-heading)' }}>
                    £{selectedService?.base_price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                <ShieldCheck size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                <span>24-hour complimentary rescheduling and cancellation policy applies.</span>
              </div>

              <div className="booking-step-actions">
                <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="btn btn-primary"
                  style={{ whiteSpace: 'normal', textAlign: 'center' }}
                >
                  {isSubmitting ? 'Securing Slot...' : 'Confirm Sanctuary Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .booking-ritual-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .booking-ritual-price {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--color-border);
        }
        .booking-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 6px 14px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
        }
        .booking-step-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .booking-ritual-card {
            display: grid;
            grid-template-columns: 80px minmax(0, 1fr) auto;
            gap: 20px;
            align-items: center;
          }
          .booking-ritual-price {
            display: block;
            text-align: end;
            padding-top: 0;
            border-top: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;

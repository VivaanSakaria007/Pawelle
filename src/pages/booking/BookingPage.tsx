import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { useAuth } from '../../features/authentication/AuthContext';
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
  Scissors
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const services = dbStore.getServices(true);
  const locations = dbStore.getLocations();
  const userPets = dbStore.getPets(user?.id);

  // Steps: 1: Pet, 2: Service, 3: Location & Date/Time, 4: Review & Confirm
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedPet, setSelectedPet] = useState<Pet | null>(userPets[0] || null);
  const [selectedService, setSelectedService] = useState<Service | null>(() => {
    const sId = searchParams.get('service');
    return services.find(s => s.id === sId) || services[0] || null;
  });
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  
  // Date & Time
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow);
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Inline New Pet Creation Modal / Form
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'dog' | 'cat'>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState<number>(2);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedApptId, setConfirmedApptId] = useState<string | null>(null);

  // Time Slots (9:00 to 17:00, 1-hour intervals)
  const timeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];

  // Handle inline pet creation
  const handleCreateInlinePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim() || !newPetBreed.trim()) return;

    const created = dbStore.createPet({
      owner_id: user?.id || 'usr-demo-customer',
      name: newPetName.trim(),
      species: newPetSpecies,
      breed: newPetBreed.trim(),
      age_years: newPetAge,
      coat_type: 'Standard Coat',
      photo_url: newPetSpecies === 'dog'
        ? 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
    });

    setSelectedPet(created);
    setShowNewPetForm(false);
    setNewPetName('');
    setNewPetBreed('');
  };

  const handleConfirmBooking = () => {
    setErrorMessage('');
    if (!selectedPet) {
      setErrorMessage('Please select or register a pet for this session.');
      return;
    }
    if (!selectedService) {
      setErrorMessage('Please select a grooming service.');
      return;
    }

    setIsSubmitting(true);

    try {
      const startsAt = `${selectedDate}T${selectedTime}:00Z`;
      const durationMs = (selectedService.duration_minutes || 60) * 60 * 1000;
      const endsAt = new Date(new Date(startsAt).getTime() + durationMs).toISOString();

      const newAppointment = dbStore.createAppointment({
        customer_id: user?.id || 'usr-demo-customer',
        customer_name: user?.full_name || 'Guest Client',
        customer_phone: user?.phone || '+44 7946 0991',
        pet_id: selectedPet.id,
        pet_name: selectedPet.name,
        pet_breed: selectedPet.breed,
        service_id: selectedService.id,
        service_name: selectedService.name,
        location_id: selectedLocation.id,
        location_name: selectedLocation.name,
        starts_at: startsAt,
        ends_at: endsAt,
        price_snapshot: selectedService.base_price,
        status: 'confirmed',
        payment_status: 'paid',
        customer_notes: customerNotes.trim() || undefined
      });

      setConfirmedApptId(newAppointment.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Availability conflict. Please pick another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation Success View
  if (confirmedApptId) {
    return (
      <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container-narrow">
          <div className="card-surface" style={{ padding: 'clamp(32px, 5vw, 56px)', textAlign: 'center' }}>
            <div style={{
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
            }}>
              <CheckCircle2 size={44} />
            </div>

            <span className="badge badge-success" style={{ marginBottom: '12px' }}>
              Appointment Confirmed
            </span>

            <h1 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>
              Your Pet's Sanctuary Session is Reserved
            </h1>

            <p className="lead" style={{ marginInline: 'auto', marginBottom: '32px' }}>
              We look forward to welcoming <strong>{selectedPet?.name}</strong> to our {selectedLocation.name}.
            </p>

            {/* Appointment Recap Card */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                textAlign: 'start',
                marginBottom: '32px',
                border: '1px solid var(--color-border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Pet Companion</span>
                <div style={{ fontWeight: 600 }}>{selectedPet?.name} ({selectedPet?.breed})</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Selected Ritual</span>
                <div style={{ fontWeight: 600 }}>{selectedService?.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Date &amp; Time</span>
                <div style={{ fontWeight: 600 }}>{selectedDate} at {selectedTime}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Studio Location</span>
                <div style={{ fontWeight: 600 }}>{selectedLocation.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/customer/appointments" className="btn btn-primary">
                View in My Appointments <ArrowRight size={16} className="arrow-icon" />
              </Link>
              <Link to="/" className="btn btn-secondary">
                Return to Home
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
        <div className="container-narrow" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-kicker">Sanctuary Reservation</div>
          <h1 style={{ marginBottom: '12px' }}>Reserve Your Grooming Appointment</h1>
          <p style={{ marginInline: 'auto' }}>
            Unhurried one-on-one sessions in acoustic-paneled suites. Step through our 4-point reservation process.
          </p>
        </div>

        {/* Step Indicator Progress */}
        <div style={{ maxWidth: '700px', marginInline: 'auto', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {[
              { num: 1, label: 'Select Pet' },
              { num: 2, label: 'Select Ritual' },
              { num: 3, label: 'Date & Time' },
              { num: 4, label: 'Confirm' }
            ].map(step => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: currentStep >= step.num ? 'var(--color-forest)' : 'var(--color-bg-surface)',
                    color: currentStep >= step.num ? 'white' : 'var(--color-text-secondary)',
                    border: '2px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  {step.num}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: currentStep === step.num ? 600 : 400 }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div style={{ maxWidth: '700px', marginInline: 'auto', padding: '16px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Step Content Card */}
        <div className="card-surface" style={{ maxWidth: '820px', marginInline: 'auto', padding: 'clamp(24px, 4vw, 40px)' }}>
          {/* STEP 1: Select Pet */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>1. Which companion is visiting us?</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Select a registered pet or add a new profile below:
              </p>

              {userPets.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  {userPets.map(pet => (
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
                        gap: '12px'
                      }}
                    >
                      <img
                        src={pet.photo_url || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80'}
                        alt={pet.name}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{pet.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                          {pet.breed} &bull; {pet.species}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Pet Button or Form */}
              {showNewPetForm ? (
                <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Quick Pet Registration</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Pet Name *</label>
                      <input
                        type="text"
                        value={newPetName}
                        onChange={(e) => setNewPetName(e.target.value)}
                        placeholder="e.g. Barnaby"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Species *</label>
                      <select
                        value={newPetSpecies}
                        onChange={(e) => setNewPetSpecies(e.target.value as any)}
                        className="form-select"
                      >
                        <option value="dog">Canine (Dog)</option>
                        <option value="cat">Feline (Cat)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Breed *</label>
                      <input
                        type="text"
                        value={newPetBreed}
                        onChange={(e) => setNewPetBreed(e.target.value)}
                        placeholder="e.g. Cockapoo"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={handleCreateInlinePet} className="btn btn-primary btn-sm">
                      Save &amp; Select Pet
                    </button>
                    <button type="button" onClick={() => setShowNewPetForm(false)} className="btn btn-ghost btn-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewPetForm(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
                >
                  <Plus size={16} /> Register Another Pet Companion
                </button>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  disabled={!selectedPet}
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-primary"
                >
                  Continue to Ritual Selection <ArrowRight size={16} className="arrow-icon" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Service */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>2. Choose the Grooming or Spa Ritual</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Displaying treatments suitable for your {selectedPet?.species}:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                {services
                  .filter(s => !selectedPet || s.eligible_pet_types.includes(selectedPet.species as any))
                  .map(service => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      style={{
                        padding: '20px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedService?.id === service.id ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                        backgroundColor: selectedService?.id === service.id ? 'var(--color-forest-soft)' : 'var(--color-bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                          {service.category_name}
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{service.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                          {service.short_description || service.description}
                        </p>
                      </div>

                      <div style={{ textAlign: 'end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-forest)', fontFamily: 'var(--font-heading)' }}>
                          £{service.base_price}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {service.duration_minutes} min
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setCurrentStep(3)}
                  className="btn btn-primary"
                >
                  Continue to Studio &amp; Time <ArrowRight size={16} className="arrow-icon" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Studio Location & Date/Time Slot */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>3. Studio Location &amp; Time Slot</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Select your preferred PAWELLE atelier and date:
              </p>

              {/* Studio Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{loc.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{loc.address}</div>
                  </div>
                ))}
              </div>

              {/* Date Picker */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>Select Available Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input"
                  style={{ maxWidth: '300px' }}
                />
              </div>

              {/* Real Availability Time Slots */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>Available Start Times</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                  {timeSlots.map(time => {
                    const startsAtISO = `${selectedDate}T${time}:00Z`;
                    const durationMs = (selectedService?.duration_minutes || 60) * 60 * 1000;
                    const endsAtISO = new Date(new Date(startsAtISO).getTime() + durationMs).toISOString();
                    const isAvailable = dbStore.checkSlotAvailable(selectedLocation.id, startsAtISO, endsAtISO);

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: 'var(--radius-md)',
                          border: selectedTime === time ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                          backgroundColor: selectedTime === time
                            ? 'var(--color-forest)'
                            : isAvailable ? 'var(--color-bg-surface)' : 'rgba(0,0,0,0.05)',
                          color: selectedTime === time
                            ? 'white'
                            : isAvailable ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textAlign: 'center'
                        }}
                      >
                        {time}
                        {!isAvailable && <div style={{ fontSize: '0.65rem', fontWeight: 400 }}>Booked</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Care Notes */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Notes or Requests for the Groomer (Optional)</label>
                <textarea
                  rows={3}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Sensitive around left ear, prefers quiet dryer, coat tangling on tail..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="btn btn-primary"
                >
                  Review Details <ArrowRight size={16} className="arrow-icon" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Confirm Booking */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>4. Review &amp; Confirm Booking</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Please review your reservation summary before completing:
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Pet Companion:</span>
                  <strong>{selectedPet?.name} ({selectedPet?.breed})</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Service Ritual:</span>
                  <strong>{selectedService?.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Studio Atelier:</span>
                  <strong>{selectedLocation.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Date &amp; Time:</span>
                  <strong>{selectedDate} at {selectedTime}</strong>
                </div>

                {customerNotes && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Special Notes:</span>
                    <span style={{ fontStyle: 'italic' }}>{customerNotes}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '1.25rem', fontWeight: 600 }}>
                  <span>Confirmed Rate:</span>
                  <span style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-heading)' }}>£{selectedService?.base_price}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="btn btn-primary btn-lg"
                >
                  {isSubmitting ? 'Securing slot...' : (
                    <>
                      <CheckCircle2 size={18} /> Confirm Sanctuary Reservation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

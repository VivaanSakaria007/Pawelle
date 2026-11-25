import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { dbStore } from '../../services/store';
import { useStoreSync } from '../../hooks/useStoreSync';
import {
  Calendar,
  Heart,
  ShoppingBag,
  Sparkles,
  Clock,
  ArrowRight,
  Plus,
  Scissors
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  useStoreSync();
  const customerId = user?.id || '';

  const pets = customerId ? dbStore.getPets(customerId) : [];
  const appointments = customerId ? dbStore.getAppointments({ customerId }) : [];
  const orders = customerId ? dbStore.getOrders(customerId) : [];
  const ownedPetIds = new Set(pets.map(p => p.id));
  const groomingRecords = customerId
    ? dbStore.getGroomingRecords().filter(record => ownedPetIds.has(record.pet_id))
    : [];

  const upcomingAppts = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const nextAppt = upcomingAppts[0];
  const displayName = user?.full_name?.trim() || (user?.email ? user.email.split('@')[0] : 'Member');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: 'clamp(24px, 4vw, 36px)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <span className="badge badge-sand" style={{ marginBottom: '8px' }}>
            Customer Sanctuary Portal
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', marginBottom: '6px' }}>
            Welcome back, {displayName}
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Manage your pet companions, view grooming histories, and track upcoming appointments.
          </p>
        </div>

        <Link to="/customer/booking" className="btn btn-primary">
          <Calendar size={16} /> Book Next Session
        </Link>
      </div>

      {/* Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="card-surface" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-forest-soft)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{upcomingAppts.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Upcoming Bookings</div>
          </div>
        </div>

        <div className="card-surface" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(166, 91, 70, 0.12)', color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{pets.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Registered Pets</div>
          </div>
        </div>

        <div className="card-surface" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(214, 199, 173, 0.3)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{groomingRecords.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Grooming Records</div>
          </div>
        </div>

        <div className="card-surface" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{orders.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Apothecary Orders</div>
          </div>
        </div>
      </div>

      {/* Next Upcoming Appointment Highlight */}
      <div className="card-surface" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Next Scheduled Visit</h2>
          <Link to="/customer/appointments" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-forest)' }}>
            View All ({appointments.length}) &rarr;
          </Link>
        </div>

        {nextAppt ? (
          <div
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              border: '1px solid var(--color-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              alignItems: 'center'
            }}
          >
            <div>
              <span className="badge badge-forest" style={{ marginBottom: '8px' }}>
                {nextAppt.status.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{nextAppt.service_name}</h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                Pet: <strong>{nextAppt.pet_name}</strong> ({nextAppt.pet_breed})
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 500, marginBottom: '6px' }}>
                <Clock size={16} style={{ color: 'var(--color-terracotta)' }} />
                <span>{new Date(nextAppt.starts_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {new Date(nextAppt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Studio: {nextAppt.location_name}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Link to="/customer/appointments" className="btn btn-secondary btn-sm">
                Manage Appointment
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              You do not have any upcoming visits booked.
            </p>
            <Link to="/customer/booking" className="btn btn-primary btn-sm">
              Schedule Your Pet's Visit
            </Link>
          </div>
        )}
      </div>

      {/* Pet Profiles Quick Overview */}
      <div className="card-surface" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>My Registered Companions</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Tailored grooming preferences and allergy notes
            </p>
          </div>
          <Link to="/customer/pets" className="btn btn-secondary btn-sm">
            <Plus size={14} /> Add New Pet
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {pets.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '28px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                No companion profiles registered under this account yet.
              </p>
              <Link to="/customer/pets" className="btn btn-primary btn-sm">
                <Plus size={14} /> Register Your First Companion
              </Link>
            </div>
          ) : (
            pets.map(pet => (
              <div
                key={pet.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  alignItems: 'center'
                }}
              >
                <img
                  src={pet.photo_url || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80'}
                  alt={pet.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{pet.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {pet.breed} &bull; {pet.age_years ? `${pet.age_years} yrs` : 'Adult'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', fontWeight: 600, marginTop: '4px' }}>
                    {pet.coat_type || 'Standard Coat'}
                  </div>
                </div>
                <Link to="/customer/pets" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                  Edit &rarr;
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

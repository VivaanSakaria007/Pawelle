import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { dbStore } from '../../services/store';
import { useStoreSync } from '../../hooks/useStoreSync';
import { AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Scissors,
  Heart,
  Sparkles,
  ArrowRight,
  ClipboardCheck
} from 'lucide-react';

export const StaffDashboardPage: React.FC = () => {
  const { user } = useAuth();
  useStoreSync();
  const appointments = dbStore.getAppointments();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const pets = dbStore.getPets();
  const records = dbStore.getGroomingRecords();

  const staffName = user?.full_name?.trim() || 'Stylist';
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const activeSuiteCount = appointments.filter(
    a => a.status === 'checked_in' || a.status === 'in_progress'
  ).length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  const activeQueue = appointments.filter(
    a => a.status === 'confirmed' || a.status === 'checked_in' || a.status === 'in_progress'
  );

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleUpdateStatus = (apptId: string, newStatus: AppointmentStatus) => {
    dbStore.updateAppointmentStatus(apptId, newStatus);
    showStatus(`Appointment status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} data-testid="staff-portal-page">
      {/* Staff Overview Welcome Banner */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <span className="badge badge-terracotta" style={{ marginBottom: '8px' }}>
            Practitioner Portal Overview
          </span>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '4px' }}>
            Welcome back, {staffName}
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
            Overview of assigned treatments, active sanctuary suites, pet allergy precautions, and recent coat logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/staff/appointments" className="btn btn-secondary">
            <Calendar size={16} /> Open Studio Schedule
          </Link>
          <Link to="/staff/grooming-records" className="btn btn-primary">
            <Scissors size={16} /> Log Grooming Record
          </Link>
        </div>
      </div>

      {/* Live Station KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
        <div className="card-surface" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-forest-soft)',
              color: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.55rem', fontWeight: 600 }}>{confirmedCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Confirmed Upcoming</div>
          </div>
        </div>

        <div className="card-surface" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.55rem', fontWeight: 600 }}>{activeSuiteCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Checked In / Active</div>
          </div>
        </div>

        <div className="card-surface" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ClipboardCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.55rem', fontWeight: 600 }}>{completedCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Completed Sessions</div>
          </div>
        </div>

        <div className="card-surface" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-terracotta-soft)',
              color: 'var(--color-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Heart size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.55rem', fontWeight: 600 }}>{pets.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Pet Care Profiles</div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500
          }}
        >
          <CheckCircle2 size={18} /> {statusMessage}
        </div>
      )}

      {/* Priority Active Client Queue */}
      <div className="card-surface" style={{ padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Assigned Client Queue</h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Quick status updates for upcoming and active treatments ({records.length} grooming records logged in archive).
            </p>
          </div>
          <Link to="/staff/appointments" className="editorial-link" style={{ fontSize: '0.875rem' }}>
            Full Calendar &amp; Schedule <ArrowRight size={14} className="arrow-icon" />
          </Link>
        </div>

        {activeQueue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ marginBottom: '12px', color: 'var(--color-text-secondary)' }}>
              All currently active appointments have been completed.
            </p>
            <Link to="/staff/appointments" className="btn btn-secondary btn-sm">
              Review Full Studio Schedule
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeQueue.map(appt => (
              <div
                key={appt.id}
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span
                    className={`badge ${
                      appt.status === 'in_progress'
                        ? 'badge-warning'
                        : 'badge-forest'
                    }`}
                    style={{ marginBottom: '6px' }}
                  >
                    {appt.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{appt.pet_name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Breed: {appt.pet_breed} &bull; Client: {appt.customer_name}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{appt.service_name}</div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Clock size={13} />{' '}
                    {new Date(appt.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at{' '}
                    {new Date(appt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {appt.customer_notes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontStyle: 'italic', marginTop: '4px' }}>
                      Client Note: &ldquo;{appt.customer_notes}&rdquo;
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'checked_in')}
                      className="btn btn-secondary btn-sm"
                    >
                      Check In Pet
                    </button>
                  )}

                  {appt.status === 'checked_in' && (
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'in_progress')}
                      className="btn btn-primary btn-sm"
                    >
                      Start Grooming
                    </button>
                  )}

                  {appt.status === 'in_progress' && (
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'completed')}
                      className="btn btn-terracotta btn-sm"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Distinct Practitioner Tool Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Calendar size={22} style={{ color: 'var(--color-forest)' }} />
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Studio Schedule &amp; Calendar</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, flex: 1 }}>
            Browse chronological studio timetables by date, location, and handling stage.
          </p>
          <Link to="/staff/appointments" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
            View Studio Schedule
          </Link>
        </div>

        <div className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Sparkles size={22} style={{ color: 'var(--color-terracotta)' }} />
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Coat Health Documentation</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, flex: 1 }}>
            Publish post-session dermatology assessments, botanicals used, and next-visit guidance.
          </p>
          <Link to="/staff/grooming-records" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
            Log Coat Record
          </Link>
        </div>

        <div className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Heart size={22} style={{ color: 'var(--color-forest)' }} />
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Companion Care &amp; Allergies</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, flex: 1 }}>
            Verify sensitivity notes, scissoring requests, and medical accommodations prior to prep.
          </p>
          <Link to="/staff/pet-directory" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
            Open Pet Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

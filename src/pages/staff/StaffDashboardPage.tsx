import React, { useState } from 'react';
import { useAuth } from '../../features/authentication/AuthContext';
import { dbStore } from '../../services/store';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Check,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StaffDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(() => dbStore.getAppointments());
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleUpdateStatus = (apptId: string, newStatus: AppointmentStatus) => {
    dbStore.updateAppointmentStatus(apptId, newStatus, internalNotes || undefined);
    setAppointments(dbStore.getAppointments());
    setSelectedAppt(null);
    setInternalNotes('');
    showStatus(`Appointment status updated to ${newStatus.toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
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
            Stylist &amp; Groomer Station
          </span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
            Today's Studio Roster &amp; Schedule
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Monitor pet arrivals, update handling statuses, and record coat care observations.
          </p>
        </div>

        <Link to="/staff/grooming-records" className="btn btn-primary">
          <Scissors size={16} /> Log Grooming Record
        </Link>
      </div>

      {statusMessage && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {statusMessage}
        </div>
      )}

      {/* Appointments Table / Roster */}
      <div className="card-surface" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Assigned Appointments Roster</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointments.map(appt => (
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
                <span className={`badge ${appt.status === 'completed' ? 'badge-success' : appt.status === 'in_progress' ? 'badge-warning' : 'badge-forest'}`} style={{ marginBottom: '6px' }}>
                  {appt.status.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{appt.pet_name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Breed: {appt.pet_breed} &bull; Client: {appt.customer_name}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{appt.service_name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {new Date(appt.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {new Date(appt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {appt.customer_notes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontStyle: 'italic', marginTop: '4px' }}>
                    Client Note: "{appt.customer_notes}"
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

                {appt.status === 'completed' && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

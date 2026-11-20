import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { dbStore } from '../../services/store';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Scissors,
  ArrowRight,
  X
} from 'lucide-react';

export const CustomerAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const customerId = user?.id || 'usr-demo-customer';

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    dbStore.getAppointments({ customerId })
  );

  // Reschedule Modal State
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [rescheduleError, setRescheduleError] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCancel = (apptId: string) => {
    try {
      dbStore.updateAppointmentStatus(apptId, 'cancelled');
      setAppointments(dbStore.getAppointments({ customerId }));
      showToast('Appointment successfully cancelled.');
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel appointment.');
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppt || !newDate || !newTime) return;
    setRescheduleError('');

    try {
      const newStartsAt = `${newDate}T${newTime}:00Z`;
      const originalStart = new Date(reschedulingAppt.starts_at).getTime();
      const originalEnd = new Date(reschedulingAppt.ends_at).getTime();
      const durationMs = originalEnd - originalStart;
      const newEndsAt = new Date(new Date(newStartsAt).getTime() + durationMs).toISOString();

      dbStore.rescheduleAppointment(reschedulingAppt.id, newStartsAt, newEndsAt);
      setAppointments(dbStore.getAppointments({ customerId }));
      setReschedulingAppt(null);
      showToast('Appointment successfully rescheduled.');
    } catch (err: any) {
      setRescheduleError(err.message || 'Slot conflict. Please select another time.');
    }
  };

  const filtered = appointments.filter(a => {
    if (activeTab === 'upcoming') return a.status === 'confirmed' || a.status === 'pending' || a.status === 'in_progress' || a.status === 'checked_in';
    if (activeTab === 'completed') return a.status === 'completed';
    return a.status === 'cancelled' || a.status === 'no_show';
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Sanctuary Appointments</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Review, reschedule, or reserve future grooming sessions.
          </p>
        </div>

        <Link to="/booking" className="btn btn-primary">
          <Calendar size={16} /> Book New Appointment
        </Link>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Upcoming Visits ({appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Past Completed ({appointments.filter(a => a.status === 'completed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`btn btn-sm ${activeTab === 'cancelled' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Cancelled ({appointments.filter(a => a.status === 'cancelled' || a.status === 'no_show').length})
        </button>
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <Calendar size={36} style={{ color: 'var(--color-sand)', marginBottom: '16px' }} />
          <h3>No appointments found in this category</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            Ready to schedule an unhurried visit for your companion?
          </p>
          <Link to="/booking" className="btn btn-primary btn-sm">
            Book a Ritual
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(appt => (
            <div
              key={appt.id}
              className="card-surface"
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span className={`badge ${appt.status === 'confirmed' ? 'badge-forest' : appt.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>
                    {appt.status.toUpperCase()}
                  </span>
                  <span className="badge badge-sand">Paid &bull; £{appt.price_snapshot}</span>
                </div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{appt.service_name}</h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  Pet: <strong>{appt.pet_name}</strong> ({appt.pet_breed})
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                  <Clock size={16} style={{ color: 'var(--color-terracotta)' }} />
                  <span>
                    {new Date(appt.starts_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(appt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <MapPin size={14} /> {appt.location_name}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {activeTab === 'upcoming' && (
                  <>
                    <button
                      onClick={() => {
                        setReschedulingAppt(appt);
                        setNewDate(appt.starts_at.split('T')[0]);
                        setNewTime('10:30');
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-danger)' }}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {activeTab === 'completed' && (
                  <Link to="/customer/grooming-records" className="btn btn-secondary btn-sm">
                    View Grooming Record &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingAppt && (
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
          <div className="card-surface" style={{ maxWidth: '480px', width: '100%', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Reschedule Appointment</h2>
              <button onClick={() => setReschedulingAppt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {rescheduleError && (
              <div style={{ padding: '12px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px' }}>
                {rescheduleError}
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="form-select"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:30">01:30 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:30">04:30 PM</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setReschedulingAppt(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

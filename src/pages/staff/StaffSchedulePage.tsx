import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { useStoreSync } from '../../hooks/useStoreSync';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  CheckCircle2,
  Scissors,
  AlertTriangle,
  Phone,
  X
} from 'lucide-react';

type ScheduleScope = 'all' | 'date';

function shiftIsoDate(dateStr: string, deltaDays: number): string {
  const base = new Date(`${dateStr}T12:00:00Z`);
  base.setUTCDate(base.getUTCDate() + deltaDays);
  return base.toISOString().split('T')[0];
}

function formatDateHeading(dateStr: string): string {
  const dt = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(dt.getTime())) return dateStr;
  return dt.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

function formatTimeRange(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const fmt = (d: Date) =>
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export const StaffSchedulePage: React.FC = () => {
  useStoreSync();
  const locations = dbStore.getLocations();
  const appointments = dbStore.getAppointments();
  const [scope, setScope] = useState<ScheduleScope>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const first = dbStore.getAppointments()[0];
    return first ? first.starts_at.split('T')[0] : new Date().toISOString().split('T')[0];
  });
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const todayIso = new Date().toISOString().split('T')[0];

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleStatusChange = (apptId: string, nextStatus: AppointmentStatus) => {
    dbStore.updateAppointmentStatus(apptId, nextStatus);
    showToast(`Schedule updated: appointment marked ${nextStatus.replace('_', ' ').toUpperCase()}.`);
  };

  const filteredAppointments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return appointments
      .filter(appt => {
        const apptDate = appt.starts_at.split('T')[0];
        if (scope === 'date' && apptDate !== selectedDate) return false;
        if (locationFilter !== 'all' && appt.location_id !== locationFilter) return false;
        if (statusFilter !== 'all' && appt.status !== statusFilter) return false;
        if (q) {
          const hay = `${appt.pet_name} ${appt.pet_breed} ${appt.customer_name} ${appt.service_name} ${appt.location_name}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  }, [appointments, scope, selectedDate, locationFilter, statusFilter, searchQuery]);

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, Appointment[]>();
    for (const appt of filteredAppointments) {
      const dateKey = appt.starts_at.split('T')[0];
      const existing = groups.get(dateKey) || [];
      existing.push(appt);
      groups.set(dateKey, existing);
    }
    return Array.from(groups.entries());
  }, [filteredAppointments]);

  const bookedDates = useMemo(() => {
    const set = new Set(appointments.map(a => a.starts_at.split('T')[0]));
    return Array.from(set).sort();
  }, [appointments]);

  const statusCounts = {
    all: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    checked_in: appointments.filter(a => a.status === 'checked_in').length,
    in_progress: appointments.filter(a => a.status === 'in_progress').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} data-testid="staff-schedule-page">
      {/* Page Title & Action Header */}
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
          <span className="badge badge-forest" style={{ marginBottom: '8px' }}>
            Studio Calendar &amp; Suites
          </span>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '4px' }}>Studio Schedule</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
            Chronological appointment timetable across suites, date views, companion allergies, and check-in stages.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/staff" className="btn btn-secondary btn-sm">
            Back to Staff Portal
          </Link>
          <Link to="/staff/grooming-records" className="btn btn-primary btn-sm">
            <Scissors size={15} /> Create Grooming Record
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
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

      {/* Date Navigation & Studio Controls Card */}
      <div className="card-surface" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Date Mode Switcher & Day Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setScope('all')}
              className={`btn btn-sm ${scope === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            >
              All Scheduled Dates ({appointments.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setScope('date');
                setSelectedDate(todayIso);
              }}
              className={`btn btn-sm ${scope === 'date' && selectedDate === todayIso ? 'btn-primary' : 'btn-ghost'}`}
            >
              Today
            </button>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-primary)'
              }}
            >
              <button
                type="button"
                aria-label="Previous day"
                onClick={() => {
                  setScope('date');
                  setSelectedDate(prev => shiftIsoDate(prev, -1));
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-primary)'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <input
                type="date"
                aria-label="Select schedule date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                    setScope('date');
                  }
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              />
              <button
                type="button"
                aria-label="Next day"
                onClick={() => {
                  setScope('date');
                  setSelectedDate(prev => shiftIsoDate(prev, 1));
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-primary)'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {bookedDates.length > 0 && scope === 'date' && !bookedDates.includes(selectedDate) && (
              <button
                type="button"
                onClick={() => setSelectedDate(bookedDates[0])}
                className="btn btn-secondary btn-sm"
              >
                Jump to Next Booked ({bookedDates[0]})
              </button>
            )}
          </div>

          {/* Search & Location Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineStart: '14px',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                aria-label="Search schedule appointments"
                placeholder="Search pet or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-control"
                style={{ minHeight: '38px', fontSize: '0.85rem' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    insetInlineEnd: '8px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'var(--color-bg-subtle)',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <select
              aria-label="Filter by studio location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="sort-select"
              style={{ minHeight: '38px', fontSize: '0.85rem' }}
            >
              <option value="all">All Studios ({locations.length})</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border-subtle)'
          }}
        >
          {[
            { id: 'all', label: `All (${statusCounts.all})` },
            { id: 'confirmed', label: `Confirmed (${statusCounts.confirmed})` },
            { id: 'checked_in', label: `Checked In (${statusCounts.checked_in})` },
            { id: 'in_progress', label: `In Progress (${statusCounts.in_progress})` },
            { id: 'completed', label: `Completed (${statusCounts.completed})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`filter-chip ${statusFilter === tab.id ? 'active' : ''}`}
              style={{ minHeight: '34px', padding: '5px 14px', fontSize: '0.8rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Schedule Groups */}
      {groupedByDate.length === 0 ? (
        <div className="card-surface" style={{ textAlign: 'center', padding: '52px 24px' }}>
          <Calendar size={38} style={{ color: 'var(--color-sand)', marginBottom: '12px', marginInline: 'auto' }} />
          <h2 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>No appointments scheduled for this view</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '18px', marginInline: 'auto' }}>
            {scope === 'date'
              ? `No sessions are booked on ${formatDateHeading(selectedDate)}.`
              : 'No appointments match the selected studio, status, or search filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setScope('all');
              setLocationFilter('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Schedule Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {groupedByDate.map(([dateKey, dayAppts]) => (
            <section key={dateKey} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Date Group Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingInline: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={17} style={{ color: 'var(--color-terracotta)' }} />
                  <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{formatDateHeading(dateKey)}</h2>
                </div>
                <span className="badge badge-sand">
                  {dayAppts.length} {dayAppts.length === 1 ? 'Session' : 'Sessions'}
                </span>
              </div>

              {/* Chronological Appointment Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {dayAppts.map(appt => {
                  const petProfile = appt.pet_id ? dbStore.getPetById(appt.pet_id) : undefined;
                  return (
                    <article
                      key={appt.id}
                      className="card-surface"
                      style={{
                        padding: '22px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '18px',
                        alignItems: 'center'
                      }}
                    >
                      {/* Time Window & Status */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="duration-pill">
                            <Clock size={12} /> {formatTimeRange(appt.starts_at, appt.ends_at)}
                          </span>
                          <span
                            className={`badge ${
                              appt.status === 'completed'
                                ? 'badge-success'
                                : appt.status === 'in_progress'
                                  ? 'badge-warning'
                                  : appt.status === 'cancelled'
                                    ? 'badge-danger'
                                    : 'badge-forest'
                            }`}
                          >
                            {appt.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
                          {appt.service_name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.825rem',
                            color: 'var(--color-text-secondary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <MapPin size={13} style={{ color: 'var(--color-terracotta)', flexShrink: 0 }} />
                          <span>{appt.location_name}</span>
                        </div>
                      </div>

                      {/* Companion, Guardian & Safety Notes */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.975rem' }}>
                          {appt.pet_name}{' '}
                          <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                            ({appt.pet_breed})
                          </span>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span>Client: {appt.customer_name}</span>
                          {appt.customer_phone && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              &bull; <Phone size={11} /> {appt.customer_phone}
                            </span>
                          )}
                        </div>
                        {appt.customer_notes && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)', fontStyle: 'italic' }}>
                            Booking Note: &ldquo;{appt.customer_notes}&rdquo;
                          </div>
                        )}
                        {petProfile?.care_notes && (
                          <div
                            style={{
                              marginTop: '4px',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--color-danger-bg)',
                              color: 'var(--color-danger)',
                              fontSize: '0.775rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              width: 'fit-content'
                            }}
                          >
                            <AlertTriangle size={12} /> {petProfile.care_notes}
                          </div>
                        )}
                      </div>

                      {/* Rate & Practitioner Controls */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                          Session Rate:{' '}
                          <strong style={{ color: 'var(--color-forest)', fontSize: '0.95rem' }}>
                            £{appt.price_snapshot}
                          </strong>{' '}
                          ({appt.payment_status})
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {appt.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(appt.id, 'checked_in')}
                              className="btn btn-secondary btn-sm"
                            >
                              Check In Pet
                            </button>
                          )}
                          {appt.status === 'checked_in' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(appt.id, 'in_progress')}
                              className="btn btn-primary btn-sm"
                            >
                              Start Grooming
                            </button>
                          )}
                          {appt.status === 'in_progress' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(appt.id, 'completed')}
                              className="btn btn-terracotta btn-sm"
                            >
                              Mark Completed
                            </button>
                          )}
                          <Link to="/staff/grooming-records" className="btn btn-ghost btn-sm">
                            <Scissors size={13} /> Log Coat Notes
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffSchedulePage;

import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Edit2,
  X
} from 'lucide-react';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => dbStore.getAppointments());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [modalStatus, setModalStatus] = useState<AppointmentStatus>('confirmed');
  const [modalNotes, setModalNotes] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const staff = dbStore.getStaff();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = appointments.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !search ||
      a.pet_name?.toLowerCase().includes(q) ||
      a.customer_name?.toLowerCase().includes(q) ||
      a.service_name?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleOpenEdit = (appt: Appointment) => {
    setEditingAppt(appt);
    setModalStatus(appt.status);
    setModalNotes(appt.internal_notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppt) return;

    dbStore.updateAppointmentStatus(editingAppt.id, modalStatus, modalNotes);
    setAppointments(dbStore.getAppointments());
    setEditingAppt(null);
    showToast(`Appointment status updated to ${modalStatus.toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Appointments Management</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Inspect client booking schedules, assign stylists, and monitor status transitions.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* Filter and Search */}
      <div className="card-surface" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search by pet, client, or ritual..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingInlineStart: '38px', paddingBlock: '8px', fontSize: '0.875rem' }}
          />
          <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ padding: '6px 14px', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="card-surface" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'start', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'start' }}>Pet &amp; Client</th>
                <th style={{ padding: '14px 20px', textAlign: 'start' }}>Service Ritual</th>
                <th style={{ padding: '14px 20px', textAlign: 'start' }}>Date &amp; Time</th>
                <th style={{ padding: '14px 20px', textAlign: 'start' }}>Rate</th>
                <th style={{ padding: '14px 20px', textAlign: 'start' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'end' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, i) => (
                <tr key={appt.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600 }}>{appt.pet_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {appt.customer_name} ({appt.pet_breed})
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div>{appt.service_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {appt.location_name}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {new Date(appt.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(appt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--color-forest)' }}>
                    £{appt.price_snapshot}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${appt.status === 'completed' ? 'badge-success' : appt.status === 'confirmed' ? 'badge-forest' : appt.status === 'in_progress' ? 'badge-warning' : 'badge-danger'}`}>
                      {appt.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'end' }}>
                    <button
                      onClick={() => handleOpenEdit(appt)}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit2 size={13} /> Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editingAppt && (
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
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Update Appointment #{editingAppt.id.slice(-6)}</h2>
              <button onClick={() => setEditingAppt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{editingAppt.pet_name} &bull; {editingAppt.service_name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Client: {editingAppt.customer_name}</div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Workflow Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as AppointmentStatus)}
                  className="form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Internal Director Notes</label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Internal audit notes, special arrangements..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditingAppt(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

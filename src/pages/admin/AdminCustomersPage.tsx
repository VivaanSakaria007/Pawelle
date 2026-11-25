import React, { useState, useEffect } from 'react';
import { dbStore } from '../../services/store';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Search, Mail, Phone, Users } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [, setStoreRevision] = useState(0);

  useEffect(() => {
    const unsubscribe = dbStore.subscribe(() => {
      setStoreRevision(prev => prev + 1);
    });

    const handleStorage = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key.startsWith('pawelle_customers') ||
        e.key.startsWith('pawelle_pets') ||
        e.key.startsWith('pawelle_appointments') ||
        e.key.startsWith('pawelle_orders') ||
        e.key === 'pawelle_sandbox_registered_users'
      ) {
        dbStore.refreshCustomersFromStorage();
      }
    };
    window.addEventListener('storage', handleStorage);

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .then(({ data }) => {
          if (data && data.length > 0) {
            data.forEach(p => {
              dbStore.upsertCustomerProfile({
                id: p.id,
                email: p.email || '',
                full_name: p.full_name || 'Valued Client',
                phone: p.phone || undefined,
                avatar_url: p.avatar_url || undefined,
                role: 'customer',
                created_at: p.created_at
              });
            });
          }
        });
    }

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const appointments = dbStore.getAppointments();
  const pets = dbStore.getPets();
  const orders = dbStore.getOrders();
  const clients = dbStore.getCustomers(search);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Customer Directory</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Inspect registered clients, their animal companions, booking frequencies, and apothecary orders.
          </p>
        </div>

        <div
          data-testid="customer-directory-count"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-forest-soft)',
            color: 'var(--color-forest)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <Users size={15} />
          <span>{clients.length} Registered {clients.length === 1 ? 'Client' : 'Clients'}</span>
        </div>
      </div>

      <div className="card-surface" style={{ padding: '16px 24px', maxWidth: '420px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            aria-label="Search customer directory"
            placeholder="Search by client name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingInlineStart: '38px', paddingBlock: '8px', fontSize: '0.875rem' }}
          />
          <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="card-surface" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No customer profiles match "{search}".
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
          {clients.map(client => {
            const clientPets = pets.filter(p => p.owner_id === client.id);
            const allClientAppointments = appointments.filter(a => a.customer_id === client.id);
            const activeAppointments = allClientAppointments.filter(a => a.status !== 'cancelled');
            const completedAppointments = activeAppointments.filter(a => a.status === 'completed');
            const upcomingAppointments = activeAppointments.filter(a => a.status !== 'completed');
            const clientOrders = orders.filter(o => o.customer_id === client.id);
            const initial = (client.full_name || client.email || 'C').trim().charAt(0).toUpperCase();

            return (
              <div
                key={client.id}
                data-testid={`customer-card-${client.id}`}
                className="card-surface"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-forest-soft)',
                    color: 'var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    {initial}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{client.full_name}</h2>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                      ID: {client.id}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-word' }}>
                    <Mail size={14} style={{ color: 'var(--color-forest)', flexShrink: 0 }} /> {client.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} style={{ color: 'var(--color-forest)', flexShrink: 0 }} /> {client.phone || 'Not provided'}
                  </div>
                </div>

                <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>Registered Pets</div>
                    <strong>
                      {clientPets.length} {clientPets.length === 1 ? 'companion' : 'companions'}
                    </strong>
                    {clientPets.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {clientPets.map(p => p.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>Appointments</div>
                    <strong>
                      {activeAppointments.length} total {activeAppointments.length === 1 ? 'visit' : 'visits'}
                    </strong>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: completedAppointments.length > 0 ? 'var(--color-forest)' : 'var(--color-text-muted)',
                        marginTop: '2px',
                        fontWeight: completedAppointments.length > 0 ? 600 : 400
                      }}
                    >
                      {completedAppointments.length} completed &bull; {upcomingAppointments.length} upcoming
                    </div>
                  </div>
                </div>

                {clientOrders.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Apothecary Orders</span>
                    <strong>{clientOrders.length} {clientOrders.length === 1 ? 'order' : 'orders'}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { Search, User, Heart, Calendar, Mail, Phone } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const appointments = dbStore.getAppointments();
  const pets = dbStore.getPets();
  const orders = dbStore.getOrders();

  // Synthetic client profiles extracted from store
  const clients = [
    {
      id: 'usr-demo-customer',
      name: 'Jessica Vance',
      email: 'jessica.vance@example.com',
      phone: '+44 7946 0991',
      city: 'London',
      pets: pets.filter(p => p.owner_id === 'usr-demo-customer'),
      appointments: appointments.filter(a => a.customer_id === 'usr-demo-customer'),
      orders: orders.filter(o => o.customer_id === 'usr-demo-customer')
    },
    {
      id: 'usr-customer-2',
      name: 'Harrison Blake',
      email: 'harrison.b@example.com',
      phone: '+44 7820 119933',
      city: 'London',
      pets: [],
      appointments: [],
      orders: []
    }
  ];

  const filteredClients = clients.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Customer Directory</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Inspect registered clients, their animal companions, booking frequencies, and apothecary orders.
        </p>
      </div>

      <div className="card-surface" style={{ padding: '16px 24px', maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by client name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingInlineStart: '38px', paddingBlock: '8px', fontSize: '0.875rem' }}
          />
          <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredClients.map(client => (
          <div key={client.id} className="card-surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                fontSize: '1.2rem'
              }}>
                {client.name[0]}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{client.name}</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>ID: {client.id}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} style={{ color: 'var(--color-forest)' }} /> {client.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} style={{ color: 'var(--color-forest)' }} /> {client.phone}
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: 'var(--color-text-secondary)' }}>Registered Pets</div>
                <strong>{client.pets.length} companions</strong>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-secondary)' }}>Appointments</div>
                <strong>{client.appointments.length} total visits</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

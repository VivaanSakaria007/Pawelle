import React from 'react';
import { dbStore } from '../../services/store';
import {
  Calendar,
  Users,
  ShoppingBag,
  TrendingUp,
  Clock,
  Sparkles,
  Shield,
  Star,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverviewPage: React.FC = () => {
  const appointments = dbStore.getAppointments();
  const orders = dbStore.getOrders();
  const products = dbStore.getProducts();
  const pets = dbStore.getPets();
  const reviews = dbStore.getReviews(false);
  const messages = dbStore.getContactMessages();

  const totalApptRevenue = appointments
    .filter(a => a.status === 'completed' || a.payment_status === 'paid')
    .reduce((sum, a) => sum + (Number(a.price_snapshot) || 0), 0);

  const totalShopRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const totalRevenue = totalApptRevenue + totalShopRevenue;

  const pendingReviews = reviews.filter(r => !r.is_approved).length;
  const newMessages = messages.filter(m => m.status === 'new').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
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
            Directorate Intelligence
          </span>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Studio Performance &amp; Analytics</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Real-time business telemetry across London atelier appointments, boutique apothecary, and client records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/appointments" className="btn btn-secondary btn-sm">
            Appointments
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            Fulfillment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="card-surface" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Total Verified Revenue</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-forest-soft)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-forest)' }}>
            £{totalRevenue.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '4px' }}>
            Appts: £{totalApptRevenue.toFixed(2)} &bull; Shop: £{totalShopRevenue.toFixed(2)}
          </div>
        </div>

        <div className="card-surface" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Total Appointments</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(166, 91, 70, 0.12)', color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {appointments.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {appointments.filter(a => a.status === 'confirmed').length} upcoming confirmed
          </div>
        </div>

        <div className="card-surface" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Apothecary Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {orders.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {orders.filter(o => o.order_status === 'processing').length} pending dispatch
          </div>
        </div>

        <div className="card-surface" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Pending Actions</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(214, 199, 173, 0.3)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-terracotta)' }}>
            {pendingReviews + newMessages}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {pendingReviews} reviews &bull; {newMessages} client inquiries
          </div>
        </div>
      </div>

      {/* Recent Activity Streams */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Recent Appointments */}
        <div className="card-surface" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Appointments</h2>
            <Link to="/admin/appointments" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest)' }}>
              Manage &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appointments.slice(0, 4).map(appt => (
              <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{appt.pet_name} ({appt.service_name})</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {appt.customer_name} &bull; {appt.starts_at.split('T')[0]}
                  </div>
                </div>
                <span className={`badge ${appt.status === 'completed' ? 'badge-success' : appt.status === 'confirmed' ? 'badge-forest' : 'badge-sand'}`}>
                  {appt.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Apothecary Orders */}
        <div className="card-surface" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Product Orders</h2>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest)' }}>
              Manage &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>No orders placed yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.slice(0, 4).map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.order_number}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {order.customer_name} &bull; {order.items.length} items
                    </div>
                  </div>
                  <div style={{ textAlign: 'end' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>£{order.total_amount.toFixed(2)}</div>
                    <span className="badge badge-forest">{order.order_status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

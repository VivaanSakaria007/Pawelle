import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/authentication/AuthContext';
import { dbStore } from '../../services/store';
import { ShoppingBag, PackageCheck, Clock, ExternalLink } from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const customerId = user?.id || 'usr-demo-customer';
  const orders = dbStore.getOrders(customerId);

  if (orders.length === 0) {
    return (
      <div className="card-surface" style={{ textAlign: 'center', padding: '64px' }}>
        <ShoppingBag size={40} style={{ color: 'var(--color-sand)', marginBottom: '16px' }} />
        <h2>No Orders Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Explore our organic apothecary formulations, herbal salves, and grooming accessories.
        </p>
        <Link to="/shop" className="btn btn-primary btn-sm">
          Browse Apothecary
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>My Apothecary Orders</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Track past deliveries and product invoices.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.map(order => (
          <div key={order.id} className="card-surface" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.15rem' }}>Order {order.order_number}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge badge-forest">{order.order_status.toUpperCase()}</span>
                <span className="badge badge-success">{order.payment_status.toUpperCase()}</span>
                <span style={{ fontWeight: 600, fontSize: '1.2rem', marginInlineStart: '12px', color: 'var(--color-forest)' }}>
                  £{order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.product_name_snapshot}
                        style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                      />
                    )}
                    <span>{item.quantity}&times; {item.product_name_snapshot}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>£{item.line_total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Shipping Summary */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              <div>Shipping to: <strong>{order.shipping_address.address_line1}, {order.shipping_address.city}</strong></div>
              <Link to="/shop" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>Reorder Products &rarr;</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

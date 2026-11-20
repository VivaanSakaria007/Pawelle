import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { CheckCircle2, PackageCheck, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = dbStore.getOrderById(id || '');

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container-narrow">
        <div className="card-surface" style={{ padding: 'clamp(28px, 5vw, 48px)', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginInline: 'auto',
            marginBottom: '20px'
          }}>
            <CheckCircle2 size={40} />
          </div>

          <span className="badge badge-success" style={{ marginBottom: '12px' }}>
            Payment Verified &amp; Confirmed
          </span>

          <h1 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>Thank you for your order</h1>
          <p className="lead" style={{ marginInline: 'auto', marginBottom: '28px' }}>
            Your order <strong>{order.order_number}</strong> has been received by our apothecary packaging suite.
          </p>

          {/* Details breakdown */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'start',
              marginBottom: '32px',
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Recipient:</span>
                <div style={{ fontWeight: 600 }}>{order.shipping_address.full_name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {order.shipping_address.address_line1}, {order.shipping_address.city} {order.shipping_address.postal_code}
                </div>
              </div>
              <div style={{ textAlign: 'end' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Order Status:</span>
                <div>
                  <span className="badge badge-forest">{order.order_status.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.quantity}&times; {item.product_name_snapshot}</span>
                  <span style={{ fontWeight: 600 }}>£{item.line_total.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border)', fontWeight: 600, fontSize: '1.05rem' }}>
                <span>Total Paid:</span>
                <span style={{ color: 'var(--color-forest)' }}>£{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/customer/orders" className="btn btn-primary">
              View in My Orders <ArrowRight size={16} className="arrow-icon" />
            </Link>
            <Link to="/shop" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

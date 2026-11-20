import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { Order, OrderStatus } from '../../types';
import { ShoppingBag, CheckCircle2, Truck, Package, Clock } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => dbStore.getOrders());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    dbStore.updateOrderStatus(id, newStatus);
    setOrders(dbStore.getOrders());
    showToast(`Order status updated to ${newStatus.toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Orders &amp; Fulfillment Manager</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Process client shipments, update fulfillment states, and review delivery destinations.
        </p>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card-surface" style={{ textAlign: 'center', padding: '48px' }}>
          <ShoppingBag size={36} style={{ color: 'var(--color-sand)', marginBottom: '16px' }} />
          <h3>No Orders in Queue</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Orders placed in the apothecary will appear here in real-time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.id} className="card-surface" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.15rem' }}>Order #{order.order_number}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Recipient: {order.customer_name} ({order.customer_email})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <select
                    value={order.order_status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="form-select"
                    style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                  >
                    <option value="pending_payment">Pending Payment</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <span style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--color-forest)' }}>
                    £{order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>{item.quantity}&times; {item.product_name_snapshot}</span>
                    <span style={{ fontWeight: 600 }}>£{item.line_total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: 'var(--color-text-secondary)', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <span>Delivery: {order.shipping_address.address_line1}, {order.shipping_address.city} {order.shipping_address.postal_code}</span>
                <span>Payment: <strong style={{ color: 'var(--color-success)' }}>{order.payment_status.toUpperCase()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

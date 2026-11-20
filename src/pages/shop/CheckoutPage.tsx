import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/authentication/AuthContext';
import { dbStore } from '../../services/store';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    full_name: user?.full_name || '',
    address_line1: '',
    address_line2: '',
    city: 'London',
    postal_code: '',
    country: 'United Kingdom',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="section" style={{ textAlign: 'center', backgroundColor: 'var(--color-bg-primary)' }}>
        <h2>Your shopping bag is empty</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>Return to Shop</Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!shippingAddress.full_name || !shippingAddress.address_line1 || !shippingAddress.postal_code || !shippingAddress.phone) {
      setErrorMsg('Please fill in all mandatory delivery fields.');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvc)) {
      setErrorMsg('Please enter your card payment details.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = items.map(item => ({
        id: `oi-${Date.now()}-${item.product.id}`,
        order_id: '',
        product_id: item.product.id,
        product_name_snapshot: item.product.name,
        unit_price_snapshot: item.product.sale_price || item.product.price,
        quantity: item.quantity,
        line_total: (item.product.sale_price || item.product.price) * item.quantity,
        image_url: item.product.image_url
      }));

      const newOrder = dbStore.createOrder({
        customer_id: user?.id || 'usr-guest-checkout',
        customer_name: shippingAddress.full_name,
        customer_email: user?.email || 'guest@pawelle.com',
        subtotal,
        shipping_amount: shipping,
        tax_amount: tax,
        total_amount: total,
        currency: 'GBP',
        order_status: 'processing',
        payment_status: 'paid',
        shipping_address: shippingAddress,
        items: orderItems
      });

      clearCart();
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed. Please check stock or details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Secure Checkout</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Complete your purchase with guaranteed safe packaging and delivery.
        </p>

        {errorMsg && (
          <div style={{ padding: '16px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'start'
            }}
          >
            {/* Left: Shipping & Payment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Delivery Address */}
              <div className="card-surface" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '1.35rem', marginBottom: '20px' }}>1. Delivery Address</h2>

                <div className="form-group">
                  <label className="form-label">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.full_name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, full_name: e.target.value })}
                    className="form-input"
                    placeholder="Jessica Vance"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address_line1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address_line1: e.target.value })}
                    className="form-input"
                    placeholder="Flat 4, 18 South Audley Street"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.address_line2}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address_line2: e.target.value })}
                    className="form-input"
                    placeholder="Mayfair"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                      className="form-input"
                      placeholder="W1K 2PS"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="form-input"
                    placeholder="+44 7946 0991"
                  />
                  <span className="form-hint">Used strictly for delivery notifications</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card-surface" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '1.35rem', marginBottom: '20px' }}>2. Payment Information</h2>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'card' ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                      backgroundColor: paymentMethod === 'card' ? 'var(--color-forest-soft)' : 'transparent',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <CreditCard size={18} /> Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'apple_pay' ? '2px solid var(--color-forest)' : '1px solid var(--color-border)',
                      backgroundColor: paymentMethod === 'apple_pay' ? 'var(--color-forest-soft)' : 'transparent',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Apple / Google Pay
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                        className="form-input"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Expiry MM/YY</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">CVC / Security Code</label>
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="884"
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      Biometric checkout ready. Confirm your purchase when prompted by clicking the Place Order button.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="card-surface" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                Review Your Items
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={item.product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        Qty: {item.quantity} &times; £{item.product.sale_price || item.product.price}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      £{((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBlock: '16px', borderBlock: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Delivery</span>
                  <span>{shipping === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `£${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Tax (5%)</span>
                  <span>£{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: '1.25rem', fontWeight: 600 }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-heading)' }}>£{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
              >
                {isProcessing ? 'Verifying payment...' : (
                  <>
                    <Lock size={16} /> Pay &amp; Place Order — £{total.toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

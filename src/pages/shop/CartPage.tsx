import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../features/cart/CartContext';
import { PawelleImage } from '../../components/common/PawelleImage';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    shipping,
    tax,
    total
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-forest-soft)',
            color: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginInline: 'auto',
            marginBottom: '24px'
          }}>
            <ShoppingBag size={36} />
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '16px' }}>Your Shopping Bag is Empty</h1>
          <p className="lead" style={{ marginInline: 'auto', marginBottom: '32px' }}>
            Explore our botanical coat shampoos, nourishing paw salves, and artisanal German beechwood brushes.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Explore Apothecary
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Your Shopping Bag</h1>
            <p style={{ margin: 0 }}>Review selected items ({totalItems} {totalItems === 1 ? 'item' : 'items'})</p>
          </div>
          <button onClick={clearCart} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Clear Bag
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}
        >
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(item => {
              const unitPrice = item.product.sale_price || item.product.price;
              const lineTotal = (unitPrice * item.quantity).toFixed(2);

              return (
                <div
                  key={item.product.id}
                  className="card-surface"
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    padding: '20px',
                    flexWrap: 'wrap'
                  }}
                >
                  <PawelleImage
                    src={item.product.image_url}
                    alt={item.product.name}
                    fallbackSrc="/assets/products/botanical-shampoo.jpg"
                    style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {item.product.category_name}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>
                      <Link to={`/shop/${item.product.slug}`} style={{ color: 'inherit' }}>
                        {item.product.name}
                      </Link>
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                      £{unitPrice} each
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-bg-primary)', padding: '2px' }}>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-primary)' }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ paddingInline: '12px', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      style={{ background: 'none', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-primary)' }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div style={{ textAlign: 'end', minWidth: '80px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--color-forest)', fontFamily: 'var(--font-heading)' }}>
                      £{lineTotal}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginTop: '6px' }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: '16px' }}>
              <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="card-surface" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Delivery Fee</span>
                <span>{shipping === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `£${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)' }}>
                  Add £{(50 - subtotal).toFixed(2)} more for complimentary shipping!
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Standard Tax (5%)</span>
                <span>£{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--color-border)', fontSize: '1.25rem', fontWeight: 600 }}>
                <span>Estimated Total</span>
                <span style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-heading)' }}>£{total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}>
              Proceed to Secure Checkout <ArrowRight size={18} className="arrow-icon" />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-forest)' }} />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

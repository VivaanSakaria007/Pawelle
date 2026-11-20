import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { useCart } from '../../features/cart/CartContext';
import {
  ShoppingBag,
  Heart,
  Check,
  ArrowLeft,
  ShieldCheck,
  Droplets,
  PackageCheck,
  Plus,
  Minus
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = dbStore.getProductBySlug(slug || '');
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', paddingBlock: '14px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={14} /> Back to Apothecary
          </Link>
          <span style={{ color: 'var(--color-border-strong)' }}>/</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 6vw, 64px)',
              alignItems: 'start'
            }}
          >
            {/* Left: Product Imagery */}
            <div>
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', height: '480px', objectFit: 'cover' }}
                />
              </div>

              {/* Guarantees Box */}
              <div className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                  <span>100% Non-Toxic &amp; Cruelty-Free</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <Droplets size={18} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                  <span>Free of parabens, sulfates &amp; synthetic fragrance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <PackageCheck size={18} style={{ color: 'var(--color-terracotta)', flexShrink: 0 }} />
                  <span>Complimentary carbon-neutral delivery on orders over £50</span>
                </div>
              </div>
            </div>

            {/* Right: Purchasing & Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-sand">{product.category_name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>SKU: {product.sku}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '16px' }}>
                {product.name}
              </h1>

              {/* Price & Stock */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-forest)' }}>
                  £{product.sale_price || product.price}
                </div>
                {product.sale_price && (
                  <div style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                    £{product.price}
                  </div>
                )}
                <span className="badge badge-success" style={{ marginInlineStart: 'auto' }}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} In Stock` : 'Out of Stock'}
                </span>
              </div>

              <p className="lead" style={{ marginBottom: '28px' }}>
                {product.description}
              </p>

              {/* Quantity Picker & Add to Cart */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-bg-surface)', padding: '4px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    style={{ background: 'none', border: 'none', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ paddingInline: '16px', fontWeight: 600, fontSize: '1rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    aria-label="Increase quantity"
                    style={{ background: 'none', border: 'none', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                  className={`btn ${justAdded ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                  style={{ flex: 1, minWidth: '220px' }}
                >
                  {justAdded ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add to Cart — £{((product.sale_price || product.price) * quantity).toFixed(2)}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist toggle"
                  className="btn btn-secondary"
                  style={{ padding: '14px', borderRadius: '50%' }}
                >
                  <Heart
                    size={20}
                    fill={isInWishlist(product.id) ? 'var(--color-terracotta)' : 'none'}
                    color={isInWishlist(product.id) ? 'var(--color-terracotta)' : 'var(--color-forest)'}
                  />
                </button>
              </div>

              {/* Ingredients & Benefits Tabs/Blocks */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Active Botanicals &amp; Ingredients</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="badge badge-sand">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.benefits && product.benefits.length > 0 && (
                <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Target Benefits</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {product.benefits.map((ben, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <Check size={16} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

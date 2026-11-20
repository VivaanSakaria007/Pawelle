import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { useCart } from '../../features/cart/CartContext';
import {
  ShoppingBag,
  Search,
  Filter,
  Heart,
  Check,
  Star,
  Sparkles
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const products = dbStore.getProducts();

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div>
      {/* Header */}
      <section style={{ backgroundColor: 'var(--color-bg-primary)', paddingBlock: 'clamp(48px, 6vw, 72px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="section-kicker">The PAWELLE Apothecary</div>
          <h1 style={{ marginBottom: '20px' }}>Organic Botanicals &amp; Grooming Tools</h1>
          <p className="lead" style={{ marginInline: 'auto' }}>
            Bring atelier-grade coat wellness into your home. Small-batch botanical formulas handcrafted with colloidal oats, raw shea butter, and sustainable beechwood.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ backgroundColor: 'var(--color-bg-surface)', paddingBlock: '20px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: '80px', zIndex: 40 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            >
              All Apothecary
            </button>
            <button
              onClick={() => setSelectedCategory('pcat-1')}
              className={`btn btn-sm ${selectedCategory === 'pcat-1' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Coat &amp; Bath
            </button>
            <button
              onClick={() => setSelectedCategory('pcat-2')}
              className={`btn btn-sm ${selectedCategory === 'pcat-2' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Paw &amp; Skin Salves
            </button>
            <button
              onClick={() => setSelectedCategory('pcat-3')}
              className={`btn btn-sm ${selectedCategory === 'pcat-3' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Artisanal Brushes
            </button>
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search apothecary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingInlineStart: '38px', paddingBlock: '8px', fontSize: '0.875rem' }}
            />
            <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--color-text-secondary)' }} />
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px'
            }}
          >
            {filteredProducts.map(product => (
              <article
                key={product.id}
                className="card-surface"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Save to Wishlist"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    insetInlineEnd: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Heart
                    size={18}
                    fill={isInWishlist(product.id) ? 'var(--color-terracotta)' : 'none'}
                    color={isInWishlist(product.id) ? 'var(--color-terracotta)' : 'var(--color-text-primary)'}
                  />
                </button>

                {/* Product Cover */}
                <Link to={`/shop/${product.slug}`} style={{ height: '280px', overflow: 'hidden', display: 'block' }}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-terracotta)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {product.category_name}
                  </div>

                  <h2 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
                    <Link to={`/shop/${product.slug}`} style={{ color: 'inherit' }}>
                      {product.name}
                    </Link>
                  </h2>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '16px', flex: 1 }}>
                    {product.description.substring(0, 100)}...
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-forest)', fontFamily: 'var(--font-heading)' }}>
                        £{product.sale_price || product.price}
                      </span>
                      {product.sale_price && (
                        <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                          £{product.price}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: product.stock_quantity > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Sold out'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    disabled={product.stock_quantity <= 0}
                    className={`btn ${addedId === product.id ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {addedId === product.id ? (
                      <>
                        <Check size={16} /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

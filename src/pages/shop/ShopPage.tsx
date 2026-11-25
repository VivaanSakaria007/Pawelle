import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dbStore } from '../../services/store';
import { useCart } from '../../features/cart/CartContext';
import { useRequireAuth } from '../../features/authentication/useRequireAuth';
import { PawelleImage } from '../../components/common/PawelleImage';
import {
  ShoppingBag,
  Search,
  Heart,
  Check,
  X,
  ArrowUpDown
} from 'lucide-react';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

export const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { requireAuth } = useRequireAuth();
  const products = dbStore.getProducts();

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        Boolean(product.category_name?.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.sale_price ?? a.price;
      const priceB = b.sale_price ?? b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth(() => {
      addToCart(product, 1);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1800);
    });
  };

  const handleToggleWishlist = (productId: string) => {
    requireAuth(() => {
      toggleWishlist(productId);
    });
  };

  const categories = [
    { id: 'all', label: 'All Formulations' },
    { id: 'pcat-1', label: 'Coat & Hydro-Wash' },
    { id: 'pcat-2', label: 'Paw & Skin Balms' },
    { id: 'pcat-3', label: 'Artisanal Implements' }
  ];

  return (
    <div>
      {/* Header */}
      <section
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          paddingTop: 'clamp(56px, 7vw, 92px)',
          paddingBottom: 'clamp(48px, 6vw, 76px)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '16px' }}>
            The Mayfair Apothecary &bull; Small-Batch British Craft
          </div>
          <h1 className="editorial-headline" style={{ marginBottom: '20px' }}>
            Organic Botanicals &amp; <br />
            <span className="font-serif-italic">Grooming Implements.</span>
          </h1>
          <p className="lead" style={{ marginInline: 'auto', color: 'var(--color-text-secondary)', maxWidth: '60ch' }}>
            Extend atelier-grade coat and skin wellness into your home. Small-batch formulations handcrafted in England with organic colloidal oats, raw shea butter, and FSC-certified European beechwood.
          </p>
        </div>
      </section>

      {/* Refined Filter, Search & Sorting Bar */}
      <section
        data-testid="apothecary-filter-bar"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          paddingBlock: '20px',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }} role="group" aria-label="Product category filters">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={isActive}
                  className={`filter-chip ${isActive ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineStart: '16px',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                aria-label="Search botanical items"
                placeholder="Search botanical items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-control"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    insetInlineEnd: '10px',
                    width: '24px',
                    height: '24px',
                    background: 'var(--color-bg-subtle)',
                    border: 'none',
                    borderRadius: '50%',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              <select
                aria-label="Sort apothecary products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="sort-select"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div
              className="card-surface"
              style={{
                textAlign: 'center',
                padding: '56px 24px',
                maxWidth: '580px',
                marginInline: 'auto'
              }}
            >
              <ShoppingBag size={36} style={{ color: 'var(--color-sand)', marginBottom: '14px', marginInline: 'auto' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No formulations match your filters</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', marginInline: 'auto' }}>
                Try clearing your search keyword or viewing all curated Mayfair apothecary categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="btn btn-secondary btn-sm"
              >
                Reset Apothecary Filters
              </button>
            </div>
          ) : (
            <div
              className="apothecary-product-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: 'clamp(28px, 4vw, 40px)',
                alignItems: 'stretch'
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
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleWishlist(product.id)}
                    aria-label={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Save to Wishlist'}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      insetInlineEnd: '16px',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                    }}
                  >
                    <Heart
                      size={17}
                      fill={isInWishlist(product.id) ? 'var(--color-terracotta)' : 'none'}
                      color={isInWishlist(product.id) ? 'var(--color-terracotta)' : 'var(--color-text-primary)'}
                    />
                  </button>

                  {/* Product Cover */}
                  <Link to={`/shop/${product.slug}`} style={{ height: '280px', overflow: 'hidden', display: 'block', flexShrink: 0 }}>
                    <PawelleImage
                      src={product.image_url}
                      alt={product.name}
                      fallbackSrc="/assets/products/botanical-shampoo.jpg"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </Link>

                  <div style={{ padding: '26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ marginBottom: '10px' }}>
                      <span className="editorial-tag">{product.category_name}</span>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
                      <Link to={`/shop/${product.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {product.name}
                      </Link>
                    </h2>

                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                      {product.description.substring(0, 110)}...
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
                          £{product.sale_price || product.price}
                        </span>
                        {product.sale_price && (
                          <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                            £{product.price}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: product.stock_quantity > 0 ? 'var(--color-forest)' : 'var(--color-danger)', fontWeight: 500 }}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Sold out'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      disabled={product.stock_quantity <= 0}
                      className={`btn ${addedId === product.id ? 'btn-secondary' : 'btn-primary'}`}
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        minHeight: '44px'
                      }}
                    >
                      {addedId === product.id ? (
                        <>
                          <Check size={16} /> Added to Cart
                        </>
                      ) : product.stock_quantity <= 0 ? (
                        'Out of Stock'
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
          )}
        </div>
      </section>
      <style>{`
        @media (max-width: 375px) {
          .apothecary-product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

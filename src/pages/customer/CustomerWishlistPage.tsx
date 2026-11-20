import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../features/cart/CartContext';
import { dbStore } from '../../services/store';
import { Bookmark, ShoppingBag, Trash2 } from 'lucide-react';

export const CustomerWishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const allProducts = dbStore.getProducts();
  const savedProducts = allProducts.filter(p => wishlist.includes(p.id));

  if (savedProducts.length === 0) {
    return (
      <div className="card-surface" style={{ textAlign: 'center', padding: '64px' }}>
        <Bookmark size={40} style={{ color: 'var(--color-sand)', marginBottom: '16px' }} />
        <h2>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Save products you love from our apothecary collection for later.
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
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Saved Wishlist</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Items you've bookmarked for your companions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {savedProducts.map(product => (
          <div key={product.id} className="card-surface" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '220px', objectFit: 'cover' }}
            />
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>
                <Link to={`/shop/${product.slug}`} style={{ color: 'inherit' }}>
                  {product.name}
                </Link>
              </h3>
              <div style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--color-forest)', marginBottom: '16px' }}>
                £{product.sale_price || product.price}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={14} /> Add to Bag
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

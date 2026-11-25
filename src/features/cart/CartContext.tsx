import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, Product } from '../../types';
import { useAuth } from '../authentication/AuthContext';

interface CartContextType {
  items: CartItem[];
  wishlist: string[]; // product IDs
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const getCartStorageKey = (userId?: string | null) =>
  userId ? `pawelle_cart_items_${userId}` : 'pawelle_cart_items_guest';

export const getWishlistStorageKey = (userId?: string | null) =>
  userId ? `pawelle_wishlist_${userId}` : 'pawelle_wishlist_guest';

function readStorageArray<T>(key: string): T[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorageArray<T>(key: string, value: T[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || null;

  // Clean up legacy unscoped cart/wishlist keys so they never bleed across users
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('pawelle_cart_items');
        localStorage.removeItem('pawelle_wishlist');
      }
    } catch {
      // ignore
    }
  }, []);

  const [items, setItems] = useState<CartItem[]>(() =>
    userId ? readStorageArray<CartItem>(getCartStorageKey(userId)) : []
  );

  const [wishlist, setWishlist] = useState<string[]>(() =>
    userId ? readStorageArray<string>(getWishlistStorageKey(userId)) : []
  );

  // Immediately reload user-scoped cart and wishlist whenever active user switches or logs out
  useEffect(() => {
    if (!userId) {
      setItems([]);
      setWishlist([]);
      return;
    }
    setItems(readStorageArray<CartItem>(getCartStorageKey(userId)));
    setWishlist(readStorageArray<string>(getWishlistStorageKey(userId)));
  }, [userId]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    const key = getCartStorageKey(userId);
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      let next: CartItem[];
      if (existing) {
        const newQty = Math.min(product.stock_quantity, existing.quantity + quantity);
        next = prev.map(i => i.product.id === product.id ? { ...i, quantity: newQty } : i);
      } else {
        next = [...prev, { product, quantity: Math.min(product.stock_quantity, quantity) }];
      }
      if (userId) writeStorageArray(key, next);
      return next;
    });
  }, [userId]);

  const removeFromCart = useCallback((productId: string) => {
    const key = getCartStorageKey(userId);
    setItems(prev => {
      const next = prev.filter(i => i.product.id !== productId);
      if (userId) writeStorageArray(key, next);
      return next;
    });
  }, [userId]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const key = getCartStorageKey(userId);
    setItems(prev => {
      const next = prev.map(i => {
        if (i.product.id === productId) {
          const validQty = Math.min(i.product.stock_quantity, quantity);
          return { ...i, quantity: validQty };
        }
        return i;
      });
      if (userId) writeStorageArray(key, next);
      return next;
    });
  }, [userId, removeFromCart]);

  const clearCart = useCallback(() => {
    const key = getCartStorageKey(userId);
    setItems([]);
    if (userId) writeStorageArray(key, []);
  }, [userId]);

  const toggleWishlist = useCallback((productId: string) => {
    const key = getWishlistStorageKey(userId);
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      if (userId) writeStorageArray(key, next);
      return next;
    });
  }, [userId]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Free shipping over £50, else £4.95
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 4.95;
  const tax = Number((subtotal * 0.05).toFixed(2)); // 5% VAT / pet care standard
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        totalItems,
        subtotal,
        shipping,
        tax,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

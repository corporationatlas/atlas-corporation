import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe utilizarse dentro de un WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userKey = currentUser ? (currentUser.id || currentUser.uid || currentUser.email) : 'guest';
  const storageKey = `atlas_wishlist_${userKey}`;

  const loadWishlistFromStorage = (key) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error cargando wishlist de localStorage', err);
      return [];
    }
  };

  const [wishlist, setWishlist] = useState(() => loadWishlistFromStorage(storageKey));

  // Aislamiento estricto: al cambiar de usuario o cerrar sesión se carga la lista de favoritos correspondiente
  useEffect(() => {
    setWishlist(loadWishlistFromStorage(storageKey));
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (err) {
      console.error('Error guardando wishlist en localStorage', err);
    }
  }, [wishlist, storageKey]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item) === productId);
  };

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => (item.id || item) === product.id);
      if (exists) {
        return prev.filter((item) => (item.id || item) !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => (item.id || item) !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

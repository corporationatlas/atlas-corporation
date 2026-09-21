import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe utilizarse dentro de un WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_wishlist_v1');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error cargando wishlist de localStorage', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('atlas_wishlist_v1', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Error guardando wishlist en localStorage', err);
    }
  }, [wishlist]);

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

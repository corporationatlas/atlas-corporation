import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Inicialización con persistencia y sanitización estricta de datos
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_cart_v2') || localStorage.getItem('tienda_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) => item && item.product && typeof item.product.price === 'number' && item.product.name
        );
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', productName: '' });

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('atlas_cart_v2', JSON.stringify(cart));
    } catch (err) {
      console.error('Error guardando carrito', err);
    }
  }, [cart]);

  const showToast = (message, productName = '') => {
    setToast({ show: true, message, productName });
    setTimeout(() => {
      setToast({ show: false, message: '', productName: '' });
    }, 3200);
  };

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    if (!product || typeof product.price !== 'number') return;

    setCart((prevCart) => {
      const variantKey = selectedVariant ? JSON.stringify(selectedVariant) : '';
      const existingIndex = prevCart.findIndex(
        (item) => item.product?.id === product.id && JSON.stringify(item.selectedVariant) === variantKey
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity, selectedVariant }];
      }
    });

    showToast('¡Agregado a tu solicitud de procura!', product.name);
  };

  const updateQuantity = (productId, selectedVariant, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }

    setCart((prevCart) => {
      const variantKey = selectedVariant ? JSON.stringify(selectedVariant) : '';
      return prevCart.map((item) => {
        if (item.product?.id === productId && JSON.stringify(item.selectedVariant) === variantKey) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId, selectedVariant) => {
    setCart((prevCart) => {
      const variantKey = selectedVariant ? JSON.stringify(selectedVariant) : '';
      return prevCart.filter(
        (item) => !(item.product?.id === productId && JSON.stringify(item.selectedVariant) === variantKey)
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setCoupon('');
  };

  const applyCoupon = (code) => {
    setCouponError('');
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'DESCUENTO10' || cleanCode === 'ATLAS10') {
      setDiscountPercent(10);
      setCoupon(cleanCode);
      return true;
    } else if (cleanCode === 'VERANO20' || cleanCode === 'PROMO20') {
      setDiscountPercent(20);
      setCoupon(cleanCode);
      return true;
    } else {
      setCouponError('Cupón inválido. Prueba con "ATLAS10"');
      return false;
    }
  };

  // Cálculos ultra-seguros contra valores nulos
  const cartCount = cart.reduce((total, item) => total + (item?.quantity || 0), 0);
  const subtotal = cart.reduce((sum, item) => {
    const p = typeof item?.product?.price === 'number' ? item.product.price : 0;
    const q = typeof item?.quantity === 'number' ? item.quantity : 1;
    return sum + p * q;
  }, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = 0; // Flete marítimo incluido en cotización CIF
  const total = Math.max(0, subtotal - discountAmount + shipping);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discountPercent,
        discountAmount,
        coupon,
        couponError,
        applyCoupon,
        shipping,
        total,
        toast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

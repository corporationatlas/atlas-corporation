import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isAdded, setIsAdded] = useState(false);

  // Sincronizar estado cuando se abre con un nuevo producto
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      setIsAdded(false);

      // Variante inicial por defecto
      if (product.variants && product.variants.length > 0) {
        const initialVars = {};
        product.variants.forEach((v) => {
          initialVars[v.type] = v.options[0];
        });
        setSelectedVariants(initialVars);
      } else {
        setSelectedVariants({});
      }
    }
  }, [product]);

  // Cerrar con la tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Left: Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white bg-slate-900 rounded-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Vista adicional" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Purchase Controls */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="uppercase font-semibold tracking-wider text-indigo-600">{product.category}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount} opiniones)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 text-xs font-extrabold bg-rose-100 text-rose-700 rounded-md">
                      Ahorras {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Variants (e.g., Color / Size) */}
                {product.variants && product.variants.map((variant) => (
                  <div key={variant.type} className="mb-4">
                    <span className="block text-xs font-bold text-slate-700 mb-2">
                      {variant.type}: <span className="font-normal text-slate-600">{selectedVariants[variant.type]}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => {
                        const isSelected = selectedVariants[variant.type] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariants({ ...selectedVariants, [variant.type]: opt })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-1'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Key features bullets */}
                {product.features && (
                  <div className="space-y-1.5 mb-5 pt-3 border-t border-slate-100">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions & Quantity */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98 shadow-indigo-200'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Añadido al Carrito!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Añadir al Carrito (${(product.price * quantity).toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust guarantee microcopy */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-indigo-500" /> Entrega rápida
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" /> Garantía 100%
                  </span>
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-500" /> 30 días devolución
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

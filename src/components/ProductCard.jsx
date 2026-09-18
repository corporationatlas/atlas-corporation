import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    // Añadimos con la primera opción de variante si existe
    const defaultVariant = product.variants ? { [product.variants[0].type]: product.variants[0].options[0] } : null;
    addToCart(product, 1, defaultVariant);

    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const badgeColors = {
    'Más Vendido': 'bg-amber-500 text-white',
    'Oferta': 'bg-rose-500 text-white',
    'Nuevo': 'bg-emerald-500 text-white',
    'Envío Gratis': 'bg-indigo-600 text-white',
    'Popular': 'bg-purple-600 text-white'
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative w-full pt-[85%] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md shadow-sm ${badgeColors[product.badge] || 'bg-slate-800 text-white'}`}>
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 rounded-md w-fit">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Floating Button on hover */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-slate-900 font-semibold text-xs shadow-lg hover:bg-indigo-600 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Rápida</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="capitalize font-medium text-indigo-600">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-slate-700">{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {/* Brief teaser description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Stock disponible</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isAdding
                ? 'bg-emerald-600 text-white scale-95'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            }`}
            aria-label="Añadir producto al carrito"
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Añadir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

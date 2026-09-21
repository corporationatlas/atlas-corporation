import React, { useState } from 'react';
import { Heart, ShoppingCart, Check, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';

export const VehicleCard = ({ vehicle, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { language, t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = isInWishlist(vehicle.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    const defaultVariant = vehicle.variants ? { [vehicle.variants[0].type]: vehicle.variants[0].options[0] } : null;
    addToCart(vehicle, 1, defaultVariant);

    setTimeout(() => {
      setIsAdding(false);
    }, 900);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleWishlist(vehicle);
  };

  return (
    <div
      onClick={() => onQuickView(vehicle)}
      className="group relative bg-[#13151d] hover:bg-[#161822] rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl"
    >
      {/* Vehicle Studio Image Area */}
      <div className="relative w-full aspect-square bg-[#0b0c10] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-Right: Botoncito pequeño de Favoritos (Corazón) - Referencia 1 */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 ${
            isFavorited
              ? 'bg-red-500/20 text-red-500 border border-red-500/40 shadow-lg shadow-red-500/20'
              : 'bg-black/50 text-slate-300 hover:text-white hover:bg-black/70 border border-white/10'
          }`}
          title={isFavorited ? (language === 'es' ? 'En favoritos' : 'In wishlist') : (language === 'es' ? 'Añadir a favoritos' : 'Add to wishlist')}
          aria-label="Favoritos"
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isFavorited ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-300 hover:scale-110'
            }`}
          />
        </button>

        {/* Bottom-Left: Botón circular flotante de Carrito - Referencia 1 */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className={`absolute bottom-3.5 left-3.5 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90 ${
            isAdding
              ? 'bg-emerald-600 text-white shadow-emerald-600/40 scale-105'
              : 'bg-[#5b6574]/90 hover:bg-[#6c788a] text-white border border-white/20 hover:scale-105 shadow-black/60'
          }`}
          title={language === 'es' ? 'Añadir a la cesta' : 'Add to cart'}
          aria-label="Añadir a la cesta"
        >
          {isAdding ? (
            <Check className="w-5 h-5 text-white animate-in zoom-in-50 duration-200" />
          ) : (
            <ShoppingCart className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Hover Tooltip con el nombre del producto al estilo de la referencia */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <span className="px-3 py-1.5 rounded-lg bg-black/85 text-white text-xs font-semibold border border-white/15 backdrop-blur-md shadow-2xl whitespace-nowrap">
            {vehicle.name}
          </span>
        </div>

        {/* Origin / Logistics Tag sutil */}
        <div className="absolute bottom-3.5 right-3.5 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded-md bg-black/70 text-slate-300 border border-white/10 backdrop-blur-xs">
            <MapPin className="w-2.5 h-2.5 text-red-500" />
            <span>{vehicle.origin || 'Dubái'}</span>
          </span>
        </div>
      </div>

      {/* Info inferior limpia: Nombre y Precio (Estilo Referencia 1) */}
      <div className="p-4 pt-3.5 flex flex-col justify-between flex-1 space-y-1.5">
        <h3 className="text-base font-bold text-white group-hover:text-slate-200 transition-colors line-clamp-1 tracking-tight">
          {vehicle.name}
        </h3>

        <div className="flex items-baseline justify-between pt-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-white">
              ${vehicle.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">USD</span>
          </div>

          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="hidden xs:inline">{language === 'es' ? 'CIF Venezuela' : 'CIF Venezuela'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

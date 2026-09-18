import React, { useState } from 'react';
import { Eye, Plus, Check, ShieldCheck, MapPin, Gauge, Fuel } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const VehicleCard = ({ vehicle, onQuickView }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddProcurement = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    const defaultVariant = vehicle.variants ? { [vehicle.variants[0].type]: vehicle.variants[0].options[0] } : null;
    addToCart(vehicle, 1, defaultVariant);

    setTimeout(() => {
      setIsAdding(false);
    }, 700);
  };

  return (
    <div
      onClick={() => onQuickView(vehicle)}
      className="group relative bg-[#15171e] rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl"
    >
      {/* Vehicle Studio Image Area */}
      <div className="relative w-full pt-[70%] bg-[#0d0e12] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Origin & Line Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-md bg-black/80 text-white border border-white/15 backdrop-blur-xs">
            {vehicle.line}
          </span>
          {vehicle.badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600/90 text-white rounded-md w-fit">
              {vehicle.badge}
            </span>
          )}
        </div>

        {/* Logistics Route Pin */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-full bg-black/70 text-slate-300 border border-white/10 backdrop-blur-md">
            <MapPin className="w-3 h-3 text-red-500" />
            <span>{vehicle.origin} ➔ VEN</span>
          </span>
        </div>

        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(vehicle);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-200 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ficha Técnica</span>
          </button>
        </div>
      </div>

      {/* Vehicle Specifications & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-slate-200 transition-colors">
            {vehicle.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {vehicle.description}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.engine}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.fuelEconomy}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white">
                ${vehicle.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-400">USD</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Puesto en Venezuela
            </span>
          </div>

          <button
            onClick={handleAddProcurement}
            disabled={isAdding}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-900 hover:bg-slate-200 active:scale-95'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Cotizar Procura</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

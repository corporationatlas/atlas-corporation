import React, { useState } from 'react';
import { X, Trash2, ShoppingCart, ArrowRight, ShieldCheck, MapPin, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ onCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    total
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#13141b] text-white border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0e0f14]">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-white" />
              <h2 className="text-base font-extrabold text-white tracking-wide">Solicitud de Procura</h2>
              <span className="px-2 py-0.5 text-xs font-bold bg-white/10 text-slate-200 rounded-full">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} {cart.reduce((sum, i) => sum + i.quantity, 0) === 1 ? 'unidad' : 'unidades'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logistics Banner */}
          <div className="bg-[#1a1c27] px-5 py-3 border-b border-white/5 flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tarifas CIF incluyen flete marítimo, seguro y gestión de aduana en Venezuela.</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 text-slate-400 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">No tienes vehículos seleccionados</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Explora nuestras líneas de procura y añade los modelos o motocicletas que deseas importar.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-200 transition-all shadow-md"
                >
                  Explorar Líneas de Procura
                </button>
              </div>
            ) : (
              cart.map((item, idx) => {
                const variantKey = item.selectedVariant ? JSON.stringify(item.selectedVariant) : '';
                return (
                  <div
                    key={`${item.product.id}-${variantKey}-${idx}`}
                    className="flex gap-4 p-3.5 rounded-2xl bg-[#181a24] border border-white/10 hover:border-white/20 transition-all"
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-black border border-white/10 shrink-0"
                    />

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                            className="text-slate-400 hover:text-red-400 transition-colors p-0.5"
                            title="Eliminar de la solicitud"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.selectedVariant && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.selectedVariant).map(([k, v]) => (
                              <span key={k} className="text-[10px] bg-white/10 text-slate-200 px-1.5 py-0.5 rounded font-medium">
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          <span>{item.product.origin || 'Dubái'} ➔ VEN</span>
                        </div>
                      </div>

                      {/* Quantity & Item Total */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <div className="flex items-center border border-white/10 rounded-lg bg-[#0e0f14]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-300 hover:text-white font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedVariant, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-300 hover:text-white font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-black text-white">
                          ${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#0e0f14] space-y-4">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal Unidades</span>
                  <span className="font-semibold text-white">
                    ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Seguro de Tránsito Internacional</span>
                  <span className="font-semibold">Incluido</span>
                </div>
                <div className="flex justify-between">
                  <span>Nacionalización & PDI</span>
                  <span className="font-semibold text-white">Incluido</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Estimado Puesto en VEN</span>
                  <span className="text-lg font-black text-white">
                    ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-200 active:scale-98 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Solicitar Procura & Cotización Formal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

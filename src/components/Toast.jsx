import React from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast = () => {
  const { toast, setIsCartOpen } = useCart();

  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 max-w-sm">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white">{toast.message}</p>
          {toast.productName && (
            <p className="text-[11px] text-slate-400 truncate">{toast.productName}</p>
          )}
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 shrink-0"
        >
          Ver Carrito
        </button>
      </div>
    </div>
  );
};

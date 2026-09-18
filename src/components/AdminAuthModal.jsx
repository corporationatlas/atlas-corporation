import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminAuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAdmin } = useAdmin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = loginAdmin(pin.trim());
    if (!success) {
      setError('PIN de seguridad incorrecto. Prueba con "atlas2026" o "admin123".');
    } else {
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-[#13141b] text-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 z-10 border border-white/15 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-white border border-white/15 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Portal de Propietario</h3>
              <p className="text-xs text-slate-400 mt-1">
                Ingresa tu clave autorizada para editar vehículos, fotos, precios y solicitudes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>PIN o Contraseña de Dueño</span>
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Introduce tu clave..."
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a1c27] border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Hint badge */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clave autorizada de prueba: <strong>atlas2026</strong></span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 active:scale-98 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-white/5"
              >
                Acceder al Panel de Control
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

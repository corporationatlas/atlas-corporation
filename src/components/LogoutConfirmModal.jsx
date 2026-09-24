import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, X } from 'lucide-react';

export const LogoutConfirmModal = () => {
  const { isLogoutConfirmOpen, closeLogoutConfirm, confirmLogout } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Cerrar modal al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLogoutConfirmOpen) {
        closeLogoutConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutConfirmOpen, closeLogoutConfirm]);

  if (!isLogoutConfirmOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeLogoutConfirm}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#11131c] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar X en la esquina */}
        <button
          onClick={closeLogoutConfirm}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          aria-label={isEn ? 'Close' : 'Cerrar'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icono de advertencia / logout */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <LogOut className="w-7 h-7" />
        </div>

        {/* Título */}
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-2">
          {isEn ? 'Are you sure you want to log out?' : '¿Estás seguro de cerrar sesión?'}
        </h3>

        {/* Mensaje descriptivo */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
          {isEn
            ? 'Your current session in Corporation Atlas will be closed. You will need to log in again to access your account, orders, and vehicle tracking.'
            : 'Tu sesión actual en Corporation Atlas se cerrará. Tendrás que ingresar tus credenciales nuevamente para acceder a tus pedidos y ficha de cliente.'}
        </p>

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeLogoutConfirm}
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-white/10 transition-all cursor-pointer active:scale-95"
          >
            {isEn ? 'Cancel' : 'Cancelar'}
          </button>

          <button
            type="button"
            onClick={confirmLogout}
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>{isEn ? 'Yes, Log Out' : 'Sí, cerrar sesión'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

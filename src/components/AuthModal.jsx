import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    register,
    authError,
    authLoading
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Caracas',
    cedula: ''
  });

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(loginData.email, loginData.password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    register(registerData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-gradient-to-b from-[#08090f] via-[#12141c] to-[#1c202c] text-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 z-10 border border-white/15 animate-in fade-in zoom-in-95 duration-200 shadow-black/80">
          
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col items-center justify-center pt-2 pb-2 mb-6">
            <div className="relative w-44 h-32 flex items-center justify-center">
              <div className="absolute w-28 h-28 bg-slate-400/10 rounded-full blur-2xl pointer-events-none" />
              <img
                src="/atlas-logo.png"
                alt="Atlas Platform"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_28px_rgba(255,255,255,0.18)] select-none"
              />
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#0e0f14] p-1 rounded-xl border border-white/10 mb-5">
            <button
              onClick={() => setMode('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setMode('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {authError && (
            <div className="mb-4 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* TAB 1: Iniciar Sesión */}
          {mode === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Correo Electrónico</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ej. usuario@atlas.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a1c27] border border-white/15 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contraseña</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a1c27] border border-white/15 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 ${
                    authLoading
                      ? 'bg-slate-700 text-slate-300 cursor-wait'
                      : 'bg-white hover:bg-slate-200 active:scale-98 text-slate-900'
                  }`}
                >
                  {authLoading ? (
                    <span>Verificando credenciales...</span>
                  ) : (
                    <>
                      <span>Ingresar a ATLAS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Crear Cuenta (Cliente) */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre y Apellido</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Carlos Mendoza"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cédula / RIF</label>
                  <input
                    type="text"
                    required
                    placeholder="V-18.942.311"
                    value={registerData.cedula}
                    onChange={(e) => setRegisterData({ ...registerData, cedula: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1c27] border border-white/15 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ciudad en Venezuela</label>
                  <input
                    type="text"
                    required
                    placeholder="Caracas / Valencia"
                    value={registerData.city}
                    onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1c27] border border-white/15 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+58 412 1234567"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/15 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/15 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Crear Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/15 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-bold text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
              >
                <span>Registrarse y entrar a ATLAS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

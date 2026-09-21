import React from 'react';
import { ShoppingCart, Search, User, ShieldAlert, LogOut, Package, ArrowRight, X, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({
  searchQuery,
  setSearchQuery,
  activeSection,
  setActiveSection,
  mobileOpen,
  setMobileOpen,
  onResetFilters
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { companyInfo } = useAdmin();
  const { currentUser, setCurrentView, setIsAuthModalOpen, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { id: 'inicio', label: t('nav.home') },
    { id: 'tienda', label: t('nav.store') },
    { id: 'servicios', label: t('nav.services') },
    { id: 'sobre-nosotros', label: t('nav.about') }
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileOpen(false);
    if ((id === 'tienda' || id === 'inicio') && onResetFilters) {
      onResetFilters();
    }
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Sidebar Container with immersive vertical gradient */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 md:w-72 bg-gradient-to-b from-[#06070a] via-[#10131c] to-[#252a38] border-r border-white/10 flex flex-col justify-between p-5 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Logo & Cart Icon */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            {/* Atlas Official 3D Metallic Brand Logo (Seamless & Box-free) */}
            <div className="flex flex-col items-center cursor-pointer group pt-1" onClick={() => handleNavClick('inicio')}>
              <div className="relative w-32 h-24 flex items-center justify-center">
                {/* Subtle backlight glow matching metallic chrome reflections */}
                <div className="absolute w-20 h-20 bg-slate-400/5 rounded-full blur-xl pointer-events-none group-hover:bg-slate-300/10 transition-colors" />
                <img
                  src="/atlas-logo.png"
                  alt="Atlas Import & Procurement"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_20px_rgba(255,255,255,0.12)] group-hover:scale-105 transition-transform duration-300 select-none"
                />
              </div>
            </div>

            {/* Cart & Language Selector Header Controls */}
            <div className="flex items-center gap-1.5 pt-1">
              {/* Language Switcher Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#141720]/80 hover:bg-[#1e2330] text-white text-[11px] font-bold transition-all border border-white/15 hover:border-white/30 shadow-md group active:scale-95"
                title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              >
                <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                <span className={language === 'es' ? 'text-white font-black' : 'text-slate-500 font-semibold'}>ES</span>
                <span className="text-slate-600 text-[10px]">/</span>
                <span className={language === 'en' ? 'text-white font-black' : 'text-slate-500 font-semibold'}>EN</span>
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 rounded-xl bg-[#141720]/80 hover:bg-[#1e2330] text-white flex items-center justify-center transition-all border border-white/15 hover:border-white/30 shadow-md group"
                aria-label="Abrir carrito"
              >
                <ShoppingCart className="w-4 h-4 text-slate-200 group-hover:scale-110 group-hover:text-white transition-all" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#06070a] shadow-sm animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Pill Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#dce1e8] hover:bg-[#eaeef3] focus:bg-white text-slate-900 placeholder:text-slate-500 text-sm font-medium rounded-full pl-4 pr-10 py-2.5 outline-none transition-all shadow-inner border border-white/20 focus:ring-2 focus:ring-slate-400/40"
            />
            <Search className="w-4 h-4 text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? 'text-white font-bold bg-white/10 border-l-[3px] border-white pl-4 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Profile or Clean Tracking Action Button */}
        <div className="pt-2">
          {/* Session Profile or Login Button */}
          {currentUser ? (
            <div className="p-3 rounded-2xl bg-[#141722]/80 border border-white/20 shadow-md space-y-2.5 backdrop-blur-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow overflow-hidden shrink-0 border border-white/20">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white block leading-tight truncate max-w-[115px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block capitalize">
                      {currentUser.role === 'admin' ? t('nav.adminRole') : t('nav.clientRole')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title={t('nav.logOut')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Button to their respective portal */}
              <button
                onClick={() => setCurrentView(currentUser.role === 'admin' ? 'admin-portal' : 'user-portal')}
                className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-white hover:to-slate-100 text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
              >
                {currentUser.role === 'admin' ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-900" />
                    <span>{t('nav.manageStore')}</span>
                  </>
                ) : (
                  <>
                    <Package className="w-3.5 h-3.5 text-slate-900" />
                    <span>{t('nav.myOrders')}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              {/* Clean Action Button: Rastrear mi Vehículo */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-[#141722]/85 hover:bg-[#1c202d] text-white text-xs font-bold transition-all flex items-center justify-between border border-white/20 hover:border-white/35 group shadow-lg shadow-black/30 backdrop-blur-xs active:scale-98"
              >
                <span className="text-slate-100 font-bold tracking-wide">{t('nav.trackVehicle')}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

        </div>
      </aside>
    </>
  );
};

import React, { useState, useMemo } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { HeroAtlas } from './components/HeroAtlas';
import { ProcurementLines } from './components/ProcurementLines';
import { VehicleGrid } from './components/VehicleGrid';
import { VehicleModal } from './components/VehicleModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AdminPortal } from './components/AdminPortal';
import { UserPortal } from './components/UserPortal';
import { AuthModal } from './components/AuthModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { Menu, ShoppingCart, ShieldAlert, Package } from 'lucide-react';

function AtlasPublicStore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartCount, setIsCartOpen } = useCart();
  const { publishedVehicles = [], publishedLines = [] } = useAdmin();
  const { currentUser, setCurrentView, setIsAuthModalOpen } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  // Filtrado reactivo de vehículos publicados
  const filteredVehicles = useMemo(() => {
    let list = Array.isArray(publishedVehicles) ? [...publishedVehicles] : [];

    if (selectedLine) {
      list = list.filter((v) => v.lineId === selectedLine);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          (v.name && v.name.toLowerCase().includes(q)) ||
          (v.line && v.line.toLowerCase().includes(q)) ||
          (v.description && v.description.toLowerCase().includes(q)) ||
          (v.engine && v.engine.toLowerCase().includes(q)) ||
          (v.origin && v.origin.toLowerCase().includes(q))
      );
    }

    return list;
  }, [publishedVehicles, selectedLine, searchQuery]);

  const handleSelectLine = (line) => {
    setSelectedLine(line.id);
    const tiendaEl = document.getElementById('tienda');
    if (tiendaEl) {
      tiendaEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedLine(null);
    setSearchQuery('');
  };

  const handleHeroStart = () => {
    const tiendaEl = document.getElementById('tienda');
    if (tiendaEl) {
      tiendaEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedLineObj = Array.isArray(publishedLines) ? publishedLines.find((l) => l.id === selectedLine) : null;

  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-red-600 selection:text-white">
      
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-30 bg-[#090a0d] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <img src="/atlas-logo.png" alt="Atlas Logo" className="w-6 h-6 object-contain" />
          <span className="text-xs font-black tracking-[0.3em] text-white uppercase">
            A T L A S
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white text-[10px] font-bold tracking-wider border border-white/10 transition-all active:scale-95"
            title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <span className={language === 'es' ? 'text-white font-black' : 'text-slate-400 font-medium'}>ES</span>
            <span className="text-slate-600">|</span>
            <span className={language === 'en' ? 'text-white font-black' : 'text-slate-400 font-medium'}>EN</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Left Sidebar Navigation */}
      <Sidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 lg:ml-72 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* 1. Hero Section */}
        <HeroAtlas />

        {/* 2. Tienda Section: ONLY 8 Lines OR Category Detail View */}
        {!selectedLine && !searchQuery ? (
          <ProcurementLines
            onSelectLine={handleSelectLine}
            selectedLine={selectedLine}
          />
        ) : (
          <VehicleGrid
            vehicles={filteredVehicles}
            selectedLineObj={selectedLineObj}
            onQuickView={(v) => setSelectedVehicle(v)}
            onResetFilters={handleResetFilters}
            searchQuery={searchQuery}
          />
        )}

        {/* 4. Services Section */}
        <ServicesSection />

        {/* 5. About Us Section */}
        <AboutSection />

        {/* 6. Footer */}
        <Footer onSelectLine={handleSelectLine} />

      </div>

      {/* Modals & Slide-overs */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
      
      <VehicleModal
        vehicle={selectedVehicle}
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <AuthModal />
      <Toast />

    </div>
  );
}

function MainView() {
  const { currentView, currentUser } = useAuth();

  let activeContent = <AtlasPublicStore />;

  // Guarda estricta: Solo administradores autenticados pueden ver el panel de administración
  if (currentView === 'admin-portal') {
    activeContent = (!currentUser || currentUser.role !== 'admin') ? <AtlasPublicStore /> : <AdminPortal />;
  } else if (currentView === 'user-portal') {
    // Guarda estricta: Solo clientes registrados y autenticados pueden ver el panel de pedidos
    activeContent = (!currentUser) ? <AtlasPublicStore /> : <UserPortal />;
  }

  return (
    <>
      {activeContent}
      <LogoutConfirmModal />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
          <WishlistProvider>
            <CartProvider>
              <MainView />
            </CartProvider>
          </WishlistProvider>
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

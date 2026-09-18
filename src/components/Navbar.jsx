import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar = ({ searchQuery, setSearchQuery, selectedCategory, onSelectCategory }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top promotional bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-medium py-1.5 px-4 text-center">
        <span>✨ <strong>Promoción Especial:</strong> Envío gratis en pedidos mayores a $150 | Usa el código <strong>DESCUENTO10</strong> para 10% OFF</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                  Aura<span className="text-indigo-600">Shop</span>
                </span>
                <span className="text-[10px] text-slate-600 tracking-wider uppercase font-semibold">Catálogo Premium</span>
              </div>
            </a>
          </div>

          {/* Search bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar por producto, marca o especificaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-full border border-slate-300/80 bg-slate-50/70 focus:bg-white text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Cart & Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-indigo-600 active:scale-95 transition-all shadow-sm hover:shadow-indigo-200"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-slate-900 bg-amber-400 rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Menú móvil"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-300 bg-slate-50 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

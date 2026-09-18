import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';

export const HeroBanner = ({ onExploreClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Nuevos Lanzamientos & Tendencias 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Eleva tu estilo y tecnología al <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">siguiente nivel</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explora una selección curada de dispositivos de vanguardia, accesorios premium y artículos esenciales de diseño diseñados para potenciar tu día a día.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#ofertas"
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm transition-all backdrop-blur-md"
              >
                Ofertas Especiales
              </a>
            </div>
          </div>

          {/* Featured Visual Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/90 shadow-2xl p-4 backdrop-blur-xl">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="Producto destacado"
                  className="w-full h-64 sm:h-72 object-cover rounded-xl shadow-inner transform hover:scale-105 transition-transform duration-500"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Top Ventas</span>
                    <h3 className="text-base font-bold text-white">Studio Pro Max Inalámbricos</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through mr-1.5">$249.99</span>
                    <span className="text-lg font-black text-amber-400">$189.99</span>
                  </div>
                </div>
              </div>

              {/* Floating review badge */}
              <div className="absolute -bottom-5 -left-5 bg-white/90 backdrop-blur-md text-slate-900 p-3.5 rounded-xl border border-slate-200 shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                  ★ 4.9
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">+500 Clientes Satisfechos</div>
                  <div className="text-[11px] text-slate-500">Calificación verificada</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Propositions / Trust Signals */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Envío Rápido</h4>
              <p className="text-[11px] text-slate-400">Gratis en compras &gt; $150</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Garantía 2 Años</h4>
              <p className="text-[11px] text-slate-400">Protección completa</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Devolución 30 Días</h4>
              <p className="text-[11px] text-slate-400">Sin preguntas ni demoras</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Pago Seguro</h4>
              <p className="text-[11px] text-slate-400">Cifrado SSL de 256 bits</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

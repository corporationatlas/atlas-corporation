import React from 'react';
import { VehicleCard } from './VehicleCard';
import { ArrowLeft, Package, MessageCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const VehicleGrid = ({
  vehicles = [],
  selectedLineObj,
  onQuickView,
  onResetFilters,
  searchQuery
}) => {
  const { companyInfo } = useAdmin();

  const isUnpublished = selectedLineObj?.status === 'No publicado';
  const displayTitle = selectedLineObj
    ? selectedLineObj.title
    : searchQuery
    ? `Resultados para: "${searchQuery}"`
    : 'Catálogo de Modelos';

  return (
    <section id="tienda" className="pt-2 pb-16 px-6 sm:px-10 lg:px-14 bg-gradient-to-b from-[#0d0f17] via-[#10121b] to-[#141722] scroll-mt-6">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Top Breadcrumb / Back Button bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-white text-xs font-bold transition-all border border-white/10 group shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a Líneas de Procura</span>
          </button>

          <div className="text-xs text-slate-400">
            Mostrando <strong className="text-white">{vehicles.length}</strong> {vehicles.length === 1 ? 'modelo' : 'modelos'}
          </div>
        </div>

        {/* Category Hero / Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-[#161822] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          {selectedLineObj?.image && (
            <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-25">
              <img src={selectedLineObj.image} alt={displayTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#161822] via-[#161822]/90 to-transparent" />
            </div>
          )}

          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Línea de Procura Seleccionada
              </span>
              {selectedLineObj && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isUnpublished
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {selectedLineObj.status}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {displayTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {isUnpublished
                ? 'Esta línea se encuentra en proceso de importación y selección de nuevos lotes en Dubái y China. Puedes solicitar cotizaciones personalizadas de modelos específicos bajo pedido.'
                : 'Unidades verificadas en origen para importación bajo demanda con despacho directo a Venezuela (Puerto Cabello / La Guaira).'}
            </p>
          </div>

          {/* WhatsApp Action Button */}
          <div className="relative z-10 shrink-0">
            <a
              href={`https://wa.me/${companyInfo.whatsapp || '584121234567'}?text=${encodeURIComponent(
                `Hola Atlas, deseo solicitar información o cotización de la categoría: ${displayTitle}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar Asesor WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Empty State when no models available in this line */}
        {vehicles.length === 0 ? (
          <div className="py-14 text-center max-w-md mx-auto bg-white/5 rounded-3xl border border-white/10 p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto">
              <Package className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="text-base font-bold text-white">Catálogo en Proceso de Carga</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No hay unidades estándar publicadas en este momento para esta categoría. Si tienes en mente un modelo concreto, nuestro equipo en Dubái o China lo localiza para ti.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onResetFilters}
                className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all shadow"
              >
                Ver otras Líneas
              </button>
            </div>
          </div>
        ) : (
          /* Grid of vehicles in this category */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onQuickView={onQuickView} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

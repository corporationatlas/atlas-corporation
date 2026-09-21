import React, { useState, useMemo } from 'react';
import { VehicleCard } from './VehicleCard';
import { ArrowLeft, Package, MessageCircle, Search, ChevronDown } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

export const VehicleGrid = ({
  vehicles = [],
  selectedLineObj,
  onQuickView,
  onResetFilters,
  searchQuery
}) => {
  const { companyInfo } = useAdmin();
  const { language, t } = useLanguage();
  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const isUnpublished = selectedLineObj?.status === 'No publicado';
  const displayTitle = selectedLineObj
    ? (t(`lines.lineTitles.${selectedLineObj.id}`) || selectedLineObj.title)
    : searchQuery
    ? (language === 'es' ? `Resultados para: "${searchQuery}"` : `Results for: "${searchQuery}"`)
    : t('vehicles.title');

  // Descripción corporativa de la línea (estilo Referencia 1)
  const lineDescription = selectedLineObj?.description || (
    isUnpublished
      ? (language === 'es'
          ? 'Esta línea se encuentra en proceso de importación y selección de nuevos lotes en Dubái y China. Puedes solicitar cotizaciones personalizadas de modelos específicos bajo pedido.'
          : 'This line is currently in the process of sourcing new batches from Dubai and China. You can request custom quotes for specific models.')
      : (language === 'es'
          ? 'Diseñada para el máximo rendimiento diario. Motores de alta durabilidad y tecnología de optimización de combustible ideal para flotas comerciales, entregas y trabajadores que exigen el menor costo por kilómetro sin sacrificar resistencia.'
          : 'Engineered for maximum daily performance. High durability engines and fuel optimization technology ideal for commercial fleets, deliveries, and drivers demanding lowest cost per kilometer.')
  );

  // Filtrado y Ordenación de Vehículos (Estilo Referencia 1)
  const processedVehicles = useMemo(() => {
    let list = [...vehicles];

    if (localSearch && localSearch.trim()) {
      const q = localSearch.toLowerCase().trim();
      list = list.filter(
        (v) =>
          (v.name && v.name.toLowerCase().includes(q)) ||
          (v.description && v.description.toLowerCase().includes(q)) ||
          (v.engine && v.engine.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [vehicles, localSearch, sortBy]);

  return (
    <section id="tienda" className="pt-4 pb-20 px-4 sm:px-8 lg:px-12 bg-[#090a0d] scroll-mt-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Top Breadcrumb / Back Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-98 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-white/10 group shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'es' ? 'Volver a todas las líneas' : 'Back to all lines'}</span>
          </button>

          <div className="text-xs text-slate-400">
            {language === 'es' ? 'Mostrando' : 'Showing'}{' '}
            <strong className="text-white">{processedVehicles.length}</strong>{' '}
            {processedVehicles.length === 1
              ? (language === 'es' ? 'modelo' : 'model')
              : (language === 'es' ? 'modelos' : 'models')}
          </div>
        </div>

        {/* Descripción de la Categoría en la cabecera - Idéntico a la Referencia 1 */}
        <div className="space-y-4 pt-1">
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-4xl">
            {lineDescription}
          </p>

          {/* Fila de Controles: Buscador en la Línea a la Izquierda + Ordenar por a la Derecha */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            
            {/* Buscador: 'Buscar en Motos: Efficiency Line' con lupa */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={`${t('vehicles.searchIn') || (language === 'es' ? 'Buscar en' : 'Search in')} ${displayTitle}`}
                className="w-full pl-4 pr-10 py-2.5 bg-[#1a1d27] border border-white/10 rounded-xl text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>

            {/* Selector 'Ordenar por: Destacado' */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label htmlFor="sortSelect" className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {t('vehicles.sortBy') || (language === 'es' ? 'Ordenar por:' : 'Sort by:')}
              </label>
              <div className="relative">
                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-[#1a1d27] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
                >
                  <option value="featured">{t('vehicles.sortFeatured') || (language === 'es' ? 'Destacado' : 'Featured')}</option>
                  <option value="price-asc">{t('vehicles.sortPriceAsc') || (language === 'es' ? 'Precio: Menor a Mayor' : 'Price: Low to High')}</option>
                  <option value="price-desc">{t('vehicles.sortPriceDesc') || (language === 'es' ? 'Precio: Mayor a Menor' : 'Price: High to Low')}</option>
                  <option value="name-asc">{t('vehicles.sortNameAsc') || (language === 'es' ? 'Nombre: A - Z' : 'Name: A - Z')}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* Empty State when no models match search */}
        {processedVehicles.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto bg-[#13151d] rounded-3xl border border-white/10 p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center mx-auto">
              <Package className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-white">
              {language === 'es' ? 'No se encontraron modelos' : 'No models found'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'es'
                ? 'No encontramos vehículos que coincidan con tu búsqueda en esta línea. Puedes borrar el término de búsqueda o consultar por WhatsApp.'
                : 'No vehicles matched your search in this line. Try clearing your search term or consult via WhatsApp.'}
            </p>
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-200 transition-all shadow"
              >
                {language === 'es' ? 'Limpiar búsqueda' : 'Clear search'}
              </button>
            )}
          </div>
        ) : (
          /* Grid de Vehículos: Estilo Odoo con proporción limpia */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
            {processedVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onQuickView={onQuickView} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

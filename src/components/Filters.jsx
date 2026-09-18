import React from 'react';
import { SlidersHorizontal, ArrowDownUp, Sparkles, Laptop, Shirt, Home, Headphones, Watch } from 'lucide-react';
import { categories } from '../data/products';

const iconMap = {
  Sparkles: Sparkles,
  Laptop: Laptop,
  Shirt: Shirt,
  Home: Home,
  Headphones: Headphones,
  Watch: Watch
};

export const Filters = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  resultsCount,
  onResetFilters,
  hasActiveFilters
}) => {
  return (
    <div className="bg-white border-b border-slate-200 py-6 mb-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Top bar: Category tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none w-full sm:w-auto">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Sparkles;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-102'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Sorting & Filter status */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Limpiar filtros
              </button>
            )}

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                <ArrowDownUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ordenar:</span>
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Valorados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
          <span>
            Mostrando <strong>{resultsCount}</strong> {resultsCount === 1 ? 'producto' : 'productos'}
          </span>
          <span className="hidden md:inline text-slate-600">Precios en USD ($) e IVA incluido</span>
        </div>

      </div>
    </div>
  );
};

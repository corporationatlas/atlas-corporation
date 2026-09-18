import React from 'react';
import { ProductCard } from './ProductCard';
import { PackageOpen, RotateCcw } from 'lucide-react';

export const ProductGrid = ({ products, onQuickView, onResetFilters }) => {
  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No se encontraron productos</h3>
        <p className="text-sm text-slate-500 mb-6">
          No encontramos ningún artículo que coincida con tu búsqueda o filtros actuales. Prueba con otros términos.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer todos los filtros</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};

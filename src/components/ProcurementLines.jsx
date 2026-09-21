import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

export const ProcurementLines = ({ onSelectLine, selectedLine, onExploreAll }) => {
  const { linesList } = useAdmin();
  const { t } = useLanguage();

  return (
    <section id="tienda" className="pt-2 pb-16 px-6 sm:px-10 lg:px-14 bg-gradient-to-b from-[#0d0f17] via-[#10121b] to-[#141722] scroll-mt-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('lines.sectionTitle')}
          </h2>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {linesList.map((line) => {
            const isSelected = selectedLine === line.id;
            const isUnpublished = line.status === 'No publicado';
            const translatedTitle = t(`lines.lineTitles.${line.id}`) || line.title;

            return (
              <div
                key={line.id}
                onClick={() => onSelectLine(line)}
                className={`group relative h-48 sm:h-52 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border flex flex-col justify-between p-4 ${
                  isSelected
                    ? 'ring-2 ring-white border-white shadow-xl shadow-black/50'
                    : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                } ${
                  isUnpublished
                    ? 'bg-[#40434b]/80'
                    : 'bg-[#0e0f14]'
                }`}
              >
                {/* Background Image / Texture */}
                {line.image && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={line.image}
                      alt={translatedTitle}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                        isUnpublished ? 'opacity-20 grayscale' : 'opacity-45 group-hover:opacity-60'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  </div>
                )}

                {/* Diagonal "No publicado" watermark */}
                {isUnpublished && (
                  <div className="absolute top-6 -right-10 rotate-45 pointer-events-none select-none z-10">
                    <span className="text-[11px] font-bold tracking-wider text-slate-300/80 bg-black/40 px-8 py-1 uppercase backdrop-blur-xs border-y border-white/10">
                      {t('lines.unpublished')}
                    </span>
                  </div>
                )}

                {/* Top Title */}
                <div className="relative z-10 pr-8">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug drop-shadow-md">
                    {translatedTitle}
                  </h3>
                </div>

                {/* Bottom Right Arrow Button */}
                <div className="relative z-10 self-end">
                  <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

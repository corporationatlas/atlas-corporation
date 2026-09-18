import React from 'react';
import { Shield, Award, Users, CheckCircle2 } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="sobre-nosotros" className="py-16 px-6 sm:px-10 lg:px-14 bg-[#0d0e12] border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">
              Sobre Atlas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Pioneros en Procura Automotriz Digital para Venezuela
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              En Atlas transformamos el modelo tradicional de importación. Eliminamos intermediarios innecesarios conectando al cliente directamente con los centros logísticos automotrices de Dubái y China.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Nuestra plataforma brinda visibilidad completa de costos, trámites de nacionalización y seguimiento satelital de cada unidad desde el embarque hasta que el vehículo está rodando en las calles de Venezuela.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Contratos con respaldo legal</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Inspección de origen certificada</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Despacho a nivel nacional</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Soporte y asesoría personalizada</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-[#181a23] p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-3xl font-black text-white">+500</div>
              <div className="text-xs text-slate-400 mt-1">Unidades Importadas</div>
            </div>
            <div className="bg-[#181a23] p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-3xl font-black text-white">35 días</div>
              <div className="text-xs text-slate-400 mt-1">Tránsito Promedio</div>
            </div>
            <div className="bg-[#181a23] p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-3xl font-black text-white">100%</div>
              <div className="text-xs text-slate-400 mt-1">Garantía Aduanal</div>
            </div>
            <div className="bg-[#181a23] p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-3xl font-black text-white">24/7</div>
              <div className="text-xs text-slate-400 mt-1">Seguimiento en Vivo</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

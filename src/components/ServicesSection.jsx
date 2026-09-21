import React from 'react';
import { Ship, ShieldCheck, FileCheck, KeyRound, Globe, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ServicesSection = () => {
  const { language, translations } = useLanguage();
  const tServices = translations?.services || {};

  const icons = [Globe, Ship, FileCheck, KeyRound];
  const items = tServices.items || [];

  return (
    <section id="servicios" className="py-16 px-6 sm:px-10 lg:px-14 bg-[#111217] border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">
            {tServices.tagline || 'Servicios Integrales'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {tServices.mainTitle || 'Logística Automotriz de Extremo a Extremo'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {tServices.subtitle || 'Hacemos que comprar tu vehículo en el exterior y tenerlo en Venezuela sea un proceso simple, confiable y seguro.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((svc, i) => {
            const Icon = icons[i] || Globe;
            return (
              <div
                key={i}
                className="bg-[#181a23] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{svc.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{svc.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

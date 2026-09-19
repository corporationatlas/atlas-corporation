import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer = ({ onSelectLine }) => {
  return (
    <footer className="bg-gradient-to-b from-[#090b10] via-[#12151e] to-[#202430] text-slate-400 text-xs border-t border-white/10 py-14 px-6 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/atlas-logo.png" alt="Atlas Logo" className="w-9 h-9 object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]" />
              <span className="text-lg font-black tracking-[0.25em] text-white uppercase">
                A T L A S
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Logística y procura automotriz internacional. Especialistas en importación bajo demanda de vehículos y motocicletas desde Dubái y China con entrega llave en mano en Venezuela.
            </p>
            <div className="flex items-center gap-1.5 text-slate-300 text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Operaciones 100% legales y transparentes</span>
            </div>
          </div>

          {/* Líneas de Procura */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Líneas de Procura</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectLine('motos-efficiency')}
                  className="hover:text-white transition-colors"
                >
                  Motos: Efficiency Line
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectLine('motos-power')}
                  className="hover:text-white transition-colors"
                >
                  Motos: Power Line
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectLine('motos-smart')}
                  className="hover:text-white transition-colors"
                >
                  Motos: Smart Line
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectLine('suv')}
                  className="hover:text-white transition-colors"
                >
                  Camionetas SUV
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectLine('pick-up')}
                  className="hover:text-white transition-colors"
                >
                  Camionetas Pick-up
                </button>
              </li>
            </ul>
          </div>

          {/* Cobertura y Puertos */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Rutas & Puertos</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Puerto de Jebel Ali, Dubái (EAU)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Puerto de Ningbo / Shanghai, China</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Puerto Cabello, Carabobo (VEN)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Puerto de La Guaira, La Guaira (VEN)</span>
              </li>
            </ul>
          </div>

          {/* Contacto Directo */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Atención & Despacho</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+1 555-555-5556</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">corporationatlas969@gmail.com</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Atención presencial en oficinas y concesionarios aliados en Caracas y Valencia.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Corporation Atlas. Todos los derechos reservados.</p>
          <p>Plataforma Digital de Procura Automotriz e Importación para Venezuela.</p>
        </div>
      </div>
    </footer>
  );
};

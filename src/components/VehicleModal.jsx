import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, MapPin, Clock, Gauge, Fuel, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const VehicleModal = ({ vehicle, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const [selectedVariant, setSelectedVariant] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (vehicle && vehicle.variants && vehicle.variants.length > 0) {
      setSelectedVariant(vehicle.variants[0].options[0]);
      setIsAdded(false);
    }
  }, [vehicle]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !vehicle) return null;

  const handleAddToCart = () => {
    const variantObj = vehicle.variants ? { [vehicle.variants[0].type]: selectedVariant } : null;
    addToCart(vehicle, 1, variantObj);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const lineTitle = t(`lines.lineTitles.${vehicle.lineId}`) || vehicle.line;

  const translateSpecLabel = (lbl) => {
    if (language === 'es') return lbl;
    const map = {
      'Cilindrada': 'Displacement',
      'Consumo': 'Fuel Economy',
      'Capacidad Tanque': 'Tank Capacity',
      'Encendido': 'Ignition',
      'Garantía': 'Warranty',
      'Motor': 'Engine',
      'Potencia': 'Power',
      'Transmisión': 'Transmission',
      'Frenos': 'Brakes'
    };
    return map[lbl] || lbl;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative bg-[#13141b] text-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 border border-white/15 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Left: Image & Logistics Route */}
            <div className="space-y-4">
              <div className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-[#090a0d] border border-white/10">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white bg-black/80 rounded-md border border-white/15 backdrop-blur-xs">
                  {lineTitle}
                </span>
              </div>

              {/* Maritime Logistics Card */}
              <div className="bg-[#181a23] p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{language === 'es' ? 'Ruta Logística Internacional' : 'International Logistics Route'}</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1 pl-6">
                  <div><strong>{language === 'es' ? 'Origen:' : 'Origin:'}</strong> {vehicle.origin}</div>
                  <div><strong>{language === 'es' ? 'Destino:' : 'Destination:'}</strong> {vehicle.destination}</div>
                  <div className="flex items-center gap-1 text-slate-300 pt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{language === 'es' ? 'Tiempo estimado:' : 'Estimated transit:'} <strong>{vehicle.transitDays}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Specs & Procurement Button */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {language === 'es' ? 'Ficha Técnica & Procura' : 'Spec Sheet & Procurement'}
                </span>

                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 mb-2">
                  {vehicle.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    ${vehicle.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-400">
                    {language === 'es' ? 'USD (Puesto en Venezuela)' : 'USD (Turnkey in Venezuela)'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {vehicle.description}
                </p>

                {/* Color Selector */}
                {vehicle.variants && vehicle.variants.length > 0 && (
                  <div className="mb-4">
                    <span className="block text-xs font-bold text-slate-300 mb-2">
                      {language === 'es' ? `Seleccionar ${vehicle.variants[0].type}:` : `Select ${vehicle.variants[0].type}:`} <strong className="text-white">{selectedVariant}</strong>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.variants[0].options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariant(opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selectedVariant === opt
                              ? 'bg-white text-slate-900 shadow-md ring-2 ring-white/50'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specifications Table */}
                {vehicle.specs && (
                  <div className="bg-[#181a23] rounded-xl p-3 border border-white/5 space-y-1.5 mb-4">
                    {vehicle.specs.map((s, idx) => (
                      <div key={idx} className="flex justify-between text-xs py-0.5 border-b border-white/5 last:border-0">
                        <span className="text-slate-400">{translateSpecLabel(s.label)}:</span>
                        <span className="text-slate-200 font-semibold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Benefits */}
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'es' ? 'Gestión de aduanas e importación incluida.' : 'Customs and import processing included.'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'es' ? 'Listo para rodar con documentación nacional.' : 'Ready to drive with national registration.'}</span>
                  </div>
                </div>
              </div>

              {/* Add to Procurement Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-900 hover:bg-slate-200 active:scale-98'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === 'es' ? '¡Agregado a tu lista de procura!' : 'Added to procurement list!'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'es' ? 'Agregar a Solicitud de Procura' : 'Add to Procurement Order'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

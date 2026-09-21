import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';

export const VehicleModal = ({ vehicle, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { language, t } = useLanguage();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Imágenes del vehículo para la galería de miniaturas
  const images = vehicle?.images && vehicle.images.length > 0
    ? vehicle.images
    : (vehicle?.image ? [vehicle.image] : []);

  useEffect(() => {
    if (vehicle) {
      setActiveImageIndex(0);
      setQuantity(1);
      setShowSpecs(false);
      if (vehicle.variants && vehicle.variants.length > 0) {
        setSelectedVariant(vehicle.variants[0].options[0]);
      }
      setIsAdded(false);
    }
  }, [vehicle]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) handlePrevImage();
      if (e.key === 'ArrowRight' && images.length > 1) handleNextImage();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, images.length, activeImageIndex]);

  if (!isOpen || !vehicle) return null;

  const isFavorited = isInWishlist(vehicle.id);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    const variantObj = vehicle.variants ? { [vehicle.variants[0].type]: selectedVariant } : null;
    addToCart(vehicle, quantity, variantObj);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
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
      'Frenos': 'Brakes',
      'Velocidad Máx': 'Top Speed',
      'Tracción': 'Drivetrain',
      'Batería': 'Battery',
      'Autonomía': 'Range'
    };
    return map[lbl] || lbl;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop oscuro con blur suave */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="relative bg-[#10121a] text-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Botón de cierre en esquina superior derecha */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 1. Miga de pan superior (Breadcrumbs) - Idéntico a Referencia 2 */}
          <div className="px-6 pt-5 pb-3 border-b border-white/10 text-xs text-slate-400 flex items-center gap-2 flex-wrap">
            <button
              onClick={onClose}
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {t('vehicles.allProducts') || (language === 'es' ? 'Todos los productos' : 'All products')}
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={onClose}
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              {lineTitle}
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">{vehicle.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-start">
            
            {/* 2. Columna Izquierda: Galería con Miniaturas Verticales + Imagen Principal con Relación de Aspecto y Resolución Preservada */}
            <div className="md:col-span-7 flex gap-3 sm:gap-4 self-start">
              
              {/* Miniaturas Verticales a la Izquierda */}
              {images.length > 1 && (
                <div className="flex flex-col gap-2.5 w-16 sm:w-20 shrink-0 self-start">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden bg-[#08090d] border-2 transition-all duration-200 ${
                        activeImageIndex === idx
                          ? 'border-white shadow-lg ring-1 ring-white/50 scale-102'
                          : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${vehicle.name} miniatura ${idx + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Imagen Principal Grande: Contenedor con aspect-ratio fijo, resolución máxima y sin distorsión al abrir ficha técnica */}
              <div className="relative flex-1 aspect-[4/3] sm:aspect-square max-h-[460px] rounded-2xl overflow-hidden bg-[#08090d] border border-white/10 flex items-center justify-center group select-none self-start">
                <img
                  src={images[activeImageIndex] || vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-contain p-2 transition-transform duration-300 select-none"
                  loading="eager"
                />

                {/* Flecha Izquierda < */}
                {images.length > 1 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all shadow-lg active:scale-95 z-20 cursor-pointer"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Flecha Derecha > */}
                {images.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all shadow-lg active:scale-95 z-20 cursor-pointer"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {/* Origen Logístico sutil */}
                <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-black/75 text-slate-300 border border-white/10 backdrop-blur-xs flex items-center gap-1 z-10">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span>{vehicle.origin || 'Dubái'} ➔ {vehicle.destination || 'Venezuela'}</span>
                </span>
              </div>

            </div>

            {/* 3. Columna Derecha: Panel de Compra Limpio - Idéntico a Referencia 2 */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                
                {/* Título del Producto */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    {vehicle.name}
                  </h1>
                </div>

                {/* Precio */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    ${vehicle.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">USD</span>
                </div>

                {/* Separador sutil */}
                <hr className="border-white/10" />

                {/* Selector de Variante (Color) si existe */}
                {vehicle.variants && vehicle.variants.length > 0 && (
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-300">
                      {language === 'es' ? `Color:` : `Color:`}{' '}
                      <strong className="text-white">{selectedVariant}</strong>
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

                {/* Fila de Acción Principal: Selector de Cantidad [ - 1 + ] + Botón 'Añadir a la cesta' - Referencia 2 */}
                <div className="flex items-center gap-3 pt-1">
                  
                  {/* Selector de Cantidad */}
                  <div className="flex items-center bg-[#181b26] border border-white/15 rounded-xl overflow-hidden shadow-inner h-12">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3 h-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white min-w-[28px] text-center font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 h-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Botón Principal: 'Añadir a la cesta' (Estilo botón Odoo) */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-1 h-12 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-emerald-950/40'
                        : 'bg-[#5b6574] hover:bg-[#6c788a] text-white border border-white/15 shadow-black/50'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 animate-in zoom-in-50 duration-200" />
                        <span>{language === 'es' ? '¡Añadido a la cesta!' : 'Added to cart!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>{t('vehicles.addToBasket') || (language === 'es' ? 'Añadir a la cesta' : 'Add to cart')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Botón Secundario: '♡ Add to wishlist' a ancho completo - Referencia 2 */}
                <button
                  onClick={() => toggleWishlist(vehicle)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border active:scale-98 ${
                    isFavorited
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                  <span>
                    {isFavorited
                      ? (t('vehicles.inWishlist') || (language === 'es' ? 'En tu lista de deseos' : 'In your wishlist'))
                      : (t('vehicles.addToWishlist') || (language === 'es' ? 'Add to wishlist' : 'Add to wishlist'))}
                  </span>
                </button>

                {/* Enlaces de políticas y garantías al pie - Idéntico a Referencia 2 */}
                <div className="pt-2 text-xs space-y-1.5 text-slate-400">
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="block text-slate-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer text-left"
                  >
                    {t('vehicles.termsLink') || (language === 'es' ? 'Términos y condiciones' : 'Terms and conditions')}
                  </button>
                  <p className="text-slate-300">
                    {t('vehicles.returnPolicy') || (language === 'es' ? 'Garantía de devolución de 30 días' : '30-day return guarantee')}
                  </p>
                  <p className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {language === 'es'
                        ? `Tránsito estimado: ${vehicle.transitDays || '30 - 38 días'}`
                        : `Estimated transit: ${vehicle.transitDays || '30 - 38 days'}`}
                    </span>
                  </p>
                </div>

                {/* Acordeón de Ficha Técnica Completa (para no perder el valor técnico sin recargar la vista) */}
                {vehicle.specs && vehicle.specs.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => setShowSpecs(!showSpecs)}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-between transition-colors border border-white/5"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {showSpecs
                          ? (t('vehicles.hideFullSpecs') || (language === 'es' ? 'Ocultar Ficha Técnica' : 'Hide Technical Specs'))
                          : (t('vehicles.viewFullSpecs') || (language === 'es' ? 'Ver Ficha Técnica Completa' : 'View Full Technical Specs'))}
                      </span>
                      {showSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                    </button>

                    {showSpecs && (
                      <div className="mt-2 p-3.5 rounded-xl bg-[#141622] border border-white/5 space-y-1.5 text-xs animate-in fade-in duration-200">
                        {vehicle.specs.map((s, idx) => (
                          <div key={idx} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                            <span className="text-slate-400">{translateSpecLabel(s.label)}:</span>
                            <span className="text-slate-200 font-semibold">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Modal / Popup de Términos y Condiciones */}
      {showTermsModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#131520] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'es' ? 'Términos & Condiciones de Procura' : 'Procurement Terms & Conditions'}</span>
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-slate-300 leading-relaxed max-h-64 overflow-y-auto pr-1">
              <p>
                <strong>1. Esquema de Pago:</strong> Anticipo del 40% para formalizar la reserva y despacho en origen; saldo del 60% contra inspección física y recepción en puerto venezolano.
              </p>
              <p>
                <strong>2. Cobertura Logística:</strong> Envío en contenedor sellado con póliza de seguro marítimo internacional y monitoreo satelital en tiempo real.
              </p>
              <p>
                <strong>3. Nacionalización:</strong> Trámites aduanales e impuestos SENIAT e INTT gestionados por Corporation Atlas con entrega llave en mano.
              </p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              {language === 'es' ? 'Entendido y Aceptar' : 'Understood and Accept'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

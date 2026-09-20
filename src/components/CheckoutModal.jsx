import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  FileText,
  Copy,
  Check,
  QrCode,
  CreditCard,
  MessageCircle,
  Mail
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, total, clearCart } = useCart();
  const { addOrder } = useAdmin();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    ciudad: 'Caracas',
    estado: 'Distrito Capital',
    direccionEntrega: '',
    metodoPago: 'binance'
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedTracking = 'ATL-' + Math.floor(100000 + Math.random() * 900000) + '-VE';
      setTrackingId(generatedTracking);
      setIsProcessing(false);
      setStep(3);

      addOrder({
        id: generatedTracking,
        date: new Date().toISOString().split('T')[0],
        nombre: formData.nombre,
        cedula: formData.cedula,
        email: formData.email,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        estado: formData.estado,
        direccionEntrega: formData.direccionEntrega,
        vehiculo: cart.map((i) => i.product.name).join(', ') || 'Vehículo bajo demanda',
        total: total,
        metodoPago: formData.metodoPago,
        status: 'Cotización enviada'
      });

      clearCart();
    }, 1200);
  };

  const handleCloseAndReset = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={step === 3 ? handleCloseAndReset : onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative bg-[#13141b] text-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0e0f14]">
            <div>
              <h2 className="text-lg font-black text-white">
                {step === 3 ? '¡Solicitud de Procura Confirmada!' : 'Formalizar Procura e Importación'}
              </h2>
              {step !== 3 && (
                <p className="text-xs text-slate-400">Paso {step} de 2 — Trámite directo y seguro para Venezuela</p>
              )}
            </div>

            <button
              onClick={step === 3 ? handleCloseAndReset : onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* STEP 1: Datos del Comprador y Destino en Venezuela */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 text-sm font-bold text-slate-200 border-b border-white/5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Datos del Titular y Destino de Entrega (Venezuela)</span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo</label>
                      <input
                        required
                        type="text"
                        name="nombre"
                        placeholder="ej. Oscar Ramirez"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Cédula / RIF</label>
                      <input
                        required
                        type="text"
                        name="cedula"
                        placeholder="V-12.345.678"
                        value={formData.cedula}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico</label>
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder="oscar@ejemplo.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Teléfono / WhatsApp</label>
                      <input
                        required
                        type="tel"
                        name="telefono"
                        placeholder="+58 412 1234567"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Ciudad en Venezuela</label>
                      <input
                        required
                        type="text"
                        name="ciudad"
                        placeholder="Caracas / Valencia"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Estado</label>
                      <input
                        required
                        type="text"
                        name="estado"
                        placeholder="Carabobo / Miranda"
                        value={formData.estado}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Dirección de Entrega o Concesionario Asociado</label>
                    <input
                      required
                      type="text"
                      name="direccionEntrega"
                      placeholder="Av. Francisco de Miranda, Edif. Torre Centro"
                      value={formData.direccionEntrega}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-white/10">
                  <div className="text-xs text-slate-400">
                    Monto estimado: <strong className="text-sm text-white font-black">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-900 text-xs font-bold transition-all shadow-md"
                  >
                    <span>Continuar al Método de Pago</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Forma de Pago & Garantías */}
            {step === 2 && (
              <form onSubmit={handleCompleteOrder} className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Modalidad de Pago y Garantía de Importación</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Volver
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'binance', title: '💳 Binance Pay / USDT (Criptoactivo Seguro)', desc: 'Pago directo con código QR o Pay ID sin comisiones en USDT' },
                    { id: 'paypal', title: '💳 PayPal / Tarjeta Internacional', desc: 'Pago seguro en USD con tarjeta de crédito/débito o balance PayPal' },
                    { id: 'transferencia-internacional', title: 'Transferencia Bancaria Internacional / Cable USD', desc: 'Pago a cuenta de custodia en Dubái o EE.UU.' },
                    { id: 'inicial-saldo', title: 'Plan Procura: 40% Anticipo + Saldo al Puerto', desc: '40% al iniciar embarque y 60% al arribo a Puerto Cabello' }
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setFormData({ ...formData, metodoPago: method.id })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        formData.metodoPago === method.id
                          ? 'border-white bg-[#1a1c27] text-white ring-1 ring-white/50'
                          : 'border-white/10 bg-[#0e0f14] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{method.title}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.metodoPago === method.id ? 'border-white bg-white' : 'border-slate-500'}`}>
                          {formData.metodoPago === method.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{method.desc}</p>
                    </div>
                  ))}
                </div>

                {/* INSTRUCCIONES ESPECÍFICAS DE BINANCE PAY */}
                {formData.metodoPago === 'binance' && (
                  <div className="p-4 rounded-2xl bg-[#0b0d14] border border-amber-500/30 space-y-3 shadow-inner">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <QrCode className="w-4 h-4" />
                      <span>Instrucciones de Pago con Binance Pay / USDT</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Para completar la reserva o el pago de tu vehículo, por favor sigue estas instrucciones:
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#131520] p-3 rounded-xl border border-white/10">
                      <div className="w-36 h-36 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center shadow-lg border border-white/20">
                        <img src="/binance-qr.png" alt="Binance QR Code" className="w-full h-full object-contain" />
                      </div>

                      <div className="space-y-2 text-xs flex-1">
                        <div className="flex items-center justify-between bg-black/50 px-3 py-2 rounded-lg border border-amber-500/20">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">Binance Pay ID:</span>
                            <span className="font-mono font-black text-amber-400 text-sm">395610250</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('395610250');
                              setCopiedId(true);
                              setTimeout(() => setCopiedId(false), 2000);
                            }}
                            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId ? '¡Copiado!' : 'Copiar ID'}</span>
                          </button>
                        </div>

                        <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-tight">
                          <li>Abre tu aplicación de <strong>Binance</strong> en tu teléfono celular.</li>
                          <li>Escanea el Código QR que aparece aquí o utiliza nuestro Pay ID: <strong className="text-amber-400 font-mono">395610250</strong>.</li>
                          <li>Envía el monto exacto en <strong>USDT</strong>.</li>
                          <li><strong className="text-amber-300">MUY IMPORTANTE:</strong> Al realizar la transferencia en Binance, incluye el número de referencia de tu pedido en el concepto o nota.</li>
                          <li>Una vez hecho el pago, toma una captura de pantalla del comprobante y envíala a <strong className="text-white">corporationatlas969@gmail.com</strong> o a nuestro WhatsApp de soporte.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* INSTRUCCIONES DE PAYPAL */}
                {formData.metodoPago === 'paypal' && (
                  <div className="p-4 rounded-2xl bg-[#0b0d14] border border-blue-500/30 space-y-2.5 text-xs shadow-inner">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <CreditCard className="w-4 h-4" />
                      <span>Pago con PayPal / Tarjeta de Débito o Crédito</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Puedes realizar tu pago seguro mediante PayPal enviando a la cuenta corporativa oficial de Corporation Atlas.
                    </p>
                    <div className="bg-[#131520] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Cuenta PayPal Corporativa:</span>
                        <span className="font-mono font-bold text-white text-xs">corporationatlas969@gmail.com</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('corporationatlas969@gmail.com');
                          setCopiedId(true);
                          setTimeout(() => setCopiedId(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-bold transition-all flex items-center gap-1"
                      >
                        {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId ? '¡Copiado!' : 'Copiar Correo'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Resumen de Garantía */}
                <div className="bg-[#181a24] p-4 rounded-xl border border-white/10 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Contrato de Procura con Garantía de Reembolso</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Una vez enviada la solicitud, un asesor de Atlas se comunicará al teléfono {formData.telefono || 'proporcionado'} para formalizar el contrato de consignación y flete marítimo.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                    isProcessing
                      ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                      : 'bg-white text-slate-900 hover:bg-slate-200 active:scale-98'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      Generando orden de procura y seguimiento...
                    </span>
                  ) : (
                    <span>Confirmar Solicitud de Procura</span>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: Confirmación con Tracking ID */}
            {step === 3 && (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">¡Solicitud Registrada con Éxito!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Hemos asignado un código de seguimiento prioritario y enviado los detalles a: <br />
                    <strong className="text-white">{formData.email}</strong>
                  </p>
                </div>

                {/* Recibo de Procura */}
                <div className="bg-[#181a24] p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Código de Rastreo Atlas:</span>
                    <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">{trackingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Titular de Procura:</span>
                    <span className="font-semibold text-white">{formData.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Método Elegido:</span>
                    <span className="font-semibold text-amber-400 capitalize">{formData.metodoPago}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destino de Entrega:</span>
                    <span className="font-semibold text-white">{formData.ciudad}, Venezuela</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estado de Procura:</span>
                    <span className="font-bold text-emerald-400">En asignación de cupo</span>
                  </div>
                </div>

                {/* Acciones para enviar comprobante */}
                <div className="p-4 rounded-2xl bg-[#11131e] border border-white/10 max-w-sm mx-auto space-y-2.5 text-xs">
                  <p className="text-slate-300 font-bold text-[11px]">
                    Envía tu comprobante con el código de orden <strong className="text-white font-mono">{trackingId}</strong>:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/584222932455?text=${encodeURIComponent(`Hola Corporation Atlas, adjunto comprobante de pago para mi orden ${trackingId} a nombre de ${formData.nombre}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all text-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`mailto:corporationatlas969@gmail.com?subject=${encodeURIComponent(`Comprobante de Pago - Orden ${trackingId} (${formData.nombre})`)}&body=${encodeURIComponent(`Hola Corporation Atlas,\n\nAdjunto comprobante de pago para la orden ${trackingId}.\n\nTitular: ${formData.nombre}\nTeléfono: ${formData.telefono}\nMétodo: ${formData.metodoPago}`)}`}
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all text-xs"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Enviar Correo</span>
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCloseAndReset}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-200 transition-all shadow-md"
                  >
                    <span>Volver al Catálogo Atlas</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

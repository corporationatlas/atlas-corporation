import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ProformaInvoiceModal } from './ProformaInvoiceModal';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, total, clearCart } = useCart();
  const { addOrder, getNextOrderNumber } = useAdmin();
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState(null);

  const [formData, setFormData] = useState({
    nombre: currentUser?.name || '',
    cedula: currentUser?.cedula || '',
    email: currentUser?.email || '',
    telefono: currentUser?.phone || '',
    ciudad: currentUser?.city || 'Caracas',
    estado: 'Distrito Capital',
    direccionEntrega: currentUser?.address || '',
    metodoPago: 'binance'
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      setFormData((prev) => ({
        ...prev,
        nombre: currentUser.name || prev.nombre,
        cedula: currentUser.cedula || prev.cedula,
        email: currentUser.email || prev.email,
        telefono: currentUser.phone || prev.telefono,
        ciudad: currentUser.city || prev.ciudad,
        direccionEntrega: currentUser.address || prev.direccionEntrega
      }));
    }
  }, [currentUser, isOpen]);

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
      const generatedTracking = getNextOrderNumber ? getNextOrderNumber() : 'S00001';
      setTrackingId(generatedTracking);
      setIsProcessing(false);
      setStep(3);

      const orderRecord = {
        id: generatedTracking,
        userId: currentUser?.id || currentUser?.uid || null,
        date: new Date().toISOString().split('T')[0],
        nombre: formData.nombre,
        cedula: formData.cedula,
        email: formData.email,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        estado: formData.estado,
        direccionEntrega: formData.direccionEntrega,
        vehiculo: cart.map((i) => i.product.name).join(', ') || (isEn ? 'Custom on-demand vehicle' : 'Vehículo bajo demanda'),
        total: total,
        metodoPago: formData.metodoPago,
        status: isEn ? 'Quote / Preorder issued' : 'Cotización / Preorden emitida'
      };

      setCreatedOrderData(orderRecord);
      addOrder(orderRecord);
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
                {step === 3
                  ? (isEn ? 'Procurement Request Confirmed!' : '¡Solicitud de Procura Confirmada!')
                  : (isEn ? 'Formalize Procurement & Import' : 'Formalizar Procura e Importación')}
              </h2>
              {step !== 3 && (
                <p className="text-xs text-slate-400">
                  {isEn ? `Step ${step} of 2 — Direct and secure process for Venezuela` : `Paso ${step} de 2 — Trámite directo y seguro para Venezuela`}
                </p>
              )}
            </div>

            <button
              onClick={step === 3 ? handleCloseAndReset : onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              aria-label={t('common.close')}
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
                  <span>{isEn ? 'Consignee Details and Delivery Destination (Venezuela)' : 'Datos del Titular y Destino de Entrega (Venezuela)'}</span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isEn ? 'Full Name' : 'Nombre Completo'}
                      </label>
                      <input
                        required
                        type="text"
                        name="nombre"
                        placeholder={isEn ? 'e.g. Oscar Ramirez' : 'ej. Oscar Ramirez'}
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isEn ? 'ID / Tax ID / Passport' : 'Cédula / RIF'}
                      </label>
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
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isEn ? 'Email Address' : 'Correo Electrónico'}
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder={isEn ? 'oscar@example.com' : 'oscar@ejemplo.com'}
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isEn ? 'Phone / WhatsApp' : 'Teléfono / WhatsApp'}
                      </label>
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
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isEn ? 'City in Venezuela' : 'Ciudad en Venezuela'}
                      </label>
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
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isEn ? 'State / Region' : 'Estado'}
                      </label>
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
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? 'Delivery Address or Associated Dealership' : 'Dirección de Entrega o Concesionario Asociado'}
                    </label>
                    <input
                      required
                      type="text"
                      name="direccionEntrega"
                      placeholder={isEn ? 'Main Ave, Torre Centro Bldg' : 'Av. Francisco de Miranda, Edif. Torre Centro'}
                      value={formData.direccionEntrega}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-white/10">
                  <div className="text-xs text-slate-400">
                    {isEn ? 'Estimated amount:' : 'Monto estimado:'} <strong className="text-sm text-white font-black">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-900 text-xs font-bold transition-all shadow-md"
                  >
                    <span>{isEn ? 'Continue to Payment Method' : 'Continuar al Método de Pago'}</span>
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
                    <span>{isEn ? 'Payment Method and Import Warranty' : 'Modalidad de Pago y Garantía de Importación'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> {isEn ? 'Back' : 'Volver'}
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      id: 'binance',
                      title: isEn ? '💳 Binance Pay / USDT (Secure Crypto)' : '💳 Binance Pay / USDT (Criptoactivo Seguro)',
                      desc: isEn ? 'Direct QR or Pay ID transfer with zero fees in USDT' : 'Pago directo con código QR o Pay ID sin comisiones en USDT'
                    },
                    {
                      id: 'paypal',
                      title: isEn ? '💳 PayPal / International Card' : '💳 PayPal / Tarjeta Internacional',
                      desc: isEn ? 'Secure USD payment via credit/debit card or PayPal balance' : 'Pago seguro en USD con tarjeta de crédito/débito o balance PayPal'
                    },
                    {
                      id: 'transferencia-internacional',
                      title: isEn ? 'International Wire Transfer / USD Cable' : 'Transferencia Bancaria Internacional / Cable USD',
                      desc: isEn ? 'Payment to international escrow account in Dubai or USA' : 'Pago a cuenta de custodia en Dubái o EE.UU.'
                    },
                    {
                      id: 'inicial-saldo',
                      title: isEn ? 'Procurement Plan: 40% Advance + Arrival Balance' : 'Plan Procura: 40% Anticipo + Saldo al Puerto',
                      desc: isEn ? '40% at sailing inception and 60% upon arrival at Puerto Cabello' : '40% al iniciar embarque y 60% al arribo a Puerto Cabello'
                    }
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
                      <span>{isEn ? 'Payment Instructions with Binance Pay / USDT' : 'Instrucciones de Pago con Binance Pay / USDT'}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {isEn
                        ? 'To complete your vehicle reservation or payment, please follow these instructions:'
                        : 'Para completar la reserva o el pago de tu vehículo, por favor sigue estas instrucciones:'}
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
                            <span>{copiedId ? (isEn ? 'Copied!' : '¡Copiado!') : (isEn ? 'Copy ID' : 'Copiar ID')}</span>
                          </button>
                        </div>

                        <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-tight">
                          <li>
                            {isEn ? (
                              <>Open your <strong>Binance</strong> app on your mobile phone.</>
                            ) : (
                              <>Abre tu aplicación de <strong>Binance</strong> en tu teléfono celular.</>
                            )}
                          </li>
                          <li>
                            {isEn ? (
                              <>Scan the QR code shown here or use our Pay ID: <strong className="text-amber-400 font-mono">395610250</strong>.</>
                            ) : (
                              <>Escanea el Código QR que aparece aquí o utiliza nuestro Pay ID: <strong className="text-amber-400 font-mono">395610250</strong>.</>
                            )}
                          </li>
                          <li>
                            {isEn ? (
                              <>Send the exact amount in <strong>USDT</strong>.</>
                            ) : (
                              <>Envía el monto exacto en <strong>USDT</strong>.</>
                            )}
                          </li>
                          <li>
                            {isEn ? (
                              <><strong className="text-amber-300">VERY IMPORTANT:</strong> When transferring on Binance, include your order reference number in the payment note/concept.</>
                            ) : (
                              <><strong className="text-amber-300">MUY IMPORTANTE:</strong> Al realizar la transferencia en Binance, incluye el número de referencia de tu pedido en el concepto o nota.</>
                            )}
                          </li>
                          <li>
                            {isEn ? (
                              <>Once payment is sent, take a screenshot of the receipt and send it to <strong className="text-white">corporationatlas969@gmail.com</strong> or our WhatsApp support.</>
                            ) : (
                              <>Una vez hecho el pago, toma una captura de pantalla del comprobante y envíala a <strong className="text-white">corporationatlas969@gmail.com</strong> o a nuestro WhatsApp de soporte.</>
                            )}
                          </li>
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
                      <span>{isEn ? 'Payment with PayPal / Credit or Debit Card' : 'Pago con PayPal / Tarjeta de Débito o Crédito'}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isEn
                        ? 'You can make your payment securely via PayPal to the official corporate account of Corporation Atlas.'
                        : 'Puedes realizar tu pago seguro mediante PayPal enviando a la cuenta corporativa oficial de Corporation Atlas.'}
                    </p>
                    <div className="bg-[#131520] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {isEn ? 'Corporate PayPal Account:' : 'Cuenta PayPal Corporativa:'}
                        </span>
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
                        <span>{copiedId ? (isEn ? 'Copied!' : '¡Copiado!') : (isEn ? 'Copy Email' : 'Copiar Correo')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Resumen de Garantía */}
                <div className="bg-[#181a24] p-4 rounded-xl border border-white/10 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isEn ? 'Procurement Contract with Full Refund Guarantee' : 'Contrato de Procura con Garantía de Reembolso'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isEn
                      ? `Once submitted, an Atlas logistics advisor will contact phone ${formData.telefono || 'provided'} to finalize the consignment and maritime shipping contract.`
                      : `Una vez enviada la solicitud, un asesor de Atlas se comunicará al teléfono ${formData.telefono || 'proporcionado'} para formalizar el contrato de consignación y flete marítimo.`}
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
                      {isEn ? 'Generating procurement and tracking order...' : 'Generando orden de procura y seguimiento...'}
                    </span>
                  ) : (
                    <span>{isEn ? 'Confirm Procurement Request' : 'Confirmar Solicitud de Procura'}</span>
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
                  <h3 className="text-xl font-black text-white">
                    {isEn ? 'Request Successfully Registered!' : '¡Solicitud Registrada con Éxito!'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isEn ? (
                      <>We have assigned a priority tracking code and sent details to: <br /><strong className="text-white">{formData.email}</strong></>
                    ) : (
                      <>Hemos asignado un código de seguimiento prioritario y enviado los detalles a: <br /><strong className="text-white">{formData.email}</strong></>
                    )}
                  </p>
                </div>

                {/* Recibo de Procura */}
                <div className="bg-[#181a24] p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isEn ? 'Order & Reference:' : 'Pedido & Referencia:'}</span>
                    <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">{trackingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isEn ? 'Consignee Name:' : 'Titular de Procura:'}</span>
                    <span className="font-semibold text-white">{formData.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isEn ? 'Selected Method:' : 'Método Elegido:'}</span>
                    <span className="font-semibold text-amber-400 capitalize">{formData.metodoPago}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isEn ? 'Delivery Destination:' : 'Destino de Entrega:'}</span>
                    <span className="font-semibold text-white">{formData.ciudad}, Venezuela</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isEn ? 'Procurement Status:' : 'Estado de Procura:'}</span>
                    <span className="font-bold text-emerald-400">
                      {isEn ? 'Quota Assigned / In Process' : 'En asignación de cupo'}
                    </span>
                  </div>
                </div>

                {/* Botón Factura Proforma Oficial */}
                <div className="max-w-sm mx-auto pt-1">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs transition-all shadow-xl flex items-center justify-center gap-2 active:scale-98"
                  >
                    <FileText className="w-4 h-4 text-black" />
                    <span>{isEn ? 'Download / Print Proforma Invoice (PDF)' : 'Descargar / Imprimir Factura Proforma (PDF)'}</span>
                  </button>
                </div>

                {/* Acciones para enviar comprobante */}
                <div className="p-4 rounded-2xl bg-[#11131e] border border-white/10 max-w-sm mx-auto space-y-2.5 text-xs">
                  <p className="text-slate-300 font-bold text-[11px]">
                    {isEn ? (
                      <>Send your payment receipt with order code <strong className="text-white font-mono">{trackingId}</strong>:</>
                    ) : (
                      <>Envía tu comprobante con el código de orden <strong className="text-white font-mono">{trackingId}</strong>:</>
                    )}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/584222932455?text=${encodeURIComponent(
                        isEn
                          ? `Hello Corporation Atlas, attaching payment receipt for my order ${trackingId} under name ${formData.nombre}.`
                          : `Hola Corporation Atlas, adjunto comprobante de pago para mi orden ${trackingId} a nombre de ${formData.nombre}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all text-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`mailto:corporationatlas969@gmail.com?subject=${encodeURIComponent(
                        isEn
                          ? `Payment Receipt - Order ${trackingId} (${formData.nombre})`
                          : `Comprobante de Pago - Orden ${trackingId} (${formData.nombre})`
                      )}&body=${encodeURIComponent(
                        isEn
                          ? `Hello Corporation Atlas,\n\nAttaching payment receipt for order ${trackingId}.\n\nName: ${formData.nombre}\nPhone: ${formData.telefono}\nMethod: ${formData.metodoPago}`
                          : `Hola Corporation Atlas,\n\nAdjunto comprobante de pago para la orden ${trackingId}.\n\nTitular: ${formData.nombre}\nTeléfono: ${formData.telefono}\nMétodo: ${formData.metodoPago}`
                      )}`}
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md transition-all text-xs"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{isEn ? 'Send Email' : 'Enviar Correo'}</span>
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCloseAndReset}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-200 transition-all shadow-md"
                  >
                    <span>{isEn ? 'Back to Atlas Catalog' : 'Volver al Catálogo Atlas'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Modal Factura Proforma Oficial */}
      <ProformaInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={createdOrderData}
      />
    </div>
  );
};

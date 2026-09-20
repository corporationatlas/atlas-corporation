import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Ship,
  FileText,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

export const ProformaInvoiceModal = ({ isOpen, onClose, order }) => {
  const invoiceRef = useRef(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = order.id ? `PRF-${order.id.replace('ATL-', '')}` : `PRF-${Date.now().toString().slice(-6)}`;
  const orderDate = order.date || new Date().toISOString().split('T')[0];
  
  // Vencimiento a 7 días hábiles para reserva de flete
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  const formattedDueDate = dueDate.toISOString().split('T')[0];

  const totalAmount = order.total || 0;
  const advanceAmount = totalAmount * 0.4;
  const balanceAmount = totalAmount * 0.6;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      
      {/* Contenedor Principal del Modal */}
      <div className="relative bg-[#0d0f17] text-slate-100 rounded-3xl border border-white/15 max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:bg-white print:text-black">
        
        {/* Barra superior de herramientas (Oculta al imprimir) */}
        <div className="p-4 sm:px-6 bg-[#131522] border-b border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-black text-white tracking-wide">
              Factura Proforma / Orden de Preorden (Documento Oficial)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-bold transition-all shadow"
              title="Imprimir o Guardar en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= DOCUMENTO FACTURA PROFORMA (FORMATO IMPRIMIBLE) ================= */}
        <div
          id="proforma-invoice-print"
          ref={invoiceRef}
          className="p-6 sm:p-10 space-y-6 text-xs bg-[#0d0f17] print:bg-white print:text-slate-900 print:p-8"
        >
          {/* Encabezado del Documento */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10 print:border-slate-300">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <img src="/atlas-logo.png" alt="Atlas Logo" className="w-10 h-10 object-contain" />
                <div>
                  <h1 className="text-lg sm:text-xl font-black tracking-wider text-white print:text-black uppercase">
                    CORPORATION ATLAS C.A.
                  </h1>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">
                    R.I.F. J-50493821-0 • Registro Internacional de Procura y Comercio Exterior
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600 pt-1">
                Especialistas en importación marítima directa Dubái - China - Venezuela.<br />
                Oficina Central: Caracas / Valencia • Enlace Portuario: Puerto Cabello & La Guaira.<br />
                Contacto: <strong className="text-slate-200 print:text-black">corporationatlas969@gmail.com</strong> | WhatsApp: <strong className="text-slate-200 print:text-black">+58 422 293 2455</strong>
              </p>
            </div>

            {/* Recuadro de Factura Proforma */}
            <div className="bg-[#141724] p-4 rounded-2xl border border-white/10 text-right print:bg-slate-100 print:border-slate-300 print:text-black min-w-[200px]">
              <span className="text-[10px] uppercase tracking-widest font-black text-amber-400 print:text-amber-700 block">
                FACTURA PROFORMA
              </span>
              <span className="text-sm font-mono font-black text-white print:text-black block mt-0.5">
                {invoiceNumber}
              </span>
              <div className="mt-2 text-[10px] text-slate-400 print:text-slate-600 space-y-0.5">
                <p>Fecha Emisión: <strong className="text-slate-200 print:text-black">{orderDate}</strong></p>
                <p>Validez: <strong className="text-slate-200 print:text-black">7 Días ({formattedDueDate})</strong></p>
                <p>Estatus: <span className="text-emerald-400 font-bold print:text-emerald-700">Emitida / Por Procesar</span></p>
              </div>
            </div>
          </div>

          {/* Datos del Cliente y Envío */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#11131e] p-4 rounded-2xl border border-white/10 print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider block mb-1">
                DATOS DEL COMPRADOR (CONSIGNATARIO)
              </span>
              <p className="font-bold text-sm text-white print:text-black">{order.nombre}</p>
              <p className="text-slate-300 print:text-slate-700">Cédula / RIF: <span className="font-mono">{order.cedula || 'V-En trámite'}</span></p>
              <p className="text-slate-300 print:text-slate-700">Teléfono: {order.telefono || 'Sin registrar'}</p>
              <p className="text-slate-300 print:text-slate-700">Email: {order.email}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider block mb-1">
                DESTINO DE ENTREGA & NACIONALIZACIÓN
              </span>
              <p className="font-bold text-white print:text-black">{order.ciudad || 'Caracas / Valencia'}, Venezuela</p>
              <p className="text-slate-300 print:text-slate-700">Dirección: {order.direccionEntrega || 'Entrega en Concesionario Autorizado'}</p>
              <p className="text-slate-300 print:text-slate-700">Puerto de Desaduanamiento: Puerto Cabello (VEPBL) / La Guaira (VELAG)</p>
              <p className="text-slate-300 print:text-slate-700">Modalidad: <strong className="text-amber-400 print:text-amber-700 uppercase">{order.metodoPago || 'Plan Procura'}</strong></p>
            </div>
          </div>

          {/* Tabla de Detalle del Vehículo / Ítems */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider block mb-2">
              DETALLE DE LAS UNIDADES EN PROCURA INTERNACIONAL
            </span>
            <div className="overflow-x-auto rounded-xl border border-white/10 print:border-slate-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161825] text-slate-300 print:bg-slate-200 print:text-black border-b border-white/10 print:border-slate-300">
                  <tr>
                    <th className="p-3">Descripción de la Unidad</th>
                    <th className="p-3">Origen / Logística</th>
                    <th className="p-3 text-center">Cant.</th>
                    <th className="p-3 text-right">Precio Unitario</th>
                    <th className="p-3 text-right">Total USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200">
                  <tr>
                    <td className="p-3 font-bold text-white print:text-black">
                      {order.vehiculo || 'Unidad Automotriz Atlas Spec'}
                      <span className="block text-[10px] text-slate-400 print:text-slate-600 font-normal mt-0.5">
                        Incluye: Flete marítimo internacional en contenedor sellado, aranceles aduanales SENIAT, certificado de origen y gestión de placas INTT en Venezuela.
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 print:text-slate-700">Dubái / China ➔ Venezuela</td>
                    <td className="p-3 text-center font-mono font-bold">1</td>
                    <td className="p-3 text-right font-mono">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-mono font-bold text-white print:text-black">
                      ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cuadro de Totales y Liquidación */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
            <div className="space-y-3 flex-1">
              <div className="p-3 rounded-xl bg-[#11131e] border border-white/10 print:bg-slate-50 print:border-slate-300 text-[11px] space-y-1">
                <span className="font-bold text-slate-200 print:text-black flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Garantía & Compromiso de Procura
                </span>
                <p className="text-slate-400 print:text-slate-600 text-[10px] leading-relaxed">
                  Esta orden proforma reserva la unidad en fábrica y bloquea el flete marítimo durante 7 días. El trámite incluye custodia de fondos y seguimiento satelital de la carga en vivo.
                </p>
              </div>

              {/* Si es Plan Procura 40/60 */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] space-y-1 print:border-amber-400 print:bg-amber-50">
                <span className="font-bold text-amber-300 print:text-amber-800">
                  Esquema de Pago Procura (40% Anticipo + 60% al Puerto):
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-slate-400 print:text-slate-700 block">Anticipo de Zarpe (40%):</span>
                    <strong className="text-white print:text-black font-mono">${advanceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-slate-700 block">Saldo contra Entrega (60%):</span>
                    <strong className="text-white print:text-black font-mono">${balanceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 bg-[#141724] p-4 rounded-2xl border border-white/10 print:bg-slate-100 print:border-slate-300 text-xs">
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Subtotal CIF Origen:</span>
                <span className="font-mono font-bold">${(totalAmount * 0.85).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Flete Marítimo + Seguro:</span>
                <span className="font-mono font-bold">${(totalAmount * 0.10).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Gestión Aduana SENIAT:</span>
                <span className="font-mono font-bold">${(totalAmount * 0.05).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-2 border-t border-white/10 print:border-slate-300 flex justify-between items-baseline">
                <span className="font-bold text-white print:text-black text-xs uppercase">Total Puesto en VE:</span>
                <span className="text-base font-black text-amber-400 print:text-black font-mono">
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>
          </div>

          {/* Instrucciones de Pago en la Factura Proforma */}
          <div className="pt-4 border-t border-white/10 print:border-slate-300 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
              CANALES DE PAGO HABILITADOS PARA ESTA PREORDEN
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              {/* Binance Pay */}
              <div className="p-3.5 rounded-xl bg-[#11131e] border border-amber-500/30 print:bg-slate-50 print:border-amber-600 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 print:text-amber-800 font-bold text-xs">
                  <QrCode className="w-4 h-4" />
                  <span>Binance Pay / USDT</span>
                </div>
                <p className="text-slate-300 print:text-slate-700">
                  Pay ID Oficial: <strong className="text-white print:text-black font-mono text-xs">395610250</strong>
                </p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">
                  Monto exacto en USDT. En el concepto de Binance colocar el código de orden: <strong className="text-white print:text-black font-mono">{order.id}</strong>.
                </p>
              </div>

              {/* PayPal */}
              <div className="p-3.5 rounded-xl bg-[#11131e] border border-blue-500/30 print:bg-slate-50 print:border-blue-600 space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-400 print:text-blue-800 font-bold text-xs">
                  <CreditCard className="w-4 h-4" />
                  <span>PayPal / Tarjeta de Crédito</span>
                </div>
                <p className="text-slate-300 print:text-slate-700">
                  Cuenta Oficial: <strong className="text-white print:text-black font-mono text-xs">corporationatlas969@gmail.com</strong>
                </p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">
                  Pago seguro protegido en USD. Enviar comprobante al WhatsApp de la empresa.
                </p>
              </div>
            </div>
          </div>

          {/* Pie de página de validez legal */}
          <div className="pt-6 border-t border-white/10 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 print:text-slate-600">
            <p>
              Documento emitido electrónicamente por Corporation Atlas C.A. • Sistema de Procura Vercel & Firebase.
            </p>
            <div className="text-center sm:text-right">
              <span className="font-bold text-slate-300 print:text-black block">Firma & Sello de Emisión Digital</span>
              <span>Corporation Atlas • Dirección de Operaciones y Comercio Exterior</span>
            </div>
          </div>

        </div>

        {/* Barra Inferior de Acciones (Oculta al imprimir) */}
        <div className="p-4 sm:px-6 bg-[#131522] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <a
            href={`https://wa.me/584222932455?text=${encodeURIComponent(`Hola Corporation Atlas, tengo mi Factura Proforma ${invoiceNumber} para la orden ${order.id} por $${totalAmount} USD. Deseo confirmar mi pago.`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-bold transition-all shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

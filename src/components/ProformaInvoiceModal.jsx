import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  FileText,
  ShieldCheck,
  QrCode,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  Building2,
  Mail,
  Phone,
  Receipt
} from 'lucide-react';

export const ProformaInvoiceModal = ({ isOpen, onClose, order }) => {
  // 'notice' = Aviso de Pedido / Presupuesto (Foto 2 estilo Odoo)
  // 'invoice' = Factura Formal Comercial Definitiva
  const [docType, setDocType] = useState('notice');
  const [copiedId, setCopiedId] = useState(false);

  // Código correlativo corto estilo Odoo S0000X o el ID de orden
  const orderRef = order?.id ? (order.id.startsWith('ATL-') ? `S${order.id.replace('ATL-', '').replace('-VE', '')}` : order.id) : 'S00001';
  const orderDate = order?.date || new Date().toISOString().split('T')[0];
  const totalAmount = order?.total || 0;
  const formattedTotal = totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const advanceAmount = (totalAmount * 0.4).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const balanceAmount = (totalAmount * 0.6).toLocaleString('en-US', { minimumFractionDigits: 2 });

  // Detección estricta del método de pago elegido para mostrar únicamente ese canal
  const paymentMethodRaw = (order?.metodoPago || '').toLowerCase();
  const isPayPal = paymentMethodRaw.includes('paypal');
  const isTransfer = paymentMethodRaw.includes('transferencia') || paymentMethodRaw.includes('bancari') || paymentMethodRaw.includes('cable');
  const isPlanProcura = paymentMethodRaw.includes('procura') || paymentMethodRaw.includes('inicial') || paymentMethodRaw.includes('40%');
  const isBinance = paymentMethodRaw.includes('binance') || paymentMethodRaw.includes('usdt') || (!isPayPal && !isTransfer && !isPlanProcura);

  // Impresión aislada garantizada mediante Iframe para evitar páginas en blanco por estilos del modal
  const handlePrint = () => {
    const container = document.getElementById('printable-document-container');
    if (!container) {
      window.print();
      return;
    }

    try {
      // Eliminar iframe previo si existía
      const oldFrame = document.getElementById('atlas-invoice-print-frame');
      if (oldFrame) {
        oldFrame.remove();
      }

      // Crear iframe invisible aislado
      const printFrame = document.createElement('iframe');
      printFrame.id = 'atlas-invoice-print-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      printFrame.style.visibility = 'hidden';
      document.body.appendChild(printFrame);

      const frameDoc = printFrame.contentWindow.document;

      // Extraer estilos cargados en la página (Tailwind CSS, fuentes y layouts)
      const currentStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map(style => style.outerHTML)
        .join('\n');

      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <title>Atlas - ${docType === 'notice' ? 'Aviso de Pedido' : 'Factura'} ${orderRef}</title>
            ${currentStyles}
            <style>
              @page {
                size: letter portrait;
                margin: 12mm 15mm 15mm 15mm;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                box-sizing: border-box;
              }
              html, body {
                background: #ffffff !important;
                color: #0f172a !important;
                margin: 0 !important;
                padding: 0 !important;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                font-size: 13px;
                line-height: 1.5;
              }
              #atlas-print-wrapper {
                width: 100% !important;
                max-width: 720px !important;
                margin: 0 auto !important;
                padding: 10px 0 !important;
                background: #ffffff !important;
                color: #0f172a !important;
              }
              .no-print {
                display: none !important;
              }
            </style>
          </head>
          <body>
            <div id="atlas-print-wrapper">
              ${container.innerHTML}
            </div>
          </body>
        </html>
      `);
      frameDoc.close();

      const triggerPrint = () => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch (e) {
          console.warn('Iframe print falló, usando window.print:', e);
          window.print();
        }
      };

      // Esperar a que los recursos e imágenes terminen de procesarse
      const imgs = frameDoc.querySelectorAll('img');
      if (imgs.length > 0) {
        let loaded = 0;
        let fired = false;
        const checkReady = () => {
          if (fired) return;
          loaded++;
          if (loaded >= imgs.length) {
            fired = true;
            setTimeout(triggerPrint, 150);
          }
        };
        imgs.forEach(img => {
          if (img.complete) {
            checkReady();
          } else {
            img.onload = checkReady;
            img.onerror = checkReady;
          }
        });
        setTimeout(() => {
          if (!fired) {
            fired = true;
            triggerPrint();
          }
        }, 500);
      } else {
        setTimeout(triggerPrint, 150);
      }
    } catch (err) {
      console.warn('Error en impresión por iframe:', err);
      window.print();
    }
  };

  // Interceptar Ctrl+P o Cmd+P mientras el modal esté abierto para usar la impresión limpia
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, docType, orderRef]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      
      {/* Tarjeta Modal Principal */}
      <div className="relative bg-[#0d0f17] text-slate-100 rounded-3xl border border-white/15 max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:bg-white print:text-black">
        
        {/* ================= BARRA SUPERIOR DE HERRAMIENTAS (NO IMPRIMIBLE) ================= */}
        <div className="p-4 sm:px-6 bg-[#131522] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 no-print">
          {/* Selector de tipo de documento */}
          <div className="flex items-center gap-2 bg-[#0a0c13] p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setDocType('notice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                docType === 'notice'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Aviso de Pedido (Estilo Odoo)</span>
            </button>

            <button
              onClick={() => setDocType('invoice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                docType === 'invoice'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Factura Formal Comercial</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-bold transition-all shadow-md active:scale-95"
              title="Imprimir o Guardar en PDF limpio"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= CONTENEDOR AISLADO PARA IMPRESIÓN (#printable-document-container) ================= */}
        <div id="printable-document-container" className="p-6 sm:p-10 bg-white text-slate-900 selection:bg-slate-200 selection:text-black font-sans">
          
          {/* ============================================================== */}
          {/* FORMATO 1: AVISO DE PEDIDO / PRESUPUESTO (FOTO 2 EXACTA DE ODOO) */}
          {/* ============================================================== */}
          {docType === 'notice' && (
            <div className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed text-slate-800">
              
              {/* Encabezado Odoo */}
              <div className="space-y-1">
                <span className="text-xs text-slate-600 font-medium block">
                  Su Presupuesto
                </span>
                <h1 className="text-3xl font-black text-blue-600 underline tracking-tight">
                  {orderRef}
                </h1>
              </div>

              {/* Línea divisoria superior */}
              <hr className="border-t border-slate-300 my-4" />

              {/* Cuerpo del Mensaje Odoo */}
              <div className="space-y-4 text-[13px] sm:text-sm text-slate-800">
                <p className="font-semibold">
                  Hola {order.nombre || 'Cliente'}:
                </p>

                <p>
                  El pago con referencia <strong className="font-bold text-black">{orderRef}</strong> por un importe de{' '}
                  <strong className="font-black text-black">${formattedTotal} USD</strong> en relación con su pedido{' '}
                  <strong className="font-bold text-black">{orderRef}</strong> ({order.vehiculo || 'Vehículo bajo demanda'}) está pendiente de pago.
                </p>

                <p>
                  Confirmaremos su pedido una vez que se haya confirmado el pago.
                </p>

                {/* Recuadro del Medio de Pago Seleccionado por el Cliente */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 my-4">
                  <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
                    Canal de Pago para Liquidar su Pedido:
                  </span>

                  {/* Binance Pay / USDT */}
                  {isBinance && (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-300 space-y-2 text-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-amber-600" />
                          <span className="text-sm">Binance Pay / USDT</span>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          Criptoactivo Seguro
                        </span>
                      </div>
                      <p className="text-slate-700">
                        Pay ID Oficial: <strong className="text-black font-mono text-sm">395610250</strong>
                      </p>
                      <p className="text-slate-600">
                        Concepto / Nota obligatoria: <strong className="text-black font-mono text-sm font-bold">{orderRef}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 leading-relaxed">
                        Abre Binance en tu teléfono celular, ingresa en Pay con el ID <strong>395610250</strong> y envía el monto en USDT colocando el código <strong>{orderRef}</strong> en la nota del pago.
                      </p>
                    </div>
                  )}

                  {/* PayPal */}
                  {isPayPal && (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-300 space-y-2 text-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">PayPal (USD / Tarjeta Internacional)</span>
                        </div>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                          Pago Seguro USD
                        </span>
                      </div>
                      <p className="text-slate-700">
                        Cuenta Corporativa: <strong className="text-black font-mono text-xs sm:text-sm">corporationatlas969@gmail.com</strong>
                      </p>
                      <p className="text-slate-600">
                        Nota de la transacción: <strong className="text-black font-mono text-sm font-bold">{orderRef}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 leading-relaxed">
                        Al enviar tu pago por PayPal, recuerda incluir el código <strong>{orderRef}</strong> en la nota o concepto para conciliar tu compra inmediatamente.
                      </p>
                    </div>
                  )}

                  {/* Transferencia Bancaria Internacional */}
                  {isTransfer && (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-300 space-y-2 text-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm">Transferencia Bancaria Internacional / Cable USD</span>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                          Cuenta Custodia
                        </span>
                      </div>
                      <p className="text-slate-700">
                        Beneficiario: <strong className="text-black font-semibold">Corporation Atlas C.A.</strong>
                      </p>
                      <p className="text-slate-600">
                        Referencia obligatoria: <strong className="text-black font-mono text-sm font-bold">{orderRef}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 leading-relaxed">
                        Comunícate a nuestro WhatsApp corporativo indicando tu referencia <strong>{orderRef}</strong> para suministrarte los datos SWIFT/IBAN de liquidación.
                      </p>
                    </div>
                  )}

                  {/* Plan Procura */}
                  {isPlanProcura && (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-300 space-y-2 text-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Receipt className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Plan Procura: 40% Anticipo + Saldo al Puerto</span>
                        </div>
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                          Modalidad Fraccionada
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-semibold">40% Anticipo de Zarpe:</span>
                          <strong className="text-black font-mono text-sm font-bold">${advanceAmount} USD</strong>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-semibold">60% Saldo al Arribo en VE:</span>
                          <strong className="text-black font-mono text-sm font-bold">${balanceAmount} USD</strong>
                        </div>
                      </div>
                      <p className="text-slate-600 pt-1">
                        Referencia del Pedido: <strong className="text-black font-mono text-sm font-bold">{orderRef}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 leading-relaxed">
                        Puedes liquidar el 40% de anticipo (${advanceAmount} USD) vía Binance Pay ID (395610250) o PayPal (corporationatlas969@gmail.com) indicando la referencia <strong>{orderRef}</strong>.
                      </p>
                    </div>
                  )}
                </div>

                <p>
                  Agradecemos su confianza.
                </p>

                <p>
                  No dude en ponerse en contacto con nosotros si tiene alguna pregunta.
                </p>

                <div className="pt-2 text-slate-600">
                  <p>--</p>
                  <p className="font-bold text-slate-800">Administrator</p>
                </div>
              </div>

              {/* Línea divisoria inferior */}
              <hr className="border-t border-slate-300 my-4" />

              {/* Pie de página final */}
              <div className="text-center text-xs text-slate-600 font-medium py-1">
                WhatsApp: +58 422 293 2455 • Caracas
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* FORMATO 2: FACTURA COMERCIAL FORMAL COMPLETA                   */}
          {/* ============================================================== */}
          {docType === 'invoice' && (
            <div className="space-y-6 text-xs text-slate-900">
              
              {/* Header Formal */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-300 gap-4">
                <div className="flex items-center gap-3">
                  <img src="/atlas-logo.png" alt="Atlas Logo" className="w-12 h-12 object-contain" />
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-wider text-black uppercase">
                      CORPORATION ATLAS C.A.
                    </h2>
                    <p className="text-[10px] text-slate-600">
                      R.I.F. J-50493821-0 • Registro Mercantil de Comercio Exterior y Procura Automotriz<br />
                      Caracas / Valencia • Puertos de Desaduanamiento: Puerto Cabello & La Guaira
                    </p>
                  </div>
                </div>

                <div className="text-right border border-slate-300 p-3 rounded-lg bg-slate-50 min-w-[170px]">
                  <span className="text-[10px] font-black uppercase text-slate-700 block tracking-widest">
                    FACTURA COMERCIAL
                  </span>
                  <span className="text-sm font-black font-mono text-black block">
                    {order.id || orderRef}
                  </span>
                  <div className="text-[10px] text-slate-600 mt-1 space-y-0.5">
                    <p>Fecha: <strong>{orderDate}</strong></p>
                    <p>Estado: <strong className="text-emerald-700 uppercase">Orden Registrada</strong></p>
                  </div>
                </div>
              </div>

              {/* Ficha Comprador y Destino */}
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    CLIENTE CONSIGNATARIO
                  </span>
                  <p className="font-bold text-xs text-black">{order.nombre}</p>
                  <p className="text-slate-700">Cédula / RIF: <span className="font-mono">{order.cedula || 'V-En proceso'}</span></p>
                  <p className="text-slate-700">Teléfono: {order.telefono || 'Sin registrar'}</p>
                  <p className="text-slate-700">Email: {order.email}</p>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    DESTINO DE NACIONALIZACIÓN
                  </span>
                  <p className="font-bold text-xs text-black">{order.ciudad || 'Caracas / Valencia'}, Venezuela</p>
                  <p className="text-slate-700">Dirección: {order.direccionEntrega || 'Entrega en Concesionario'}</p>
                  <p className="text-slate-700">Modalidad: <strong>{order.metodoPago || 'Plan Procura'}</strong></p>
                </div>
              </div>

              {/* Tabla de Unidades */}
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-800">
                  <tr>
                    <th className="p-2.5">Descripción de la Unidad Automotriz</th>
                    <th className="p-2.5">Puerto / Ruta</th>
                    <th className="p-2.5 text-center">Cant.</th>
                    <th className="p-2.5 text-right">Precio Unitario</th>
                    <th className="p-2.5 text-right">Total USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-bold text-black">
                      {order.vehiculo || 'Unidad Automotriz Atlas Spec'}
                      <span className="block text-[10px] text-slate-600 font-normal mt-0.5">
                        Incluye: Flete marítimo internacional en contenedor sellado, aranceles aduanales SENIAT, certificado de origen y gestión de placas INTT en Venezuela.
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700">Dubái / China ➔ Venezuela</td>
                    <td className="p-2.5 text-center font-mono">1</td>
                    <td className="p-2.5 text-right font-mono">${formattedTotal}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-black">${formattedTotal}</td>
                  </tr>
                </tbody>
              </table>

              {/* Liquidación de Totales */}
              <div className="flex justify-between items-start gap-4 pt-1">
                <div className="space-y-1.5 flex-1 text-[11px] text-slate-600">
                  <p className="font-bold text-slate-800">Garantía y Condiciones de Comercio Exterior:</p>
                  <p>
                    • Cobertura de seguro marítimo contra todo riesgo hasta el puerto de arribo en Venezuela.<br />
                    • Trámite formal de aduanas ante SENIAT con factura de nacionalización legal.<br />
                    • Garantía de fábrica respaldada por Corporation Atlas.
                  </p>
                </div>

                <div className="w-60 border border-slate-300 p-3 rounded-lg bg-slate-50 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal CIF:</span>
                    <span className="font-mono">${(totalAmount * 0.85).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Flete Marítimo:</span>
                    <span className="font-mono">${(totalAmount * 0.10).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Aranceles SENIAT:</span>
                    <span className="font-mono">${(totalAmount * 0.05).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-300 flex justify-between font-bold text-black text-sm">
                    <span>Total Puesto en VE:</span>
                    <span className="font-mono">${formattedTotal} USD</span>
                  </div>
                </div>
              </div>

              {/* Sello y Firma */}
              <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-600">
                <div>
                  <p className="font-bold text-black">Corporation Atlas C.A.</p>
                  <p>WhatsApp: +58 422 293 2455 • Caracas</p>
                </div>
                <div className="text-right">
                  <div className="w-36 border-b border-slate-400 mb-1"></div>
                  <p className="font-bold text-black">Firma y Sello Autorizado</p>
                  <p>Departamento de Importación & Logística</p>
                </div>
              </div>

              {/* Pie de página unificado */}
              <div className="text-center text-xs text-slate-600 font-medium pt-3 border-t border-slate-200">
                WhatsApp: +58 422 293 2455 • Caracas
              </div>

            </div>
          )}

        </div>

        {/* ================= BARRA INFERIOR DE ACCIONES (NO IMPRIMIBLE) ================= */}
        <div className="p-4 sm:px-6 bg-[#131522] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 no-print">
          <a
            href={`https://wa.me/584222932455?text=${encodeURIComponent(`Hola Corporation Atlas, adjunto comprobante del pedido ${orderRef} (${order.nombre}) por un importe de $${formattedTotal} USD.`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notificar Pago por WhatsApp</span>
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

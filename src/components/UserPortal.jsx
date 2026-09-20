import React, { useState, useRef } from 'react';
import {
  Package,
  MapPin,
  CheckCircle2,
  Ship,
  FileCheck,
  KeyRound,
  MessageCircle,
  LogOut,
  User,
  ArrowLeft,
  Camera,
  Trash2,
  Navigation,
  Compass,
  Radio,
  Anchor,
  Globe,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { ProformaInvoiceModal } from './ProformaInvoiceModal';

export const UserPortal = () => {
  const { currentUser, setCurrentView, logout, updateUserProfile } = useAuth();
  const { ordersList } = useAdmin();

  // Tabs: 'orders' | 'tracking' | 'profile'
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Formulario de datos básicos
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    cedula: currentUser?.cedula || '',
    phone: currentUser?.phone || '',
    city: currentUser?.city || 'Valencia',
    address: currentUser?.address || 'Urb. El Parral, Av. 137, Res. Los Sauces'
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Filtrar pedidos del usuario
  const myOrders = ordersList.filter(
    (o) =>
      o.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
      o.nombre?.toLowerCase() === currentUser?.name?.toLowerCase() ||
      currentUser?.email === 'cliente@atlas.com' // Demo fallback
  );

  // Pedido seleccionado para el mapa de seguimiento
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(myOrders[0] || null);

  // Mapeo de etapas logísticas para la línea de tiempo
  const stages = [
    { id: 1, label: 'Procura en Origen', desc: 'Dubái / China', icon: Package },
    { id: 2, label: 'Tránsito Marítimo', desc: 'En navegación oceánica', icon: Ship },
    { id: 3, label: 'Aduana & SENIAT', desc: 'Puerto Cabello / La Guaira', icon: FileCheck },
    { id: 4, label: 'Listo para Rodar', desc: 'Inspeccionado con placas', icon: KeyRound }
  ];

  const getStageNumber = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('entregado') || s.includes('listo')) return 4;
    if (s.includes('aduana') || s.includes('puerto')) return 3;
    if (s.includes('marítima') || s.includes('navegación') || s.includes('tránsito') || s.includes('embarque')) return 2;
    return 1;
  };

  // Subir y comprimir foto de perfil
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        updateUserProfile({ photoURL: compressedDataUrl });
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    updateUserProfile({ photoURL: '' });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: profileForm.name,
      cedula: profileForm.cedula,
      phone: profileForm.phone,
      city: profileForm.city,
      address: profileForm.address
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const goToTrackingForOrder = (order) => {
    setSelectedTrackingOrder(order);
    setActiveTab('tracking');
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* ================= TOP HEADER REESTRUCTURADO ================= */}
      <header className="sticky top-0 z-30 bg-[#0c0d12]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Botón Flecha Atrás para volver a la tienda principal */}
          <button
            onClick={() => setCurrentView('store')}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10 group"
            title="Volver a la tienda principal"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Logo Atlas */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
            <img
              src="/atlas-logo.png"
              alt="Atlas Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
            />
          </div>

          {/* Saludo Bienvenido al usuario */}
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-wide text-white flex items-center gap-1.5">
              <span>Bienvenido,</span>
              <span className="text-slate-200 truncate max-w-[150px] sm:max-w-[260px]">
                {currentUser?.name || 'Cliente'}
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              Corporation Atlas • Procura y Logística Internacional
            </p>
          </div>
        </div>

        {/* Lado derecho: Botón "Mi Perfil" con avatar (despliega los datos básicos) */}
        <div className="flex items-center">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-black border-white shadow-lg ring-2 ring-white/20'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Ver y editar Mi Perfil"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow overflow-hidden border shrink-0 ${
              activeTab === 'profile' ? 'bg-black text-white border-black/20' : 'bg-white text-black border-white/20'
            }`}>
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <span className="text-xs font-bold">
              Mi Perfil
            </span>
          </button>
        </div>
      </header>

      {/* ================= PESTAÑAS DE NAVEGACIÓN ================= */}
      <div className="bg-[#0f1118] border-b border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 scrollbar-none">
          {/* Pestaña 1: Mis Pedidos */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-white text-black shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Mis Pedidos</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-white/10 text-slate-300'}`}>
              {myOrders.length}
            </span>
          </button>

          {/* Pestaña 2: Seguimiento de Vehículo (con mapa) */}
          <button
            onClick={() => setActiveTab('tracking')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'bg-white text-black shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Seguimiento de Vehículo</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </button>
        </div>
      </div>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">

        {/* ================= TAB 1: MIS PEDIDOS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Historial de Mis Pedidos</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Consulta el estatus de las unidades adquiridas e ingresa al mapa satelital de seguimiento.
                </p>
              </div>

              {myOrders.length > 0 && (
                <button
                  onClick={() => goToTrackingForOrder(myOrders[0])}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 self-start sm:self-auto transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Ver Mapa Satelital Global</span>
                </button>
              )}
            </div>

            {myOrders.length === 0 ? (
              <div className="py-20 text-center bg-[#11131c] rounded-3xl border border-white/10 max-w-lg mx-auto p-8 space-y-4 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No tienes pedidos activos aún</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Explora nuestro catálogo de motocicletas y vehículos en la vitrina principal para tramitar tu orden de procura e importación con entrega directa en Venezuela.
                </p>
                <button
                  onClick={() => setCurrentView('store')}
                  className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all shadow-md inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ir al menú principal</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myOrders.map((order) => {
                  const currentStage = getStageNumber(order.status);

                  return (
                    <div
                      key={order.id}
                      className="bg-[#12141e] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-5 shadow-xl hover:border-white/20 transition-all"
                    >
                      {/* Cabecera del Pedido */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-400">Código de Orden:</span>
                            <span className="font-mono text-sm font-black text-white bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                              {order.id}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              • Solicitado el {order.date}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1.5">
                            Destino de entrega: <strong className="text-white">{order.ciudad || 'Caracas / Valencia'}, Venezuela</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {order.status || 'En trámite de embarque'}
                          </span>
                        </div>
                      </div>

                      {/* Línea de tiempo de 4 etapas */}
                      <div className="py-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                          Etapa de la Operación
                        </span>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                          {stages.map((stg) => {
                            const isCompleted = currentStage >= stg.id;
                            const isCurrent = currentStage === stg.id;
                            const Icon = stg.icon;

                            return (
                              <div
                                key={stg.id}
                                className={`p-3 rounded-xl border transition-all ${
                                  isCurrent
                                    ? 'bg-[#1c1f2e] border-white text-white shadow-lg ring-1 ring-white/30'
                                    : isCompleted
                                    ? 'bg-[#141722] border-emerald-500/30 text-slate-200'
                                    : 'bg-[#0d0e14] border-white/5 text-slate-600'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                      isCurrent
                                        ? 'bg-white text-black'
                                        : isCompleted
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-white/5 text-slate-600'
                                    }`}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[9px] font-mono font-bold text-slate-400">
                                    {stg.id}/4
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold">{stg.label}</h4>
                                <p className="text-[10px] opacity-70 mt-0.5">{stg.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detalles del vehículo y botones de acción */}
                      <div className="bg-[#171926] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Unidad Solicitada
                          </span>
                          <h4 className="text-base font-black text-white mt-0.5">{order.vehiculo}</h4>
                          <span className="text-xs text-slate-400">
                            Modalidad: <strong className="text-slate-300">{order.metodoPago || 'Plan Procura'}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap justify-end">
                          <div className="text-left md:text-right mr-2">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Monto Puesto en VE:</span>
                            <span className="text-lg font-black text-white">
                              ${order.total ? order.total.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'} USD
                            </span>
                          </div>

                          {/* Botón Factura Proforma Oficial */}
                          <button
                            onClick={() => {
                              setSelectedInvoiceOrder(order);
                              setIsInvoiceOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 shadow-sm"
                            title="Ver e Imprimir Factura Proforma en PDF"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Factura Proforma</span>
                          </button>

                          {/* Botón destacado: Abrir Mapa de Seguimiento */}
                          <button
                            onClick={() => goToTrackingForOrder(order)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-bold transition-all shadow-md"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Rastrear en Mapa</span>
                          </button>

                          {/* Botón WhatsApp */}
                          <a
                            href={`https://wa.me/584222932455?text=${encodeURIComponent(`Hola Atlas, soy ${currentUser?.name || order.nombre} y deseo consultar el estatus de mi orden ${order.id}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Consultar Asesor</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: SEGUIMIENTO DE VEHÍCULO (MAPA SATELITAL DIGITAL) ================= */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Rastreo Satelital en Tiempo Real</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse text-emerald-400" /> GPS Activo
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Posición satelital del buque mercante y trayecto marítimo internacional con destino a puertos de Venezuela.
                </p>
              </div>

              {/* Selector de orden si tiene varias */}
              {myOrders.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Orden:</span>
                  <select
                    value={selectedTrackingOrder?.id}
                    onChange={(e) => {
                      const found = myOrders.find((o) => o.id === e.target.value);
                      if (found) setSelectedTrackingOrder(found);
                    }}
                    className="px-3 py-1.5 bg-[#171926] border border-white/15 rounded-xl text-xs font-bold text-white outline-none"
                  >
                    {myOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.vehiculo}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* MAPA DIGITAL SATELITAL E INTERACTIVO */}
            <div className="bg-[#0b0d14] rounded-3xl border border-white/15 overflow-hidden shadow-2xl relative">
              
              {/* Top Bar del Mapa */}
              <div className="bg-[#12141f] px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Compass className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '15s' }} />
                    <span className="font-mono font-bold text-white">Ruta: Dubái / China ➔ Puerto Cabello, Venezuela</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                  <span>Coord: <strong className="text-emerald-400">12° 28' 14" N, 68° 01' 22" W</strong></span>
                  <span className="hidden sm:inline">Buque: <strong className="text-slate-200">Atlas Ocean Voyager IV</strong></span>
                </div>
              </div>

              {/* Lienzo del Mapa Gráfico Digital (Estilo Navegación Satelital Dark High-Tech) */}
              <div className="relative w-full h-[400px] sm:h-[480px] bg-[#07090e] overflow-hidden flex items-center justify-center select-none">
                
                {/* Cuadrícula de Coordenadas de Fondo */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }}
                />

                {/* Radar Sonar Wave Background */}
                <div className="absolute w-[600px] h-[600px] rounded-full border border-blue-500/10 pointer-events-none" />
                <div className="absolute w-[400px] h-[400px] rounded-full border border-blue-500/15 pointer-events-none" />
                <div className="absolute w-[200px] h-[200px] rounded-full border border-blue-500/20 pointer-events-none" />

                {/* SVG Visual Maritime Chart */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                    </linearGradient>

                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Siluetas geográficas vectoriales estilizadas */}
                  {/* Continente Americano / Venezuela */}
                  <path
                    d="M 100,120 Q 180,100 240,160 T 260,280 Q 230,340 180,440 L 120,420 Z"
                    fill="#151928"
                    stroke="#2a3250"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  {/* África y Europa */}
                  <path
                    d="M 460,80 Q 580,70 620,130 T 640,290 Q 560,420 500,380 L 460,250 Z"
                    fill="#151928"
                    stroke="#2a3250"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  {/* Medio Oriente / Dubái & Asia */}
                  <path
                    d="M 720,110 Q 850,90 920,150 T 940,320 Q 880,360 800,280 L 740,210 Z"
                    fill="#151928"
                    stroke="#2a3250"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />

                  {/* Línea de Ruta Marítima de Envío (Dubái -> Mar Rojo -> Océano Atlántico -> Caribe -> Venezuela) */}
                  <path
                    d="M 820,200 C 700,220 620,290 540,270 S 380,240 280,250"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="3.5"
                    strokeDasharray="6,6"
                    filter="url(#glow)"
                  />

                  {/* Puerto Origen (Dubái) */}
                  <circle cx="820" cy="200" r="7" fill="#3b82f6" />
                  <circle cx="820" cy="200" r="14" fill="#3b82f6" opacity="0.3" />

                  {/* Puerto Destino (Puerto Cabello / La Guaira, Venezuela) */}
                  <circle cx="280" cy="250" r="8" fill="#ef4444" />
                  <circle cx="280" cy="250" r="18" fill="#ef4444" opacity="0.3" className="animate-ping" />

                  {/* Posición Actual del Buque (En aproximación al Mar Caribe) */}
                  <g transform="translate(340, 248)">
                    <circle cx="0" cy="0" r="12" fill="#10b981" opacity="0.25" className="animate-ping" />
                    <circle cx="0" cy="0" r="6" fill="#10b981" />
                  </g>
                </svg>

                {/* Etiquetas superpuestas e interactivas en el mapa */}
                {/* Pin Origen */}
                <div className="absolute top-[34%] right-[14%] sm:right-[16%] flex flex-col items-center pointer-events-none">
                  <div className="bg-[#10121d]/90 backdrop-blur-xs border border-blue-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold text-blue-300 shadow-lg whitespace-nowrap flex items-center gap-1">
                    <Anchor className="w-3 h-3 text-blue-400" />
                    <span>Puerto Jebel Ali (Dubái)</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">Zarpe confirmado</span>
                </div>

                {/* Pin Posición en Vivo del Buque */}
                <div className="absolute top-[44%] left-[30%] sm:left-[32%] flex flex-col items-center">
                  <div className="relative group cursor-pointer">
                    <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 shadow-xl shadow-emerald-500/20 whitespace-nowrap flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                      <Ship className="w-4 h-4 text-emerald-400" />
                      <span>Buque en Navegación</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    </div>

                    {/* Popover con detalles en hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl bg-[#11131e] border border-white/20 shadow-2xl text-[10px] space-y-1 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="font-bold text-white text-xs">Atlas Ocean Voyager IV</p>
                      <p className="text-slate-300">Rumbo: 272° O (Mar Caribe)</p>
                      <p className="text-emerald-400 font-mono">Velocidad: 18.4 nudos (34 km/h)</p>
                      <p className="text-slate-400">Arribo estimado: 4 Días 16 Horas</p>
                    </div>
                  </div>
                </div>

                {/* Pin Destino Venezuela */}
                <div className="absolute top-[52%] left-[22%] sm:left-[24%] flex flex-col items-center pointer-events-none">
                  <div className="bg-[#10121d]/90 backdrop-blur-xs border border-red-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold text-red-300 shadow-lg whitespace-nowrap flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>Puerto Cabello, VE</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">Destino Final</span>
                </div>

                {/* Overlay de Telemetría Inferior del Mapa */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0d0f17]/90 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Ship className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Cargamento Asociado
                      </span>
                      <strong className="text-white text-sm">
                        {selectedTrackingOrder?.vehiculo || 'Atlas Apex 250 Sport R'}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[9px] block uppercase font-sans font-bold">Estado</span>
                      <span className="text-emerald-400 font-bold">En Tránsito Marítimo</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] block uppercase font-sans font-bold">Velocidad</span>
                      <span className="text-white">18.4 Nudos</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] block uppercase font-sans font-bold">Tiempo Estimado</span>
                      <span className="text-amber-300 font-bold">ETA: 4 Días</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] block uppercase font-sans font-bold">BL Embarque</span>
                      <span className="text-slate-300">MSCU-889102</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bitácora de Novedades del Trayecto */}
              <div className="p-6 bg-[#0e1018] border-t border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Bitácora de Posicionamiento Satelital</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#141622] border border-white/5 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white font-bold">Ingreso al Mar Caribe - Aguas Internacionales</strong>
                        <span className="text-[10px] font-mono text-slate-400">Hoy, 09:30 AM</span>
                      </div>
                      <p className="text-slate-400 mt-0.5 text-[11px]">
                        Navegación estable rumbo a las costas centrales venezolanas. Condiciones marítimas óptimas.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141622] border border-white/5 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-200 font-bold">Cruce Transatlántico Completado</strong>
                        <span className="text-[10px] font-mono text-slate-400">Hace 3 días</span>
                      </div>
                      <p className="text-slate-400 mt-0.5 text-[11px]">
                        Embarcación finalizó el paso por el Océano Atlántico Central manteniendo velocidad de crucero.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141622] border border-white/5 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-300 font-bold">Zarpe y Embarque en Puerto Jebel Ali, Dubái</strong>
                        <span className="text-[10px] font-mono text-slate-400">Hace 14 días</span>
                      </div>
                      <p className="text-slate-400 mt-0.5 text-[11px]">
                        Contenedor de seguridad precintado e inspeccionado antes de estiba.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= VISTA: MI PERFIL (DATOS BÁSICOS & FOTO) ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Mi Perfil & Datos Básicos</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Actualiza tu fotografía de perfil y datos personales para los trámites de importación, aduana y entrega.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a Mis Pedidos</span>
              </button>
            </div>

            <div className="bg-[#12141e] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
              
              {/* SECCIÓN FOTO DE PERFIL */}
              <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center font-black text-3xl shadow-xl overflow-hidden border-2 border-white/20">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                  </div>

                  {/* Botón de Cámara en el Avatar */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-black hover:bg-slate-200 shadow-lg border border-black/10 transition-transform active:scale-95"
                    title="Subir o cambiar foto"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="text-center sm:text-left space-y-2 flex-1">
                  <h3 className="text-sm font-bold text-white">Fotografía de Perfil</h3>
                  <p className="text-xs text-slate-400">
                    Esta imagen se reflejará en tu encabezado, barra lateral y ficha de cliente. Formato recomendado: JPG o PNG.
                  </p>
                  
                  <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                    >
                      Subir Nueva Foto
                    </button>

                    {currentUser?.photoURL && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all border border-red-500/20 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* FORMULARIO DE DATOS */}
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Ej. Oscar Ramirez"
                    className="w-full px-4 py-2.5 bg-[#171926] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Cédula de Identidad / RIF</label>
                    <input
                      type="text"
                      value={profileForm.cedula}
                      onChange={(e) => setProfileForm({ ...profileForm, cedula: e.target.value })}
                      placeholder="V-18.942.311"
                      className="w-full px-4 py-2.5 bg-[#171926] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+58 414 5551234"
                      className="w-full px-4 py-2.5 bg-[#171926] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Correo Electrónico (Registrado)</label>
                  <input
                    type="email"
                    disabled
                    value={profileForm.email}
                    className="w-full px-4 py-2.5 bg-[#0f1017] border border-white/5 rounded-xl text-slate-400 cursor-not-allowed text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Cuenta verificada y vinculada a la base de datos de Corporation Atlas.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Ciudad de Destino en Venezuela</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    placeholder="Valencia, Caracas, Barquisimeto..."
                    className="w-full px-4 py-2.5 bg-[#171926] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Dirección de Entrega Personal o Concesionario</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="Av., Urbanización, Edificio o Punto de Referencia"
                    className="w-full px-4 py-2.5 bg-[#171926] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 text-xs"
                  />
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {profileSaved ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" /> Datos sincronizados en la nube exitosamente
                    </span>
                  ) : <div />}

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold shadow-lg transition-all text-xs"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>

      {/* Modal Factura Proforma Oficial */}
      <ProformaInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={selectedInvoiceOrder}
      />
    </div>
  );
};

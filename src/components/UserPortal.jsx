import React, { useState } from 'react';
import {
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  Ship,
  FileCheck,
  KeyRound,
  MessageCircle,
  Plus,
  Eye,
  LogOut,
  User,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Car
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';

export const UserPortal = () => {
  const { currentUser, setCurrentView, logout } = useAuth();
  const { ordersList, vehiclesList } = useAdmin();
  const { addToCart, setIsCartOpen } = useCart();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'catalog' | 'profile'
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Carlos Mendoza',
    email: currentUser?.email || 'cliente@atlas.com',
    cedula: currentUser?.cedula || 'V-18.942.311',
    phone: currentUser?.phone || '+58 414 5551234',
    city: currentUser?.city || 'Valencia',
    address: 'Urb. El Parral, Av. 137, Res. Los Sauces'
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Filtrar pedidos del usuario o mostrar los asociados
  const myOrders = ordersList.filter(
    (o) =>
      o.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
      o.nombre?.toLowerCase() === currentUser?.name?.toLowerCase() ||
      currentUser?.email === 'cliente@atlas.com' // Mostrar pedidos de demo
  );

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
    if (s.includes('marítima') || s.includes('navegación') || s.includes('tránsito')) return 2;
    return 1;
  };

  const handleOrderVehicle = (vehicle) => {
    addToCart(vehicle, 1);
    setIsCartOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0d0e14] border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src="/atlas-logo.png"
              alt="Atlas Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider uppercase text-white">
                Atlas Portal de Cliente
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Cliente Activo
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bienvenido, <strong className="text-slate-200">{currentUser?.name || 'Cliente'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('store')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Tienda Pública</span>
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[#111218] border-b border-white/10 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-6 overflow-x-auto py-3 scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Mis Pedidos & Seguimiento ({myOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Solicitar Nuevo Pedido</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mis Datos de Entrega</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* ================= TAB 1: MIS PEDIDOS & SEGUIMIENTO ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Seguimiento Logístico de tus Vehículos</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rastrea el trayecto en tiempo real desde el puerto de salida en Dubái/China hasta la entrega en Venezuela.
              </p>
            </div>

            {myOrders.length === 0 ? (
              <div className="py-16 text-center bg-[#13141b] rounded-2xl border border-white/10 max-w-md mx-auto p-6 space-y-4">
                <Package className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No tienes pedidos activos aún</h3>
                <p className="text-xs text-slate-400">
                  Explora el catálogo publicado de motocicletas y vehículos para solicitar tu primera importación.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200"
                >
                  Ver Catálogo de Procura
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myOrders.map((order) => {
                  const currentStage = getStageNumber(order.status);

                  return (
                    <div
                      key={order.id}
                      className="bg-[#13141b] rounded-2xl border border-white/10 p-6 space-y-6 shadow-xl"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Código de Rastreo:</span>
                            <span className="font-mono text-sm font-black text-white bg-white/10 px-2.5 py-1 rounded-lg">
                              {order.id}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 mt-1 block">
                            Fecha de solicitud: <strong>{order.date}</strong> | Destino: <strong>{order.ciudad}, Venezuela</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {order.status || 'En trámite de embarque'}
                          </span>
                        </div>
                      </div>

                      {/* 4-Stage Graphical Timeline */}
                      <div className="py-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
                          Estado del Trayecto Marítimo Internacional
                        </span>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
                          {stages.map((stg) => {
                            const isCompleted = currentStage >= stg.id;
                            const isCurrent = currentStage === stg.id;
                            const Icon = stg.icon;

                            return (
                              <div
                                key={stg.id}
                                className={`p-3.5 rounded-xl border transition-all ${
                                  isCurrent
                                    ? 'bg-[#1e202d] border-white text-white shadow-lg ring-1 ring-white/30'
                                    : isCompleted
                                    ? 'bg-[#151720] border-emerald-500/30 text-slate-200'
                                    : 'bg-[#0e0f14] border-white/5 text-slate-500'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      isCurrent
                                        ? 'bg-white text-black'
                                        : isCompleted
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-white/5 text-slate-600'
                                    }`}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold">
                                    Paso {stg.id} de 4
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold">{stg.label}</h4>
                                <p className="text-[10px] opacity-70 mt-0.5">{stg.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Details & Summary */}
                      <div className="bg-[#181a23] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Vehículo Solicitado:</span>
                          <h4 className="text-sm font-black text-white">{order.vehiculo}</h4>
                          <span className="text-xs text-slate-400">Modalidad: {order.metodoPago}</span>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block">Monto Puesto en Venezuela:</span>
                            <span className="text-base font-black text-white">
                              ${order.total ? order.total.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'} USD
                            </span>
                          </div>

                          <a
                            href={`https://wa.me/584121234567?text=${encodeURIComponent(`Hola Atlas, soy ${currentUser?.name || order.nombre} y deseo consultar el estatus de mi orden ${order.id}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Consultar Asesor</span>
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

        {/* ================= TAB 2: CATALOGO PARA NUEVOS PEDIDOS ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Catálogo de Procura Publicado</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona la unidad que deseas importar a Venezuela bajo demanda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {vehiclesList.map((veh) => (
                <div
                  key={veh.id}
                  className="bg-[#13141b] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  <div className="relative h-44 bg-black overflow-hidden">
                    <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-bold bg-black/80 text-white rounded-md border border-white/10">
                      {veh.line}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{veh.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{veh.description}</p>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-2.5 pt-2 border-t border-white/5">
                        <span><strong>Motor:</strong> {veh.engine}</span>
                        <span><strong>Tránsito:</strong> {veh.transitDays}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-white">
                          ${veh.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">USD</span>
                      </div>

                      <button
                        onClick={() => handleOrderVehicle(veh)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition-all shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Solicitar Pedido</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: MIS DATOS DE ENTREGA ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Mis Datos de Despacho & Facturación</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mantén tus datos actualizados para agilizar los trámites de importación y aduanas ante SENIAT e INTT.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-[#13141b] rounded-2xl border border-white/10 p-6 space-y-4 shadow-md text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Cédula / RIF</label>
                  <input
                    type="text"
                    value={profileForm.cedula}
                    onChange={(e) => setProfileForm({ ...profileForm, cedula: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  disabled
                  value={profileForm.email}
                  className="w-full px-3.5 py-2 bg-[#111218] border border-white/5 rounded-xl text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Ciudad de Recepción en Venezuela</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Dirección de Entrega Personal o Concesionario</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {profileSaved ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Datos guardados correctamente
                  </span>
                ) : <div />}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold shadow-md"
                >
                  Actualizar Datos
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

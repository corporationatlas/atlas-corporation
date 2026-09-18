import React, { useState } from 'react';
import {
  Car,
  Grid,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  LogOut,
  RotateCcw,
  Check,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ShieldAlert,
  Send,
  Sparkles,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';

export const AdminPortal = () => {
  const {
    vehiclesList,
    linesList,
    ordersList,
    companyInfo,
    setCompanyInfo,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    toggleLineStatus,
    updateLine,
    updateOrderStatus,
    deleteOrder,
    resetToDefaults,
    hasUnpublishedChanges,
    publishChanges,
    discardDraftChanges,
    publishSuccessMsg
  } = useAdmin();

  const { currentUser, setCurrentView, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles' | 'lines' | 'orders' | 'settings'
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  // Form state for Vehicle creation / editing
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    lineId: 'motos-efficiency',
    line: 'Motos: Efficiency Line',
    category: 'Motos',
    price: 1500,
    origin: 'Dubái / China',
    destination: 'Venezuela (Puerto Cabello / La Guaira)',
    transitDays: '30 - 38 días',
    engine: '150cc 4T Monocilíndrico',
    power: '13 HP',
    fuelEconomy: '45 km / litro',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    description: 'Motocicleta importada de alta eficiencia y durabilidad para las rutas venezolanas.',
    colors: 'Rojo, Negro, Azul'
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(companyInfo);
  const [savedSettings, setSavedSettings] = useState(false);

  // Quick preset image selector
  const imagePresets = [
    { label: 'Moto Roja Clásica', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80' },
    { label: 'Moto Sport Racing', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80' },
    { label: 'Moto Urbana Negra', url: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80' },
    { label: 'Camioneta SUV Lujo', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Camioneta Pick-up', url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Scooter Eléctrico', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleOpenCreateVehicle = () => {
    setEditingVehicleId(null);
    setVehicleForm({
      name: '',
      lineId: 'motos-efficiency',
      line: 'Motos: Efficiency Line',
      category: 'Motos',
      price: 1500,
      origin: 'Dubái / China',
      destination: 'Venezuela (Puerto Cabello / La Guaira)',
      transitDays: '30 - 38 días',
      engine: '150cc 4T Monocilíndrico',
      power: '13 HP',
      fuelEconomy: '45 km / litro',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      description: 'Vehículo importado bajo especificación internacional con entrega en Venezuela.',
      colors: 'Rojo, Negro, Blanco'
    });
    setIsVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (veh) => {
    setEditingVehicleId(veh.id);
    setVehicleForm({
      name: veh.name,
      lineId: veh.lineId || 'motos-efficiency',
      line: veh.line || 'Motos: Efficiency Line',
      category: veh.category || 'Motos',
      price: veh.price,
      origin: veh.origin,
      destination: veh.destination,
      transitDays: veh.transitDays,
      engine: veh.engine,
      power: veh.power,
      fuelEconomy: veh.fuelEconomy,
      image: veh.image,
      description: veh.description,
      colors: veh.variants ? veh.variants[0].options.join(', ') : 'Rojo, Negro'
    });
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    const colorArray = vehicleForm.colors.split(',').map((c) => c.trim()).filter(Boolean);
    const lineItem = linesList.find((l) => l.id === vehicleForm.lineId);

    const payload = {
      name: vehicleForm.name,
      lineId: vehicleForm.lineId,
      line: lineItem ? lineItem.title : vehicleForm.line,
      category: vehicleForm.category,
      price: parseFloat(vehicleForm.price) || 0,
      origin: vehicleForm.origin,
      destination: vehicleForm.destination,
      transitDays: vehicleForm.transitDays,
      engine: vehicleForm.engine,
      power: vehicleForm.power,
      fuelEconomy: vehicleForm.fuelEconomy,
      image: vehicleForm.image,
      images: [vehicleForm.image],
      description: vehicleForm.description,
      variants: [{ type: 'Color', options: colorArray.length > 0 ? colorArray : ['Negro'] }],
      rating: 5.0,
      reviewsCount: 1,
      badge: 'Nuevo Ingreso'
    };

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, payload);
    } else {
      addVehicle(payload);
    }

    setIsVehicleModalOpen(false);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setCompanyInfo(settingsForm);
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0d0e14] border-b border-white/10 px-6 py-3.5 flex flex-wrap items-center justify-between shadow-xl gap-3">
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
                Atlas Panel de Administración
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Modo Edición / CMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Propietario: <strong className="text-slate-200">{currentUser?.name || companyInfo.ownerName}</strong>
            </p>
          </div>
        </div>

        {/* Publish Action Center */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator */}
          {hasUnpublishedChanges ? (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Hay correcciones pendientes</span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Página web actualizada</span>
            </div>
          )}

          {/* Botón PUBLICAR CAMBIOS */}
          <button
            onClick={publishChanges}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg ${
              hasUnpublishedChanges
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 animate-pulse ring-2 ring-emerald-400/50 scale-102'
                : 'bg-white hover:bg-slate-200 text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Cambios en la Página</span>
          </button>

          {hasUnpublishedChanges && (
            <button
              onClick={discardDraftChanges}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-all"
              title="Descartar borrador"
            >
              Descartar
            </button>
          )}

          <button
            onClick={() => setCurrentView('store')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            title="Ver la tienda tal como la ven los clientes"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Tienda</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all border border-red-500/20"
            title="Restablecer datos originales"
          >
            <RotateCcw className="w-4 h-4" />
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

      {/* Success Publish Banner */}
      {publishSuccessMsg && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>¡Todos los cambios y correcciones se han publicado exitosamente en la página web pública!</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="bg-[#111218] border-b border-white/10 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-6 overflow-x-auto py-3 scrollbar-none">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Vehículos & Motos ({vehiclesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lines')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'lines'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Líneas de Procura ({linesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cotizaciones de Clientes</span>
            {ordersList.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold">
                {ordersList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Datos de Empresa</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* ================= TAB 1: VEHICULOS & MOTOS ================= */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">Catálogo en Borrador / Correcciones</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Haz las correcciones necesarias aquí. Cuando termines, pulsa <strong>"Publicar Cambios en la Página"</strong> arriba para aplicarlas.
                </p>
              </div>

              <button
                onClick={handleOpenCreateVehicle}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition-all shadow-md self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nuevo Vehículo / Moto</span>
              </button>
            </div>

            {/* Grid of editable vehicles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vehiclesList.map((veh) => (
                <div
                  key={veh.id}
                  className="bg-[#13141b] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between shadow-md"
                >
                  <div className="relative h-44 bg-black overflow-hidden">
                    <img
                      src={veh.image}
                      alt={veh.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-bold bg-black/80 text-white rounded-md backdrop-blur-xs border border-white/10">
                      {veh.line}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-xs font-black bg-white text-black rounded-lg shadow-sm">
                      ${veh.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{veh.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{veh.description}</p>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-2.5 pt-2 border-t border-white/5">
                        <span><strong>Motor:</strong> {veh.engine}</span>
                        <span><strong>Origen:</strong> {veh.origin}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleOpenEditVehicle(veh)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Seguro que deseas eliminar "${veh.name}" del catálogo?`)) {
                            deleteVehicle(veh.id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: LINEAS DE PROCURA ================= */}
        {activeTab === 'lines' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Líneas de Procura (Categorías)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Activa o desactiva las categorías. Recuerda pulsar <strong>"Publicar Cambios"</strong> para que se reflejen en la tienda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {linesList.map((line) => {
                const isPublished = line.status === 'Disponible';
                return (
                  <div
                    key={line.id}
                    className="bg-[#13141b] rounded-2xl border border-white/10 p-4 space-y-3 flex flex-col justify-between shadow-md"
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden bg-black">
                      <img
                        src={line.image}
                        alt={line.title}
                        className={`w-full h-full object-cover ${!isPublished ? 'opacity-30 grayscale' : 'opacity-70'}`}
                      />
                      {!isPublished && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-black bg-red-600/90 text-white rounded">
                          NO PUBLICADO
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{line.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Estado: <strong className={isPublished ? 'text-emerald-400' : 'text-amber-400'}>{line.status}</strong>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">Publicar en catálogo</span>
                      <button
                        onClick={() => toggleLineStatus(line.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isPublished ? 'bg-emerald-600' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isPublished ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: COTIZACIONES RECIBIDAS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Solicitudes de Clientes & Actualización de Envíos</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Al cambiar el estado de un pedido aquí, el cliente verá avanzar automáticamente su barra de progreso en su Panel de Usuario.
              </p>
            </div>

            {ordersList.length === 0 ? (
              <div className="py-16 text-center bg-[#13141b] rounded-2xl border border-white/10 max-w-md mx-auto">
                <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">No hay solicitudes aún</p>
                <p className="text-xs text-slate-400 mt-1">
                  Las órdenes generadas desde la tienda aparecerán aquí automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ordersList.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#13141b] rounded-2xl border border-white/10 p-5 space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-black text-white bg-white/10 px-2.5 py-1 rounded-lg">
                          {order.id}
                        </span>
                        <span className="text-xs text-slate-400">{order.date}</span>
                      </div>

                      {/* Status selector (Updates live for client) */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold">Estado Logístico:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-[#1a1c27] text-white text-xs font-bold border border-white/20 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        >
                          <option value="En trámite de embarque">1. En trámite de embarque (Origen)</option>
                          <option value="En navegación marítima">2. En navegación marítima (Océano)</option>
                          <option value="En Aduana Puerto Cabello">3. En Aduana Puerto Cabello (SENIAT)</option>
                          <option value="Listo para entrega con placas">4. Listo para entrega con placas</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Cliente:</span>
                        <strong className="text-white text-sm">{order.nombre}</strong>
                        <div className="text-slate-400">{order.cedula}</div>
                        <div className="text-slate-400">{order.email}</div>
                      </div>

                      <div>
                        <span className="text-slate-500 block">Destino en Venezuela:</span>
                        <strong className="text-white">{order.ciudad}, {order.estado}</strong>
                        <div className="text-slate-400">{order.direccionEntrega}</div>
                        <div className="text-slate-400">Tel: {order.telefono}</div>
                      </div>

                      <div>
                        <span className="text-slate-500 block">Vehículo Solicitado:</span>
                        <strong className="text-white text-sm">{order.vehiculo}</strong>
                        <div className="text-emerald-400 font-black text-sm mt-0.5">
                          ${order.total ? order.total.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'} USD
                        </div>
                        <div className="text-slate-400 text-[11px]">{order.metodoPago}</div>
                      </div>
                    </div>

                    {/* Actions: WhatsApp & Delete */}
                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                      {order.telefono ? (
                        <a
                          href={`https://wa.me/${order.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${order.nombre}, le escribimos de Atlas respecto a su solicitud de procura ${order.id}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Contactar por WhatsApp</span>
                        </a>
                      ) : <div />}

                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                      >
                        Eliminar solicitud
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: DATOS DE EMPRESA ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Configuración y Datos de Contacto</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Actualiza los números de teléfono, correos y avisos que se muestran en el sitio público.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-[#13141b] rounded-2xl border border-white/10 p-6 space-y-4 shadow-md">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre del Propietario</label>
                <input
                  type="text"
                  value={settingsForm.ownerName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Teléfono Principal</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp de Atención</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico Corporativo</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Dirección / Puertos en Venezuela</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Texto del Cintillo Promocional Superior</label>
                <textarea
                  rows={2}
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSettings ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> ¡Borrador guardado! Pulsa "Publicar Cambios" arriba para aplicarlo.
                  </span>
                ) : <div />}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition-all shadow-md"
                >
                  Guardar en Borrador
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ================= MODAL CREAR / EDITAR VEHICULO ================= */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => setIsVehicleModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
          />

          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-[#13141b] text-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 z-10 border border-white/15 animate-in fade-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setIsVehicleModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-black text-white mb-1">
                {editingVehicleId ? 'Editar Unidad Automotriz' : 'Agregar Nuevo Vehículo / Moto'}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Completa los datos técnicos y la fotografía. Se guardará en tu borrador para luego publicarlo.
              </p>

              <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nombre o Modelo del Vehículo</label>
                    <input
                      required
                      type="text"
                      placeholder="ej. Atlas Dominator 250cc"
                      value={vehicleForm.name}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Línea de Procura</label>
                    <select
                      value={vehicleForm.lineId}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, lineId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                    >
                      {linesList.map((l) => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Precio en USD (Puesto en Venezuela)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="1850.00"
                      value={vehicleForm.price}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Origen (Puerto de Embarque)</label>
                    <input
                      type="text"
                      placeholder="Dubái Spec / China"
                      value={vehicleForm.origin}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, origin: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mechanical Specs */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Motor / Cilindrada</label>
                    <input
                      type="text"
                      placeholder="150cc 4T"
                      value={vehicleForm.engine}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, engine: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Potencia</label>
                    <input
                      type="text"
                      placeholder="14.5 HP"
                      value={vehicleForm.power}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, power: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Consumo</label>
                    <input
                      type="text"
                      placeholder="45 km / l"
                      value={vehicleForm.fuelEconomy}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, fuelEconomy: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image URL & Presets */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">URL de la Imagen / Fotografía</label>
                  <input
                    required
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={vehicleForm.image}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none text-xs"
                  />
                  
                  {/* Preset quick buttons */}
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-slate-400">O elige foto sugerida:</span>
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setVehicleForm({ ...vehicleForm, image: preset.url })}
                        className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-[10px] text-slate-300 border border-white/5 transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Colores Disponibles (separados por coma)</label>
                  <input
                    type="text"
                    placeholder="Rojo Carmesí, Negro Mate, Azul"
                    value={vehicleForm.colors}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, colors: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Descripción y Características</label>
                  <textarea
                    rows={3}
                    placeholder="Describe los puntos fuertes del vehículo..."
                    value={vehicleForm.description}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1c27] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsVehicleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold shadow-md"
                  >
                    {editingVehicleId ? 'Guardar Corrección' : 'Crear en Borrador'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

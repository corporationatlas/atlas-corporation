import React, { createContext, useContext, useState, useEffect } from 'react';
import { vehicles as initialVehicles, procurementLines as initialLines } from '../data/products';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe utilizarse dentro de un AdminProvider');
  }
  return context;
};

const initialCompanyInfo = {
  phone: '+58 422 293 2455',
  email: 'corporationatlas969@gmail.com',
  whatsapp: '584222932455',
  address: 'Atención digital y procura internacional para toda Venezuela',
  ownerName: 'Corporation Atlas Admin',
  announcement: '✨ Promoción Especial: Envío asegurado y gestión de placas en Venezuela incluido.',
  binancePayId: '395610250',
  paypalEmail: 'corporationatlas969@gmail.com',
  paypalClientId: 'AboPQ2P4y9JdreIAjO0Ar_1nfS-Cg081MgaZFUKeSYE7rICtEdBT4XA-IWxFSWjp',
  paypalWebhookId: '0YU42284E4242394H'
};

const initialSampleOrders = [
  {
    id: 'ATL-783921-VE',
    date: '2026-09-18',
    nombre: 'Carlos Mendoza',
    cedula: 'V-18.942.311',
    email: 'cliente@atlas.com',
    telefono: '+58 414 5551234',
    ciudad: 'Valencia',
    estado: 'Carabobo',
    direccionEntrega: 'Urb. El Parral, Calle 137',
    vehiculo: 'Atlas Apex 250 Sport R',
    total: 2450.00,
    metodoPago: 'Plan Procura (40% + 60%)',
    status: 'En trámite de embarque'
  },
  {
    id: 'ATL-612940-VE',
    date: '2026-09-17',
    nombre: 'Valeria Briceño',
    cedula: 'V-21.405.882',
    email: 'valeria.b@email.com',
    telefono: '+58 412 8899221',
    ciudad: 'Caracas',
    estado: 'Distrito Capital',
    direccionEntrega: 'Av. Libertador, Torre Humboldt',
    vehiculo: 'Atlas Titan 150 EcoMax',
    total: 1350.00,
    metodoPago: 'Transferencia Bancaria USD',
    status: 'Cotización enviada'
  }
];

export const AdminProvider = ({ children }) => {
  // 1. Vehículos de trabajo (Borrador de edición)
  const [vehiclesList, setVehiclesList] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_draft_vehicles');
      if (!saved) return initialVehicles;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialVehicles;
    } catch {
      return initialVehicles;
    }
  });

  // 1b. Vehículos Publicados (lo que ve la tienda pública)
  const [publishedVehicles, setPublishedVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_pub_vehicles');
      if (!saved) return initialVehicles;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialVehicles;
    } catch {
      return initialVehicles;
    }
  });

  // 2. Líneas de procura de trabajo (Borrador)
  const [linesList, setLinesList] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_draft_lines');
      if (!saved) return initialLines;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialLines;
    } catch {
      return initialLines;
    }
  });

  // 2b. Líneas Publicadas
  const [publishedLines, setPublishedLines] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_pub_lines');
      if (!saved) return initialLines;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialLines;
    } catch {
      return initialLines;
    }
  });

  // 3. Solicitudes / Órdenes recibidas de clientes
  const [ordersList, setOrdersList] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_orders_v2');
      return saved ? JSON.parse(saved) : initialSampleOrders;
    } catch {
      return initialSampleOrders;
    }
  });

  // 4. Datos de empresa de trabajo
  const [companyInfo, setCompanyInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_draft_company');
      return saved ? JSON.parse(saved) : initialCompanyInfo;
    } catch {
      return initialCompanyInfo;
    }
  });

  // 4b. Datos de empresa publicados
  const [publishedCompanyInfo, setPublishedCompanyInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_pub_company');
      return saved ? JSON.parse(saved) : initialCompanyInfo;
    } catch {
      return initialCompanyInfo;
    }
  });

  // Estado de cambios pendientes por publicar
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(() => {
    return localStorage.getItem('atlas_has_pending_changes') === 'true';
  });

  // Modales
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState(false);

  // Guardar borradores automáticamente
  useEffect(() => {
    localStorage.setItem('atlas_draft_vehicles', JSON.stringify(vehiclesList));
  }, [vehiclesList]);

  useEffect(() => {
    localStorage.setItem('atlas_draft_lines', JSON.stringify(linesList));
  }, [linesList]);

  useEffect(() => {
    localStorage.setItem('atlas_draft_company', JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem('atlas_orders_v2', JSON.stringify(ordersList));
  }, [ordersList]);

  useEffect(() => {
    localStorage.setItem('atlas_has_pending_changes', hasUnpublishedChanges ? 'true' : 'false');
  }, [hasUnpublishedChanges]);

  // Sincronización en Tiempo Real de Órdenes con Cloud Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteOrders = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
          setOrdersList((prev) => {
            const combined = [...remoteOrders];
            prev.forEach((p) => {
              if (!combined.some((c) => c.id === p.id)) combined.push(p);
            });
            return combined;
          });
        }
      }, (err) => {
        console.warn('Firestore onSnapshot listener status:', err.message);
      });
      return () => unsub();
    } catch (err) {
      console.warn('Error inicializando listener de Firestore:', err);
    }
  }, []);

  // Acciones sobre Vehículos
  const addVehicle = (newVehicle) => {
    const item = {
      ...newVehicle,
      id: 'veh-' + Date.now(),
      inStock: true
    };
    setVehiclesList((prev) => [item, ...prev]);
    setHasUnpublishedChanges(true);
    return item;
  };

  const updateVehicle = (id, updatedData) => {
    setVehiclesList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
    );
    setHasUnpublishedChanges(true);
  };

  const deleteVehicle = (id) => {
    setVehiclesList((prev) => prev.filter((v) => v.id !== id));
    setHasUnpublishedChanges(true);
  };

  // Acciones sobre Líneas de Procura
  const toggleLineStatus = (lineId) => {
    setLinesList((prev) =>
      prev.map((line) => {
        if (line.id === lineId) {
          const nextStatus = line.status === 'Disponible' ? 'No publicado' : 'Disponible';
          return {
            ...line,
            status: nextStatus,
            isAvailable: nextStatus === 'Disponible'
          };
        }
        return line;
      })
    );
    setHasUnpublishedChanges(true);
  };

  const updateLine = (lineId, updatedData) => {
    setLinesList((prev) =>
      prev.map((line) => (line.id === lineId ? { ...line, ...updatedData } : line))
    );
    setHasUnpublishedChanges(true);
  };

  // Acciones sobre Órdenes (Sincronizadas con Cloud Firestore en tiempo real)
  const addOrder = async (order) => {
    const orderId = order.id || ('ATL-' + Date.now() + '-VE');
    const enrichedOrder = {
      ...order,
      id: orderId,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOrdersList((prev) => [enrichedOrder, ...prev]);

    try {
      await setDoc(doc(db, 'orders', orderId), enrichedOrder);
      console.log('✅ Orden guardada en Cloud Firestore:', orderId);
    } catch (e) {
      console.warn('Respaldo local para orden:', e.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Estatus actualizado en Cloud Firestore:', orderId, newStatus);
    } catch (e) {
      console.warn('Error actualizando estatus en Firestore:', e.message);
    }
  };

  const deleteOrder = (orderId) => {
    setOrdersList((prev) => prev.filter((o) => o.id !== orderId));
  };

  // PUBLICAR CAMBIOS A LA PÁGINA WEB
  const publishChanges = () => {
    setPublishedVehicles(vehiclesList);
    setPublishedLines(linesList);
    setPublishedCompanyInfo(companyInfo);
    setHasUnpublishedChanges(false);

    localStorage.setItem('atlas_pub_vehicles', JSON.stringify(vehiclesList));
    localStorage.setItem('atlas_pub_lines', JSON.stringify(linesList));
    localStorage.setItem('atlas_pub_company', JSON.stringify(companyInfo));
    localStorage.setItem('atlas_has_pending_changes', 'false');

    setPublishSuccessMsg(true);
    setTimeout(() => setPublishSuccessMsg(false), 3500);
    return true;
  };

  // Descartar borrador y volver a lo publicado
  const discardDraftChanges = () => {
    if (window.confirm('¿Deseas descartar las correcciones no publicadas y volver a la versión publicada actual?')) {
      setVehiclesList(publishedVehicles);
      setLinesList(publishedLines);
      setCompanyInfo(publishedCompanyInfo);
      setHasUnpublishedChanges(false);
      localStorage.setItem('atlas_draft_vehicles', JSON.stringify(publishedVehicles));
      localStorage.setItem('atlas_draft_lines', JSON.stringify(publishedLines));
      localStorage.setItem('atlas_draft_company', JSON.stringify(publishedCompanyInfo));
      localStorage.setItem('atlas_has_pending_changes', 'false');
    }
  };

  // Reiniciar a valores originales de fábrica
  const resetToDefaults = () => {
    if (window.confirm('¿Estás seguro de restablecer todos los datos originales de fábrica?')) {
      setVehiclesList(initialVehicles);
      setPublishedVehicles(initialVehicles);
      setLinesList(initialLines);
      setPublishedLines(initialLines);
      setOrdersList(initialSampleOrders);
      setCompanyInfo(initialCompanyInfo);
      setPublishedCompanyInfo(initialCompanyInfo);
      setHasUnpublishedChanges(false);

      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <AdminContext.Provider
      value={{
        vehiclesList,
        publishedVehicles,
        linesList,
        publishedLines,
        ordersList,
        companyInfo,
        publishedCompanyInfo,
        setCompanyInfo,
        hasUnpublishedChanges,
        setHasUnpublishedChanges,
        publishChanges,
        discardDraftChanges,
        publishSuccessMsg,
        isAuthModalOpen,
        setIsAuthModalOpen,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        toggleLineStatus,
        updateLine,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        resetToDefaults
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

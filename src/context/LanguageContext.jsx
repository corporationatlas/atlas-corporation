import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  es: {
    // General & Common
    common: {
      search: 'Buscar...',
      cart: 'Carrito',
      close: 'Cerrar',
      back: 'Volver',
      continue: 'Continuar',
      confirm: 'Confirmar',
      loading: 'Cargando...',
      success: 'Éxito',
      error: 'Error',
      whatsappSupport: 'WhatsApp: +58 422 293 2455 • Caracas',
      copy: 'Copiar',
      copied: '¡Copiado!',
      usd: 'USD',
      viewAll: 'Ver todos',
      currency: '$'
    },
    // Navigation & Sidebar
    nav: {
      home: 'Inicio',
      store: 'Tienda',
      services: 'Servicios',
      about: 'Sobre nosotros',
      trackVehicle: 'Rastrear mi Vehículo',
      myOrders: 'Mis Pedidos',
      manageStore: 'Gestionar Tienda',
      logOut: 'Cerrar sesión',
      searchPlaceholder: 'Buscar modelo, marca, motor...',
      adminRole: 'Administrador',
      clientRole: 'Cliente'
    },
    // Hero Section
    hero: {
      titleLine1: 'El camino más',
      titleLine2: 'rápido y seguro',
      titleLine3: 'para tu vehículo',
      description: 'Transformamos la logística automotriz en una experiencia 100% digital y transparente. Con Atlas, seleccionas tu modelo, sigues el trayecto en tiempo real y recibes tu vehículo listo para rodar en Venezuela de la manera más sencilla posible.',
      exploreBtn: 'Explorar Modelos',
      stats: {
        units: '+500 Unidades Importadas',
        routes: 'Ruta Dubái & China',
        advance: 'Plan Procura 40/60'
      }
    },
    // Procurement Lines
    lines: {
      sectionTitle: 'Explora Nuestras Líneas de Procura',
      unpublished: 'No publicado',
      available: 'Disponible',
      lineTitles: {
        'pick-up': 'Camionetas Pick-up',
        'suv': 'Camionetas SUV',
        'compactos': 'Carros Compactos',
        'electric-scooters': 'Scooters Eléctricos',
        'motos-efficiency': 'Motos: Efficiency Line',
        'motos-power': 'Motos: Power Line',
        'motos-smart': 'Motos: Smart Line',
        'vehiculos-electricos': 'Vehículos Eléctricos'
      }
    },
    // Vehicles Catalog & Grid
    vehicles: {
      title: 'Catálogo de Vehículos Disponibles',
      allVehicles: 'Todos los vehículos',
      showing: 'Mostrando',
      units: 'unidades',
      noVehiclesFound: 'No se encontraron vehículos que coincidan con tu búsqueda.',
      resetFilters: 'Restablecer filtros',
      turnkeyPrice: 'Precio puesto en Venezuela',
      departureAdvance: 'Anticipo 40% al zarpe',
      arrivalBalance: 'Saldo 60% al arribo',
      viewDetails: 'Ver detalles',
      reserveWith40: 'Apartar con 40%',
      origin: 'Origen',
      destination: 'Destino',
      transitTime: 'Tiempo estimado',
      engine: 'Motor',
      power: 'Potencia',
      fuelEconomy: 'Consumo',
      transmission: 'Transmisión',
      brakes: 'Frenos',
      mostRequested: 'Más Solicitada',
      availableUnit: 'Unidad Disponible'
    },
    // Vehicle Detail Modal
    vehicleModal: {
      keySpecs: 'Especificaciones Clave',
      paymentScheme: 'Esquema de Pago Atlas (40/60)',
      advanceDesc: 'Pago del 40% al confirmar la orden para compra e inicio del embarque marítimo sellado.',
      balanceDesc: 'Saldo del 60% al momento de la llegada e inspección en puerto venezolano (Puerto Cabello / La Guaira).',
      importProcess: 'Proceso de Importación Directa',
      step1: '1. Selección & Reserva',
      step1Desc: 'Selecciona tu unidad y formaliza tu preorden con el 40% de anticipo.',
      step2: '2. Embarque y Monitoreo',
      step2Desc: 'Contenedor marítimo sellado con seguimiento satelital en tiempo real.',
      step3: '3. Desaduanamiento & Entrega',
      step3Desc: 'Nacionalización legal SENIAT e INTT con entrega listo para rodar en Venezuela.',
      addToCart: 'Añadir al Carrito',
      reserveNow: 'Apartar con 40%',
      consultWhatsApp: 'Consultar por WhatsApp'
    },
    // Shopping Cart Drawer
    cart: {
      title: 'Tu Carrito de Compra',
      emptyTitle: 'Tu carrito está vacío',
      emptyDesc: 'Explora nuestras líneas de procura automotriz y agrega el modelo que deseas importar.',
      exploreFleet: 'Ver Catálogo',
      summary: 'Resumen de Compra',
      totalCIF: 'Precio Total puesto en Venezuela',
      advanceToPay: 'Anticipo Requerido (40%)',
      balanceArrival: 'Saldo Pendiente al Arribo (60%)',
      checkoutBtn: 'Continuar con la Reserva',
      remove: 'Eliminar',
      clearCart: 'Vaciar carrito'
    },
    // Checkout Modal
    checkout: {
      title: 'Solicitud de Procura Automotriz',
      step1Title: '1. Datos de Consignación',
      step2Title: '2. Método de Liquidación',
      fullName: 'Nombre y Apellido',
      fullNamePlaceholder: 'ej. Carlos Mendoza',
      cedula: 'Cédula / RIF / Pasaporte',
      cedulaPlaceholder: 'V-18.942.311',
      phone: 'Teléfono / WhatsApp',
      phonePlaceholder: '+58 412 1234567',
      email: 'Correo Electrónico',
      emailPlaceholder: 'carlos@ejemplo.com',
      city: 'Ciudad de Entrega en Venezuela',
      cityPlaceholder: 'Caracas, Valencia, Maracaibo...',
      address: 'Dirección o Concesionario de Entrega',
      addressPlaceholder: 'Av. Principal, Concesionario Atlas...',
      selectPaymentMethod: 'Selecciona tu Método de Pago:',
      binanceTitle: 'Binance Pay / USDT',
      binanceDesc: 'Transferencia instantánea y segura sin comisiones bancarias internacionales.',
      paypalTitle: 'PayPal (USD / Tarjeta)',
      paypalDesc: 'Procesamiento en divisas internacionales con protección al comprador.',
      transferTitle: 'Transferencia Bancaria Internacional',
      transferDesc: 'Liquidación directa por cable bancario / cuenta custodia internacional.',
      planProcuraTitle: 'Plan Procura: 40% Anticipo + 60% al Arribo',
      planProcuraDesc: 'Reserva tu unidad pagando el 40% y liquida el 60% restante al llegar a Venezuela.',
      confirmOrder: 'Confirmar y Generar Orden de Pedido',
      processing: 'Procesando tu solicitud...'
    },
    // Invoice & Preorder Notice Modal
    invoice: {
      noticeTab: 'Aviso de Pedido (Estilo Odoo)',
      formalInvoiceTab: 'Factura Formal Comercial',
      printBtn: 'Imprimir / Guardar PDF',
      closeBtn: 'Cerrar',
      notifyWhatsApp: 'Notificar Pago por WhatsApp',
      yourQuote: 'Su Presupuesto',
      hello: 'Hola',
      pendingText1: 'El pago con referencia',
      pendingText2: 'por un importe de',
      pendingText3: 'en relación con su pedido',
      pendingText4: 'está pendiente de pago.',
      confirmNotice: 'Confirmaremos su pedido una vez que se haya confirmado el pago.',
      paymentChannelTitle: 'Canal de Pago para Liquidar su Pedido:',
      binancePayId: 'Pay ID Oficial:',
      requiredNote: 'Concepto / Nota obligatoria:',
      binanceInstruction: 'Abre Binance en tu teléfono celular, ingresa en Pay con el ID 395610250 y envía el monto en USDT colocando el código en la nota del pago.',
      paypalAccount: 'Cuenta Corporativa:',
      paypalInstruction: 'Al enviar tu pago por PayPal, recuerda incluir el código de pedido en la nota o concepto para conciliar tu compra inmediatamente.',
      wireBeneficiary: 'Beneficiario:',
      wireInstruction: 'Comunícate a nuestro WhatsApp corporativo indicando tu referencia para suministrarte los datos SWIFT/IBAN de liquidación.',
      advancePortion: '40% Anticipo de Zarpe:',
      balancePortion: '60% Saldo al Arribo en VE:',
      thanksConfidence: 'Agradecemos su confianza.',
      questionsContact: 'No dude en ponerse en contacto con nosotros si tiene alguna pregunta.',
      administrator: 'Administrator',
      commercialInvoiceTitle: 'FACTURA COMERCIAL',
      orderDate: 'Fecha:',
      orderStatus: 'Estado: ORDEN REGISTRADA',
      clientConsignee: 'CLIENTE CONSIGNATARIO',
      customsDestination: 'DESTINO DE NACIONALIZACIÓN',
      unitDescription: 'Descripción de la Unidad Automotriz',
      portRoute: 'Puerto / Ruta',
      qty: 'Cant.',
      unitPrice: 'Precio Unitario',
      totalUSD: 'Total USD',
      includesNote: 'Incluye: Flete marítimo internacional en contenedor sellado, aranceles aduanales SENIAT, certificado de origen y gestión de placas INTT en Venezuela.',
      subtotalCIF: 'Subtotal CIF:',
      oceanFreight: 'Flete Marítimo:',
      seniatDuties: 'Aranceles SENIAT:',
      totalTurnkeyVE: 'Total Puesto en VE:',
      termsTitle: 'Garantía y Condiciones de Comercio Exterior:',
      term1: '• Cobertura de seguro marítimo contra todo riesgo hasta el puerto de arribo en Venezuela.',
      term2: '• Trámite formal de aduanas ante SENIAT con factura de nacionalización legal.',
      term3: '• Garantía de fábrica respaldada por Corporation Atlas.',
      signatureCompany: 'Corporation Atlas C.A.',
      signatureAuth: 'Firma y Sello Autorizado',
      signatureDept: 'Departamento de Importación & Logística'
    },
    // Services Section
    services: {
      tagline: 'Servicios Integrales',
      mainTitle: 'Logística Automotriz de Extremo a Extremo',
      subtitle: 'Hacemos que comprar tu vehículo en el exterior y tenerlo en Venezuela sea un proceso simple, confiable y seguro.',
      items: [
        {
          title: 'Procura Internacional Directa',
          desc: 'Acceso directo a inventarios de vehículos y motocicletas a nivel internacional bajo demanda para importación.'
        },
        {
          title: 'Flete Marítimo Asegurado',
          desc: 'Transporte en contenedores sellados con póliza internacional y monitoreo de trayecto en tiempo real hacia puertos venezolanos.'
        },
        {
          title: 'Gestión Aduanal Completa',
          desc: 'Nacionalización 100% legal ante SENIAT e INTT, aranceles, homologación y trámite de placas y títulos.'
        },
        {
          title: 'Entrega Listo para Rodar',
          desc: 'Inspección técnica pre-entrega (PDI), fluidos, batería y entrega directa en Caracas o Valencia.'
        }
      ]
    },
    // About Section
    about: {
      tagline: 'Sobre Atlas',
      paragraph1: 'Atlas nace con un propósito claro: ofrecerte una experiencia de adquisición 100% digital, sin complicaciones y libre de los obstáculos tradicionales. Creemos que comprar un vehículo debe ser un proceso emocionante, directo y sin estrés.',
      paragraph2: 'Explora nuestra vitrina virtual, selecciona tu modelo, realiza tu pago a través de nuestras pasarelas seguras y nosotros nos encargamos de preparar tu unidad. Simplificamos cada paso para que pases menos tiempo en trámites y más tiempo disfrutando de tu vehículo.',
      points: [
        'Contratos con respaldo legal',
        'Inspección de origen certificada',
        'Despacho a nivel nacional',
        'Soporte y asesoría personalizada'
      ],
      stats: {
        units: 'Unidades Importadas',
        transit: 'Tránsito Promedio',
        transitDays: '35 días',
        warranty: 'Garantía Aduanal',
        tracking: 'Seguimiento en Vivo'
      }
    },
    // Footer
    footer: {
      rights: 'Todos los derechos reservados.',
      legalNote: 'Corporation Atlas C.A. - Operador logístico internacional y comercializadora de unidades automotrices bajo demanda. Todos los procesos aduanales están sujetos a las normativas de la República Bolivariana de Venezuela (SENIAT / INTT).'
    },
    // Auth Modal
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Crear Cuenta',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'ej. usuario@atlas.com',
      passwordLabel: 'Contraseña',
      nameLabel: 'Nombre y Apellido',
      namePlaceholder: 'ej. Carlos Mendoza',
      cedulaLabel: 'Cédula / RIF',
      cityLabel: 'Ciudad en Venezuela',
      phoneLabel: 'Teléfono / WhatsApp',
      addressLabel: 'Dirección de Entrega',
      signInBtn: 'Ingresar a ATLAS',
      signUpBtn: 'Registrarme en ATLAS',
      verifying: 'Verificando credenciales...',
      creating: 'Creando cuenta...'
    },
    // User Portal
    userPortal: {
      title: 'Portal de Pedidos y Seguimiento',
      backToStore: 'Ir al menú principal',
      tabOrders: 'Mis Pedidos',
      tabTracking: 'Rastreo Satelital',
      tabProfile: 'Mi Perfil',
      noOrders: 'Aún no tienes pedidos registrados.',
      noOrdersDesc: 'Cuando reserves una unidad o generes un presupuesto en la tienda, podrás seguir su estatus y documentos aquí.',
      viewInvoice: 'Ver Comprobante / Factura',
      orderStatus: 'Estado de la Procura',
      steps: {
        step1: 'Orden Confirmada',
        step2: 'Embarque Marítimo',
        step3: 'En Alta Mar (Tránsito)',
        step4: 'Desaduanamiento SENIAT',
        step5: 'Listo para Entrega'
      },
      mapTitle: 'Ubicación Satelital del Barco en Tiempo Real',
      vesselName: 'Buque Portacontenedores:',
      currentPort: 'Coordenadas de Navegación:',
      eta: 'Fecha Estimada de Llegada (ETA):',
      profileTitle: 'Mis Datos Básicos',
      saveProfile: 'Guardar Cambios',
      savedSuccess: '¡Datos actualizados exitosamente!',
      logOut: 'Cerrar Sesión'
    }
  },
  en: {
    // General & Common
    common: {
      search: 'Search...',
      cart: 'Cart',
      close: 'Close',
      back: 'Back',
      continue: 'Continue',
      confirm: 'Confirm',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      whatsappSupport: 'WhatsApp: +58 422 293 2455 • Caracas',
      copy: 'Copy',
      copied: 'Copied!',
      usd: 'USD',
      viewAll: 'View all',
      currency: '$'
    },
    // Navigation & Sidebar
    nav: {
      home: 'Home',
      store: 'Store',
      services: 'Services',
      about: 'About Us',
      trackVehicle: 'Track My Vehicle',
      myOrders: 'My Orders',
      manageStore: 'Manage Store',
      logOut: 'Log Out',
      searchPlaceholder: 'Search model, brand, engine...',
      adminRole: 'Administrator',
      clientRole: 'Customer'
    },
    // Hero Section
    hero: {
      titleLine1: 'The fastest',
      titleLine2: 'and safest route',
      titleLine3: 'for your vehicle',
      description: 'We turn automotive logistics into a 100% digital, transparent experience. With Atlas, select your model, track the route in real-time, and receive your vehicle ready to drive in Venezuela seamlessly.',
      exploreBtn: 'Explore Models',
      stats: {
        units: '+500 Imported Units',
        routes: 'Dubai & China Routes',
        advance: 'Procurement Plan 40/60'
      }
    },
    // Procurement Lines
    lines: {
      sectionTitle: 'Explore Our Procurement Lines',
      unpublished: 'Unpublished',
      available: 'Available',
      lineTitles: {
        'pick-up': 'Pick-up Trucks',
        'suv': 'SUV Trucks',
        'compactos': 'Compact Cars',
        'electric-scooters': 'Electric Scooters',
        'motos-efficiency': 'Motorcycles: Efficiency Line',
        'motos-power': 'Motorcycles: Power Line',
        'motos-smart': 'Motorcycles: Smart Line',
        'vehiculos-electricos': 'Electric Vehicles'
      }
    },
    // Vehicles Catalog & Grid
    vehicles: {
      title: 'Available Vehicles Catalog',
      allVehicles: 'All vehicles',
      showing: 'Showing',
      units: 'units',
      noVehiclesFound: 'No vehicles match your search criteria.',
      resetFilters: 'Reset filters',
      turnkeyPrice: 'Turnkey Price in Venezuela',
      departureAdvance: '40% advance at sailing',
      arrivalBalance: '60% balance upon arrival',
      viewDetails: 'View Details',
      reserveWith40: 'Reserve with 40%',
      origin: 'Origin',
      destination: 'Destination',
      transitTime: 'Estimated Transit',
      engine: 'Engine',
      power: 'Power',
      fuelEconomy: 'Fuel Economy',
      transmission: 'Transmission',
      brakes: 'Brakes',
      mostRequested: 'Most Requested',
      availableUnit: 'Available Unit'
    },
    // Vehicle Detail Modal
    vehicleModal: {
      keySpecs: 'Key Specifications',
      paymentScheme: 'Atlas Payment Plan (40/60)',
      advanceDesc: '40% payment upon order confirmation for procurement and sealed maritime shipment.',
      balanceDesc: '60% remaining balance upon arrival and inspection at Venezuelan port (Puerto Cabello / La Guaira).',
      importProcess: 'Direct Procurement Process',
      step1: '1. Selection & Preorder',
      step1Desc: 'Choose your unit and formalize your preorder with the 40% initial deposit.',
      step2: '2. Shipment & Monitoring',
      step2Desc: 'Sealed container with 24/7 real-time satellite trajectory tracking.',
      step3: '3. Customs & Handover',
      step3Desc: 'Legal SENIAT & INTT customs clearance, delivered turnkey in Venezuela.',
      addToCart: 'Add to Cart',
      reserveNow: 'Reserve with 40%',
      consultWhatsApp: 'Consult via WhatsApp'
    },
    // Shopping Cart Drawer
    cart: {
      title: 'Your Shopping Cart',
      emptyTitle: 'Your cart is empty',
      emptyDesc: 'Explore our vehicle procurement lines and add the model you wish to import.',
      exploreFleet: 'Browse Catalog',
      summary: 'Order Summary',
      totalCIF: 'Total Turnkey Price in Venezuela',
      advanceToPay: 'Required Advance (40%)',
      balanceArrival: 'Pending Balance Upon Arrival (60%)',
      checkoutBtn: 'Proceed to Reservation',
      remove: 'Remove',
      clearCart: 'Clear cart'
    },
    // Checkout Modal
    checkout: {
      title: 'Automotive Procurement Order',
      step1Title: '1. Consignment Details',
      step2Title: '2. Settlement Method',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Carlos Mendoza',
      cedula: 'ID / Tax ID / Passport',
      cedulaPlaceholder: 'V-18.942.311 / Passport',
      phone: 'Phone / WhatsApp',
      phonePlaceholder: '+58 412 1234567',
      email: 'Email Address',
      emailPlaceholder: 'carlos@example.com',
      city: 'Delivery City in Venezuela',
      cityPlaceholder: 'Caracas, Valencia, Maracaibo...',
      address: 'Delivery Address or Dealership',
      addressPlaceholder: 'Main Ave, Atlas Dealership...',
      selectPaymentMethod: 'Select Your Payment Method:',
      binanceTitle: 'Binance Pay / USDT',
      binanceDesc: 'Instant, secure crypto payment with zero international wire fees.',
      paypalTitle: 'PayPal (USD / Card)',
      paypalDesc: 'International USD processing with buyer protection.',
      transferTitle: 'International Wire Transfer',
      transferDesc: 'Direct SWIFT wire to international corporate escrow account.',
      planProcuraTitle: 'Procurement Plan: 40% Advance + 60% on Arrival',
      planProcuraDesc: 'Reserve your unit with 40% and settle the remaining 60% upon arrival in Venezuela.',
      confirmOrder: 'Confirm and Issue Procurement Order',
      processing: 'Processing your request...'
    },
    // Invoice & Preorder Notice Modal
    invoice: {
      noticeTab: 'Order Notice (Odoo Style)',
      formalInvoiceTab: 'Formal Commercial Invoice',
      printBtn: 'Print / Save PDF',
      closeBtn: 'Close',
      notifyWhatsApp: 'Notify Payment via WhatsApp',
      yourQuote: 'Your Quote',
      hello: 'Hello',
      pendingText1: 'The payment with reference',
      pendingText2: 'for an amount of',
      pendingText3: 'regarding your order',
      pendingText4: 'is pending payment.',
      confirmNotice: 'We will confirm your order as soon as payment is confirmed.',
      paymentChannelTitle: 'Payment Channel to Settle Your Order:',
      binancePayId: 'Official Pay ID:',
      requiredNote: 'Required Concept / Note:',
      binanceInstruction: 'Open Binance on your mobile phone, navigate to Pay with ID 395610250 and send the USDT amount including your order code in the payment note.',
      paypalAccount: 'Corporate Account:',
      paypalInstruction: 'When sending your payment via PayPal, remember to include the order reference in the note to reconcile your purchase immediately.',
      wireBeneficiary: 'Beneficiary:',
      wireInstruction: 'Contact our corporate WhatsApp with your reference to receive SWIFT/IBAN wire transfer details.',
      advancePortion: '40% Departure Advance:',
      balancePortion: '60% Balance on VE Arrival:',
      thanksConfidence: 'We appreciate your trust.',
      questionsContact: 'Do not hesitate to reach out to us if you have any questions.',
      administrator: 'Administrator',
      commercialInvoiceTitle: 'COMMERCIAL INVOICE',
      orderDate: 'Date:',
      orderStatus: 'Status: REGISTERED ORDER',
      clientConsignee: 'CONSIGNEE CUSTOMER',
      customsDestination: 'CUSTOMS DESTINATION',
      unitDescription: 'Automotive Unit Description',
      portRoute: 'Port / Route',
      qty: 'Qty.',
      unitPrice: 'Unit Price',
      totalUSD: 'Total USD',
      includesNote: 'Includes: International ocean freight in sealed container, SENIAT customs duties, certificate of origin, and INTT license plates in Venezuela.',
      subtotalCIF: 'Subtotal CIF:',
      oceanFreight: 'Ocean Freight:',
      seniatDuties: 'SENIAT Duties:',
      totalTurnkeyVE: 'Total Delivered in VE:',
      termsTitle: 'Foreign Trade Terms & Warranty:',
      term1: '• Full maritime insurance coverage up to the arrival port in Venezuela.',
      term2: '• Legal customs clearance with official SENIAT nationalization invoice.',
      term3: '• Factory warranty backed by Corporation Atlas.',
      signatureCompany: 'Corporation Atlas C.A.',
      signatureAuth: 'Authorized Seal & Signature',
      signatureDept: 'Import & Logistics Department'
    },
    // Services Section
    services: {
      tagline: 'Comprehensive Services',
      mainTitle: 'End-to-End Automotive Logistics',
      subtitle: 'We make buying your vehicle abroad and receiving it in Venezuela simple, reliable, and secure.',
      items: [
        {
          title: 'Direct International Procurement',
          desc: 'Direct access to global vehicle and motorcycle inventories on demand for import.'
        },
        {
          title: 'Insured Ocean Freight',
          desc: 'Transportation in sealed containers with international insurance and live tracking to Venezuelan ports.'
        },
        {
          title: 'Full Customs Clearance',
          desc: '100% legal nationalization before SENIAT and INTT, tariffs, homologation, and vehicle title management.'
        },
        {
          title: 'Turnkey Delivery Ready to Drive',
          desc: 'Pre-delivery technical inspection (PDI), fluids, battery, and direct handover in Caracas or Valencia.'
        }
      ]
    },
    // About Section
    about: {
      tagline: 'About Atlas',
      paragraph1: 'Atlas was founded with a single mission: to deliver a 100% digital, frictionless procurement experience free from traditional obstacles. We believe acquiring a vehicle should be exciting, straightforward, and stress-free.',
      paragraph2: 'Browse our digital showcase, choose your model, complete your payment through secure channels, and let our logistics network handle the rest. Spend less time on paperwork and more time driving.',
      points: [
        'Contracts with full legal backing',
        'Certified origin inspection',
        'Nationwide delivery in Venezuela',
        'Personalized advisory & support'
      ],
      stats: {
        units: 'Imported Units',
        transit: 'Average Transit',
        transitDays: '35 days',
        warranty: 'Customs Guarantee',
        tracking: 'Live Tracking'
      }
    },
    // Footer
    footer: {
      rights: 'All rights reserved.',
      legalNote: 'Corporation Atlas C.A. - International logistics operator and on-demand automotive dealer. All customs procedures are strictly compliant with the regulations of the Bolivarian Republic of Venezuela (SENIAT / INTT).'
    },
    // Auth Modal
    auth: {
      signIn: 'Sign In',
      signUp: 'Create Account',
      emailLabel: 'Email Address',
      emailPlaceholder: 'e.g. user@atlas.com',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g. Carlos Mendoza',
      cedulaLabel: 'ID / Tax ID',
      cityLabel: 'City in Venezuela',
      phoneLabel: 'Phone / WhatsApp',
      addressLabel: 'Delivery Address',
      signInBtn: 'Sign in to ATLAS',
      signUpBtn: 'Register at ATLAS',
      verifying: 'Verifying credentials...',
      creating: 'Creating account...'
    },
    // User Portal
    userPortal: {
      title: 'Orders & Tracking Portal',
      backToStore: 'Back to Main Store',
      tabOrders: 'My Orders',
      tabTracking: 'Live Satellite Tracking',
      tabProfile: 'My Profile',
      noOrders: 'You have no active orders yet.',
      noOrdersDesc: 'Once you reserve a vehicle or create an order notice in the store, you will be able to track its status and documents here.',
      viewInvoice: 'View Invoice / Order Notice',
      orderStatus: 'Procurement Status',
      steps: {
        step1: 'Order Confirmed',
        step2: 'Maritime Loading',
        step3: 'High Seas (In Transit)',
        step4: 'SENIAT Customs',
        step5: 'Ready for Delivery'
      },
      mapTitle: 'Real-Time Vessel Satellite Positioning',
      vesselName: 'Container Vessel:',
      currentPort: 'Navigation Coordinates:',
      eta: 'Estimated Time of Arrival (ETA):',
      profileTitle: 'Personal Account Info',
      saveProfile: 'Save Changes',
      savedSuccess: 'Profile saved successfully!',
      logOut: 'Log Out'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_language_pref');
      return saved === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('atlas_language_pref', language);
      document.documentElement.lang = language;
    } catch (e) {
      console.error('Error saving language preference', e);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  // Helper t(path) e.g. t('nav.home')
  const t = (path) => {
    if (!path) return '';
    const keys = path.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Spanish if key missing
        let fallback = translations.es;
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        translations: translations[language]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

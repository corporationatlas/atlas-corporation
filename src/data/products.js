export const procurementLines = [
  {
    id: 'pick-up',
    title: 'Camionetas Pick-up',
    status: 'No publicado',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    type: 'vehicles',
    isAvailable: false,
    description: 'Capacidad de carga pesada, chasis reforzado y tracción todoterreno para las faenas más exigentes.'
  },
  {
    id: 'suv',
    title: 'Camionetas SUV',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    type: 'vehicles',
    isAvailable: true,
    description: 'Confort premium, seguridad activa y espacio familiar para viajes largos con tracción 4x4.'
  },
  {
    id: 'compactos',
    title: 'Carros Compactos',
    status: 'No publicado',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    type: 'vehicles',
    isAvailable: false,
    description: 'Agilidad urbana y consumo óptimo de combustible con mantenimiento accesible.'
  },
  {
    id: 'electric-scooters',
    title: 'Electric Scooters',
    status: 'No publicado',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    type: 'scooters',
    isAvailable: false,
    description: 'Movilidad 100% eléctrica, cero emisiones y recarga en tomacorrientes domésticos.'
  },
  {
    id: 'motos-efficiency',
    title: 'Motos: Efficiency Line',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    type: 'motorcycles',
    isAvailable: true,
    description: 'Diseñada para el máximo rendimiento diario. Motores de alta durabilidad y tecnología de optimización de combustible ideal para flotas comerciales, entregas y trabajadores que exigen el menor costo por kilómetro sin sacrificar resistencia.'
  },
  {
    id: 'motos-power',
    title: 'Motos: Power Line',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    type: 'motorcycles',
    isAvailable: true,
    description: 'Aceleración deportiva, tecnología DOHC de alta compresión y frenos de alto rendimiento para carretera.'
  },
  {
    id: 'motos-smart',
    title: 'Motos: Smart Line',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
    type: 'motorcycles',
    isAvailable: true,
    description: 'Tecnología digital inteligente, conectividad Bluetooth, tableros TFT y telemetría avanzada.'
  },
  {
    id: 'vehiculos-electricos',
    title: 'Vehículos Eléctricos',
    status: 'No publicado',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    type: 'electric',
    isAvailable: false,
    description: 'Vanguardia automotriz con baterías de largo alcance, autonomía extendida y tecnología silenciosa.'
  }
];

export const vehicles = [
  {
    id: 'moto-eff-1',
    lineId: 'motos-efficiency',
    name: 'Splendor XTEC (125cc)',
    line: 'Motos: Efficiency Line',
    category: 'Motos',
    price: 1350.00,
    originalPrice: 1550.00,
    origin: 'Dubái / China',
    destination: 'Venezuela (Puerto Cabello / La Guaira)',
    transitDays: '30 - 38 días',
    engine: '125cc 4T Monocilíndrico EcoThrust',
    power: '11.8 HP @ 8000 rpm',
    fuelEconomy: '52 km / litro',
    brakes: 'Disco delantero / Tambor trasero con frenada combinada',
    transmission: '5 velocidades mecánica',
    rating: 4.9,
    reviewsCount: 44,
    badge: 'Más Solicitada',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Diseñada para el máximo rendimiento diario. Motores de alta durabilidad y tecnología de optimización de combustible ideal para flotas comerciales, entregas y trabajadores que exigen el menor costo por kilómetro sin sacrificar resistencia.',
    specs: [
      { label: 'Cilindrada', value: '124.7 cc' },
      { label: 'Consumo', value: '1.9 L / 100 km' },
      { label: 'Capacidad Tanque', value: '11.5 Litros' },
      { label: 'Encendido', value: 'Eléctrico y Pedal' },
      { label: 'Garantía', value: '1 Año o 15.000 km' }
    ],
    variants: [
      { type: 'Color', options: ['Rojo Atlas Carmesí', 'Negro Obsidiana', 'Azul Real'] }
    ],
    inStock: true
  },
  {
    id: 'moto-pow-1',
    lineId: 'motos-power',
    name: 'Atlas Apex 250 Sport R',
    line: 'Motos: Power Line',
    category: 'Motos',
    price: 2450.00,
    originalPrice: 2790.00,
    origin: 'Dubái Spec',
    destination: 'Venezuela (Puerto Cabello)',
    transitDays: '35 - 42 días',
    engine: '250cc DOHC Refrigeración Líquida',
    power: '27.8 HP @ 9500 rpm',
    fuelEconomy: '35 km / litro',
    brakes: 'Doble Disco con ABS Bosch',
    transmission: '6 velocidades con embrague antirrebote',
    rating: 4.9,
    reviewsCount: 52,
    badge: 'Alto Rendimiento',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Potencia pura y aceleración deportiva con postura ergonómica. Motor de inyección electrónica Delphi con refrigeración líquida de alto flujo y escape en acero inoxidable.',
    specs: [
      { label: 'Cilindrada', value: '249.2 cc' },
      { label: 'Velocidad Máx', value: '148 km/h' },
      { label: 'Frenos', value: 'Doble Disco + ABS' },
      { label: 'Suspensión', value: 'Horquilla invertida 41mm' },
      { label: 'Garantía', value: '1 Año o 20.000 km' }
    ],
    variants: [
      { type: 'Color', options: ['Rojo Racing', 'Gris Grafito Mate', 'Negro Puro'] }
    ],
    inStock: true
  },
  {
    id: 'moto-smart-1',
    lineId: 'motos-smart',
    name: 'Atlas Quantum 200 SmartLine',
    line: 'Motos: Smart Line',
    category: 'Motos',
    price: 1980.00,
    originalPrice: 2200.00,
    origin: 'China / Export Spec',
    destination: 'Venezuela (Puerto Cabello / La Guaira)',
    transitDays: '32 - 40 días',
    engine: '200cc 4T Monocilíndrico con Balanceador',
    power: '18.2 HP @ 8000 rpm',
    fuelEconomy: '42 km / litro',
    brakes: 'Disco delantero y trasero lobulado',
    transmission: '5 velocidades',
    rating: 4.8,
    reviewsCount: 29,
    badge: 'Tecnología Inteligente',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Conectividad Bluetooth integrada, tablero TFT a color con navegación paso a paso, iluminación Full LED matricial y puerto USB dual de carga rápida para dispositivos móviles.',
    specs: [
      { label: 'Cilindrada', value: '198 cc' },
      { label: 'Tablero', value: 'TFT 5" con Bluetooth' },
      { label: 'Iluminación', value: 'Full LED 360°' },
      { label: 'Seguridad', value: 'Alarma y bloqueo satelital' },
      { label: 'Garantía', value: '1 Año de fábrica' }
    ],
    variants: [
      { type: 'Color', options: ['Negro Phantom con Detalles Rojos', 'Blanco Glaciar', 'Azul Titanio'] }
    ],
    inStock: true
  },
  {
    id: 'suv-1',
    lineId: 'suv',
    name: 'Atlas Terran SUV 4x4 Luxury',
    line: 'Camionetas SUV',
    category: 'Camionetas',
    price: 28500.00,
    originalPrice: 31000.00,
    origin: 'Dubái Spec',
    destination: 'Venezuela (Puerto Cabello)',
    transitDays: '40 - 48 días',
    engine: '2.0L Turbo Intercooler Gasolina',
    power: '228 HP / 350 Nm Torque',
    fuelEconomy: '12.8 km / litro mixto',
    brakes: 'Discos ventilados en las 4 ruedas',
    transmission: 'Automática Secuencial 8 velocidades',
    rating: 5.0,
    reviewsCount: 16,
    badge: 'Bajo Demanda',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'SUV todoterreno de gran porte y lujo interior. Techo panorámico corredizo, asientos de cuero ventilados, tracción 4x4 inteligente con modos de terreno y paquete de asistencia avanzada al conductor ADAS.',
    specs: [
      { label: 'Motor', value: '2.0L Turbo 228 HP' },
      { label: 'Tracción', value: '4x4 AWD Inteligente' },
      { label: 'Pasajeros', value: '7 Puestos (3 Filas)' },
      { label: 'Pantalla', value: 'Dual 12.3" Apple CarPlay/Android Auto' },
      { label: 'Garantía Procura', value: 'Inspección certificada de origen' }
    ],
    variants: [
      { type: 'Color', options: ['Gris Plomo Metalizado', 'Negro Ébano', 'Blanco Perla'] }
    ],
    inStock: true
  },
  {
    id: 'pickup-1',
    lineId: 'pick-up',
    name: 'Atlas Patriot D-Max 4x4 Double Cab',
    line: 'Camionetas Pick-up',
    category: 'Camionetas',
    price: 24800.00,
    originalPrice: 26900.00,
    origin: 'Dubái / China Export Spec',
    destination: 'Venezuela (Puerto Cabello)',
    transitDays: '35 - 45 días',
    engine: '2.5L Turbo Diésel Intercooler',
    power: '163 HP / 400 Nm Torque',
    fuelEconomy: '13.5 km / litro',
    brakes: 'Disco delantero / Tambor reforzado',
    transmission: 'Manual 6 velocidades / Reductora 4x4',
    rating: 4.9,
    reviewsCount: 22,
    badge: 'Carga Pesada',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Camioneta Pick-up de alto torque y capacidad de carga de 1.2 toneladas. Chasis de alta resistencia preparado para el trabajo rudo y carreteras difíciles en Venezuela.',
    specs: [
      { label: 'Cilindrada', value: '2.499 cc Turbo Diésel' },
      { label: 'Capacidad de Carga', value: '1.200 kg' },
      { label: 'Tracción', value: '4x4 con Selector Electrónico' },
      { label: 'Capacidad de Arrastre', value: '3.000 kg' },
      { label: 'Garantía', value: '1 Año de Procura Certificada' }
    ],
    variants: [
      { type: 'Color', options: ['Arena Desierto', 'Blanco Polar', 'Negro Obsidiana'] }
    ],
    inStock: true
  },
  {
    id: 'compacto-1',
    lineId: 'compactos',
    name: 'Atlas Urban Polo 1.6 Flex',
    line: 'Carros Compactos',
    category: 'Carros',
    price: 14200.00,
    originalPrice: 15800.00,
    origin: 'China Spec',
    destination: 'Venezuela (La Guaira / Puerto Cabello)',
    transitDays: '32 - 40 días',
    engine: '1.6L 16V 4 Cilindros',
    power: '110 HP @ 5800 rpm',
    fuelEconomy: '16.5 km / litro',
    brakes: 'Discos delanteros / ABS + EBD',
    transmission: 'Automática 6 velocidades',
    rating: 4.7,
    reviewsCount: 14,
    badge: 'Económico',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vehículo compacto ideal para la ciudad. Excelente rendimiento de combustible, aire acondicionado de alto poder y suspensión reforzada para baches urbanos.',
    specs: [
      { label: 'Motor', value: '1.6L 4 Cilindros Gasolina' },
      { label: 'Consumo', value: '6.0 L / 100 km' },
      { label: 'Pasajeros', value: '5 Puestos' },
      { label: 'Maleta', value: '380 Litros' }
    ],
    variants: [
      { type: 'Color', options: ['Azul Eléctrico', 'Gris Plata', 'Blanco'] }
    ],
    inStock: true
  },
  {
    id: 'scooter-1',
    lineId: 'electric-scooters',
    name: 'Atlas Volt E-Scooter City 3000W',
    line: 'Electric Scooters',
    category: 'Motos',
    price: 1150.00,
    originalPrice: 1300.00,
    origin: 'China Export Spec',
    destination: 'Venezuela (Puerto Cabello)',
    transitDays: '28 - 35 días',
    engine: 'Motor Eléctrico Brushless 3000W',
    power: '4.1 HP Equivalente',
    fuelEconomy: 'Autonomía 80 km por carga',
    brakes: 'Doble Disco Hidráulico',
    transmission: 'Automática Directa',
    rating: 4.8,
    reviewsCount: 19,
    badge: 'Cero Emisiones',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Scooter 100% eléctrico para movilidad urbana ágil. Batería de Litio extraíble recargable en cualquier tomacorriente estándar de 110V en 4 horas.',
    specs: [
      { label: 'Batería', value: 'Litio 72V 32Ah Extraíble' },
      { label: 'Velocidad Máx', value: '75 km/h' },
      { label: 'Tiempo de Carga', value: '4 a 6 Horas (110V)' },
      { label: 'Costo por Carga', value: 'Aproximadamente $0.10 USD' }
    ],
    variants: [
      { type: 'Color', options: ['Negro Mate', 'Blanco', 'Rojo Brillante'] }
    ],
    inStock: true
  },
  {
    id: 'ev-1',
    lineId: 'vehiculos-electricos',
    name: 'Atlas e-Cruiser EV Long Range',
    line: 'Vehículos Eléctricos',
    category: 'Carros',
    price: 32000.00,
    originalPrice: 35000.00,
    origin: 'China EV Hub',
    destination: 'Venezuela (Puerto Cabello / La Guaira)',
    transitDays: '35 - 45 días',
    engine: 'Dual Motor AWD 100% Eléctrico',
    power: '310 HP / 450 Nm',
    fuelEconomy: 'Autonomía 520 km (NEDC)',
    brakes: 'Frenos Regenerativos + Disco en las 4 ruedas',
    transmission: 'Direct Drive de una velocidad',
    rating: 5.0,
    reviewsCount: 8,
    badge: 'Alta Tecnología',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vehículo eléctrico de última generación con batería Blade de alta durabilidad y cargador inteligente portátil incluido para redes residenciales.',
    specs: [
      { label: 'Batería', value: 'Litio Ferrofosfato (LFP) 70 kWh' },
      { label: 'Autonomía', value: '520 km por carga' },
      { label: 'Aceleración 0-100', value: '5.2 segundos' },
      { label: 'Cargador', value: 'Portátil 110V/220V Incluido' }
    ],
    variants: [
      { type: 'Color', options: ['Gris Nardo', 'Blanco Nieve', 'Negro Diamante'] }
    ],
    inStock: true
  }
];
